/* Tempo Continuum — editor de matérias, fichas, votações, vídeos, vídeos curtos, publicações e dossiês.
   Grava arquivos Markdown (.md) em conteudo/noticias, conteudo/politicos, conteudo/votacoes, conteudo/videos, conteudo/publicacoes
   e conteudo/dossies pelo servidor local
   (scripts/servidor.py). O formato dos arquivos está descrito em js/markdown.js. */
(function () {
  'use strict';

  var EDITORIAS = ['Trabalho', 'Política', 'Economia', 'Cidades', 'Campo', 'Educação', 'Memória', 'Formação', 'Cultura', 'Internacional'];
  var CATEGORIAS = ['Presidente', 'Senador', 'Deputado federal', 'Governador', 'Prefeito', 'Deputado estadual', 'Vereador', 'Outro'];
  var ROTULOS_DADOS = ['Nome completo', 'Nascimento', 'Naturalidade', 'Formação', 'Profissão', 'Partido atual', 'Cargo'];
  var MAX_TAGS = 8;
  var NOMES = {
    noticias: { novo: '+ Nova matéria', vazio: 'Escolha uma matéria na lista ou crie uma nova.', pasta: 'materias', pagina: 'materia.html' },
    politicos: { novo: '+ Nova ficha', vazio: 'Escolha uma ficha na lista ou crie uma nova.', pasta: 'politicos', pagina: 'ficha.html' },
    votacoes: { novo: '+ Nova votação', vazio: 'Escolha uma votação na lista ou traga uma nova do e-Cidadania.', pasta: 'materias', pagina: 'votacoes.html' },
    videos: { novo: '+ Novo vídeo', vazio: 'Escolha um vídeo na lista ou adicione um novo do YouTube.', pasta: 'videos', pagina: 'streaming.html' },
    publicacoes: { novo: '+ Nova publicação', vazio: 'Escolha um livro ou uma revista na lista, ou crie uma publicação nova.', pasta: 'publicacoes', pagina: 'publicacoes.html' },
    dossies: { novo: '+ Novo dossiê', vazio: 'Escolha um dossiê na lista ou crie um novo.', pasta: 'dossies', pagina: 'dossie.html' },
    metadossies: { novo: '+ Novo meta-dossiê', vazio: 'Escolha um meta-dossiê na lista ou crie um novo, juntando dossiês que já existem.', pasta: 'dossies', pagina: 'dossie.html' },
    casos: { novo: '+ Novo caso', vazio: 'Escolha um caso na lista ou crie um novo.', pasta: 'casos', pagina: 'caso.html' },
    curtos: { novo: '+ Novo vídeo curto', vazio: 'Escolha um vídeo curto na lista ou adicione um novo, de qualquer plataforma.', pasta: 'curtos', pagina: 'curtos.html' }
  };
  // Coleções da lateral, em grupos: nome, descrição curta e o que diz a contagem
  var GRUPOS = [
    { nome: 'Conteúdo', tipos: [['noticias', 'Matérias', 'matéria', 'matérias'], ['dossies', 'Dossiês', 'dossiê', 'dossiês'],
      ['metadossies', 'Meta-dossiês', 'meta-dossiê', 'meta-dossiês'], ['publicacoes', 'Publicações', 'publicação', 'publicações']] },
    { nome: 'Wiki', tipos: [['politicos', 'Políticos', 'ficha', 'fichas'], ['casos', 'Casos', 'caso', 'casos']] },
    { nome: 'Streaming', tipos: [['videos', 'Vídeos', 'vídeo', 'vídeos'], ['curtos', 'Curtos', 'vídeo curto', 'vídeos curtos']] },
    { nome: 'Participação', tipos: [['votacoes', 'Votações', 'votação', 'votações']] }
  ];
  // Endereço público do site (GitHub Pages): vai no rodapé e no QR code das imagens para redes
  var SITE_PUBLICO = 'https://tony-f-trinity.github.io/tempo/';
  var COLECAO = {};
  GRUPOS.forEach(function (g) { g.tipos.forEach(function (x) { COLECAO[x[0]] = { nome: x[1], um: x[2], varios: x[3] }; }); });
  function contagemTexto(tipo, n) { var c = COLECAO[tipo]; return n == null ? '…' : n + ' ' + (n === 1 ? c.um : c.varios); }
  var PLATAFORMAS = ['YouTube', 'TikTok', 'Instagram', 'Kwai', 'X', 'Facebook', 'Threads', 'Bluesky', 'Outra'];
  // Plataforma pelo endereço do vídeo (a mesma regra de scripts/gerar-indice.py e curtos.html)
  function plataformaDoLink(link) {
    var m = /^https?:\/\/([^\/:?#]+)/i.exec(String(link || '').trim());
    var host = m ? m[1].toLowerCase().replace(/^www\./, '') : '';
    var regras = [[/(^|\.)(youtube\.com|youtu\.be)$/, 'YouTube'], [/(^|\.)tiktok\.com$/, 'TikTok'],
      [/(^|\.)(instagram\.com|instagr\.am)$/, 'Instagram'], [/(^|\.)(kwai\.com|kw\.ai)$/, 'Kwai'],
      [/(^|\.)(x\.com|twitter\.com)$/, 'X'], [/(^|\.)(facebook\.com|fb\.watch)$/, 'Facebook'],
      [/(^|\.)threads\.(net|com)$/, 'Threads'], [/(^|\.)bsky\.app$/, 'Bluesky']];
    for (var i = 0; i < regras.length; i++) if (regras[i][0].test(host)) return regras[i][1];
    return host ? 'Outra' : '';
  }
  // Endereço do item no site (votações ficam todas numa página, cada uma com uma âncora;
  // os vídeos ficam na parte "Vídeos do YouTube" da página Streaming)
  function enderecoNoSite(tipo, id) {
    if (tipo === 'videos') return NOMES.videos.pagina + '#youtube';
    if (tipo === 'curtos') return NOMES.curtos.pagina + '#' + id;
    if (tipo === 'metadossies') return NOMES.metadossies.pagina + '?meta=' + id;
    if (tipo === 'casos') return NOMES.casos.pagina + '?id=' + id;
    if (tipo === 'publicacoes') {
      var pub = estado.atual && estado.atual.tipo === 'publicacoes' ? estado.atual.m : null;
      return NOMES.publicacoes.pagina + (pub ? (pub.tipo === 'revista' ? '#revistas' : '#livros') : '');
    }
    return NOMES[tipo].pagina + (tipo === 'votacoes' ? '#' : '?id=') + id;
  }
  function numeroBr(n) { return Number(n || 0).toLocaleString('pt-BR'); }
  function dataHoraCurta(iso) {
    var m = /T(\d{2}:\d{2})/.exec(String(iso || ''));
    return dataCurta(iso) + (m ? ' às ' + m[1] : '');
  }

  var $ = function (id) { return document.getElementById(id); };
  var estado = { tipo: 'noticias', itens: [], tags: [], atual: null, sujo: false, contagens: {}, carregado: false };

  // =========================================================================
  // Utilidades
  // =========================================================================
  // h('div', { class: 'x', onclick: fn }, filho1, 'texto', ...)
  function h(tag, attrs) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'class') el.className = v;
      else if (k === 'value') el.value = v;
      else if (k === 'checked') el.checked = !!v;
      else if (k === 'html') el.innerHTML = v;
      else el.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) acrescentar(el, arguments[i]);
    return el;
  }
  function acrescentar(el, filho) {
    if (filho === null || filho === undefined || filho === false) return;
    if (Array.isArray(filho)) { filho.forEach(function (f) { acrescentar(el, f); }); return; }
    el.appendChild(typeof filho === 'object' ? filho : document.createTextNode(String(filho)));
  }

  function api(url, opcoes) {
    opcoes = opcoes || {};
    var cab = Object.assign({ 'X-TC-Editor': '1' }, opcoes.headers || {});
    var corpo = opcoes.corpo;
    if (corpo !== undefined && !(corpo instanceof Blob)) { corpo = JSON.stringify(corpo); cab['Content-Type'] = 'application/json'; }
    return fetch('/api/' + url, { method: corpo !== undefined ? 'POST' : 'GET', headers: cab, body: corpo, cache: 'no-store' })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          // editor online: sessão vencida ou sem login, vai para a tela de entrar
          if (r.status === 401 && j.entrar) { location.href = 'entrar.html'; return new Promise(function () {}); }
          if (!r.ok) throw new Error(j.erro || ('erro ' + r.status));
          if (corpo !== undefined) setTimeout(atualizarBotao, 500);   // editor online: conta das pendências
          return j;
        });
      }, function () { throw new Error('não consegui falar com o servidor. Ele está rodando (python scripts/servidor.py)?'); });
  }

  var temporizador = null;
  function aviso(msg, erro) {
    var el = $('aviso');
    el.textContent = msg;
    el.className = 'aviso' + (erro ? ' erro' : '');
    el.hidden = false;
    clearTimeout(temporizador);
    temporizador = setTimeout(function () { el.hidden = true; }, erro ? 7000 : 3000);
  }

  function dataCurta(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
    return m ? m[3] + '/' + m[2] + '/' + m[1] : '';
  }
  function agoraLocal() {
    var d = new Date(), z = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) + 'T' + z(d.getHours()) + ':' + z(d.getMinutes()) + ':00';
  }
  function hoje() { return agoraLocal().slice(0, 10); }

  function marcarSujo(v) {
    estado.sujo = v !== false;
    atualizarImagem();
    var el = document.querySelector('.barra .estado');
    if (el) {
      el.textContent = estado.sujo ? 'Alterações não salvas' : (estado.salvoEm ? 'Salvo às ' + estado.salvoEm : 'Sem alterações');
      el.classList.toggle('sujo', estado.sujo);
    }
  }
  function podeSair() {
    return !estado.sujo || confirm('Há alterações não salvas. Descartar e continuar?');
  }
  window.addEventListener('beforeunload', function (e) { if (estado.sujo) { e.preventDefault(); e.returnValue = ''; } });

  // =========================================================================
  // Tema
  // =========================================================================
  function aplicarTema(escuro) {
    document.documentElement.setAttribute('data-tema', escuro ? 'escuro' : 'claro');
    $('tema').textContent = escuro ? 'Claro' : 'Escuro';
    try { localStorage.setItem('tc-tema', escuro ? 'escuro' : 'claro'); } catch (e) {}
  }
  (function () {
    var t = null;
    try { t = localStorage.getItem('tc-tema'); } catch (e) {}
    aplicarTema(t ? t === 'escuro' : window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    $('tema').addEventListener('click', function () { aplicarTema(document.documentElement.getAttribute('data-tema') !== 'escuro'); });
  })();

  // =========================================================================
  // Lista
  // =========================================================================
  function carregarLista() {
    var tipo = estado.tipo;
    return api('itens?tipo=' + tipo).then(function (r) {
      if (tipo !== estado.tipo) return;
      estado.itens = r.itens;
      estado.carregado = true;
      estado.contagens[tipo] = r.itens.length;
      desenharColecoes();
      desenharLista();
    }).catch(function (e) { aviso(e.message, true); });
  }
  // Contagem de todas as coleções, para a lateral
  function carregarContagens() {
    Object.keys(COLECAO).forEach(function (tipo) {
      api('itens?tipo=' + tipo).then(function (r) { estado.contagens[tipo] = r.itens.length; desenharColecoes(); }).catch(function () {});
    });
  }

  // Tags sugeridas no campo de tags: as das matérias ou, nas abas Curtos e Casos, as dos vídeos curtos e dos casos
  function fonteTags() { return estado.tipo === 'curtos' || estado.tipo === 'casos' ? estado.tipo : 'noticias'; }
  function carregarTags() {
    var tipo = fonteTags();
    return fetch('../dados/' + tipo + '.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (lista) {
      if (fonteTags() !== tipo) return;
      estado.tags = TCTags.contar(lista.map(function (n) { return n.tags || []; }));
    }).catch(function () { estado.tags = []; });
  }

  // ---- Lateral: as coleções, agrupadas, com a contagem de cada uma
  function desenharColecoes() {
    var nav = $('colecoes');
    nav.innerHTML = '';
    GRUPOS.forEach(function (g) {
      nav.appendChild(h('p', { class: 'colecoes-grupo' }, g.nome));
      nav.appendChild(h('ul', { class: 'lista' }, g.tipos.map(function (x) {
        var tipo = x[0];
        return h('li', null, h('button', { type: 'button', 'aria-current': tipo === estado.tipo && !estado.ferramenta ? 'true' : 'false', onclick: function () { trocarTipo(tipo); } },
          h('span', { class: 't' }, x[1]), h('span', { class: 'm' }, contagemTexto(tipo, estado.contagens[tipo]))));
      })));
    });
    nav.appendChild(h('p', { class: 'colecoes-grupo' }, 'Ferramentas'));
    nav.appendChild(h('ul', { class: 'lista' }, FERRAMENTAS.filter(function (f) { return !f.existe || f.existe(); }).map(function (f) {
      return h('li', null, h('button', { type: 'button', 'aria-current': estado.ferramenta === f.chave ? 'true' : 'false', onclick: function () { abrirFerramenta(f.chave); } },
        h('span', { class: 't' }, f.nome), h('span', { class: 'm' }, f.resumo)));
    })));
  }

  // Ferramentas da lateral. Os Mapas do Movimento só aparecem se site/local/planos/ existir neste computador.
  var FERRAMENTAS = [
    { chave: 'gerador', nome: 'Gerador de imagens', resumo: 'posts e prévias de link',
      dica: 'Monte imagens para redes sociais e prévias de link, com título que se ajusta sozinho, foto de fundo, logos, camadas e QR code. Para a imagem de uma matéria, abra a matéria: lá o gerador já vem preenchido.',
      montar: function (lugar) { TCGerador.montar(lugar, { chave: 'tc-gerador-imagens' }); } },
    { chave: 'mapas', nome: 'Mapas do Movimento', resumo: 'só neste computador', existe: function () { return !!window.TCPlanos; },
      dica: 'Os dois planos lado a lado: o do Tempo Continuum como coletivo e a proposta de movimento político. Clique em qualquer ponto do mapa para ver o que ele recebe e entrega; no fim de cada aba, o plano inteiro pode ser editado em Markdown. "Baixar texto (.docx)" gera o plano da aba aberta em texto corrido, para ler ou revisar no Word ou no Google Docs. Fica só neste computador (site/local/), fora do git.',
      montar: function (lugar, sub) { lugar.classList.add('pl-lugar'); TCPlanos.montar(lugar, sub); } }
  ];
  function abrirFerramenta(chave, sub) {
    var f = FERRAMENTAS.filter(function (x) { return x.chave === chave && (!x.existe || x.existe()); })[0];
    if (!f || estado.ferramenta === chave || !podeSair()) return;
    estado.ferramenta = chave;
    estado.atual = null;
    estado.redesenharLigacoes = null;
    marcarSujo(false);
    var area = $('area'), lugar = h('div');
    area.innerHTML = '';
    area.appendChild(h('div', { class: 'colecao ferramenta' },
      h('div', { class: 'colecao-topo' }, h('div', { class: 'colecao-titulo' }, h('h1', null, f.nome))),
      h('p', { class: 'dica' }, f.dica),
      lugar));
    history.replaceState(null, '', '#' + chave);
    f.montar(lugar, sub);
    desenharColecoes();
    area.scrollTop = 0;
  }


  // Linha de detalhes do item (data, editoria, situação…), igual para o cartão e para a busca
  function metaDe(i) {
    var t = estado.tipo;
    var meta = t === 'noticias'
      ? [dataCurta(i.data), i.editoria, i.destaque ? 'Manchete' : ''].filter(Boolean).join(' · ')
      : t === 'dossies' || t === 'metadossies'
        ? [dataCurta(i.data), i.editoria].filter(Boolean).join(' · ')
      : t === 'casos'
        ? [i.editoria, i.data ? 'atualizado em ' + dataCurta(i.data) : ''].filter(Boolean).join(' · ')
      : t === 'votacoes' || t === 'videos' || t === 'publicacoes' || t === 'curtos'
        ? [i.editoria, dataCurta(i.data)].filter(Boolean).join(' · ')
        : [i.editoria, i.data ? 'revisada em ' + dataCurta(i.data) : ''].filter(Boolean).join(' · ');
    return meta + (i.formato === 'json' ? ' · formato antigo' : '');
  }
  function enderecoImagem(src) {
    src = String(src || '').trim();
    return !src ? '' : /^https?:/i.test(src) ? src : '../' + src.replace(/^\/+/, '');
  }
  function iniciais(texto) {
    return String(texto || '').split(/\s+/).filter(function (p) { return p.length > 2 || /^[A-ZÀ-Ú]/.test(p); }).slice(0, 2)
      .map(function (p) { return p[0]; }).join('').toUpperCase() || '·';
  }

  // ---- Área principal sem item aberto: título da coleção, busca, "+ Novo" e a grade de cartões
  function desenharLista() {
    if (estado.atual || estado.ferramenta) return;   // com um item ou uma ferramenta aberta, a área mostra o editor
    var area = $('area'), c = COLECAO[estado.tipo];
    var busca = h('input', { type: 'search', id: 'busca', placeholder: 'Buscar em ' + c.nome.toLowerCase(), 'aria-label': 'Buscar em ' + c.nome, autocomplete: 'off' });
    var grade = h('div', { class: 'cartoes', id: 'cartoes' });
    var contagem = h('span', { class: 'colecao-contagem', role: 'status' });
    function desenharCartoes() {
      var q = TCTags.norm(busca.value);
      var itens = estado.itens.filter(function (i) { return !q || TCTags.norm(i.titulo + ' ' + i.editoria + ' ' + metaDe(i)).indexOf(q) >= 0; });
      grade.innerHTML = '';
      contagem.textContent = !estado.carregado ? 'Carregando…' : q ? itens.length + ' de ' + contagemTexto(estado.tipo, estado.itens.length) : contagemTexto(estado.tipo, estado.itens.length);
      if (!estado.carregado) return;
      if (!itens.length) {
        grade.appendChild(h('div', { class: 'cartoes-vazio' }, h('p', null, estado.itens.length ? 'Nada encontrado com essa busca.' : NOMES[estado.tipo].vazio)));
        return;
      }
      itens.forEach(function (i) {
        var img = enderecoImagem(i.imagem);
        grade.appendChild(h('button', { type: 'button', class: 'cartao', title: 'Editar: ' + i.titulo, onclick: function () { abrir(estado.tipo, i.id); } },
          img ? h('span', { class: 'cartao-img' }, h('img', { src: img, alt: '', loading: 'lazy', referrerpolicy: 'no-referrer' }))
            : h('span', { class: 'cartao-img sem' }, h('span', { class: 'cartao-tipo' }, c.um), h('span', { class: 'cartao-iniciais' }, iniciais(i.titulo))),
          h('span', { class: 'cartao-corpo' },
            h('span', { class: 'm' }, metaDe(i)),
            h('span', { class: 't' }, i.titulo),
            h('span', { class: 'cartao-acao' }, 'Editar →'))));
      });
    }
    busca.addEventListener('input', desenharCartoes);
    area.innerHTML = '';
    area.appendChild(h('div', { class: 'colecao' },
      h('div', { class: 'colecao-topo' },
        h('div', { class: 'colecao-titulo' }, h('h1', null, c.nome), contagem),
        busca,
        h('button', { type: 'button', id: 'novo', class: 'botao principal', onclick: function () { if (podeSair()) novo(estado.tipo); } }, NOMES[estado.tipo].novo)),
      grade));
    desenharCartoes();
  }

  // Volta do editor para a grade da coleção
  function voltarParaGrade() {
    if (!podeSair()) return;
    estado.redesenharLigacoes = null;
    estado.atual = null;
    estado.ferramenta = null;
    marcarSujo(false);
    desenharLista();
    history.replaceState(null, '', '#' + estado.tipo);
    $('area').scrollTop = 0;
  }

  function trocarTipo(tipo) {
    if ((tipo === estado.tipo && !estado.atual && !estado.ferramenta) || !podeSair()) return;
    var mudou = tipo !== estado.tipo;
    estado.ferramenta = null;
    estado.tipo = tipo;
    estado.atual = null;
    marcarSujo(false);
    if (mudou) { estado.itens = []; estado.carregado = false; }
    desenharColecoes();
    desenharLista();
    carregarLista();
    if (mudou) carregarTags();
    history.replaceState(null, '', '#' + tipo);
  }

  // =========================================================================
  // Abrir, criar, salvar, apagar
  // =========================================================================
  function modeloDeArquivo(tipo, r) {
    // r: resposta de /api/item ({formato:'md', texto} ou {formato:'json', dados})
    if (tipo === 'noticias') {
      var m = r.formato === 'md' ? TCMarkdown.lerMateria(r.texto) : Object.assign({}, r.dados, { tags: r.dados.tags || [] });
      return m;
    }
    if (tipo === 'votacoes') return TCMarkdown.lerVotacao(r.texto);
    if (tipo === 'videos') return TCMarkdown.lerVideo(r.texto);
    if (tipo === 'curtos') return TCMarkdown.lerCurto(r.texto);
    if (tipo === 'metadossies') return TCMarkdown.lerMetaDossie(r.texto);
    if (tipo === 'casos') return TCMarkdown.lerCaso(r.texto);
    if (tipo === 'publicacoes') return TCMarkdown.lerPublicacao(r.texto);
    if (tipo === 'dossies') return TCMarkdown.lerDossie(r.texto);
    if (r.formato === 'md') {
      var lido = TCMarkdown.ler(r.texto), f = TCMarkdown.lerFicha(r.texto);
      f.corpo = lido.corpo;
      return f;
    }
    var j = Object.assign({}, r.dados);
    j.corpo = TCMarkdown.corpoFicha(j);
    return j;
  }

  function abrir(tipo, id) {
    if (estado.atual && estado.atual.id === id && estado.atual.tipo === tipo) return;
    if (!podeSair()) return;
    api('item?tipo=' + tipo + '&id=' + encodeURIComponent(id)).then(function (r) {
      var daLista = estado.itens.filter(function (i) { return i.id === id; })[0];
      estado.ferramenta = null;
      estado.atual = { tipo: tipo, id: id, m: modeloDeArquivo(tipo, r), modo: 'form', antigo: r.formato === 'json', pdf: daLista ? daLista.pdf || '' : '' };
      estado.salvoEm = null;
      marcarSujo(false);
      desenharEditor();
      desenharLista();
      history.replaceState(null, '', '#' + tipo + '/' + id);
    }).catch(function (e) { aviso(e.message, true); });
  }

  function novo(tipo) {
    var m = tipo === 'dossies'
      ? { titulo: '', linha: '', data: hoje(), autor: 'Redação', capa: '', legenda: '', credito: '', tags: [], destaque: false, corpo: MODELO_DOSSIE }
      : tipo === 'publicacoes'
      ? { tipo: 'livro', titulo: '', autoria: '', editora: '', ano: String(new Date().getFullYear()), edicao: '', data: hoje().slice(0, 7),
          capa: '', link: '', rotulo_link: '', assuntos: [], corpo: '' }
      : tipo === 'videos'
      ? { titulo: '', criador: '', foto_criador: '', link: '', capa: '', data: hoje() }
      : tipo === 'curtos'
      ? { titulo: '', link: '', plataforma: '', criador: '', data: hoje(), capa: '', tags: [], corpo: '' }
      : tipo === 'metadossies'
      ? { titulo: '', linha: '', data: hoje(), autor: 'Redação', capa: '', legenda: '', credito: '', tags: [], destaque: false, dossies: [], corpo: '' }
      : tipo === 'casos'
      ? { titulo: '', status: TCMarkdown.STATUS_CASO[0], aberto: hoje(), atualizado: hoje(), etapa: '', envolvidos: [], tags: [], documentos: [], corpo: '' }
      : tipo === 'votacoes'
      ? { titulo: '', sigla: '', identificacao: '', autoria: '', ementa: '', ecidadania_id: '', recomendacao: '',
          votos_sim: '', votos_nao: '', apurado_em: '', data: hoje(), corpo: '' }
      : tipo === 'noticias'
      ? { titulo: '', linha: '', data: agoraLocal(), editoria: EDITORIAS[0], tags: [], autor: 'Redação', foto: '', legenda: '', credito: '', destaque: false, corpo: '' }
      : { nome: '', iniciais: '', foto: '', categoria: CATEGORIAS[2], cargo_curto: '', partido: '', uf: '', chamada: '', subtitulo: '', atualizado: hoje(),
          selos: [], dados: ROTULOS_DADOS.map(function (r) { return { rotulo: r, valor: '' }; }), eleicoes: [], nota_eleicoes: '', corpo: TCMarkdown.MODELO_FICHA };
    estado.ferramenta = null;
    estado.atual = { tipo: tipo, id: null, m: m, modo: 'form' };
    if (tipo === 'votacoes') {
      estado.salvoEm = null;
      marcarSujo(false);
      desenharEditor();
      desenharLista();
      var entrada = document.querySelector('.form .importar input');
      if (entrada) entrada.focus();
      return;
    }
    estado.salvoEm = null;
    marcarSujo(false);
    desenharEditor();
    desenharLista();
    var primeiro = document.querySelector('.form input[type="text"]');
    if (primeiro) primeiro.focus();
  }

  // Texto completo do arquivo .md a partir do que está na tela
  function arquivoAtual() {
    var a = estado.atual;
    if (a.modo === 'md') return document.querySelector('.arquivo textarea').value;
    return escreverArquivo(a);
  }
  function escreverArquivo(a) {
    if (a.tipo === 'votacoes') return TCMarkdown.escreverVotacao(a.m);
    if (a.tipo === 'videos') return TCMarkdown.escreverVideo(a.m);
    if (a.tipo === 'curtos') return TCMarkdown.escreverCurto(a.m);
    if (a.tipo === 'metadossies') return TCMarkdown.escreverMetaDossie(a.m);
    if (a.tipo === 'casos') return TCMarkdown.escreverCaso(a.m);
    if (a.tipo === 'publicacoes') return TCMarkdown.escreverPublicacao(a.m);
    if (a.tipo === 'dossies') return TCMarkdown.escreverDossie(a.m);
    return a.tipo === 'noticias' ? TCMarkdown.escreverMateria(a.m) : TCMarkdown.escreverFicha(a.m, a.m.corpo);
  }

  function validar() {
    var a = estado.atual, m = a.m, erros = [];
    if (a.modo === 'md') m = modeloDeArquivo(a.tipo, { formato: 'md', texto: arquivoAtual() });
    if (a.tipo === 'noticias') {
      if (!String(m.titulo || '').trim()) erros.push('o título');
      if (!String(m.data || '').trim()) erros.push('a data');
      if (!(m.tags || []).length) erros.push('pelo menos uma tag');
    } else if (a.tipo === 'votacoes') {
      if (!m.ecidadania_id) erros.push('a consulta do e-Cidadania (cole o link e clique em "Trazer do e-Cidadania")');
      if (!String(m.titulo || '').trim()) erros.push('o título');
      if (!m.recomendacao) erros.push('a recomendação de voto (Sim ou Não)');
      if (!String(m.corpo || '').trim()) erros.push('a descrição');
    } else if (a.tipo === 'videos') {
      if (!/^https?:\/\//i.test(String(m.link || '').trim())) erros.push('o link do vídeo (começando com https://)');
      if (!String(m.titulo || '').trim()) erros.push('o nome do vídeo');
      if (!String(m.criador || '').trim()) erros.push('o nome do criador');
    } else if (a.tipo === 'metadossies') {
      if (!String(m.titulo || '').trim()) erros.push('o título');
      if (!String(m.data || '').trim()) erros.push('a data');
      if (!(m.dossies || []).length) erros.push('pelo menos um dossiê na lista "Dossiês reunidos"');
    } else if (a.tipo === 'casos') {
      if (!String(m.titulo || '').trim()) erros.push('o título');
      if (TCMarkdown.STATUS_CASO.indexOf(m.status) < 0) erros.push('a situação');
      if (!String(m.aberto || '').trim()) erros.push('a data de abertura');
      if (!String(m.corpo || '').trim()) erros.push('o resumo');
    } else if (a.tipo === 'curtos') {
      if (!/^https?:\/\//i.test(String(m.link || '').trim())) erros.push('o link do vídeo (começando com https://)');
      if (!String(m.titulo || '').trim()) erros.push('o título');
      if (!(m.tags || []).length) erros.push('pelo menos uma tag');
    } else if (a.tipo === 'dossies') {
      if (!String(m.titulo || '').trim()) erros.push('o título');
      if (!String(m.data || '').trim()) erros.push('a data');
      if (!TCMarkdown.capitulosDossie(m.corpo).capitulos.length) erros.push('pelo menos um capítulo (uma linha "## Título do capítulo" no texto)');
    } else if (a.tipo === 'publicacoes') {
      if (!String(m.titulo || '').trim()) erros.push('o título');
      var lk = String(m.link || '').trim();
      if (lk && !/^(https?:\/\/|imagens\/|arquivos\/)/i.test(lk)) erros.push('um link válido (começando com https://), ou deixe o link em branco');
    } else {
      if (!String(m.nome || '').trim()) erros.push('o nome');
    }
    return erros;
  }

  function salvar() {
    var a = estado.atual;
    if (!a) return Promise.resolve(false);
    var faltam = validar();
    if (faltam.length) { aviso('Falta preencher ' + faltam.join(', ') + '.', true); return Promise.resolve(false); }
    if (a.tipo === 'noticias' && a.carimbar && a.modo === 'form') {
      a.m.editado = agoraLocal();
      var campoEditado = $('campo-editado');
      if (campoEditado) campoEditado.value = a.m.editado.slice(0, 16);
    }
    var texto = arquivoAtual();
    if (a.tipo === 'politicos') {
      // Trechos de exemplo do modelo de ficha nova que ficaram no texto
      var restos = ['De 3 a 5 frases, só com fatos verificáveis.', '**2018:** O que aconteceu', '- Item\n', 'O que aconteceu, e a versão da pessoa', 'https://exemplo.com']
        .filter(function (t) { return (texto + '\n').indexOf(t) >= 0; });
      if (restos.length && !confirm('O texto da ficha ainda tem trechos do modelo de exemplo (como "' + restos[0].replace(/\n/g, '').trim() + '"). Salvar mesmo assim?')) return Promise.resolve(false);
    }
    var botao = document.querySelector('[data-acao="salvar"]');
    if (botao) botao.disabled = true;
    return api('salvar', { corpo: { tipo: a.tipo, id: a.id || '', texto: texto } }).then(function (r) {
      var novoItem = !a.id;
      a.id = r.id;
      a.antigo = false;
      if (a.modo === 'md') a.m = modeloDeArquivo(a.tipo, { formato: 'md', texto: texto });
      var z = function (n) { return String(n).padStart(2, '0'); }, d = new Date();
      estado.salvoEm = z(d.getHours()) + ':' + z(d.getMinutes());
      marcarSujo(false);
      aviso(novoItem ? 'Criado. Endereço: ' + enderecoNoSite(a.tipo, r.id) : 'Salvo.');
      if (novoItem) desenharEditor();
      history.replaceState(null, '', '#' + a.tipo + '/' + a.id);
      carregarLista();
      if (a.tipo === 'noticias' || a.tipo === 'curtos' || a.tipo === 'casos') carregarTags();
      carregarIndices();
      if (a.tipo === 'dossies' || a.tipo === 'metadossies') a.pdf = a.pdf ? 'PDF desatualizado' : '';
      return true;
    }).catch(function (e) { aviso('Não salvou: ' + e.message, true); return false; })
      .then(function (ok) { if (botao) botao.disabled = false; return ok; });
  }

  function apagar() {
    var a = estado.atual;
    if (!a || !a.id) return;
    var nome = a.tipo === 'noticias' ? 'a matéria "' + (a.m.titulo || a.id) + '"'
      : a.tipo === 'votacoes' ? 'a votação "' + (a.m.titulo || a.id) + '"'
      : a.tipo === 'videos' ? 'o vídeo "' + (a.m.titulo || a.id) + '"'
      : a.tipo === 'curtos' ? 'o vídeo curto "' + (a.m.titulo || a.id) + '"'
      : a.tipo === 'metadossies' ? 'o meta-dossiê "' + (a.m.titulo || a.id) + '" (e o PDF dele, se houver; os dossiês que ele junta continuam)'
      : a.tipo === 'casos' ? 'o caso "' + (a.m.titulo || a.id) + '"'
      : a.tipo === 'dossies' ? 'o dossiê "' + (a.m.titulo || a.id) + '" (e o PDF dele, se houver)'
      : a.tipo === 'publicacoes' ? (a.m.tipo === 'revista' ? 'a revista "' : 'o livro "') + (a.m.titulo || a.id) + '"' : 'a ficha de ' + (a.m.nome || a.id);
    if (!confirm('Apagar ' + nome + '? O arquivo será removido da pasta conteudo e sai do site. Links já compartilhados param de funcionar.')) return;
    api('apagar', { corpo: { tipo: a.tipo, id: a.id } }).then(function () {
      aviso('Apagado.');
      estado.atual = null;
      marcarSujo(false);
      desenharLista();
      carregarLista();
      history.replaceState(null, '', '#' + estado.tipo);
    }).catch(function (e) { aviso('Não apagou: ' + e.message, true); });
  }

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); if (estado.atual) salvar(); }
  });

  // =========================================================================
  // Campos
  // =========================================================================
  function campo(rotulo, controle, opcoes) {
    opcoes = opcoes || {};
    return h('label', { class: 'campo' + (opcoes.largo ? ' largo' : '') },
      h('span', null, rotulo, opcoes.extra || null), controle, opcoes.dica ? h('small', null, opcoes.dica) : null);
  }
  function texto(obj, chave, attrs) {
    return h('input', Object.assign({ type: 'text', value: obj[chave] == null ? '' : obj[chave],
      oninput: function (e) { obj[chave] = e.target.value; marcarSujo(); } }, attrs || {}));
  }
  function areaTexto(obj, chave, linhas) {
    return h('textarea', { rows: linhas || 2, value: obj[chave] || '', oninput: function (e) { obj[chave] = e.target.value; marcarSujo(); } });
  }
  function selecao(obj, chave, opcoes) {
    if (obj[chave] && opcoes.indexOf(obj[chave]) < 0) opcoes = opcoes.concat([obj[chave]]);
    return h('select', { onchange: function (e) { obj[chave] = e.target.value; marcarSujo(); } },
      opcoes.map(function (o) { return h('option', { value: o, selected: o === obj[chave] ? 'selected' : null }, o); }));
  }
  function marcar(obj, chave, rotulo) {
    return h('label', { class: 'marcar' }, h('input', { type: 'checkbox', checked: !!obj[chave],
      onchange: function (e) { obj[chave] = e.target.checked; marcarSujo(); } }), rotulo);
  }
  function contador(input, max) {
    var c = h('span', { class: 'contador' });
    var atualizar = function () { var n = input.value.length; c.textContent = n + '/' + max; c.classList.toggle('acima', n > max); };
    input.addEventListener('input', atualizar);
    atualizar();
    return c;
  }

  // ---- Tags com sugestões (tag/subtag)
  function campoTags(m) {
    var caixa = h('div', { class: 'tags' });
    var entrada = h('input', { type: 'text', placeholder: 'Digite e aperte Enter. Subtag: violência/contra indígenas', 'aria-label': 'Nova tag', autocomplete: 'off' });
    var listaSug = h('div', { class: 'sugestoes' });
    var escolhida = -1, opcoes = [];
    var existe = function (t) { return estado.tags.some(function (x) { return TCTags.norm(x.tag) === TCTags.norm(t); }); };

    function desenhar() {
      caixa.innerHTML = '';
      m.tags.forEach(function (t, i) {
        caixa.appendChild(h('span', { class: 'tag' + (existe(t) ? '' : ' nova'), title: existe(t) ? '' : 'Tag nova (ainda não usada em outra matéria)' },
          TCTags.rotulo(t),
          h('button', { type: 'button', 'aria-label': 'Remover ' + t, onclick: function () { m.tags.splice(i, 1); marcarSujo(); desenhar(); entrada.focus(); } }, '×')));
      });
      caixa.appendChild(entrada);
      entrada.disabled = m.tags.length >= MAX_TAGS;
      entrada.placeholder = m.tags.length >= MAX_TAGS ? 'Máximo de ' + MAX_TAGS + ' tags' : (m.tags.length ? 'Outra tag' : 'Digite e aperte Enter. Subtag: violência/contra indígenas');
      estado.redesenharTags = desenhar;
    }
    function adicionar(t) {
      t = TCTags.limpa(String(t || '').replace(/,/g, ' ').trim());
      if (!t || m.tags.length >= MAX_TAGS) return;
      var igual = estado.tags.filter(function (x) { return TCTags.norm(x.tag) === TCTags.norm(t); })[0];
      if (igual) t = igual.tag;   // usa a grafia que já existe ("violencia" → "violência")
      else {
        // subtag nova de uma tag-mãe que já existe: aproveita a grafia da mãe
        var p = TCTags.partes(t), mae = estado.tags.filter(function (x) { return !x.sub && TCTags.norm(x.tag) === TCTags.norm(p.mae); })[0];
        if (mae && p.sub) t = mae.tag + '/' + p.sub;
      }
      if (m.tags.some(function (x) { return TCTags.norm(x) === TCTags.norm(t); })) return;
      m.tags.push(t);
      marcarSujo();
      entrada.value = '';
      fecharSug();
      desenhar();
      entrada.focus();
    }
    function fecharSug() { listaSug.innerHTML = ''; opcoes = []; escolhida = -1; }
    function sugerir() {
      var q = TCTags.norm(entrada.value);
      fecharSug();
      if (!q) return;
      opcoes = estado.tags.filter(function (x) {
        var n = TCTags.norm(x.tag);
        return n.indexOf(q) >= 0 && !m.tags.some(function (t) { return TCTags.norm(t) === n; });
      }).slice(0, 12);
      if (!opcoes.length) return;
      listaSug.appendChild(h('ul', { role: 'listbox' }, opcoes.map(function (x, i) {
        return h('li', { role: 'option', class: x.sub ? 'sub' : '', 'aria-selected': 'false',
          onmousedown: function (e) { e.preventDefault(); adicionar(x.tag); } }, x.rotulo, h('small', null, x.n + (estado.tipo === 'curtos' ? (x.n === 1 ? ' vídeo' : ' vídeos') : estado.tipo === 'casos' ? (x.n === 1 ? ' caso' : ' casos') : (x.n === 1 ? ' matéria' : ' matérias'))));
      })));
    }
    function destacar(i) {
      var lis = listaSug.querySelectorAll('li');
      if (!lis.length) return;
      escolhida = (i + lis.length) % lis.length;
      lis.forEach(function (li, j) { li.setAttribute('aria-selected', j === escolhida ? 'true' : 'false'); });
      lis[escolhida].scrollIntoView({ block: 'nearest' });
    }
    entrada.addEventListener('input', function () {
      if (entrada.value.indexOf(',') >= 0) { entrada.value.split(',').slice(0, -1).forEach(adicionar); entrada.value = entrada.value.split(',').pop(); }
      sugerir();
    });
    entrada.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); destacar(escolhida + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); destacar(escolhida - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); adicionar(escolhida >= 0 && opcoes[escolhida] ? opcoes[escolhida].tag : entrada.value); }
      else if (e.key === 'Escape') fecharSug();
      else if (e.key === 'Backspace' && !entrada.value && m.tags.length) { m.tags.pop(); marcarSujo(); desenhar(); entrada.focus(); }
    });
    entrada.addEventListener('blur', function () { setTimeout(function () { if (entrada.value.trim()) adicionar(entrada.value); fecharSug(); }, 120); });
    caixa.addEventListener('click', function (e) { if (e.target === caixa) entrada.focus(); });
    desenhar();
    return h('div', null, caixa, listaSug);
  }

  // ---- Imagens
  // Reduz fotos grandes no navegador antes de enviar (maxLargura × maxAltura)
  function prepararImagem(arquivo, maxL, maxA) {
    return new Promise(function (ok) {
      if (!/^image\/(jpeg|png|webp)$/.test(arquivo.type)) return ok(arquivo);
      var img = new Image(), url = URL.createObjectURL(arquivo);
      img.onload = function () {
        URL.revokeObjectURL(url);
        var k = Math.min(1, maxL / img.naturalWidth, maxA / img.naturalHeight);
        if (k >= 1 && arquivo.size < 1024 * 1024) return ok(arquivo);
        var c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
        var ctx = c.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, c.width, c.height);
        var tipo = arquivo.type === 'image/png' ? 'image/png' : 'image/jpeg';
        c.toBlob(function (b) { ok(b && b.size < arquivo.size ? new File([b], arquivo.name, { type: tipo }) : arquivo); }, tipo, 0.86);
      };
      img.onerror = function () { URL.revokeObjectURL(url); ok(arquivo); };
      img.src = url;
    });
  }

  function enviarImagem(pasta, arquivo, maxL, maxA) {
    if (!arquivo || !/^image\//.test(arquivo.type)) return Promise.reject(new Error('escolha um arquivo de imagem'));
    aviso('Enviando ' + arquivo.name + '…');
    return prepararImagem(arquivo, maxL, maxA).then(function (f) {
      return api('imagem?pasta=' + pasta + '&nome=' + encodeURIComponent(arquivo.name), { corpo: f, headers: { 'Content-Type': f.type } });
    }).then(function (r) { aviso('Imagem enviada.'); return r.caminho; });
  }

  function escolherArquivo() {
    return new Promise(function (ok) {
      var i = h('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp,image/gif' });
      i.addEventListener('change', function () { ok(i.files[0] || null); });
      i.click();
    });
  }

  function galeria(pasta) {
    return new Promise(function (ok) {
      var dlg = $('galeria'), grade = $('galeria-grade');
      grade.innerHTML = '<p class="dica">Carregando…</p>';
      dlg.showModal();
      var fim = function (v) { dlg.removeEventListener('close', aoFechar); if (dlg.open) dlg.close(); ok(v); };
      var aoFechar = function () { fim(null); };
      dlg.addEventListener('close', aoFechar);
      api('imagens?pasta=' + pasta).then(function (r) {
        grade.innerHTML = '';
        if (!r.imagens.length) { grade.appendChild(h('p', { class: 'dica' }, 'Nenhuma imagem enviada ainda.')); return; }
        r.imagens.forEach(function (c) {
          grade.appendChild(h('button', { type: 'button', title: c.split('/').pop(), onclick: function () { fim(c); } }, h('img', { src: '../' + c, alt: '', loading: 'lazy' })));
        });
      }).catch(function (e) { grade.innerHTML = ''; grade.appendChild(h('p', { class: 'dica' }, e.message)); });
    });
  }

  // Confere se o link é de uma imagem que abre (https://… que o navegador consegue mostrar)
  function testarLinkImagem(url) {
    return new Promise(function (ok, falha) {
      if (!/^https?:\/\/\S+$/i.test(url)) return falha(new Error('o link precisa começar com https:// e não ter espaços'));
      var img = new Image(), tempo = setTimeout(function () { img.src = ''; falha(new Error('a imagem demorou demais para abrir; confira o link')); }, 15000);
      img.referrerPolicy = 'no-referrer';
      img.onload = function () { clearTimeout(tempo); ok(img); };
      img.onerror = function () {
        clearTimeout(tempo);
        falha(new Error('não consegui abrir uma imagem nesse link. Use o link direto da imagem (botão direito na foto › "Copiar endereço da imagem"), não o da página.'));
      };
      img.src = url;
    });
  }

  function campoFoto(m, chave, pasta, opcoes) {
    var previa = h('div', { class: 'foto-previa' + (opcoes.quadrada ? ' quadrada' : '') });
    var caminho = h('span', { class: 'caminho' });
    var remover = h('button', { type: 'button', class: 'botao-texto', onclick: function () { m[chave] = ''; marcarSujo(); desenhar(); } }, 'Remover');
    function desenhar() {
      previa.innerHTML = '';
      if (m[chave]) previa.appendChild(h('img', { src: /^https?:/.test(m[chave]) ? m[chave] : '../' + TCMarkdown.caminhoImagem(m[chave]), alt: '', referrerpolicy: 'no-referrer' }));
      else previa.textContent = 'Sem foto · arraste uma imagem aqui';
      caminho.textContent = m[chave] || '';
      remover.hidden = !m[chave];
    }
    function usar(arq) {
      enviarImagem(pasta, arq, opcoes.maxL, opcoes.maxA).then(function (c) { m[chave] = c; marcarSujo(); desenhar(); }, function (e) { aviso(e.message, true); });
    }
    ['dragenter', 'dragover'].forEach(function (t) { previa.addEventListener(t, function (e) { e.preventDefault(); previa.classList.add('arrastando'); }); });
    ['dragleave', 'drop'].forEach(function (t) { previa.addEventListener(t, function (e) { e.preventDefault(); previa.classList.remove('arrastando'); }); });
    previa.addEventListener('drop', function (e) { if (e.dataTransfer.files[0]) usar(e.dataTransfer.files[0]); });
    // Foto por link (endereço de uma imagem em outro site)
    var link = h('input', { type: 'url', placeholder: 'https://… (link direto da imagem)', 'aria-label': 'Link da foto',
      onkeydown: function (e) { if (e.key === 'Enter') { e.preventDefault(); usarLink(); } } });
    function usarLink() {
      var url = link.value.trim();
      if (!url) return;
      testarLinkImagem(url).then(function () {
        m[chave] = url; link.value = ''; marcarSujo(); desenhar(); aviso('Foto definida pelo link.');
      }, function (e) { aviso(e.message, true); });
    }
    desenhar();
    return h('div', { class: 'foto' }, previa, h('div', { class: 'foto-acoes' },
      h('button', { type: 'button', class: 'botao', onclick: function () { escolherArquivo().then(function (a) { if (a) usar(a); }); } }, 'Enviar imagem'),
      h('button', { type: 'button', class: 'botao-texto', onclick: function () { galeria(pasta).then(function (c) { if (c) { m[chave] = c; marcarSujo(); desenhar(); } }); } }, 'Escolher uma já enviada'),
      h('div', { class: 'foto-link' }, link, h('button', { type: 'button', class: 'botao-mini', onclick: usarLink }, 'Usar link')),
      remover, caminho, opcoes.dica ? h('small', { class: 'dica' }, opcoes.dica) : null));
  }

  // ---- Listas de linhas (selos, dados, eleições)
  function campoLinhas(lista, colunas, novoItem, extras) {
    var caixa = h('div', { class: 'linhas' });
    var molde = colunas.map(function (c) { return c.largura; }).join(' ') + ' 34px';
    function desenhar() {
      caixa.innerHTML = '';
      if (lista.length) caixa.appendChild(h('div', { class: 'linhas-topo', style: 'grid-template-columns:' + molde }, colunas.map(function (c) { return h('span', null, c.rotulo); }), h('span')));
      lista.forEach(function (item, i) {
        caixa.appendChild(h('div', { class: 'linha', style: 'grid-template-columns:' + molde },
          colunas.map(function (c) {
            if (c.tipo === 'marcar') return marcar(item, c.chave, c.rotuloMarcar || 'Sim');
            return h('input', { type: c.tipo === 'numero' ? 'number' : 'text', value: item[c.chave] == null ? '' : item[c.chave], placeholder: c.exemplo || '',
              'aria-label': c.rotulo, list: c.lista || null,
              oninput: function (e) { item[c.chave] = c.tipo === 'numero' ? e.target.value : e.target.value; marcarSujo(); } });
          }),
          h('button', { type: 'button', class: 'botao-mini', 'aria-label': 'Remover linha', title: 'Remover', onclick: function () { lista.splice(i, 1); marcarSujo(); desenhar(); } }, '×')));
      });
      caixa.appendChild(h('div', { class: 'linhas-acoes' },
        h('button', { type: 'button', class: 'botao-mini', onclick: function () { lista.push(novoItem()); marcarSujo(); desenhar(); var ins = caixa.querySelectorAll('.linha'); var ult = ins[ins.length - 1]; if (ult) ult.querySelector('input').focus(); } }, '+ Adicionar'),
        (extras || []).map(function (x) { return h('button', { type: 'button', class: 'botao-mini', onclick: function () { x.acao(lista); marcarSujo(); desenhar(); } }, x.rotulo); })));
    }
    desenhar();
    return caixa;
  }

  // ---- Texto em Markdown com barra de ferramentas e prévia
  function campoMarkdown(m, chave, opcoes) {
    var area = h('textarea', { value: m[chave] || '', spellcheck: 'true', 'aria-label': opcoes.rotulo || 'Texto' });
    var previa = h('div', { class: 'previa', 'aria-live': 'off' });
    var caixa = h('div', { class: 'texto' });

    function atualizarPrevia() {
      previa.innerHTML = '';
      previa.appendChild(h('p', { class: 'previa-rotulo' }, 'Prévia'));
      var conteudo = h('div');
      conteudo.innerHTML = opcoes.renderizar ? opcoes.renderizar(area.value) : TCMarkdown.html(area.value, '../');
      if (!area.value.trim()) conteudo.innerHTML = '<p class="vazio-previa">O texto aparece aqui enquanto você escreve.</p>';
      previa.appendChild(conteudo);
    }
    var agendado = null;
    area.addEventListener('input', function () {
      m[chave] = area.value;
      marcarSujo();
      clearTimeout(agendado);
      agendado = setTimeout(atualizarPrevia, 120);
    });

    // Ações da barra
    function selecao() { return { ini: area.selectionStart, fim: area.selectionEnd, txt: area.value.slice(area.selectionStart, area.selectionEnd) }; }
    function trocar(ini, fim, novo, selIni, selFim) {
      area.focus();
      area.setSelectionRange(ini, fim);
      if (!document.execCommand || !document.execCommand('insertText', false, novo)) {
        area.setRangeText(novo, ini, fim, 'end');
        area.dispatchEvent(new Event('input'));
      }
      area.setSelectionRange(selIni == null ? ini + novo.length : selIni, selFim == null ? ini + novo.length : selFim);
    }
    function envolver(antes, depois, exemplo) {
      var s = selecao(), t = s.txt || exemplo;
      trocar(s.ini, s.fim, antes + t + depois, s.ini + antes.length, s.ini + antes.length + t.length);
    }
    function prefixar(prefixo, numerado) {
      var v = area.value, s = selecao();
      var ini = v.lastIndexOf('\n', s.ini - 1) + 1, fim = v.indexOf('\n', s.fim);
      if (fim < 0) fim = v.length;
      var linhas = v.slice(ini, fim).split('\n');
      var limpar = function (l) { return l.replace(/^(#{1,3}\s+|>\s?|[-*+]\s+|\d+[.)]\s+)/, ''); };
      var todas = linhas.every(function (l) { return !l.trim() || (numerado ? /^\d+[.)]\s/.test(l) : l.indexOf(prefixo) === 0); });
      var novo = linhas.map(function (l, i) {
        if (!l.trim() && linhas.length > 1) return l;
        if (todas) return limpar(l);
        return (numerado ? (i + 1) + '. ' : prefixo) + limpar(l);
      }).join('\n');
      trocar(ini, fim, novo, ini, ini + novo.length);
    }
    function link() {
      var s = selecao(), url = prompt('Endereço do link (https://…):', 'https://');
      if (!url || url === 'https://') return;
      var t = s.txt || 'texto do link';
      trocar(s.ini, s.fim, '[' + t + '](' + url.trim() + ')', s.ini + 1, s.ini + 1 + t.length);
    }
    function inserirImagem(caminhoImg) {
      var legenda = prompt('Descrição da imagem (aparece como legenda e é lida por leitores de tela):', '') || '';
      var s = selecao(), v = area.value;
      var antes = s.ini > 0 && v[s.ini - 1] !== '\n' ? '\n\n' : (s.ini > 1 && v[s.ini - 2] !== '\n' ? '\n' : '');
      trocar(s.ini, s.fim, antes + '![' + legenda.replace(/[\[\]]/g, '') + '](' + caminhoImg + ')\n\n');
    }
    function imagem() {
      escolherArquivo().then(function (a) {
        if (!a) return;
        enviarImagem(NOMES[estado.atual.tipo].pasta, a, 1600, 1600).then(inserirImagem, function (e) { aviso(e.message, true); });
      });
    }
    function imagemPorLink() {
      var url = prompt('Link direto da imagem (https://…). Dica: botão direito na foto › "Copiar endereço da imagem".', 'https://');
      if (!url || url.trim() === 'https://') return;
      url = url.trim();
      testarLinkImagem(url).then(function () { inserirImagem(url); }, function (e) { aviso(e.message, true); });
    }

    var botoes = [
      ['B', 'Negrito (Ctrl+B)', function () { envolver('**', '**', 'texto em negrito'); }],
      ['I', 'Itálico (Ctrl+I)', function () { envolver('*', '*', 'texto em itálico'); }],
      'sep',
      ['T2', 'Intertítulo (Título 2)', function () { prefixar('## '); }],
      ['T3', 'Subdivisão (Título 3)', function () { prefixar('### '); }],
      ['❝', 'Citação', function () { prefixar('> '); }],
      ['• Lista', 'Lista com marcadores', function () { prefixar('- '); }],
      ['1. Lista', 'Lista numerada', function () { prefixar('', true); }],
      'sep',
      ['Link', 'Link (Ctrl+K)', link],
      ['Imagem', 'Enviar e inserir uma imagem', imagem],
      ['Imagem por link', 'Inserir uma imagem de outro site pelo link', imagemPorLink],
      ['Galeria', 'Inserir uma imagem já enviada', function () { galeria(NOMES[estado.atual.tipo].pasta).then(function (c) { if (c) inserirImagem(c); }); }]
    ];
    var barra = h('div', { class: 'ferramentas', role: 'toolbar', 'aria-label': 'Formatação' },
      botoes.map(function (b) {
        if (b === 'sep') return h('span', { class: 'sep' });
        return h('button', { type: 'button', title: b[1], 'aria-label': b[1], onclick: b[2] }, b[0]);
      }),
      h('button', { type: 'button', class: 'direita', title: 'Mostrar ou esconder a prévia', onclick: function () { caixa.classList.toggle('sem-previa'); } }, 'Prévia'));
    area.addEventListener('keydown', function (e) {
      if (!(e.ctrlKey || e.metaKey)) return;
      var k = e.key.toLowerCase();
      if (k === 'b') { e.preventDefault(); envolver('**', '**', 'texto em negrito'); }
      else if (k === 'i') { e.preventDefault(); envolver('*', '*', 'texto em itálico'); }
      else if (k === 'k') { e.preventDefault(); link(); }
    });

    caixa.appendChild(h('div', { class: 'texto-editor' }, barra, area));
    caixa.appendChild(previa);
    atualizarPrevia();
    return caixa;
  }

  // Prévia da ficha: o texto dividido nas seções que a página da ficha mostra
  function previaFicha(corpo) {
    var f = TCMarkdown.lerFicha('---\n---\n' + corpo);
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var inl = function (t) { return TCMarkdown.html(t).replace(/^<p>|<\/p>$/g, ''); };
    var partes = [];
    if (f.resumo) partes.push('<h2>Resumo</h2><p>' + inl(f.resumo) + '</p>');
    if (f.trajetoria.length) partes.push('<h2>Trajetória</h2><ul class="ficha-trajetoria">' + f.trajetoria.map(function (t) { return '<li><b>' + esc(t.quando) + '</b><span>' + inl(t.fato) + '</span></li>'; }).join('') + '</ul>');
    [[f.atuacao_titulo, f.atuacao], ['Posições declaradas', f.posicoes], ['Controvérsias e processos', f.controversias]].forEach(function (s) {
      if (s[1].length) partes.push('<h2>' + esc(s[0]) + '</h2><ul>' + s[1].map(function (i) { return '<li>' + inl(i) + '</li>'; }).join('') + '</ul>');
    });
    var fontes = f.fontes.filter(function (fo) { return fo.url; });
    if (fontes.length) partes.push('<h2>Fontes</h2><ol>' + fontes.map(function (fo) { return '<li><a href="' + esc(fo.url) + '" target="_blank" rel="noopener noreferrer">' + esc(fo.titulo) + '</a></li>'; }).join('') + '</ol>');
    var semUrl = f.fontes.length - fontes.length;
    if (!fontes.length) partes.push('<p class="alerta">A ficha ainda não tem fontes com link. Toda informação precisa estar numa fonte (seção "## Fontes", itens no formato - [Título](https://...)).</p>');
    else if (semUrl) partes.push('<p class="alerta">' + semUrl + (semUrl === 1 ? ' fonte está' : ' fontes estão') + ' sem link e não aparece' + (semUrl === 1 ? '' : 'm') + ' na ficha.</p>');
    return partes.join('\n');
  }

  // =========================================================================
  // Telas de edição
  // =========================================================================
  function desenharEditor() {
    var a = estado.atual, area = $('area');
    area.innerHTML = '';
    var verSite = a.id ? h('a', { class: 'botao', href: '../' + enderecoNoSite(a.tipo, a.id), target: '_blank', rel: 'noopener' }, 'Ver no site') : null;
    var modos = h('div', { class: 'modos', role: 'group', 'aria-label': 'Modo de edição' },
      h('button', { type: 'button', 'aria-pressed': a.modo === 'form' ? 'true' : 'false', onclick: function () { trocarModo('form'); } }, 'Formulário'),
      h('button', { type: 'button', 'aria-pressed': a.modo === 'md' ? 'true' : 'false', onclick: function () { trocarModo('md'); } }, 'Arquivo Markdown'));
    area.appendChild(h('div', { class: 'barra' },
      h('button', { type: 'button', class: 'botao-texto voltar', onclick: voltarParaGrade, title: 'Voltar para a lista' }, '← ' + COLECAO[a.tipo].nome),
      h('span', { class: 'estado' }),
      modos, verSite,
      a.tipo === 'dossies' || a.tipo === 'metadossies' ? h('button', { type: 'button', class: 'botao', 'data-acao': 'pdf', title: 'Salva e gera o PDF', onclick: gerarPdf }, 'Gerar PDF') : null,
      a.id ? h('button', { type: 'button', class: 'botao perigo', onclick: apagar }, 'Apagar') : null,
      h('button', { type: 'button', class: 'botao principal', 'data-acao': 'salvar', title: 'Ctrl+S', onclick: salvar }, a.id ? 'Salvar' : 'Criar')));
    marcarSujo(estado.sujo);

    if (a.modo === 'md') {
      var ta = h('textarea', { spellcheck: 'false', value: a.textoMd || '', oninput: function () { marcarSujo(); } });
      area.appendChild(h('div', { class: 'form arquivo' },
        h('p', { class: 'dica' }, 'Este é o arquivo completo, como fica gravado em conteudo/' + a.tipo + '/' + (a.id || '(novo)') + '.md. O cabeçalho entre as linhas --- guarda os dados; o texto vem depois. Para voltar ao formulário, clique em "Formulário".'),
        ta));
      return;
    }
    estado.redesenharTags = null;
    var form = a.tipo === 'noticias' ? formMateria(a) : a.tipo === 'votacoes' ? formVotacao(a)
      : a.tipo === 'videos' ? formVideo(a) : a.tipo === 'publicacoes' ? formPublicacao(a)
      : a.tipo === 'dossies' ? formDossie(a) : a.tipo === 'curtos' ? formCurto(a)
      : a.tipo === 'metadossies' ? formMetaDossie(a) : a.tipo === 'casos' ? formCaso(a) : formFicha(a);
    if (TCLigacoes.TIPOS[a.tipo]) form.appendChild(secaoLigacoes(a));
    area.appendChild(form);
  }

  function trocarModo(modo) {
    var a = estado.atual;
    if (modo === a.modo) return;
    if (modo === 'md') {
      a.textoMd = escreverArquivo(a);
    } else {
      var texto = document.querySelector('.arquivo textarea').value;
      if (!/^---\n[\s\S]*?\n---/.test(texto.replace(/\r/g, ''))) { aviso('O arquivo precisa começar com o cabeçalho entre linhas ---.', true); return; }
      a.m = modeloDeArquivo(a.tipo, { formato: 'md', texto: texto });
    }
    a.modo = modo;
    desenharEditor();
  }

  function formMateria(a) {
    var m = a.m;
    var titulo = texto(m, 'titulo', { maxlength: 200, placeholder: 'O fato, em uma ou duas linhas' });
    var dataInput = h('input', { type: 'datetime-local', step: 60, value: String(m.data || '').slice(0, 16),
      oninput: function (e) { m.data = e.target.value ? e.target.value + ':00' : ''; marcarSujo(); } });
    // Última edição (opcional): "Atualizada em …" na matéria
    var editadoInput = h('input', { type: 'datetime-local', step: 60, id: 'campo-editado', value: String(m.editado || '').slice(0, 16),
      oninput: function (e) { m.editado = e.target.value ? e.target.value + ':00' : ''; marcarSujo(); } });
    var editado = h('div', { class: 'campo' },
      h('span', null, 'Última edição', h('span', { class: 'contador' }, 'opcional')),
      editadoInput,
      h('div', { class: 'linhas-acoes' },
        h('button', { type: 'button', class: 'botao-mini', onclick: function () { m.editado = agoraLocal(); editadoInput.value = m.editado.slice(0, 16); marcarSujo(); } }, 'Agora'),
        h('button', { type: 'button', class: 'botao-mini', onclick: function () { m.editado = ''; editadoInput.value = ''; marcarSujo(); } }, 'Limpar')),
      a.id ? h('label', { class: 'marcar' }, h('input', { type: 'checkbox', checked: !!a.carimbar,
        onchange: function (e) { a.carimbar = e.target.checked; } }), 'Marcar a hora ao salvar') : null,
      h('small', null, 'Aparece na matéria como "Atualizada em …". Use quando corrigir ou acrescentar informação.'));
    var endereco = a.id
      ? h('p', { class: 'dica' }, 'Endereço: ' + NOMES.noticias.pagina + '?id=' + a.id + ' (não muda, mesmo que o título seja corrigido)')
      : h('p', { class: 'dica' }, 'O endereço da matéria é criado ao clicar em "Criar", a partir da data e do título.');
    return h('div', { class: 'form' },
      a.antigo ? h('p', { class: 'dica' }, 'Esta matéria está no formato antigo (.json). Ao salvar, ela é convertida para Markdown (.md).') : null,
      h('section', { class: 'secao' },
        h('h2', null, a.id ? 'Matéria' : 'Nova matéria'),
        h('div', { class: 'grade' },
          campo('Título', titulo, { largo: true, extra: contador(titulo, 140) }),
          campo('Linha fina', areaTexto(m, 'linha', 2), { largo: true, dica: 'Uma ou duas frases sobre o que está em jogo. Aparece sob o título e nas listas.' }),
          campo('Data de publicação', dataInput),
          editado,
          campo('Editoria', selecao(m, 'editoria', EDITORIAS)),
          campo('Autoria', texto(m, 'autor')),
          h('div', { class: 'campo' }, h('span', null, 'Home'), marcar(m, 'destaque', 'Manchete principal da Home'), h('small', null, 'Se várias estiverem marcadas, vale a mais recente.'))),
        endereco),
      h('section', { class: 'secao' },
        h('h2', null, 'Tags'),
        campoTags(m),
        h('p', { class: 'dica' }, 'De 1 a 8, em minúsculas. Reaproveite as sugeridas: "greve" e "greves" viram filtros diferentes. Para uma subtag, use a barra: violência/contra indígenas. Tags com borda tracejada são novas.')),
      h('section', { class: 'secao' },
        h('h2', null, 'Foto principal'),
        campoFoto(m, 'foto', 'materias', { maxL: 1600, maxA: 1600, dica: 'Horizontal. Fotos grandes são reduzidas para 1600 px de largura ao enviar.' }),
        h('div', { class: 'grade' },
          campo('Legenda', texto(m, 'legenda', { placeholder: 'O que aparece na foto' }), { dica: 'Também é lida por leitores de tela.' }),
          campo('Crédito', texto(m, 'credito', { placeholder: 'Nome / Tempo Continuum' })))),
      h('section', { class: 'secao' },
        h('h2', null, 'Texto'),
        h('p', { class: 'dica' }, 'Escrito em Markdown. Use T2 para os intertítulos, citação para falas de entrevistados e parágrafos curtos, de 2 a 4 frases. Uma linha em branco separa os parágrafos.'),
        campoMarkdown(m, 'corpo', { rotulo: 'Texto da matéria' })),
      secaoImagem(a));
  }

  // =========================================================================
  // Imagem para redes (gerador.js), preenchida com a matéria enquanto ela é escrita
  // =========================================================================
  function dadosDaImagem(a) {
    var m = a.m, foto = m.foto || '';
    if (foto && !/^https?:/.test(foto)) foto = TCMarkdown.caminhoImagem(foto);
    return {
      titulo: m.titulo || '',
      selo: m.editoria || '',
      rodape1: 'Leia a matéria completa',
      rodape2: SITE_PUBLICO.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      link: a.id ? SITE_PUBLICO + enderecoNoSite(a.tipo, a.id) : '',
      nome: a.id || '',
      fundo: foto,
      logos: ['logos/logo-escuro.svg'],
      aviso: a.id ? '' : 'O link e o QR code entram quando a matéria for criada (o endereço sai da data e do título).'
    };
  }
  function secaoImagem(a) {
    var lugar = h('div');
    a.gerador = a.gerador || {};
    var g = TCGerador.montar(lugar, { automatico: true, memoria: a.gerador, item: a.id ? a.tipo + '/' + a.id : null, rotulo: 'da matéria' });
    estado.imagem = { g: g, a: a };
    g.preencher(dadosDaImagem(a));
    return h('section', { class: 'secao' },
      h('h2', null, 'Imagem para redes'),
      h('p', { class: 'dica' }, 'Título, editoria (no selo), foto, link do QR code e nome do arquivo vêm da matéria e mudam enquanto você escreve. Quando a matéria estiver pronta, é só baixar. O que for ajustado aqui não vai para o arquivo da matéria.'),
      lugar);
  }
  function atualizarImagem() {
    var im = estado.imagem;
    if (!im) return;
    if (!im.g.raiz.isConnected || im.a !== estado.atual) { estado.imagem = null; return; }
    im.g.preencher(dadosDaImagem(im.a));
  }

  function formFicha(a) {
    var m = a.m;
    var iniciais = texto(m, 'iniciais', { maxlength: 3, placeholder: 'MH' });
    var uf = texto(m, 'uf', { maxlength: 2, placeholder: 'RS' });
    uf.addEventListener('input', function () { uf.value = uf.value.toUpperCase(); m.uf = uf.value; });
    var lista = h('datalist', { id: 'rotulos-dados' }, ROTULOS_DADOS.map(function (r) { return h('option', { value: r }); }));
    return h('div', { class: 'form' },
      lista,
      a.antigo ? h('p', { class: 'dica' }, 'Esta ficha está no formato antigo (.json). Ao salvar, ela é convertida para Markdown (.md).') : null,
      h('section', { class: 'secao' },
        h('h2', null, a.id ? 'Ficha' : 'Nova ficha'),
        h('div', { class: 'grade' },
          campo('Nome', texto(m, 'nome', { placeholder: 'Como a pessoa é conhecida' }), { dica: a.id ? 'Endereço: ficha.html?id=' + a.id : 'O endereço da ficha é criado a partir do nome.' }),
          campo('Iniciais', iniciais, { dica: 'No círculo, quando não há foto.' }),
          campo('Categoria', selecao(m, 'categoria', CATEGORIAS), { dica: 'Filtro da página Políticos.' }),
          campo('Cargo (curto)', texto(m, 'cargo_curto', { placeholder: 'Senador eleito' })),
          campo('Partido atual', texto(m, 'partido')),
          campo('Estado (UF)', uf),
          campo('Linha do cartão', texto(m, 'chamada', { placeholder: 'Eleito em 2026 · mandato 2027–2035' }), { largo: true }),
          campo('Subtítulo da ficha', texto(m, 'subtitulo', { placeholder: 'Senador eleito pelo Rio Grande do Sul · Novo' }), { largo: true }),
          campo('Data da última revisão', h('input', { type: 'date', value: String(m.atualizado || '').slice(0, 10), oninput: function (e) { m.atualizado = e.target.value; marcarSujo(); } })))),
      h('section', { class: 'secao' },
        h('h2', null, 'Foto'),
        campoFoto(m, 'foto', 'politicos', { quadrada: true, maxL: 600, maxA: 600, dica: 'Quadrada. Use só fotos que vocês podem publicar (ex.: oficiais da Câmara ou do Senado, com crédito nas fontes).' })),
      h('section', { class: 'secao' },
        h('h2', null, 'Selos'),
        h('p', { class: 'dica' }, 'Etiquetas curtas abaixo do subtítulo. Ex.: "Eleito em 2026", "Mandato 2027–2035".'),
        campoLinhas(m.selos, [
          { chave: 'texto', rotulo: 'Texto', largura: '1fr', exemplo: 'Eleito em 2026' },
          { chave: 'destaque', rotulo: 'Verde', largura: 'auto', tipo: 'marcar', rotuloMarcar: 'Destacar' }
        ], function () { return { texto: '', destaque: false }; })),
      h('section', { class: 'secao' },
        h('h2', null, 'Dados'),
        h('p', { class: 'dica' }, 'Caixa lateral da ficha. Use sempre os mesmos rótulos.'),
        campoLinhas(m.dados, [
          { chave: 'rotulo', rotulo: 'Rótulo', largura: 'minmax(140px, 220px)', lista: 'rotulos-dados' },
          { chave: 'valor', rotulo: 'Valor', largura: '1fr' }
        ], function () { return { rotulo: '', valor: '' }; }, [{
          rotulo: 'Completar rótulos padrão', acao: function (l) {
            ROTULOS_DADOS.forEach(function (r) { if (!l.some(function (d) { return d.rotulo === r; })) l.push({ rotulo: r, valor: '' }); });
          }
        }])),
      h('section', { class: 'secao' },
        h('h2', null, 'Eleições'),
        h('p', { class: 'dica' }, 'A tabela da ficha é ordenada pelo ano. Confira os votos no TSE (dadosabertos.tse.jus.br).'),
        campoLinhas(m.eleicoes, [
          { chave: 'ano', rotulo: 'Ano', largura: '80px', tipo: 'numero', exemplo: '2026' },
          { chave: 'cargo', rotulo: 'Cargo', largura: 'minmax(120px, 1.3fr)', exemplo: 'Deputado federal (RS)' },
          { chave: 'partido', rotulo: 'Partido', largura: 'minmax(70px, 0.6fr)' },
          { chave: 'votos', rotulo: 'Votos', largura: 'minmax(90px, 0.8fr)', exemplo: '349.855' },
          { chave: 'resultado', rotulo: 'Resultado', largura: 'minmax(120px, 1.3fr)', exemplo: 'Eleito · mais votado do RS' },
          { chave: 'destaque', rotulo: 'Verde', largura: 'auto', tipo: 'marcar', rotuloMarcar: 'Destacar' }
        ], function () { return { ano: '', cargo: '', partido: m.partido || '', votos: '', resultado: '', destaque: false }; }),
        campo('Nota abaixo da tabela', texto(m, 'nota_eleicoes'), { largo: true })),
      h('section', { class: 'secao' },
        h('h2', null, 'Texto da ficha'),
        h('p', { class: 'dica', html: 'Escrito em Markdown, com uma seção "## " para cada parte: <b>Resumo</b> (3 a 5 frases), <b>Trajetória</b> (itens "- **2018:** o que aconteceu", do mais antigo ao mais recente), a seção de atuação (título livre, ex.: "Atuação parlamentar"), <b>Posições declaradas</b>, <b>Controvérsias e processos</b> (comece com a data em negrito e registre a versão da pessoa) e <b>Fontes</b> (itens "- [Título — Veículo, data](https://...)"). Toda informação precisa estar numa fonte.' }),
        campoMarkdown(m, 'corpo', { rotulo: 'Texto da ficha', renderizar: previaFicha })));
  }

  // ---- Votação do e-Cidadania
  function linkConsulta(n) { return 'https://www12.senado.leg.br/ecidadania/visualizacaomateria?id=' + n; }

  function formVotacao(a) {
    var m = a.m;
    var entrada = h('input', { type: 'text', value: m.ecidadania_id ? linkConsulta(m.ecidadania_id) : '',
      placeholder: 'https://www12.senado.leg.br/ecidadania/visualizacaomateria?id=173618', 'aria-label': 'Link ou número da consulta' });
    var rotuloBotao = function () { return m.ecidadania_id ? 'Atualizar dados e votos' : 'Trazer do e-Cidadania'; };
    var botao = h('button', { type: 'button', class: 'botao principal' }, rotuloBotao());

    function trazer() {
      var v = entrada.value.trim();
      if (!v) { aviso('Cole o link da consulta ou o número dela.', true); entrada.focus(); return; }
      botao.disabled = true;
      botao.textContent = 'Buscando no e-Cidadania…';
      api('ecidadania?consulta=' + encodeURIComponent(v)).then(function (r) {
        var trocou = m.ecidadania_id && Number(m.ecidadania_id) !== r.ecidadania_id;
        if (trocou && !confirm('Esta votação é da consulta ' + m.ecidadania_id + '. Trocar pela consulta ' + r.ecidadania_id + ' (' + r.sigla + ')?')) return;
        var nova = !m.ecidadania_id || trocou;
        ['sigla', 'identificacao', 'autoria', 'ementa'].forEach(function (k) { if (nova || !String(m[k] || '').trim()) m[k] = r[k] || ''; });
        if (nova && (!String(m.titulo || '').trim() || m.titulo === m.sigla)) m.titulo = r.sigla || '';
        m.ecidadania_id = r.ecidadania_id;
        m.votos_sim = r.votos_sim;
        m.votos_nao = r.votos_nao;
        m.apurado_em = r.apurado_em;
        a.explicacao = r.explicacao || '';
        marcarSujo();
        desenharEditor();
        aviso(nova ? 'Consulta ' + r.sigla + ' trazida. Agora escreva o título, a recomendação e a descrição.'
          : 'Votos atualizados: ' + numeroBr(r.votos_sim) + ' sim, ' + numeroBr(r.votos_nao) + ' não. Salve para gravar.');
      }).catch(function (e) { aviso('Não deu para trazer a consulta: ' + e.message, true); })
        .then(function () { botao.disabled = false; botao.textContent = rotuloBotao(); });
    }
    botao.addEventListener('click', trazer);
    entrada.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); trazer(); } });

    var secaoConsulta = h('section', { class: 'secao' },
      h('h2', null, a.id ? 'Votação' : 'Nova votação'),
      h('div', { class: 'importar' }, entrada, botao),
      h('p', { class: 'dica' }, 'Cole o link da consulta pública (no e-Cidadania, abra a proposta e copie o endereço) ou só o número dela. ' +
        'O editor traz a sigla, a autoria, a ementa e o placar. O placar não se atualiza sozinho: clique em "Atualizar dados e votos" e salve.'));
    if (!m.ecidadania_id) return h('div', { class: 'form' }, secaoConsulta);

    var sim = Number(m.votos_sim) || 0, nao = Number(m.votos_nao) || 0, total = sim + nao;
    var pct = total ? Math.round(sim * 1000 / total) / 10 : 0;
    var pctTxt = function (x) { return ' (' + String(x).replace('.', ',') + '%)'; };
    secaoConsulta.appendChild(h('div', { class: 'consulta' },
      h('p', { class: 'consulta-id' }, [m.identificacao || m.sigla, m.autoria].filter(Boolean).join(' · ')),
      h('div', { class: 'placar', 'aria-label': 'Placar no e-Cidadania' },
        h('div', { class: 'placar-barra' }, h('span', { style: 'width:' + pct + '%' })),
        h('div', { class: 'placar-numeros' },
          h('span', null, h('b', null, 'Sim '), numeroBr(sim) + (total ? pctTxt(pct) : '')),
          h('span', null, h('b', null, 'Não '), numeroBr(nao) + (total ? pctTxt(Math.round((100 - pct) * 10) / 10) : '')))),
      h('small', { class: 'dica' }, m.apurado_em ? 'Votos apurados até ' + dataHoraCurta(m.apurado_em) + '. ' : '',
        h('a', { href: linkConsulta(m.ecidadania_id), target: '_blank', rel: 'noopener noreferrer' }, 'Abrir no e-Cidadania ↗'))));

    var referencia = a.explicacao
      ? h('div', { class: 'referencia' }, h('b', null, 'O que é, segundo o Senado'), h('p', null, a.explicacao),
          h('small', null, 'Só para consulta: este resumo não é gravado nem aparece no site.'))
      : null;

    var titulo = texto(m, 'titulo', { maxlength: 160, placeholder: 'Ex.: Reajuste da bolsa da residência médica' });
    var opcaoVoto = function (valor, rotulo) {
      return h('button', { type: 'button', class: 'voto voto-' + valor, 'aria-pressed': m.recomendacao === valor ? 'true' : 'false',
        onclick: function () { m.recomendacao = valor; marcarSujo(); desenharEditor(); } }, rotulo);
    };
    return h('div', { class: 'form' },
      secaoConsulta,
      h('section', { class: 'secao' },
        h('h2', null, 'Recomendação de voto'),
        h('div', { class: 'votos', role: 'group', 'aria-label': 'Recomendação de voto' }, opcaoVoto('sim', 'Vote SIM'), opcaoVoto('nao', 'Vote NÃO')),
        h('p', { class: 'dica' }, 'Aparece em destaque no cartão da votação, ao lado do botão para votar no e-Cidadania.')),
      h('section', { class: 'secao' },
        h('h2', null, 'Dados da proposta'),
        h('div', { class: 'grade' },
          campo('Título', titulo, { largo: true, extra: contador(titulo, 90), dica: 'O assunto em poucas palavras e em linguagem simples. Vem preenchido com a sigla: troque por um título que explique a proposta.' }),
          campo('Sigla', texto(m, 'sigla', { placeholder: 'PL 1809/2026' })),
          campo('Autoria', texto(m, 'autoria')),
          campo('Ordem no site', h('input', { type: 'date', value: String(m.data || '').slice(0, 10), oninput: function (e) { m.data = e.target.value; marcarSujo(); } }),
            { dica: 'As mais recentes aparecem primeiro.' }),
          campo('Ementa oficial', areaTexto(m, 'ementa', 3), { largo: true, dica: 'Texto do Senado. Aparece no site como "Ementa oficial".' })),
        h('p', { class: 'dica' }, a.id ? 'Endereço: ' + enderecoNoSite('votacoes', a.id) : 'O endereço é criado ao clicar em "Criar", a partir da sigla.')),
      h('section', { class: 'secao' },
        h('h2', null, 'Descrição'),
        h('p', { class: 'dica' }, 'Explique em linguagem simples o que a proposta muda, quem ganha e quem perde, e por que recomendamos esse voto. Parágrafos curtos, com links para as fontes.'),
        referencia,
        campoMarkdown(m, 'corpo', { rotulo: 'Descrição da votação' })));
  }

  // ---- Vídeo do YouTube (parte "Vídeos do YouTube" da página Streaming)
  // Número do vídeo num link do YouTube (youtube.com/watch?v=…, youtu.be/…, /shorts/…, /live/…, /embed/…)
  function idYoutube(url) {
    var m = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|live\/|embed\/|v\/))([A-Za-z0-9_-]{11})/i.exec(String(url || ''));
    return m ? m[1] : '';
  }

  function formVideo(a) {
    var m = a.m;
    var titulo = texto(m, 'titulo', { maxlength: 200, placeholder: 'Como aparece no YouTube' });
    var link = texto(m, 'link', { type: 'url', placeholder: 'https://www.youtube.com/watch?v=…' });
    var avisoLink = h('small');
    function conferirLink() {
      var v = String(m.link || '').trim();
      avisoLink.textContent = !v ? 'Cole o endereço do vídeo. Quem clicar no cartão vai direto para ele, numa aba nova.'
        : !/^https?:\/\//i.test(v) ? 'O link precisa começar com https://'
        : idYoutube(v) ? 'Link do YouTube reconhecido.' : 'Não parece um link de vídeo do YouTube, mas pode salvar assim mesmo.';
    }
    link.addEventListener('input', conferirLink);
    conferirLink();
    var fotoCaixa = h('div');
    function desenharFoto() {
      fotoCaixa.innerHTML = '';
      fotoCaixa.appendChild(campoFoto(m, 'capa', 'videos', { maxL: 1280, maxA: 1280,
        dica: 'Horizontal (16:9), como a miniatura do YouTube. Imagens grandes são reduzidas para 1280 px ao enviar.' }));
    }
    desenharFoto();
    var usarCapaYoutube = h('button', { type: 'button', class: 'botao-mini', onclick: function () {
      var id = idYoutube(m.link);
      if (!id) { aviso('Cole primeiro um link de vídeo do YouTube.', true); link.focus(); return; }
      m.capa = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
      marcarSujo();
      desenharFoto();
    } }, 'Usar a miniatura do YouTube');
    var fotoCanal = campoFoto(m, 'foto_criador', 'videos', { quadrada: true, maxL: 300, maxA: 300,
      dica: 'Quadrada; aparece num círculo ao lado do nome do criador. Opcional.' });
    return h('div', { class: 'form' },
      h('section', { class: 'secao' },
        h('h2', null, a.id ? 'Vídeo do YouTube' : 'Novo vídeo do YouTube'),
        h('div', { class: 'grade' },
          campo('Link do vídeo', link, { largo: true }),
          h('div', { class: 'campo largo' }, avisoLink),
          campo('Nome do vídeo', titulo, { largo: true, extra: contador(titulo, 100) }),
          campo('Nome do criador', texto(m, 'criador', { placeholder: 'Canal ou pessoa que fez o vídeo' })),
          campo('Ordem no site', h('input', { type: 'date', value: String(m.data || '').slice(0, 10), oninput: function (e) { m.data = e.target.value; marcarSujo(); } }),
            { dica: 'Os mais recentes aparecem primeiro.' })),
        h('p', { class: 'dica' }, 'Aparece em Streaming › Vídeos do YouTube (' + NOMES.videos.pagina + '#youtube).')),
      h('section', { class: 'secao' },
        h('h2', null, 'Capa'),
        fotoCaixa,
        h('div', { class: 'linhas-acoes' }, usarCapaYoutube),
        h('p', { class: 'dica' }, 'Envie uma imagem ou use a miniatura que o próprio YouTube mostra. Sem capa, o cartão aparece com fundo preto.')),
      h('section', { class: 'secao' },
        h('h2', null, 'Foto do canal'),
        fotoCanal,
        h('p', { class: 'dica' }, 'No YouTube, abra o canal, clique com o botão direito na foto dele, escolha "Salvar imagem como…" e envie aqui.')));
  }

  // ---- Vídeo curto (qualquer plataforma), Recursos › Repositório de Vídeos Curtos
  function formCurto(a) {
    var m = a.m;
    var titulo = texto(m, 'titulo', { maxlength: 200, placeholder: 'Do que trata o vídeo, em uma linha' });
    var link = texto(m, 'link', { type: 'url', placeholder: 'https://www.tiktok.com/@… · https://www.instagram.com/reel/… · https://youtube.com/shorts/…' });
    var plataforma = h('select', { onchange: function (e) {
      m.plataformaManual = !!e.target.value;
      m.plataforma = e.target.value || plataformaDoLink(m.link);
      if (!e.target.value) desenharPlataformas();
      marcarSujo();
    } });
    var avisoLink = h('small');
    function desenharPlataformas() {
      plataforma.innerHTML = '';
      plataforma.appendChild(h('option', { value: '' }, '(escolher pelo link)'));
      PLATAFORMAS.forEach(function (p) { plataforma.appendChild(h('option', { value: p, selected: p === m.plataforma ? 'selected' : null }, p)); });
    }
    function conferirLink() {
      var v = String(m.link || '').trim(), p = plataformaDoLink(v);
      if (p && !m.plataformaManual) { m.plataforma = p; desenharPlataformas(); }
      avisoLink.textContent = !v ? 'Cole o endereço do vídeo. No site, o botão "Assistir" abre o vídeo na plataforma, numa aba nova.'
        : !/^https?:\/\//i.test(v) ? 'O link precisa começar com https://'
        : p === 'Outra' ? 'Plataforma não reconhecida: escolha ao lado ou deixe "Outra".' : 'Link do ' + p + ' reconhecido.';
    }
    if (m.plataforma) m.plataformaManual = m.plataforma !== plataformaDoLink(m.link);
    desenharPlataformas();
    link.addEventListener('input', conferirLink);
    conferirLink();
    var fotoCaixa = h('div');
    function desenharFoto() {
      fotoCaixa.innerHTML = '';
      fotoCaixa.appendChild(campoFoto(m, 'capa', 'curtos', { maxL: 720, maxA: 1280,
        dica: 'Vertical (9:16), como os vídeos curtos. Imagens grandes são reduzidas ao enviar. Opcional.' }));
    }
    desenharFoto();
    var usarCapaYoutube = h('button', { type: 'button', class: 'botao-mini', onclick: function () {
      var id = idYoutube(m.link);
      if (!id) { aviso('Esse botão só funciona com links do YouTube.', true); link.focus(); return; }
      m.capa = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
      marcarSujo();
      desenharFoto();
    } }, 'Usar a miniatura do YouTube');
    return h('div', { class: 'form' },
      h('section', { class: 'secao' },
        h('h2', null, a.id ? 'Vídeo curto' : 'Novo vídeo curto'),
        h('div', { class: 'grade' },
          campo('Link do vídeo', link, { largo: true }),
          h('div', { class: 'campo largo' }, avisoLink),
          campo('Plataforma', plataforma),
          campo('Criador', texto(m, 'criador', { placeholder: 'Perfil ou pessoa que fez o vídeo' })),
          campo('Título', titulo, { largo: true, extra: contador(titulo, 100) }),
          campo('Descrição', areaTexto(m, 'corpo', 3), { largo: true, dica: 'Opcional. Uma ou duas frases sobre o vídeo; aparecem no cartão.' }),
          campo('Data', h('input', { type: 'date', value: String(m.data || '').slice(0, 10), oninput: function (e) { m.data = e.target.value; marcarSujo(); } }),
            { dica: 'Os mais recentes aparecem primeiro.' })),
        h('p', { class: 'dica' }, 'Aparece em Recursos › Repositório de Vídeos Curtos (' + NOMES.curtos.pagina + ').')),
      h('section', { class: 'secao' },
        h('h2', null, 'Tags'),
        campoTags(m),
        h('p', { class: 'dica' }, 'De 1 a 8, em minúsculas, como nas matérias. Reaproveite as sugeridas. Para uma subtag, use a barra: violência/contra indígenas. Tags com borda tracejada são novas.')),
      h('section', { class: 'secao' },
        h('h2', null, 'Capa'),
        fotoCaixa,
        h('div', { class: 'linhas-acoes' }, usarCapaYoutube),
        h('p', { class: 'dica' }, 'Sem capa, o cartão mostra o nome da plataforma. TikTok, Instagram e outras não deixam usar a miniatura delas direto; tire um print e envie aqui, se quiser.')));
  }

  // ---- Publicação (livro ou revista), página Publicações
  function formPublicacao(a) {
    var m = a.m, livro = m.tipo !== 'revista';
    var trocarTipoPub = function (t) {
      if (t === m.tipo) return;
      m.tipo = t;
      if (t === 'revista' && !m.data) m.data = hoje().slice(0, 7);
      marcarSujo();
      desenharEditor();
    };
    var botaoTipo = function (t, rotulo) {
      return h('button', { type: 'button', 'aria-pressed': m.tipo === t ? 'true' : 'false', onclick: function () { trocarTipoPub(t); } }, rotulo);
    };
    var titulo = texto(m, 'titulo', { maxlength: 200, placeholder: livro ? 'Título do livro' : 'Nome da revista' });
    var assuntos = h('input', { type: 'text', value: (m.assuntos || []).join(', '), placeholder: 'marxismo, história do Brasil',
      oninput: function (e) { m.assuntos = e.target.value.split(',').map(function (s) { return s.trim(); }).filter(Boolean); marcarSujo(); } });
    var link = texto(m, 'link', { type: 'url', placeholder: 'https://… (PDF, página de leitura ou loja)' });
    var campos = livro
      ? [campo('Autoria', texto(m, 'autoria', { placeholder: 'Quem escreveu ou organizou' })),
         campo('Editora', texto(m, 'editora')),
         campo('Ano', texto(m, 'ano', { maxlength: 4, placeholder: '2026', inputmode: 'numeric' }), { dica: 'Os mais recentes aparecem primeiro.' })]
      : [campo('Edição', texto(m, 'edicao', { placeholder: 'Nº 3' })),
         campo('Mês da edição', h('input', { type: 'month', value: String(m.data || '').slice(0, 7),
           oninput: function (e) { m.data = e.target.value; marcarSujo(); } }), { dica: 'As edições mais recentes aparecem primeiro.' })];
    return h('div', { class: 'form' },
      h('section', { class: 'secao' },
        h('h2', null, a.id ? 'Publicação' : 'Nova publicação'),
        h('div', { class: 'modos', role: 'group', 'aria-label': 'Tipo de publicação', style: 'align-self: flex-start;' },
          botaoTipo('livro', 'Livro'), botaoTipo('revista', 'Revista')),
        h('div', { class: 'grade' },
          campo(livro ? 'Título' : 'Nome da revista', titulo, { largo: true, extra: contador(titulo, 120) }),
          campos,
          campo('Assuntos', assuntos, { largo: true, dica: 'Separados por vírgula. Ajudam a busca da página; não aparecem no cartão.' })),
        h('p', { class: 'dica' }, 'Aparece em Publicações › ' + (livro ? 'Livros' : 'Revistas') + ' (' + NOMES.publicacoes.pagina + (livro ? '#livros' : '#revistas') + ').')),
      h('section', { class: 'secao' },
        h('h2', null, 'Capa'),
        campoFoto(m, 'capa', 'publicacoes', { maxL: 1000, maxA: 1500,
          dica: livro ? 'Vertical (proporção de livro, 2:3). Sem capa, o site desenha uma com o título.' : 'Vertical (3:4). Sem capa, o site desenha uma com a edição e o nome.' })),
      h('section', { class: 'secao' },
        h('h2', null, 'Onde ler'),
        h('div', { class: 'grade' },
          campo('Link', link, { largo: true, dica: 'Endereço do PDF, da página de leitura ou da loja. Em branco, o cartão fica sem botão.' }),
          campo('Texto do botão', texto(m, 'rotulo_link', { placeholder: livro ? 'Ler o livro' : 'Ler a edição' }),
            { dica: 'Ex.: "Baixar PDF", "Comprar". Em branco, usa o texto padrão.' }))),
      h('section', { class: 'secao' },
        h('h2', null, 'Descrição'),
        h('p', { class: 'dica' }, 'Duas ou três frases sobre a publicação. Aparece no cartão, abaixo do título.'),
        campoMarkdown(m, 'corpo', { rotulo: 'Descrição' })));
  }

  // ---- Dossiê (página dossie.html?id=… e PDF em arquivos/dossies/<id>.pdf)
  var MODELO_DOSSIE = 'Apresentação do dossiê: a pergunta que ele responde e o material que reúne. Aparece antes do primeiro capítulo.\n\n' +
    '## Primeiro capítulo\n\nTexto do capítulo. Use "### " para as subdivisões dentro dele.\n\n' +
    '## Segundo capítulo\n\nTexto do capítulo.\n\n' +
    '## Fontes\n\n- [Título do documento — Veículo, data](https://exemplo.com)\n';

  function previaDossie(md) {
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var d = TCMarkdown.capitulosDossie(md), partes = [];
    if (d.capitulos.length) {
      partes.push('<div class="sumario"><b>Sumário · ' + d.capitulos.length + (d.capitulos.length === 1 ? ' capítulo' : ' capítulos') + '</b><ol>' +
        d.capitulos.map(function (c) { return '<li>' + esc(c.titulo) + '</li>'; }).join('') + '</ol></div>');
    } else {
      partes.push('<p class="alerta">Ainda não há capítulos. Cada linha que começa com "## " abre um capítulo (botão T2).</p>');
    }
    if (d.apresentacao) partes.push(TCMarkdown.html(d.apresentacao, '../'));
    d.capitulos.forEach(function (c) {
      partes.push('<h2><span class="cap-n">Capítulo ' + c.n + '</span> ' + esc(c.titulo) + '</h2>' + TCMarkdown.html(c.corpo, '../'));
    });
    return partes.join('\n');
  }

  // Salva (se preciso) e pede ao servidor o PDF; abre o PDF numa aba nova
  function gerarPdf() {
    var a = estado.atual;
    if (!a || (a.tipo !== 'dossies' && a.tipo !== 'metadossies')) return;
    var botao = document.querySelector('[data-acao="pdf"]');
    var janela = window.open('', '_blank');   // aberta já, para o navegador não bloquear
    if (janela) janela.document.write('<p style="font:16px sans-serif;padding:24px">Gerando o PDF…</p>');
    var antes = estado.sujo || !a.id ? salvar() : Promise.resolve(true);
    antes.then(function (ok) {
      if (!ok) { if (janela) janela.close(); return; }
      if (botao) { botao.disabled = true; botao.textContent = 'Gerando PDF…'; }
      aviso('Gerando o PDF… pode levar alguns segundos.');
      return api('pdf', { corpo: { tipo: a.tipo, id: a.id } }).then(function (r) {
        a.pdf = 'PDF em dia';
        var url = '../' + r.caminho + '?v=' + Date.now();
        if (janela) janela.location.href = url; else window.open(url, '_blank');
        aviso('PDF gerado (' + Math.max(1, Math.round(r.tamanho / 1024)) + ' KB): ' + r.caminho);
        carregarLista();
        if (estado.atual === a && a.modo === 'form') desenharEditor();
      });
    }).catch(function (e) { if (janela) janela.close(); aviso('Não gerou o PDF: ' + e.message, true); })
      .then(function () { var b = document.querySelector('[data-acao="pdf"]'); if (b) { b.disabled = false; b.textContent = 'Gerar PDF'; } });
  }

  function formDossie(a) {
    var m = a.m;
    var titulo = texto(m, 'titulo', { maxlength: 200, placeholder: 'O tema do dossiê, em poucas palavras' });
    var pdfUrl = a.id ? '../arquivos/dossies/' + a.id + '.pdf' : '';
    var situacaoPdf = !a.id ? 'O PDF pode ser gerado depois de criar o dossiê.'
      : a.pdf === 'PDF em dia' ? 'O PDF está em dia com o texto salvo. A página do dossiê mostra o botão "Baixar PDF" com este arquivo.'
      : a.pdf ? 'O texto mudou depois do último PDF. Gere de novo para o arquivo acompanhar o texto (enquanto isso, a página oferece imprimir em PDF pelo navegador).'
      : 'Ainda não há PDF. Sem ele, a página do dossiê oferece imprimir em PDF pelo navegador.';
    return h('div', { class: 'form' },
      h('section', { class: 'secao' },
        h('h2', null, a.id ? 'Dossiê' : 'Novo dossiê'),
        h('div', { class: 'grade' },
          campo('Título', titulo, { largo: true, extra: contador(titulo, 120) }),
          campo('Subtítulo', areaTexto(m, 'linha', 2), { largo: true, dica: 'Uma ou duas frases: a pergunta que o dossiê responde e o que ele reúne. Aparece na lista de dossiês, na página e na capa do PDF.' }),
          campo('Data de publicação', h('input', { type: 'date', value: String(m.data || '').slice(0, 10), oninput: function (e) { m.data = e.target.value; marcarSujo(); } })),
          campo('Autoria', texto(m, 'autor')),
          h('div', { class: 'campo' }, h('span', null, 'Página Dossiês'), marcar(m, 'destaque', 'Dossiê em destaque'), h('small', null, 'Se vários estiverem marcados, vale o mais recente.'))),
        h('p', { class: 'dica' }, a.id ? 'Endereço: ' + enderecoNoSite('dossies', a.id) + ' (não muda, mesmo que o título seja corrigido)' : 'O endereço do dossiê é criado ao clicar em "Criar", a partir do título.')),
      h('section', { class: 'secao' },
        h('h2', null, 'Tags'),
        campoTags(m),
        h('p', { class: 'dica' }, 'As mesmas tags das matérias. Para uma subtag, use a barra: violência/contra indígenas.')),
      h('section', { class: 'secao' },
        h('h2', null, 'Capa'),
        campoFoto(m, 'capa', 'dossies', { maxL: 1800, maxA: 1800, dica: 'Horizontal. Aparece no topo da página e na capa do PDF. Fotos grandes são reduzidas para 1800 px ao enviar.' }),
        h('div', { class: 'grade' },
          campo('Legenda', texto(m, 'legenda', { placeholder: 'O que aparece na foto' })),
          campo('Crédito', texto(m, 'credito', { placeholder: 'Nome / Tempo Continuum' })))),
      h('section', { class: 'secao' },
        h('h2', null, 'Texto e capítulos'),
        h('p', { class: 'dica', html: 'Escrito em Markdown. O texto antes do primeiro capítulo é a <b>apresentação</b>. Cada linha <b>"## Título"</b> (botão T2) abre um <b>capítulo</b>: ele entra no sumário e, no PDF, começa numa página nova. Use T3 para subdivisões dentro do capítulo. Termine com um capítulo "Fontes".' }),
        campoMarkdown(m, 'corpo', { rotulo: 'Texto do dossiê', renderizar: previaDossie })),
      h('section', { class: 'secao' },
        h('h2', null, 'PDF'),
        h('p', { class: 'dica' }, situacaoPdf),
        h('div', { class: 'linhas-acoes' },
          h('button', { type: 'button', class: 'botao', onclick: gerarPdf }, a.pdf ? 'Gerar o PDF de novo' : 'Gerar PDF'),
          a.pdf ? h('a', { class: 'botao', href: pdfUrl, target: '_blank', rel: 'noopener' }, 'Abrir o PDF') : null,
          a.id ? h('a', { class: 'botao', href: '../dossie.html?id=' + a.id + '&pdf=previa', target: '_blank', rel: 'noopener' }, 'Ver como fica impresso') : null),
        h('p', { class: 'dica' }, 'O PDF é feito com o Edge (ou o Chrome) deste computador, sem abrir janela, e fica em arquivos/dossies/. Ele tem capa, sumário e cada capítulo começando numa página nova.')));
  }

  // ---- Meta-dossiê: junta dossiês que já existem, na ordem escolhida (dossie.html?meta=<id>)
  function formMetaDossie(a) {
    var m = a.m;
    var titulo = texto(m, 'titulo', { maxlength: 200, placeholder: 'O tema que reúne os dossiês' });
    var pdfUrl = a.id ? '../arquivos/metadossies/' + a.id + '.pdf' : '';
    var situacaoPdf = !a.id ? 'O PDF pode ser gerado depois de criar o meta-dossiê.'
      : a.pdf === 'PDF em dia' ? 'O PDF está em dia com o que foi salvo. Se você mudar um dos dossiês reunidos, gere de novo.'
      : a.pdf ? 'O meta-dossiê mudou depois do último PDF. Gere de novo para o arquivo acompanhar o texto.'
      : 'Ainda não há PDF. Sem ele, a página oferece imprimir em PDF pelo navegador.';
    // Dossiês reunidos: lista ordenada, com os dossiês que existem para escolher
    var caixa = h('div', { class: 'linhas' });
    var disponiveis = [];
    var tituloDe = function (id) { var d = disponiveis.filter(function (x) { return x.id === id; })[0]; return d ? d.titulo : id + ' (não encontrado)'; };
    var escolha = h('select', { 'aria-label': 'Dossiê para acrescentar' });
    function desenharLista() {
      caixa.innerHTML = '';
      if (!m.dossies.length) caixa.appendChild(h('p', { class: 'dica' }, 'Nenhum dossiê ainda. Escolha abaixo e clique em "Acrescentar". A ordem da lista é a ordem das partes.'));
      m.dossies.forEach(function (id, i) {
        var mover = function (d) { return function () { var j = i + d; if (j < 0 || j >= m.dossies.length) return; m.dossies.splice(j, 0, m.dossies.splice(i, 1)[0]); marcarSujo(); desenharLista(); }; };
        caixa.appendChild(h('div', { class: 'linha', style: 'grid-template-columns: 2.4em 1fr 34px 34px 34px' },
          h('span', null, 'Parte ' + (i + 1)), h('span', null, tituloDe(id)),
          h('button', { type: 'button', class: 'botao-mini', title: 'Subir', 'aria-label': 'Subir', disabled: i === 0 ? true : null, onclick: mover(-1) }, '↑'),
          h('button', { type: 'button', class: 'botao-mini', title: 'Descer', 'aria-label': 'Descer', disabled: i === m.dossies.length - 1 ? true : null, onclick: mover(1) }, '↓'),
          h('button', { type: 'button', class: 'botao-mini', title: 'Tirar da lista', 'aria-label': 'Tirar da lista', onclick: function () { m.dossies.splice(i, 1); marcarSujo(); desenharLista(); } }, '×')));
      });
      escolha.innerHTML = '';
      var livres = disponiveis.filter(function (d) { return m.dossies.indexOf(d.id) < 0; });
      escolha.appendChild(h('option', { value: '' }, livres.length ? 'Escolha um dossiê…' : (disponiveis.length ? 'Todos os dossiês já estão na lista' : 'Carregando os dossiês…')));
      livres.forEach(function (d) { escolha.appendChild(h('option', { value: d.id }, d.titulo + ' · ' + d.editoria)); });
    }
    api('itens?tipo=dossies').then(function (r) { disponiveis = r.itens || []; desenharLista(); }).catch(function (e) { aviso(e.message, true); });
    desenharLista();
    var acrescentar = h('button', { type: 'button', class: 'botao-mini', onclick: function () {
      if (!escolha.value) { aviso('Escolha um dossiê na lista.', true); return; }
      m.dossies.push(escolha.value); marcarSujo(); desenharLista();
    } }, '+ Acrescentar');
    return h('div', { class: 'form' },
      h('section', { class: 'secao' },
        h('h2', null, a.id ? 'Meta-dossiê' : 'Novo meta-dossiê'),
        h('div', { class: 'grade' },
          campo('Título', titulo, { largo: true, extra: contador(titulo, 120) }),
          campo('Subtítulo', areaTexto(m, 'linha', 2), { largo: true, dica: 'Uma ou duas frases sobre o que os dossiês reunidos mostram juntos. Aparece na página, na lista e na capa do PDF.' }),
          campo('Data de publicação', h('input', { type: 'date', value: String(m.data || '').slice(0, 10), oninput: function (e) { m.data = e.target.value; marcarSujo(); } })),
          campo('Autoria', texto(m, 'autor')),
          h('div', { class: 'campo' }, h('span', null, 'Página Dossiês'), marcar(m, 'destaque', 'Meta-dossiê em destaque'))),
        h('p', { class: 'dica' }, a.id ? 'Endereço: ' + enderecoNoSite('metadossies', a.id) : 'O endereço é criado ao clicar em "Criar", a partir do título.')),
      h('section', { class: 'secao' },
        h('h2', null, 'Dossiês reunidos'),
        caixa,
        h('div', { class: 'linhas-acoes' }, escolha, acrescentar),
        h('p', { class: 'dica' }, 'Cada dossiê vira uma parte, com o título, o subtítulo, a apresentação e os capítulos dele. Os capítulos seguem numerados do primeiro ao último. O texto continua sendo editado em cada dossiê: o meta-dossiê sempre mostra a versão salva de cada um.')),
      h('section', { class: 'secao' },
        h('h2', null, 'Tags'),
        campoTags(m)),
      h('section', { class: 'secao' },
        h('h2', null, 'Capa'),
        campoFoto(m, 'capa', 'dossies', { maxL: 1800, maxA: 1800, dica: 'Horizontal. Aparece na página, na lista e na capa do PDF.' }),
        h('div', { class: 'grade' },
          campo('Legenda', texto(m, 'legenda', { placeholder: 'O que aparece na foto' })),
          campo('Crédito', texto(m, 'credito', { placeholder: 'Nome / Tempo Continuum' })))),
      h('section', { class: 'secao' },
        h('h2', null, 'Apresentação'),
        h('p', { class: 'dica' }, 'Opcional. Texto em Markdown que abre o meta-dossiê, antes da primeira parte: por que estes dossiês foram reunidos e em que ordem ler.'),
        campoMarkdown(m, 'corpo', { rotulo: 'Apresentação do meta-dossiê' })),
      h('section', { class: 'secao' },
        h('h2', null, 'PDF'),
        h('p', { class: 'dica' }, situacaoPdf),
        h('div', { class: 'linhas-acoes' },
          h('button', { type: 'button', class: 'botao', onclick: gerarPdf }, a.pdf ? 'Gerar o PDF de novo' : 'Gerar PDF'),
          a.pdf ? h('a', { class: 'botao', href: pdfUrl, target: '_blank', rel: 'noopener' }, 'Abrir o PDF') : null,
          a.id ? h('a', { class: 'botao', href: '../dossie.html?meta=' + a.id + '&pdf=previa', target: '_blank', rel: 'noopener' }, 'Ver como fica impresso') : null),
        h('p', { class: 'dica' }, 'O PDF fica em arquivos/metadossies/ e aparece em Publicações › Dossiês impressos. Ele tem capa, sumário com as partes, uma página de abertura para cada dossiê e cada capítulo numa página nova.')));
  }

  // ---- Caso acompanhado (página caso.html?id=<id>; lista em Wiki › Casos acompanhados)
  function formCaso(a) {
    var m = a.m;
    var titulo = texto(m, 'titulo', { maxlength: 200, placeholder: 'O caso, em uma linha' });
    var atualizado = h('input', { type: 'date', value: String(m.atualizado || '').slice(0, 10), oninput: function (e) { m.atualizado = e.target.value; marcarSujo(); } });
    var envolvidos = h('textarea', { rows: 4, value: (m.envolvidos || []).join('\n'), placeholder: 'Um por linha: pessoas, empresas, órgãos',
      oninput: function (e) { m.envolvidos = e.target.value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean); marcarSujo(); } });
    return h('div', { class: 'form' },
      h('section', { class: 'secao' },
        h('h2', null, a.id ? 'Caso' : 'Novo caso'),
        h('div', { class: 'grade' },
          campo('Título', titulo, { largo: true, extra: contador(titulo, 120) }),
          campo('Situação', selecao(m, 'status', TCMarkdown.STATUS_CASO)),
          campo('Aberto em', h('input', { type: 'date', value: String(m.aberto || '').slice(0, 10), oninput: function (e) { m.aberto = e.target.value; marcarSujo(); } }),
            { dica: 'Quando o caso começou (a denúncia, a investigação, o processo).' }),
          h('div', { class: 'campo' }, h('span', null, 'Última atualização'), atualizado,
            h('div', { class: 'linhas-acoes' }, h('button', { type: 'button', class: 'botao-mini', onclick: function () { m.atualizado = hoje(); atualizado.value = m.atualizado; marcarSujo(); } }, 'Hoje')),
            h('small', null, 'Os casos atualizados mais recentemente aparecem primeiro.')),
          campo('Última etapa', texto(m, 'etapa', { placeholder: 'Ex.: Denúncia aceita pela Justiça Federal' }), { largo: true }),
          campo('Resumo', areaTexto(m, 'corpo', 5), { largo: true, dica: 'O que aconteceu e o que está em jogo, em poucas frases. Só fatos verificáveis, com os documentos abaixo.' }),
          campo('Envolvidos', envolvidos, { largo: true })),
        h('p', { class: 'dica' }, a.id ? 'Endereço: ' + enderecoNoSite('casos', a.id) : 'Cada caso tem a sua página (caso.html?id=…) e entra na lista de Wiki › Casos acompanhados.')),
      h('section', { class: 'secao' },
        h('h2', null, 'Documentos'),
        campoLinhas(m.documentos, [
          { rotulo: 'Documento', chave: 'titulo', largura: '1fr', exemplo: 'Denúncia do MPF, 10/01/2026' },
          { rotulo: 'Link', chave: 'link', largura: '1.3fr', exemplo: 'https://…' }
        ], function () { return { titulo: '', link: '' }; }),
        h('p', { class: 'dica' }, 'Processos, decisões, denúncias, reportagens. Cada documento vira um link no caso; a contagem de documentos é feita sozinha.')),
      h('section', { class: 'secao' },
        h('h2', null, 'Tags'),
        campoTags(m),
        h('p', { class: 'dica' }, 'Usadas no filtro de casos da Wiki. Para ligar o caso a um dossiê, use o título do dossiê como tag (ex.: ICE: A nova Gestapo). Para uma subtag, use a barra: violência/contra indígenas.')));
  }

  // =========================================================================
  // Ligações entre matérias, dossiês, meta-dossiês e casos (regras em js/ligacoes.js)
  // =========================================================================
  // Os índices publicados (dados/*.json) dizem o que está salvo; o item aberto entra com o que está na tela
  function carregarIndices() {
    TCLigacoes.carregarIndices('../', function (indices) { estado.indices = indices; if (estado.redesenharLigacoes) estado.redesenharLigacoes(); });
  }
  // Abre outro item no editor (trocando de coleção, se preciso)
  function abrirOutro(tipo, id) {
    if (!podeSair()) return;
    marcarSujo(false);
    estado.atual = null;
    if (tipo !== estado.tipo) { estado.tipo = tipo; estado.itens = []; estado.carregado = false; desenharColecoes(); carregarTags(); }
    carregarLista().then(function () { abrir(tipo, id); });
  }
  // Muda e salva na hora outro item (ex.: tirar a tag dele, ou pôr um dossiê na lista de um meta-dossiê)
  function editarOutro(tipo, id, mudar) {
    return api('item?tipo=' + tipo + '&id=' + encodeURIComponent(id)).then(function (r) {
      var m = modeloDeArquivo(tipo, r);
      mudar(m);
      return api('salvar', { corpo: { tipo: tipo, id: id, texto: escreverArquivo({ tipo: tipo, m: m }) } });
    }).then(function () { carregarIndices(); carregarContagens(); });
  }
  var NOME_TIPO = { noticias: 'Matéria', dossies: 'Dossiê', metadossies: 'Meta-dossiê', casos: 'Caso' };
  // Hierarquia: matéria < caso < dossiê < meta-dossiê. Caixa só para o maior; o menor vira fonte do maior
  var ONDE_APARECE = { caixa: ' · aparece em caixa nesta página', fonte: ' · aparece nas fontes desta página',
    relacionado: ' · aparece em relacionados', '': ' · é parte deste meta-dossiê' };
  function secaoLigacoes(a) {
    var m = a.m, caixa = h('div', { class: 'ligacoes' });
    var tipoSel = h('select', { 'aria-label': 'Tipo do item a ligar' }), itemSel = h('select', { 'aria-label': 'Item a ligar' });
    var tirarTag = function (titulo) {
      var k = TCLigacoes.chave(titulo);
      m.tags = (m.tags || []).filter(function (t) { return !String(t).split('/').some(function (p) { return TCLigacoes.chave(p) === k; }); });
    };
    function atual() { return { tipo: a.tipo, id: a.id, titulo: m.titulo, tags: m.tags, dossies: m.dossies }; }
    function opcoesItens() {
      var idx = estado.indices || {}, tipo = tipoSel.value, ligados = {};
      TCLigacoes.calcular(atual(), idx).forEach(function (l) { ligados[l.tipo + '/' + l.id] = true; });
      var livres = (idx[tipo] || []).filter(function (x) { return x && x.id && x.titulo && !(tipo === a.tipo && x.id === a.id) && !ligados[tipo + '/' + x.id]; })
        .sort(function (x, y) { return String(x.titulo).localeCompare(String(y.titulo), 'pt'); });
      itemSel.innerHTML = '';
      itemSel.appendChild(h('option', { value: '' }, livres.length ? 'Escolha…' : 'Nada para ligar aqui'));
      livres.forEach(function (x) { itemSel.appendChild(h('option', { value: x.id }, x.titulo)); });
    }
    function desenhar() {
      caixa.innerHTML = '';
      if (!estado.indices) { caixa.appendChild(h('p', { class: 'dica' }, 'Carregando as ligações…')); return; }
      var lista = TCLigacoes.calcular(atual(), estado.indices);
      if (!lista.length) caixa.appendChild(h('p', { class: 'dica' }, 'Nenhuma ligação ainda.'));
      lista.forEach(function (l) {
        var onde = l.como === 'tag' ? 'pela tag deste item'
          : l.como === 'lista' ? 'pela lista de dossiês do meta-dossiê'
          : 'pela tag d' + l.artigo + ' ' + l.nome;
        var desligar = null;
        if (l.como === 'tag') {
          desligar = function () { tirarTag(l.titulo); marcarSujo(); if (estado.redesenharTags) estado.redesenharTags(); desenhar(); aviso('Ligação desfeita. Salve para valer no site.'); };
        } else if (l.como === 'outro') {
          desligar = function () {
            if (!confirm('Desfazer a ligação? Isso tira a tag "' + m.titulo + '" d' + l.artigo + ' ' + l.nome + ' "' + l.titulo + '" e salva ' + l.artigo + ' ' + l.nome + ' agora.')) return;
            editarOutro(l.tipo, l.id, function (o) { o.tags = (o.tags || []).filter(function (t) { return !String(t).split('/').some(function (p) { return TCLigacoes.chave(p) === TCLigacoes.chave(m.titulo); }); }); })
              .then(function () { aviso('Ligação desfeita.'); }, function (e) { aviso('Não desfez: ' + e.message, true); });
          };
        } else if (a.tipo === 'dossies') {
          desligar = function () {
            if (!confirm('Tirar este dossiê do meta-dossiê "' + l.titulo + '"? O meta-dossiê é salvo agora.')) return;
            // Tira também a tag com o título do meta-dossiê, se este dossiê tiver (senão a ligação continuaria pela tag)
            var tinhaTag = (m.tags || []).length;
            tirarTag(l.titulo);
            if ((m.tags || []).length !== tinhaTag) { marcarSujo(); if (estado.redesenharTags) estado.redesenharTags(); }
            editarOutro('metadossies', l.id, function (o) { o.dossies = (o.dossies || []).filter(function (x) { return x !== a.id; }); })
              .then(function () { aviso('Dossiê tirado do meta-dossiê.' + ((m.tags || []).length !== tinhaTag ? ' Salve este dossiê para tirar também a tag.' : '')); }, function (e) { aviso('Não tirou: ' + e.message, true); });
          };
        }
        caixa.appendChild(h('div', { class: 'ligacao' },
          h('span', { class: 'ligacao-tipo' }, NOME_TIPO[l.tipo]),
          h('span', { class: 'ligacao-titulo' }, l.titulo, h('small', null, 'Ligado ' + onde + ONDE_APARECE[TCLigacoes.lugar(a.tipo, l)])),
          h('div', { class: 'linhas-acoes' },
            h('button', { type: 'button', class: 'botao-mini', onclick: function () { abrirOutro(l.tipo, l.id); } }, 'Abrir'),
            desligar ? h('button', { type: 'button', class: 'botao-mini', onclick: desligar }, 'Desligar')
              : h('small', { class: 'ligacao-nota' }, 'Para desfazer, tire o dossiê em "Dossiês reunidos".'))));
      });
      opcoesItens();
    }
    TCLigacoes.ORDEM.forEach(function (t) { tipoSel.appendChild(h('option', { value: t }, NOME_TIPO[t])); });
    tipoSel.addEventListener('change', opcoesItens);
    var ligar = h('button', { type: 'button', class: 'botao-mini', onclick: function () {
      var idx = estado.indices || {}, x = (idx[tipoSel.value] || []).filter(function (i) { return i.id === itemSel.value; })[0];
      if (!x) { aviso('Escolha o item a ligar.', true); return; }
      if (a.tipo === 'metadossies' && tipoSel.value === 'dossies') {
        // No meta-dossiê, um dossiê ligado entra na lista de dossiês reunidos
        if ((m.dossies || []).indexOf(x.id) < 0) m.dossies.push(x.id);
        marcarSujo(); desenharEditor(); aviso('Dossiê acrescentado em "Dossiês reunidos". Salve para valer no site.');
        return;
      }
      if (a.tipo === 'dossies' && tipoSel.value === 'metadossies') {
        // Do dossiê, a ligação com um meta-dossiê põe o dossiê na lista do meta-dossiê
        if (!a.id) { aviso('Crie o dossiê antes de pô-lo num meta-dossiê.', true); return; }
        editarOutro('metadossies', x.id, function (o) { if ((o.dossies || []).indexOf(a.id) < 0) o.dossies.push(a.id); })
          .then(function () { aviso('Dossiê incluído no meta-dossiê "' + x.titulo + '".'); }, function (e) { aviso('Não incluiu: ' + e.message, true); });
        return;
      }
      if (!(m.tags || []).some(function (t) { return TCLigacoes.chave(t) === TCLigacoes.chave(x.titulo); })) m.tags.push(x.titulo);
      marcarSujo();
      if (estado.redesenharTags) estado.redesenharTags();
      desenhar();
      aviso('Ligado. Salve para valer no site.');
    } }, '+ Ligar');
    estado.redesenharLigacoes = desenhar;
    desenhar();
    return h('section', { class: 'secao' },
      h('h2', null, 'Ligações'),
      h('p', { class: 'dica' }, 'Matérias, dossiês, meta-dossiês e casos ligados a este item. Cada página do site mostra os itens ligados a ela, nos dois sentidos. A ligação é uma tag com o título do outro item; ligar daqui acrescenta essa tag (aparece também em Tags). Se o título de um item mudar, as tags que apontam para ele precisam ser refeitas.'),
      caixa,
      h('div', { class: 'linhas-acoes ligar' }, tipoSel, itemSel, ligar));
  }

  // =========================================================================
  // Início
  // =========================================================================
  var hash = location.hash.replace(/^#/, '').split('/');
  if (COLECAO[hash[0]]) estado.tipo = hash[0];
  desenharColecoes();
  desenharLista();
  if (hash[0] === 'planos') hash[0] = 'mapas';   // endereço antigo
  if (hash[0] === 'gerador' || hash[0] === 'mapas') abrirFerramenta(hash[0], hash[1]);
  carregarContagens();
  carregarIndices();
  Promise.all([carregarLista(), carregarTags()]).then(function () {
    if (hash[1]) abrir(estado.tipo, hash[1]);
  });

  // Editor online: quem está logado, botão Sair e o painel "Publicar" (pendências com revisão).
  // No computador local, /api/eu não existe e nada disto aparece.
  function apiOnline(url, corpo) {
    var op = { headers: { 'X-TC-Editor': '1' }, cache: 'no-store' };
    if (corpo !== undefined) { op.method = 'POST'; op.headers['Content-Type'] = 'application/json'; op.body = JSON.stringify(corpo); }
    return fetch('/api/' + url, op).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.status === 401 && j.entrar) { location.href = 'entrar.html'; return new Promise(function () {}); }
        if (!r.ok) throw new Error(j.erro || ('erro ' + r.status));
        return j;
      });
    });
  }

  function linkDoItem(caminho) {
    var m = /^site\/conteudo\/([a-z]+)\/([a-z0-9-]+)\.md$/.exec(caminho);
    if (!m) return null;
    var pagina = { noticias: 'materia.html?id=', politicos: 'ficha.html?id=', dossies: 'dossie.html?id=',
                   metadossies: 'dossie.html?meta=', casos: 'caso.html?id=' }[m[1]];
    return pagina ? '../' + pagina + m[2] : null;
  }

  function painelPublicar(revisor) {
    var dlg = document.getElementById('publicar-dlg');
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.id = 'publicar-dlg';
      dlg.className = 'galeria';
      document.body.appendChild(dlg);
    }
    dlg.innerHTML = '<p>Carregando…</p>';
    if (!dlg.open) dlg.showModal();
    apiOnline('pendentes').then(function (j) {
      dlg.innerHTML = '';
      var topo = document.createElement('header');
      var titulo = document.createElement('strong');
      titulo.textContent = j.pendentes.length ? 'Esperando revisão (' + j.pendentes.length + ')' : 'Nada esperando revisão';
      var fechar = document.createElement('button');
      fechar.className = 'botao-texto'; fechar.type = 'button'; fechar.textContent = 'Fechar';
      fechar.onclick = function () { dlg.close(); };
      topo.appendChild(titulo); topo.appendChild(fechar); dlg.appendChild(topo);
      var dica = document.createElement('p');
      dica.className = 'dica';
      dica.textContent = j.revisor
        ? 'Abra cada item para conferir. "Descartar" volta o arquivo para o que está no ar. "Publicar tudo" manda as mudanças para o site.'
        : 'Suas mudanças estão salvas aqui. Um revisor confere e publica.';
      dlg.appendChild(dica);
      var lista = document.createElement('ul');
      j.pendentes.forEach(function (p) {
        var li = document.createElement('li');
        var link = linkDoItem(p.caminho);
        var nome = document.createElement(link && p.status !== 'apagado' ? 'a' : 'span');
        nome.textContent = p.caminho.replace(/^site\//, '');
        if (link && p.status !== 'apagado') { nome.href = link; nome.target = '_blank'; nome.rel = 'noopener'; }
        li.appendChild(nome);
        li.appendChild(document.createTextNode(' · ' + p.status + (p.usuarios.length ? ' · por ' + p.usuarios.join(', ') : '') + (p.quando ? ' · ' + p.quando : '') + ' '));
        if (j.revisor) {
          var desc = document.createElement('button');
          desc.className = 'botao-texto'; desc.type = 'button'; desc.textContent = 'Descartar';
          desc.onclick = function () {
            if (!confirm('Descartar a mudança em ' + p.caminho + '? O arquivo volta a ser o que está no ar.')) return;
            apiOnline('descartar', { caminho: p.caminho }).then(function () { painelPublicar(revisor); atualizarBotao(); })
              .catch(function (e) { alert(e.message); });
          };
          li.appendChild(desc);
        }
        lista.appendChild(li);
      });
      dlg.appendChild(lista);
      if (j.revisor && j.pendentes.length) {
        var pub = document.createElement('button');
        pub.className = 'botao principal'; pub.type = 'button'; pub.textContent = 'Publicar tudo';
        pub.onclick = function () {
          pub.disabled = true; pub.textContent = 'Publicando…';
          apiOnline('publicar', {}).then(function (r) {
            alert(r.publicados + ' arquivo(s) publicados. O site atualiza em 1 ou 2 minutos.');
            painelPublicar(revisor); atualizarBotao();
          }).catch(function (e) { alert(e.message); pub.disabled = false; pub.textContent = 'Publicar tudo'; });
        };
        dlg.appendChild(pub);
      }
    }).catch(function (e) { dlg.innerHTML = ''; var p = document.createElement('p'); p.textContent = e.message; dlg.appendChild(p); });
  }

  var botaoPublicar = null;
  function atualizarBotao() {
    if (!botaoPublicar) return;
    apiOnline('pendentes').then(function (j) {
      botaoPublicar.textContent = 'Publicar' + (j.pendentes.length ? ' (' + j.pendentes.length + ')' : '');
    }).catch(function () {});
  }

  fetch('/api/eu', { headers: { 'X-TC-Editor': '1' }, cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
    if (!j || !j.online) return;
    var acoes = document.querySelector('.topo-acoes');
    if (!acoes) return;
    botaoPublicar = document.createElement('button');
    botaoPublicar.type = 'button';
    botaoPublicar.className = 'botao-texto';
    botaoPublicar.textContent = 'Publicar';
    botaoPublicar.onclick = function () { painelPublicar(j.revisor); };
    acoes.appendChild(botaoPublicar);
    var sair = document.createElement('button');
    sair.type = 'button';
    sair.className = 'botao-texto';
    sair.textContent = 'Sair (' + j.usuario + ')';
    sair.onclick = function () {
      fetch('/api/sair', { method: 'POST', headers: { 'X-TC-Editor': '1' } }).then(function () { location.href = 'entrar.html'; });
    };
    acoes.appendChild(sair);
    atualizarBotao();
    setInterval(atualizarBotao, 20000);
  }).catch(function () {});
})();
