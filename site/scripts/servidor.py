"""Servidor local do site Tempo Continuum.

- Serve a pasta do site em http://127.0.0.1:8000 (ou na rede local, com --rede).
- Sempre entrega a versão mais nova dos arquivos (sem cache), para ver as mudanças ao recarregar.
- Refaz os índices (dados/noticias.json, dados/politicos.json, dados/votacoes.json e dados/videos.json)
  sozinho quando uma matéria, ficha, votação ou vídeo em conteudo/ é criado, alterado ou apagado.
- Atende o editor do site (/admin/): rotas /api/... para listar, abrir, salvar e apagar matérias,
  fichas, votações, vídeos, vídeos curtos, publicações, dossiês, meta-dossiês e casos (arquivos .md), enviar imagens, importar consultas do
  e-Cidadania e gerar o PDF de um dossiê ou meta-dossiê (com o Edge ou o Chrome, sem abrir janela). Por segurança, só aceita pedidos do próprio computador.

Modo online (--online, ver scripts/online.py): o editor aceita pedidos de fora, mas só de quem entrou com usuário e
senha. As mudanças ficam pendentes no servidor até um revisor publicar (um commit com push para o GitHub). Para rodar
atrás de um proxy com HTTPS (Caddy, nginx).

Uso:  python scripts/servidor.py            (só neste computador)
      python scripts/servidor.py --rede     (outros aparelhos da mesma rede Wi-Fi também acessam)
      python scripts/servidor.py --porta 8080
      python scripts/servidor.py --online --ramo main   (servidor na internet, atrás de HTTPS)
"""
import argparse
import contextlib
import os
import shutil
import subprocess
import tempfile
import importlib.util
import io
import ipaddress
import json
import re
import socket
import sys
import threading
import time
import unicodedata
import urllib.error
import urllib.request
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

RAIZ = Path(__file__).resolve().parent.parent
PASTAS_CONTEUDO = [RAIZ / "conteudo" / "noticias", RAIZ / "conteudo" / "politicos", RAIZ / "conteudo" / "votacoes",
                   RAIZ / "conteudo" / "videos", RAIZ / "conteudo" / "publicacoes", RAIZ / "conteudo" / "dossies",
                   RAIZ / "conteudo" / "curtos", RAIZ / "conteudo" / "metadossies", RAIZ / "conteudo" / "casos"]
PASTA_TIPO = {"noticias": PASTAS_CONTEUDO[0], "politicos": PASTAS_CONTEUDO[1], "votacoes": PASTAS_CONTEUDO[2],
              "videos": PASTAS_CONTEUDO[3], "publicacoes": PASTAS_CONTEUDO[4], "dossies": PASTAS_CONTEUDO[5],
              "curtos": PASTAS_CONTEUDO[6], "metadossies": PASTAS_CONTEUDO[7], "casos": PASTAS_CONTEUDO[8]}
INDICES = ("/dados/noticias.json", "/dados/politicos.json", "/dados/votacoes.json", "/dados/videos.json",
           "/dados/publicacoes.json", "/dados/dossies.json", "/dados/curtos.json",
           "/dados/metadossies.json", "/dados/casos.json")
PASTA_IMAGENS = {"materias": RAIZ / "imagens" / "materias", "politicos": RAIZ / "imagens" / "politicos",
                 "videos": RAIZ / "imagens" / "videos", "publicacoes": RAIZ / "imagens" / "publicacoes",
                 "dossies": RAIZ / "imagens" / "dossies", "curtos": RAIZ / "imagens" / "curtos",
                 "metadossies": RAIZ / "imagens" / "dossies"}
PASTA_PDF_DOSSIES = RAIZ / "arquivos" / "dossies"
PASTA_PDF_METADOSSIES = RAIZ / "arquivos" / "metadossies"
# Tipos que viram PDF: a pasta do PDF e o parâmetro da página dossie.html que mostra o item
PDF_TIPOS = {"dossies": (PASTA_PDF_DOSSIES, "id"), "metadossies": (PASTA_PDF_METADOSSIES, "meta")}
STATUS_CASO = ("Em andamento", "Em julgamento", "Encerrado")
ID_VALIDO = re.compile(r"^[a-z0-9][a-z0-9-]{0,120}$")
TIPOS_IMAGEM = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif"}
MAX_TEXTO = 2 * 1024 * 1024
MAX_IMAGEM = 15 * 1024 * 1024

