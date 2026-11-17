"""Modo online do editor (servidor.py --online): login de voluntários e publicação pelo git.

Sem --online nada disto é usado e o editor continua só no computador local, como antes.

Login
- Cada voluntário tem usuário e senha em privado/usuarios.json, na raiz do repositório (fora do git e fora da pasta
  que o site serve), com a senha guardada só como hash
  PBKDF2-SHA256 (200 mil voltas, sal próprio). Para criar, trocar a senha ou tirar alguém:
      python scripts/usuarios.py adicionar <usuario> [--revisor]   (pergunta a senha)
      python scripts/usuarios.py revisor <usuario> sim|nao
      python scripts/usuarios.py remover <usuario>
      python scripts/usuarios.py listar
- Ao entrar, o servidor guarda uma sessão na memória e manda o cookie "tc_sessao" (HttpOnly, Secure, SameSite=Strict),
  que vale 12 horas. Reiniciar o servidor desfaz todas as sessões (todo mundo entra de novo).
- 5 senhas erradas seguidas do mesmo endereço travam o login desse endereço por 10 minutos.

Publicação com revisão (Antonio, 17/11/2026: "é bom a gente sempre ter que revisar antes de publicar")
- Salvar, apagar ou enviar imagem muda só os arquivos do servidor: a mudança fica PENDENTE (o site do servidor já
  mostra, o do GitHub Pages ainda não). O servidor anota quem mexeu em cada arquivo (privado/pendentes.json).
- No editor, o botão "Publicar" lista as pendências, com quem editou. Quem é revisor (--revisor) pode descartar uma
  pendência (o arquivo volta a ser o publicado) ou publicar tudo: um commit só, com o nome do revisor e de quem
  editou cada item, e "git push" para o ramo configurado (--ramo, padrão: o ramo atual). O workflow publica o site.
"""
import base64
import hashlib
import hmac
import json
import secrets
import subprocess
import threading
import time
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ARQ_USUARIOS = RAIZ.parent / "privado" / "usuarios.json"
VOLTAS = 200_000
SESSAO_SEGUNDOS = 12 * 3600
TENTATIVAS, TRAVA_SEGUNDOS = 5, 600
COOKIE = "tc_sessao"


# ---------------- usuários ----------------

def _hash(senha, sal):
    return hashlib.pbkdf2_hmac("sha256", senha.encode("utf-8"), sal, VOLTAS)