_spec = importlib.util.spec_from_file_location("gerar_indice", RAIZ / "scripts" / "gerar-indice.py")
gerar_indice = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(gerar_indice)
import ecidadania  # noqa: E402  (scripts/ já está no caminho, pelo gerar-indice)
import online  # noqa: E402

_trava = threading.Lock()
_assinatura = None


def _pdfs_dossies():
    return [a for pasta in (PASTA_PDF_DOSSIES, PASTA_PDF_METADOSSIES) if pasta.exists() for a in sorted(pasta.glob("*.pdf"))]


def assinatura_conteudo():
    """Nome, tamanho e data de cada arquivo de conteudo/: muda quando algo é salvo ou apagado."""
    itens = []
    for pasta in PASTAS_CONTEUDO:
        for arq in sorted(list(pasta.glob("*.md")) + list(pasta.glob("*.json"))):
            with contextlib.suppress(OSError):
                st = arq.stat()
                itens.append((arq.name, st.st_size, st.st_mtime_ns))
    for arq in _pdfs_dossies():   # o índice dos dossiês diz se o PDF está em dia
        with contextlib.suppress(OSError):
            itens.append(("pdf:" + arq.parent.name + "/" + arq.name, arq.stat().st_mtime_ns))
    return tuple(itens)


def atualizar_indices(forcar=False):
    global _assinatura
    with _trava:
        atual = assinatura_conteudo()
        if not forcar and atual == _assinatura:
            return
        saida, erros = io.StringIO(), io.StringIO()
        with contextlib.redirect_stdout(saida), contextlib.redirect_stderr(erros):
            gerar_indice.main()
        _assinatura = atual
        for linha in (saida.getvalue() + erros.getvalue()).splitlines():
            print(f"  [índice] {linha}", flush=True)


def slug(texto, limite):
    t = unicodedata.normalize("NFKD", str(texto)).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")[:limite].strip("-")


class ErroApi(Exception):
    def __init__(self, msg, codigo=400):
        super().__init__(msg)
        self.codigo = codigo


def caminho_item(tipo, id_):
    if tipo not in PASTA_TIPO or not ID_VALIDO.match(id_ or ""):
        raise ErroApi("tipo ou identificador inválido")
    return PASTA_TIPO[tipo] / f"{id_}.md"