def ler_usuarios(arquivo=ARQ_USUARIOS):
    try:
        return json.loads(Path(arquivo).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def gravar_usuario(usuario, senha, arquivo=ARQ_USUARIOS, revisor=None):
    usuarios = ler_usuarios(arquivo)
    sal = secrets.token_bytes(16)
    antes = usuarios.get(usuario, {})
    usuarios[usuario] = {"sal": base64.b64encode(sal).decode(), "hash": base64.b64encode(_hash(senha, sal)).decode(),
                         "revisor": antes.get("revisor", False) if revisor is None else bool(revisor)}
    Path(arquivo).parent.mkdir(parents=True, exist_ok=True)
    Path(arquivo).write_text(json.dumps(usuarios, ensure_ascii=False, indent=1), encoding="utf-8")


def definir_revisor(usuario, revisor, arquivo=ARQ_USUARIOS):
    usuarios = ler_usuarios(arquivo)
    if usuario not in usuarios:
        return False
    usuarios[usuario]["revisor"] = bool(revisor)
    Path(arquivo).write_text(json.dumps(usuarios, ensure_ascii=False, indent=1), encoding="utf-8")
    return True


def e_revisor(usuario, arquivo=ARQ_USUARIOS):
    return bool(ler_usuarios(arquivo).get(usuario, {}).get("revisor"))


def remover_usuario(usuario, arquivo=ARQ_USUARIOS):
    usuarios = ler_usuarios(arquivo)
    if usuarios.pop(usuario, None) is None:
        return False
    Path(arquivo).write_text(json.dumps(usuarios, ensure_ascii=False, indent=1), encoding="utf-8")
    return True


def conferir_senha(usuario, senha, arquivo=ARQ_USUARIOS):
    dados = ler_usuarios(arquivo).get(usuario)
    if not dados:
        _hash(senha, b"x" * 16)  # mesmo tempo de resposta para usuário que não existe
        return False
    esperado = base64.b64decode(dados["hash"])
    return hmac.compare_digest(_hash(senha, base64.b64decode(dados["sal"])), esperado)


# ---------------- sessões ----------------

class Sessoes:
    def __init__(self):
        self._trava = threading.Lock()
        self._sessoes = {}   # token -> (usuario, vence_em)
        self._erros = {}     # endereço -> (quantas, desde)

    def travado(self, endereco):
        with self._trava:
            n, desde = self._erros.get(endereco, (0, 0))
            if n >= TENTATIVAS and time.time() - desde < TRAVA_SEGUNDOS:
                return True
            if n >= TENTATIVAS:
                self._erros.pop(endereco, None)
            return False

    def errou(self, endereco):
        with self._trava:
            n, desde = self._erros.get(endereco, (0, time.time()))
            self._erros[endereco] = (n + 1, desde if n else time.time())

    def criar(self, usuario, endereco):
        token = secrets.token_urlsafe(32)
        with self._trava:
            self._erros.pop(endereco, None)
            self._sessoes[token] = (usuario, time.time() + SESSAO_SEGUNDOS)
        return token

    def usuario(self, token):
        if not token:
            return None
        with self._trava:
            par = self._sessoes.get(token)
            if not par:
                return None
            if time.time() > par[1]:
                self._sessoes.pop(token, None)
                return None
            return par[0]

    def encerrar(self, token):
        with self._trava:
            self._sessoes.pop(token, None)


def token_do_cookie(cabecalho):
    for parte in (cabecalho or "").split(";"):
        nome, _, valor = parte.strip().partition("=")
        if nome == COOKIE:
            return valor
    return None


def cookie_sessao(token, apagar=False):
    idade = 0 if apagar else SESSAO_SEGUNDOS
    return f"{COOKIE}={'' if apagar else token}; Path=/; Max-Age={idade}; HttpOnly; Secure; SameSite=Strict"


# ---------------- git: pendências e publicação ----------------

PASTAS_PUBLICADAS = ("site/conteudo", "site/imagens", "site/arquivos")
ARQ_PENDENTES = RAIZ.parent / "privado" / "pendentes.json"


class Publicador:
    """Pendências (o que mudou no servidor e ainda não foi para o GitHub) e a publicação, uma de cada vez."""

    def __init__(self, repo, ramo=None, arquivo=ARQ_PENDENTES):
        self.repo = Path(repo)
        self.ramo = ramo
        self.arquivo = Path(arquivo)
        self._trava = threading.Lock()

    def _git(self, *args, checar=True):
        r = subprocess.run(["git", "-C", str(self.repo), *args], capture_output=True, text=True, timeout=120)
        if checar and r.returncode != 0:
            raise RuntimeError(f"git {' '.join(args)}: {r.stderr.strip() or r.stdout.strip()}")
        return r

    def _ler(self):
        try:
            return json.loads(self.arquivo.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            return {}

    def _gravar(self, dados):
        self.arquivo.parent.mkdir(parents=True, exist_ok=True)
        self.arquivo.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")

    def registrar(self, caminhos, usuario, acao):
        """Anota quem mexeu em cada arquivo (caminho relativo à raiz do repositório)."""
        with self._trava:
            dados = self._ler()
            for c in caminhos:
                item = dados.setdefault(c, {"usuarios": [], "acao": acao})
                if usuario not in item["usuarios"]:
                    item["usuarios"].append(usuario)
                item["acao"], item["quando"] = acao, time.strftime("%Y-%m-%d %H:%M")
            self._gravar(dados)

    def _mudados(self):
        """[(status, caminho)] do que difere do último commit, só nas pastas que vão para o site."""
        r = self._git("status", "--porcelain", "-uall", "--", *PASTAS_PUBLICADAS)
        saida = []
        for linha in r.stdout.splitlines():
            st, caminho = linha[:2].strip(), linha[3:].strip().strip('"')
            if " -> " in caminho:
                caminho = caminho.split(" -> ", 1)[1]
            saida.append(("novo" if st == "??" or "A" in st else "apagado" if "D" in st else "alterado", caminho))
        return saida

    def listar(self):
        with self._trava:
            dados = self._ler()
            return [{"caminho": c, "status": st, "usuarios": dados.get(c, {}).get("usuarios", []),
                     "quando": dados.get(c, {}).get("quando", "")} for st, c in self._mudados()]

    def descartar(self, caminho):
        """Volta o arquivo para o que está publicado (ou apaga, se ele é novo)."""
        with self._trava:
            pend = dict((c, st) for st, c in self._mudados())
            if caminho not in pend:
                raise ValueError("essa pendência não existe mais")
            if pend[caminho] == "novo":
                (self.repo / caminho).unlink(missing_ok=True)
            else:
                self._git("checkout", "HEAD", "--", caminho)
            dados = self._ler()
            dados.pop(caminho, None)
            self._gravar(dados)

    def publicar(self, revisor):
        """Um commit com tudo o que está pendente e push. Devolve quantos arquivos foram."""
        with self._trava:
            mudados = self._mudados()
            if not mudados:
                return 0
            dados = self._ler()
            linhas = [f"- {c} ({st}; por {', '.join(dados.get(c, {}).get('usuarios', [])) or '?'})" for st, c in mudados]
            self._git("add", "-A", *PASTAS_PUBLICADAS, "site/dados")
            self._git("-c", f"user.name={revisor} (revisão do editor online)", "-c", "user.email=editor@tempocontinuum",
                      "commit", "-q", "-m", f"Publica {len(mudados)} mudança(s), revisada(s) por {revisor}",
                      "-m", "\n".join(linhas))
            ramo = self.ramo or self._git("rev-parse", "--abbrev-ref", "HEAD").stdout.strip()
            self._git("pull", "-q", "--rebase", "origin", ramo, checar=False)
            self._git("push", "-q", "origin", f"HEAD:{ramo}")
            self._gravar({})
            print(f"  [git] publicado por {revisor}: {len(mudados)} arquivo(s)", flush=True)
            return len(mudados)