def resumo_item(tipo, arquivo):
    """O que a lista do editor mostra de cada matéria ou ficha."""
    dados = gerar_indice.ler(arquivo)
    st = arquivo.stat()
    if tipo == "noticias":
        return {"id": arquivo.stem, "titulo": str(dados.get("titulo") or "(sem título)"), "data": str(dados.get("data") or ""),
                "editoria": str(dados.get("editoria") or ""), "destaque": dados.get("destaque") is True,
                "formato": arquivo.suffix[1:], "modificado": st.st_mtime}
    if tipo == "videos":
        return {"id": arquivo.stem, "titulo": str(dados.get("titulo") or "(sem título)"), "data": str(dados.get("data") or ""),
                "editoria": str(dados.get("criador") or ""), "formato": arquivo.suffix[1:], "modificado": st.st_mtime}
    if tipo == "metadossies":
        dossies = dados.get("dossies") if isinstance(dados.get("dossies"), list) else []
        pdf = PASTA_PDF_METADOSSIES / f"{arquivo.stem}.pdf"
        estado_pdf = ("PDF em dia" if pdf.stat().st_mtime >= st.st_mtime else "PDF desatualizado") if pdf.exists() else ""
        return {"id": arquivo.stem, "titulo": str(dados.get("titulo") or "(sem título)"), "data": str(dados.get("data") or ""),
                "editoria": " · ".join(x for x in (f"{len(dossies)} dossiê" + ("" if len(dossies) == 1 else "s"), estado_pdf,
                                                     "Destaque" if dados.get("destaque") is True else "") if x),
                "pdf": estado_pdf, "formato": arquivo.suffix[1:], "modificado": st.st_mtime}
    if tipo == "casos":
        return {"id": arquivo.stem, "titulo": str(dados.get("titulo") or "(sem título)"),
                "data": str(dados.get("atualizado") or dados.get("aberto") or ""),
                "editoria": " · ".join(x for x in (str(dados.get("status") or ""), str(dados.get("etapa") or "")) if x),
                "formato": arquivo.suffix[1:], "modificado": st.st_mtime}
    if tipo == "curtos":
        plataforma = str(dados.get("plataforma") or "") or gerar_indice.plataforma_do_link(str(dados.get("link") or ""))
        detalhe = [x for x in (plataforma, str(dados.get("criador") or "")) if x]
        return {"id": arquivo.stem, "titulo": str(dados.get("titulo") or "(sem título)"), "data": str(dados.get("data") or ""),
                "editoria": " · ".join(detalhe), "formato": arquivo.suffix[1:], "modificado": st.st_mtime}
    if tipo == "publicacoes":
        livro = dados.get("tipo") == "livro"
        detalhe = [x for x in (str(dados.get("autoria") or ""), str(dados.get("ano") or "")) if x] if livro \
            else [x for x in (str(dados.get("edicao") or ""),) if x]
        return {"id": arquivo.stem, "titulo": str(dados.get("titulo") or "(sem título)"),
                "data": str(dados.get("data") or dados.get("ano") or ""),
                "editoria": " · ".join(["Livro" if livro else "Revista"] + detalhe),
                "formato": arquivo.suffix[1:], "modificado": st.st_mtime}
    if tipo == "dossies":
        _, corpo = gerar_indice.cabecalho.ler(arquivo.read_text(encoding="utf-8"))
        n = len(gerar_indice.capitulos(corpo))
        pdf = PASTA_PDF_DOSSIES / f"{arquivo.stem}.pdf"
        estado_pdf = ("PDF em dia" if pdf.stat().st_mtime >= st.st_mtime else "PDF desatualizado") if pdf.exists() else ""
        return {"id": arquivo.stem, "titulo": str(dados.get("titulo") or "(sem título)"), "data": str(dados.get("data") or ""),
                "editoria": " · ".join(x for x in (f"{n} capítulo" + ("" if n == 1 else "s"), estado_pdf,
                                                     "Destaque" if dados.get("destaque") is True else "") if x),
                "pdf": estado_pdf, "formato": arquivo.suffix[1:], "modificado": st.st_mtime}
    if tipo == "votacoes":
        voto = {"sim": "Vote SIM", "nao": "Vote NÃO"}.get(str(dados.get("recomendacao") or ""), "Sem recomendação")
        return {"id": arquivo.stem, "titulo": str(dados.get("titulo") or dados.get("sigla") or "(sem título)"),
                "data": str(dados.get("data") or ""), "editoria": " · ".join(x for x in (str(dados.get("sigla") or ""), voto) if x),
                "formato": arquivo.suffix[1:], "modificado": st.st_mtime}
    return {"id": arquivo.stem, "titulo": str(dados.get("nome") or "(sem nome)"), "data": str(dados.get("atualizado") or ""),
            "editoria": " · ".join(str(dados.get(k)) for k in ("cargo_curto", "partido") if dados.get(k)),
            "formato": arquivo.suffix[1:], "modificado": st.st_mtime}


# Campo com a foto ou a capa de cada tipo: o editor mostra essa imagem no cartão do item
CAMPO_IMAGEM = {"noticias": "foto", "politicos": "foto", "videos": "capa", "curtos": "capa", "publicacoes": "capa",
                "dossies": "capa", "metadossies": "capa"}


def api_itens(tipo):
    if tipo not in PASTA_TIPO:
        raise ErroApi("tipo inválido")
    itens = []
    for arq in gerar_indice.arquivos(PASTA_TIPO[tipo]):
        with contextlib.suppress(OSError, ValueError):
            item = resumo_item(tipo, arq)
            if tipo in CAMPO_IMAGEM:
                item["imagem"] = gerar_indice.caminho_relativo(str(gerar_indice.ler(arq).get(CAMPO_IMAGEM[tipo]) or ""))
            itens.append(item)
    if tipo in ("noticias", "votacoes", "videos", "publicacoes", "dossies", "curtos", "metadossies", "casos"):
        itens.sort(key=lambda i: i["data"], reverse=True)
    else:
        itens.sort(key=lambda i: i["titulo"].casefold())
    return {"itens": itens}


def api_item(tipo, id_):
    md = caminho_item(tipo, id_)
    if md.exists():
        return {"id": id_, "formato": "md", "texto": md.read_text(encoding="utf-8")}
    antigo = md.with_suffix(".json")
    if antigo.exists():   # arquivo antigo: o editor converte para Markdown ao salvar
        return {"id": id_, "formato": "json", "dados": json.loads(antigo.read_text(encoding="utf-8"))}
    raise ErroApi("não encontrado", 404)


def api_salvar(pedido):
    tipo, texto, id_ = pedido.get("tipo"), pedido.get("texto"), pedido.get("id") or ""
    if tipo not in PASTA_TIPO or not isinstance(texto, str) or not texto.startswith("---"):
        raise ErroApi("pedido inválido")
    dados, _ = gerar_indice.cabecalho.ler(texto)
    if tipo == "noticias" and (not dados.get("titulo") or not dados.get("data")):
        raise ErroApi("a matéria precisa de título e data")
    if tipo == "politicos" and not dados.get("nome"):
        raise ErroApi("a ficha precisa de nome")
    if tipo == "votacoes" and (not dados.get("titulo") or not dados.get("ecidadania_id")
                               or dados.get("recomendacao") not in ("sim", "nao")):
        raise ErroApi("a votação precisa de título, número da consulta e recomendação de voto")
    if tipo == "videos" and (not dados.get("titulo") or not dados.get("criador")
                             or not re.match(r"^https?://", str(dados.get("link") or "").strip(), re.I)):
        raise ErroApi("o vídeo precisa de nome, criador e um link que comece com https://")
    if tipo == "curtos" and (not dados.get("titulo")
                             or not re.match(r"^https?://", str(dados.get("link") or "").strip(), re.I)):
        raise ErroApi("o vídeo curto precisa de título e de um link que comece com https://")
    if tipo == "dossies" and (not dados.get("titulo") or not dados.get("data")):
        raise ErroApi("o dossiê precisa de título e data")
    if tipo == "metadossies" and (not dados.get("titulo") or not dados.get("data")
                                  or not isinstance(dados.get("dossies"), list) or not dados.get("dossies")):
        raise ErroApi("o meta-dossiê precisa de título, data e de pelo menos um dossiê")
    if tipo == "casos" and (not dados.get("titulo") or dados.get("status") not in STATUS_CASO or not dados.get("aberto")):
        raise ErroApi("o caso precisa de título, situação (" + ", ".join(STATUS_CASO) + ") e data de abertura")
    if tipo == "publicacoes" and (not dados.get("titulo") or dados.get("tipo") not in ("livro", "revista")):
        raise ErroApi("a publicação precisa de título e de ser livro ou revista")
    if not id_:
        # Endereço criado uma vez, a partir da data e do título (matéria) ou do nome (ficha)
        if tipo == "noticias":
            base = f"{str(dados['data'])[:10]}-{slug(dados['titulo'], 60)}"
        elif tipo in ("dossies", "metadossies", "casos"):
            base = slug(dados["titulo"], 70)
        elif tipo in ("videos", "curtos"):
            base = slug(dados["titulo"], 60)
        elif tipo == "publicacoes":
            # revistas: título + edição ("revista-continuum-n-3"); livros: título
            base = slug(f"{dados['titulo']} {dados.get('edicao') or ''}" if dados["tipo"] == "revista" else dados["titulo"], 70)
        elif tipo == "votacoes":
            base = slug(dados.get("sigla") or dados["titulo"], 60) or f"consulta-{dados['ecidadania_id']}"
        else:
            base = slug(dados["nome"], 80)
        base = base.strip("-") or "item"
        id_, n = base, 2
        while caminho_item(tipo, id_).exists() or caminho_item(tipo, id_).with_suffix(".json").exists():
            id_, n = f"{base}-{n}", n + 1
    destino = caminho_item(tipo, id_)
    destino.parent.mkdir(parents=True, exist_ok=True)
    temp = destino.with_suffix(".md.tmp")
    temp.write_text(texto.replace("\r\n", "\n"), encoding="utf-8", newline="\n")
    temp.replace(destino)
    antigo = destino.with_suffix(".json")
    if antigo.exists():
        antigo.unlink()
    atualizar_indices(forcar=True)
    return {"id": id_}


# Arquivos só deste computador (site/local/ fica fora do git e da publicação), como o texto do Plano do Movimento
PASTA_LOCAL = RAIZ / "local"


def api_local(pedido):
    nome, texto = pedido.get("nome"), pedido.get("texto")
    if not isinstance(nome, str) or not re.fullmatch(r"[a-z0-9][a-z0-9-]{0,60}\.(md|json|txt)", nome) or not isinstance(texto, str):
        raise ErroApi("pedido inválido")
    PASTA_LOCAL.mkdir(parents=True, exist_ok=True)
    destino = PASTA_LOCAL / nome
    temp = destino.with_name(nome + ".tmp")
    temp.write_text(texto.replace("\r\n", "\n"), encoding="utf-8", newline="\n")
    temp.replace(destino)
    return {"nome": nome}


def api_apagar(pedido):
    destino = caminho_item(pedido.get("tipo"), pedido.get("id"))
    apagou = False
    extras = [PDF_TIPOS[pedido["tipo"]][0] / f"{pedido.get('id')}.pdf"] if pedido.get("tipo") in PDF_TIPOS else []
    for arq in [destino, destino.with_suffix(".json")] + extras:
        if arq.exists():
            arq.unlink()
            apagou = True
    if not apagou:
        raise ErroApi("não encontrado", 404)
    atualizar_indices(forcar=True)
    return {"ok": True}


def navegador_pdf():
    """Edge, Chrome, Chromium ou Brave instalado (usados sem janela para imprimir a página do dossiê em PDF)."""
    candidatos = [os.environ.get("TC_NAVEGADOR", "")]
    for base in (os.environ.get("PROGRAMFILES(X86)"), os.environ.get("PROGRAMFILES"), os.environ.get("LOCALAPPDATA")):
        if base:
            candidatos += [os.path.join(base, "Microsoft", "Edge", "Application", "msedge.exe"),
                           os.path.join(base, "Google", "Chrome", "Application", "chrome.exe")]
    candidatos += [shutil.which(n) or "" for n in ("msedge", "google-chrome", "chromium", "chromium-browser", "chrome", "brave", "brave-browser")]
    candidatos += ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                   "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"]
    return next((c for c in candidatos if c and os.path.isfile(c)), None)


def api_pdf(tipo, id_, porta):
    """Imprime dossie.html?id=<id> (ou ?meta=<id>, para um meta-dossiê) em PDF, em arquivos/dossies/<id>.pdf
    (ou arquivos/metadossies/<id>.pdf), com o Edge ou o Chrome, sem abrir janela."""
    if tipo not in PDF_TIPOS:
        raise ErroApi("só dossiês e meta-dossiês viram PDF")
    if not caminho_item(tipo, id_).exists():
        raise ErroApi("salve antes de gerar o PDF", 404)
    pasta_pdf, parametro = PDF_TIPOS[tipo]
    exe = navegador_pdf()
    if not exe:
        raise ErroApi("não achei o Edge nem o Chrome neste computador. Abra o dossiê no site e use "
                      "\"Baixar PDF\" › Salvar como PDF", 500)
    pasta_pdf.mkdir(parents=True, exist_ok=True)
    destino = pasta_pdf / f"{id_}.pdf"
    temp = destino.with_name(f"{id_}.tmp.pdf")
    with contextlib.suppress(OSError):
        temp.unlink()
    url = f"http://127.0.0.1:{porta}/dossie.html?{parametro}={id_}&pdf=arquivo"
    with tempfile.TemporaryDirectory(prefix="tc-pdf-", ignore_cleanup_errors=True) as perfil:
        cmd = [exe, "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
               "--disable-extensions", f"--user-data-dir={perfil}", "--run-all-compositor-stages-before-draw",
               "--virtual-time-budget=15000", "--no-pdf-header-footer", "--print-to-pdf-no-header",
               f"--print-to-pdf={temp}", url]
        try:
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120, check=False)
        except subprocess.TimeoutExpired as e:
            raise ErroApi("o navegador demorou demais para gerar o PDF", 504) from e
        # o processo pode devolver antes de terminar de gravar o arquivo
        for _ in range(40):
            if temp.exists() and temp.stat().st_size > 0:
                break
            time.sleep(0.25)
    if not temp.exists() or temp.stat().st_size == 0:
        raise ErroApi("o navegador não gerou o PDF", 500)
    temp.replace(destino)
    atualizar_indices(forcar=True)
    return {"caminho": f"arquivos/{pasta_pdf.name}/{destino.name}", "tamanho": destino.stat().st_size}


def api_ecidadania(consulta):
    try:
        return ecidadania.buscar(consulta)
    except ecidadania.ErroConsulta as e:
        raise ErroApi(str(e), 502) from e


def api_imagens(pasta):
    if pasta not in PASTA_IMAGENS:
        raise ErroApi("pasta inválida")
    d = PASTA_IMAGENS[pasta]
    if not d.exists():
        return {"imagens": []}
    arqs = sorted((a for a in d.iterdir() if a.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp", ".gif")),
                  key=lambda a: a.stat().st_mtime, reverse=True)
    return {"imagens": [f"imagens/{pasta}/{a.name}" for a in arqs]}


def api_enviar_imagem(pasta, nome, tipo, corpo):
    if pasta not in PASTA_IMAGENS:
        raise ErroApi("pasta inválida")
    ext = TIPOS_IMAGEM.get(tipo)
    if not ext:
        raise ErroApi("envie uma imagem JPG, PNG, WebP ou GIF")
    if not corpo:
        raise ErroApi("arquivo vazio")
    base = slug(Path(nome or "imagem").stem, 60) or "imagem"
    d = PASTA_IMAGENS[pasta]
    d.mkdir(parents=True, exist_ok=True)
    destino, n = d / f"{base}{ext}", 2
    while destino.exists():
        destino, n = d / f"{base}-{n}{ext}", n + 1
    destino.write_bytes(corpo)
    return {"caminho": f"imagens/{pasta}/{destino.name}"}


def api_imagem_externa(endereco):
    """Busca uma foto de outro site para o Gerador de imagens do editor.
    O navegador não deixa desenhar no canvas uma imagem de outro site sem permissão dele (CORS);
    vinda daqui, ela é da mesma origem. Só imagens, só de endereços públicos, até MAX_IMAGEM."""
    u = urlparse(endereco or "")
    if u.scheme not in ("http", "https") or not u.hostname:
        raise ErroApi("link inválido")
    try:
        for info in socket.getaddrinfo(u.hostname, u.port or (443 if u.scheme == "https" else 80)):
            ip = ipaddress.ip_address(info[4][0].split("%")[0])
            if not ip.is_global:
                raise ErroApi("só links de sites públicos")
    except socket.gaierror as e:
        raise ErroApi("não encontrei esse site", 502) from e
    pedido = urllib.request.Request(endereco, headers={"User-Agent": "Mozilla/5.0 (editor Tempo Continuum)", "Accept": "image/*"})
    try:
        with urllib.request.urlopen(pedido, timeout=20) as r:
            tipo = (r.headers.get("Content-Type") or "").split(";")[0].strip().lower()
            if tipo not in TIPOS_IMAGEM and tipo != "image/avif":
                raise ErroApi("o link não é de uma imagem JPG, PNG, WebP, GIF ou AVIF", 415)
            corpo = r.read(MAX_IMAGEM + 1)
    except urllib.error.HTTPError as e:
        raise ErroApi(f"o site respondeu {e.code}", 502) from e
    except (urllib.error.URLError, TimeoutError) as e:
        raise ErroApi("não consegui baixar a imagem", 502) from e
    if len(corpo) > MAX_IMAGEM:
        raise ErroApi("imagem grande demais", 413)
    return corpo, tipo


class Manipulador(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".wasm": "application/wasm",
        ".js": "text/javascript",
        ".json": "application/json",
        ".yml": "text/yaml",
        ".webp": "image/webp",
    }

    # Modo online (main() preenche): sessões de login e o publicador do git
    ONLINE = False
    sessoes = None
    publicador = None

    def do_GET(self):
        url = urlparse(self.path)
        if url.path.startswith("/api/"):
            return self._api("GET", url)
        # No modo online, a pasta local/ (arquivos só do computador) e os scripts não saem pela internet
        if self.ONLINE and (url.path.startswith("/local/") or url.path.startswith("/scripts/")):
            return self.send_error(404)
        # Antes de entregar a lista de matérias ou de fichas, confere se o conteúdo mudou
        if url.path in INDICES:
            atualizar_indices()
        super().do_GET()

    def do_POST(self):
        url = urlparse(self.path)
        if url.path.startswith("/api/"):
            return self._api("POST", url)
        self.send_error(405)

    # ---- API do editor
    def _usuario(self):
        return self.sessoes.usuario(online.token_do_cookie(self.headers.get("Cookie"))) if self.ONLINE else None

    def _mesma_origem(self):
        if self.headers.get("X-TC-Editor") != "1":
            return False
        origem = self.headers.get("Origin")
        return not origem or urlparse(origem).netloc == self.headers.get("Host")

    def _endereco(self):
        # atrás do proxy, o endereço de verdade vem no X-Forwarded-For (o Caddy põe)
        return (self.headers.get("X-Forwarded-For") or self.client_address[0]).split(",")[0].strip()

    def _api_login(self, rota):
        """Entrar, sair e "quem sou eu" do modo online. Devolve True se atendeu a rota."""
        if rota == ("POST", "/api/entrar"):
            if not self._mesma_origem():
                self._responder(403, {"erro": "pedido recusado"})
                return True
            endereco = self._endereco()
            if self.sessoes.travado(endereco):
                self._responder(429, {"erro": "muitas tentativas; espere 10 minutos"})
                return True
            try:
                pedido = json.loads(self._corpo(4096) or b"{}")
            except (ValueError, ErroApi):
                pedido = {}
            usuario, senha = str(pedido.get("usuario") or "").strip().lower(), str(pedido.get("senha") or "")
            if not usuario or not online.conferir_senha(usuario, senha):
                self.sessoes.errou(endereco)
                self._responder(401, {"erro": "usuário ou senha errados"})
                return True
            token = self.sessoes.criar(usuario, endereco)
            self._responder(200, {"usuario": usuario}, cookie=online.cookie_sessao(token))
            return True
        if rota == ("POST", "/api/sair"):
            self.sessoes.encerrar(online.token_do_cookie(self.headers.get("Cookie")))
            self._responder(200, {"ok": True}, cookie=online.cookie_sessao("", apagar=True))
            return True
        if rota == ("GET", "/api/eu"):
            u = self._usuario()
            self._responder(200 if u else 401, {"usuario": u, "online": True, "revisor": online.e_revisor(u)} if u
                            else {"erro": "entre de novo"})
            return True
        if rota[1] in ("/api/pendentes", "/api/publicar", "/api/descartar"):
            u = self._usuario()
            if not u or not self._mesma_origem():
                self._responder(401, {"erro": "entre com seu usuário e senha", "entrar": True})
                return True
            try:
                if rota == ("GET", "/api/pendentes"):
                    self._responder(200, {"pendentes": self.publicador.listar(), "revisor": online.e_revisor(u)})
                    return True
                if not online.e_revisor(u):
                    self._responder(403, {"erro": "só quem revisa pode publicar ou descartar"})
                    return True
                if rota == ("POST", "/api/publicar"):
                    n = self.publicador.publicar(u)
                    self._responder(200, {"publicados": n})
                elif rota == ("POST", "/api/descartar"):
                    pedido = json.loads(self._corpo(4096) or b"{}")
                    self.publicador.descartar(str(pedido.get("caminho") or ""))
                    atualizar_indices(forcar=True)
                    self._responder(200, {"ok": True})
                else:
                    self._responder(404, {"erro": "rota desconhecida"})
            except (RuntimeError, ValueError, OSError) as e:
                self._responder(400, {"erro": f"não consegui ({e})"})
            return True
        return False

    def _permitido(self):
        """Só o próprio computador, só a página do editor (cabeçalho próprio) e só da mesma origem.
        No modo online: de qualquer lugar, mas só com sessão de login válida."""
        if self.ONLINE:
            return bool(self._usuario()) and self._mesma_origem()
        try:
            if not ipaddress.ip_address(self.client_address[0].split("%")[0]).is_loopback:
                return False
        except ValueError:
            return False
        if self.headers.get("X-TC-Editor") != "1":
            return False
        origem = self.headers.get("Origin")
        return not origem or urlparse(origem).netloc == self.headers.get("Host")

    def _responder(self, codigo, dados, cookie=None):
        corpo = json.dumps(dados, ensure_ascii=False).encode("utf-8")
        self.send_response(codigo)
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(corpo)))
        self.end_headers()
        self.wfile.write(corpo)

    def _corpo(self, limite):
        n = int(self.headers.get("Content-Length") or 0)
        if n > limite:
            raise ErroApi("arquivo grande demais", 413)
        return self.rfile.read(n)

    def _api(self, metodo, url):
        rota = (metodo, url.path)
        if self.ONLINE and self._api_login(rota):
            return
        if not self._permitido():
            if self.ONLINE:
                return self._responder(401, {"erro": "entre com seu usuário e senha", "entrar": True})
            return self._responder(403, {"erro": "o editor só funciona neste computador"})
        q = {k: v[0] for k, v in parse_qs(url.query).items()}
        if self.ONLINE and rota == ("POST", "/api/local"):
            return self._responder(403, {"erro": "no editor online não se grava arquivo local"})
        try:
            if rota == ("GET", "/api/itens"):
                r = api_itens(q.get("tipo"))
            elif rota == ("GET", "/api/item"):
                r = api_item(q.get("tipo"), q.get("id"))
            elif rota == ("GET", "/api/ecidadania"):
                r = api_ecidadania(q.get("consulta"))
            elif rota == ("GET", "/api/imagem-externa"):
                corpo, tipo = api_imagem_externa(q.get("url"))
                self.send_response(200)
                self.send_header("Content-Type", tipo)
                self.send_header("Content-Length", str(len(corpo)))
                self.end_headers()
                self.wfile.write(corpo)
                return
            elif rota == ("GET", "/api/imagens"):
                r = api_imagens(q.get("pasta"))
            elif rota == ("POST", "/api/salvar"):
                pedido = json.loads(self._corpo(MAX_TEXTO) or b"{}")
                r = api_salvar(pedido)
            elif rota == ("POST", "/api/local"):
                r = api_local(json.loads(self._corpo(MAX_TEXTO) or b"{}"))
            elif rota == ("POST", "/api/apagar"):
                pedido = json.loads(self._corpo(MAX_TEXTO) or b"{}")
                r = api_apagar(pedido)
            elif rota == ("POST", "/api/pdf"):
                pedido = json.loads(self._corpo(MAX_TEXTO) or b"{}")  # (PDF sai junto na próxima publicação)
                r = api_pdf(pedido.get("tipo"), pedido.get("id"), self.server.server_address[1])
            elif rota == ("POST", "/api/imagem"):
                tipo = (self.headers.get("Content-Type") or "").split(";")[0].strip().lower()
                r = api_enviar_imagem(q.get("pasta"), q.get("nome"), tipo, self._corpo(MAX_IMAGEM))
            else:
                raise ErroApi("rota desconhecida", 404)
        except ErroApi as e:
            return self._responder(e.codigo, {"erro": str(e)})
        except (ValueError, OSError) as e:
            return self._responder(400, {"erro": f"não consegui concluir ({e})"})
        if self.ONLINE and metodo == "POST" and rota[1] in ("/api/salvar", "/api/apagar", "/api/imagem", "/api/pdf"):
            caminhos = self._caminhos_mudados(rota[1], locals().get("pedido") or {}, r)
            if caminhos:
                self.publicador.registrar(caminhos, self._usuario(), rota[1].rsplit("/", 1)[1])
        self._responder(200, r)

    @staticmethod
    def _caminhos_mudados(rota, pedido, r):
        """Arquivos (relativos à raiz do repositório) que a ação mudou, para anotar quem editou."""
        def rel(c):
            return Path(c).resolve().relative_to(RAIZ.parent).as_posix()
        with contextlib.suppress(ErroApi, ValueError, KeyError, TypeError):
            if rota == "/api/salvar":
                return [rel(caminho_item(pedido["tipo"], r["id"]))]
            if rota == "/api/apagar":
                return [rel(caminho_item(pedido["tipo"], pedido["id"]))]
            if rota == "/api/imagem":
                return [rel(RAIZ / r["caminho"])]
        return []

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, formato, *args):
        if len(args) > 1 and str(args[1])[:1] in "45" and "favicon.ico" not in str(args[0]):   # só erros (404, 500…)
            super().log_message(formato, *args)


def ip_da_rede():
    with contextlib.suppress(OSError), socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.connect(("10.255.255.255", 1))
        return s.getsockname()[0]
    return None


def main():
    # Acentos certos no terminal do Windows
    for fluxo in (sys.stdout, sys.stderr):
        with contextlib.suppress(AttributeError, ValueError):
            fluxo.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Servidor local do site Tempo Continuum")
    ap.add_argument("--porta", type=int, default=8000)
    ap.add_argument("--rede", action="store_true", help="aceitar acessos de outros aparelhos da rede local")
    ap.add_argument("--online", action="store_true",
                    help="editor na internet, com login e commit+push a cada mudança (rodar atrás de HTTPS)")
    ap.add_argument("--ramo", help="ramo do git para onde o modo online manda as mudanças (padrão: o atual)")
    args = ap.parse_args()

    if args.online:
        if not online.ler_usuarios():
            print("Modo online sem nenhum usuário. Crie um com: python scripts/usuarios.py adicionar <usuario>",
                  file=sys.stderr)
            sys.exit(1)
        Manipulador.ONLINE = True
        Manipulador.sessoes = online.Sessoes()
        Manipulador.publicador = online.Publicador(RAIZ.parent, args.ramo)
    endereco = "0.0.0.0" if (args.rede or args.online) else "127.0.0.1"
    try:
        servidor = ThreadingHTTPServer((endereco, args.porta), partial(Manipulador, directory=str(RAIZ)))
    except OSError:
        print(f"A porta {args.porta} já está em uso. Feche o outro servidor ou use --porta 8080.", file=sys.stderr)
        sys.exit(1)

    atualizar_indices(forcar=True)
    print(f"\nSite:   http://localhost:{args.porta}/")
    print(f"Editor: http://localhost:{args.porta}/admin/")
    if args.rede:
        ip = ip_da_rede()
        if ip:
            print(f"Rede:   http://{ip}:{args.porta}/  (outros aparelhos no mesmo Wi-Fi; o editor só funciona neste computador)")
    print("Ctrl+C para parar.\n", flush=True)
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        servidor.server_close()


if __name__ == "__main__":
    main()
