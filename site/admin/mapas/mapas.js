/* Mapas do Movimento (antes "Planos de Fundação"), dentro do editor (admin/mapas/).
   Gerado a partir das partes do plano; o texto de cada plano é salvo em admin/mapas/plano-tc.md e admin/mapas/plano.md
   (pela rota /api/mapa do servidor; no editor online, a mudança fica pendente até um revisor publicar). */
// ===== Dados do plano =====
var COLS=[
  {t:"Fundamentos",s:"Por que existimos e como trabalhamos"},
  {t:"Conhecimento",s:"Escutar, pesquisar e preservar"},
  {t:"Comunicação",s:"A ideia chega a cada público"},
  {t:"Organização e luta",s:"Gente organizada mudando a realidade"},
  {t:"Sustentação",s:"Formar, proteger, decidir e se manter"}
];

var N=[
 {id:"programa",col:0,sec:"2 · Programa",t:"Programa e projeto de país",nw:1,
  o:"Um programa público, construído coletivamente, que diz que Brasil o movimento quer: trabalho digno, reforma agrária e urbana, serviços públicos fortes, soberania nacional, combate ao racismo e às desigualdades e democracia participativa.",
  p:"Sem programa, a ação vira reação ao noticiário. O programa dá direção comum a núcleos, frentes e campanhas e permite que qualquer pessoa saiba o que o movimento defende e cobre coerência dele.",
  c:["Elaborado em encontros abertos e revisado periodicamente","Linguagem simples, com versão de uma página","Cada proposta apoiada em dossiês e dados","Metas de curto, médio e longo prazo","Base para campanhas, alianças e ação institucional"]},
 {id:"livre",col:0,sec:"1 · Pilar",t:"Livre e acessível",
  o:"Todo conteúdo, ferramenta e material de formação do movimento é aberto: qualquer pessoa pode acessar, copiar, adaptar e redistribuir, sem pagar e sem pedir permissão.",
  p:"Um movimento popular não pode depender de quem já tem acesso e formação. O conteúdo precisa chegar a quem tem pouca internet, pouco tempo ou alguma deficiência.",
  c:["Linguagem simples e conteúdo gratuito","Texto, áudio, vídeo e impresso","Legendas e, se possível, Libras","Glossário de termos técnicos e políticos","Checklist de acessibilidade antes de publicar"]},
 {id:"inter",col:0,sec:"1 · Pilar",t:"Interdisciplinar",
  o:"Ciência, arte, comunicação, direito, educação e a experiência de quem vive cada problema trabalham juntas. A mesma pesquisa serve ao dossiê, à campanha, ao ato e à aula.",
  p:"Nenhuma área explica a realidade sozinha. A falta de água num bairro envolve engenharia, economia, direito e ciências sociais, e só vira luta quando arte e educação a tornam compreensível.",
  c:["Equipes mistas desde o início de cada projeto","Lideranças comunitárias como parte da equipe, não só como fonte","Formatos de circulação planejados já na pesquisa"]},
 {id:"multi",col:0,sec:"1 · Pilar",t:"Multimodal",
  o:"Estar em todos os espaços onde as pessoas vivem: redes, rua, bairro, local de trabalho, escola, rádio, música, fandoms e espaços de fé e lazer.",
  p:"Espaço que o movimento não ocupa fica livre para outras narrativas, muitas vezes desinformativas e de extrema direita.",
  c:["Cada pesquisa nasce pensada para vários produtos","Uma equipe por formato, que domina sua linguagem","Presença física e digital tratadas com o mesmo peso"]},
 {id:"antro",col:0,sec:"3 · Princípio central",t:"Antropofagia e unidade",
  o:"Devorar boas ideias de qualquer lugar e evitar a autofagia: brigas internas, testes de pureza e disputas por controle. No movimento, isso inclui buscar unidade na ação com outras forças de esquerda.",
  p:"A esquerda costuma se enfraquecer mais por divisões internas do que por ataques externos. Somar forças em torno do que une vale mais do que vencer debates internos.",
  c:["Copiar sem medo o que funciona, dando crédito","Divergência sem ruptura e sem exposição pública de companheiros","Autonomia dos núcleos para agir com o programa e o material","Porta aberta a quem chega com dúvidas","Unidade na ação com outras organizações"]},

 {id:"escuta",col:1,sec:"4 · Conhecimento",t:"Escuta e diagnóstico popular",nw:1,
  o:"Ouvir de forma sistemática as pessoas nos bairros, nos locais de trabalho e nas comunidades: rodas de conversa, questionários e mapas dos problemas de cada território.",
  p:"Um movimento que só fala e não escuta se descola da realidade. A escuta revela as pautas que de fato mobilizam e dá legitimidade ao programa e às campanhas.",
  c:["Questionários simples aplicados pelos núcleos","Mapas de problemas por bairro e por categoria","Resultados devolvidos à comunidade","Prioridades das campanhas definidas a partir da escuta"]},
 {id:"fatos",col:1,sec:"4 · Conhecimento",t:"Site organizador de fatos",
  o:"Cada acontecimento político entra em seu contexto: o tema, o que veio antes, os atores e as fontes. É o noticiário do movimento, separado de opinião.",
  p:"O noticiário fragmentado faz as pessoas esquecerem e confundirem os fatos. O organizador permite seguir um caso do começo ao fim.",
  c:["Notícias curtas, separadas de análises","Cada fato na página do seu caso, com linha do tempo","Fontes arquivadas e selo de confiabilidade","Boletins diários e semanais; correções públicas"]},
 {id:"fichas",col:1,sec:"4 · Conhecimento",t:"Fichas de atores e de casos",
  o:"Páginas em formato wiki para políticos, empresas e casos, com dados, votações, declarações, linha do tempo e fontes.",
  p:"Informação espalhada se perde. A ficha reúne num só lugar quem é quem, o que fez e em que pé está cada caso, e mostra contradições ao longo do tempo.",
  c:["Caixa de resumo, seções fixas e links internos","Linhas do tempo com comparação lado a lado","Histórico de edições e revisão antes de publicar","Também acompanha os mandatos apoiados pelo movimento"]},
 {id:"confi",col:1,sec:"4 · Conhecimento",t:"Grau de confiabilidade",
  o:"Todo conteúdo recebe um selo: Fato, Dado, Investigação, Suspeita ou Boato.",
  p:"Um movimento acusado de mentir perde a disputa. Deixar claro o grau de certeza protege a credibilidade, que é o maior patrimônio político.",
  c:["Fato: fonte primária ou registro público","Dado: número com origem e metodologia","Investigação, Suspeita e Boato sempre sinalizados"]},
 {id:"arquivo",col:1,sec:"4 · Conhecimento",t:"Arquivo e catalogação",
  o:"Cada fonte é capturada no momento da coleta, com data e hash, catalogada com tags de local, envolvidos e tema e guardada em vários lugares.",
  p:"Páginas oficiais mudam e publicações somem. Sem arquivo, a memória das lutas e das promessas desaparece.",
  c:["Nenhuma fonte entra sem cópia preservada","Guia público de catalogação","Cópias em serviços e cidades diferentes","Registro das ações do próprio movimento"]},
 {id:"monitor",col:1,sec:"4 · Conhecimento",t:"Monitoramento de leis, votações e gastos",
  o:"Acompanhamento das câmaras, assembleias, do Congresso e dos portais de transparência, com alertas sobre temas do programa.",
  p:"Saber o que será votado e quando é o que permite pressionar no momento certo, em vez de reclamar depois.",
  c:["Cada projeto traduzido para o que muda na vida real","Alertas de votações ligadas ao programa","Orçamento e emendas acompanhados","Como cada parlamentar votou, nas fichas"]},
 {id:"resp",col:1,sec:"4 · Conhecimento",t:"De quem é a responsabilidade",
  o:"Mapa simples de quem responde por cada área: prefeitura, governo do estado, governo federal ou Congresso.",
  p:"Cobrança no lugar errado não muda nada. Saber o alvo é o que transforma insatisfação em campanha eficaz.",
  c:["Mapa baseado na Constituição e nas leis","Áreas compartilhadas explicadas sem simplificar demais","Partir de problemas do dia a dia","Indicar ouvidorias, câmaras, audiências e LAI"]},
 {id:"trabalho",col:1,sec:"4 · Conhecimento",t:"Observatório do trabalho",
  o:"Divulgação da Lista Suja do Trabalho Escravo e acompanhamento de condições de trabalho, greves, acidentes e trabalho por aplicativo.",
  p:"A classe trabalhadora é o centro de um projeto de esquerda. Dados sobre exploração dão base às lutas sindicais e às denúncias públicas.",
  c:["Lista Suja organizada por estado, setor e resgatados","Cruzamento com doações e contratos públicos, com fonte","Painéis sobre greves e acidentes de trabalho","Orientação para denunciar pelos canais oficiais"]},

 {id:"dossie",col:2,sec:"5 · Comunicação",t:"Dossiês",
  o:"A pesquisa de base de cada tema, com rigor científico e linguagem simples. É de onde saem programa, campanhas, filmes, cartilhas e aulas.",
  p:"Todo conteúdo derivado nasce de uma base verificada, o que reduz erros e protege o movimento de acusações de desinformação.",
  c:["Temas escolhidos coletivamente","Resumo, contexto, linha do tempo, dados, atores e fontes","Revisão por pelo menos duas pessoas","Versão completa e resumo de uma página"]},
 {id:"audio",col:2,sec:"5 · Comunicação",t:"Documentários e podcasts",
  o:"Documentários em longa-metragem a partir de dossiês e podcasts de debate sobre política, economia, cultura e cotidiano.",
  p:"Temas complexos precisam de tempo e narrativa. Vídeo e áudio alcançam quem tem pouco hábito de leitura ou pouco tempo.",
  c:["Roteiro checado antes e depois da edição","Imagens captadas por núcleos de várias regiões","Rádios comunitárias e cine-debates nos bairros","Convidados de movimentos e frentes"]},
 {id:"cortes",col:2,sec:"5 · Comunicação",t:"Cortes para redes",
  o:"Vídeos de até 90 segundos, com legenda, data e fonte na tela e link para o material completo.",
  p:"A maior parte das pessoas se informa por vídeo curto. Os cortes levam campanhas e pesquisas até onde o público já está.",
  c:["Gancho nos primeiros segundos","Identidade visual comum","Banco de cortes aberto a núcleos e parceiros","Resposta rápida sem abrir mão da checagem"]},
 {id:"impressos",col:2,sec:"5 · Comunicação",t:"Materiais impressos",
  o:"Panfletos, jornais de bairro, zines, lambe-lambes e cartazes com QR code para o conteúdo completo.",
  p:"Nem todos estão nas redes. O impresso entregue em mãos abre a conversa que o trabalho de base precisa.",
  c:["Modelos abertos para os núcleos imprimirem","Uma mensagem central por peça","Folha comum, preto e branco","Jornal de bairro periódico feito pelo núcleo"]},
 {id:"redes",col:2,sec:"5 · Comunicação",t:"Ocupação das redes",
  o:"Presença em WhatsApp, YouTube, Instagram, TikTok, Facebook, Reddit, X, Kwai, Discord, Threads, Bluesky, Twitch e podcasts, cada uma com linha editorial própria.",
  p:"Cada rede tem um público. O movimento precisa falar a língua de todas sem perder a base checada.",
  c:["Mesma base, linguagens diferentes","Disciplina de engajamento: não dar alcance a provocações","Tudo guardado também no acervo próprio","Redes servem para levar gente aos núcleos, não só para curtir"]},
 {id:"nichos",col:2,sec:"5 · Comunicação",t:"Nichos e comunidades",
  o:"Atuação em fandoms, games, animes, RPG, moda, carros, comunidades de fé, de identidade, de tecnologia, ciência e esportes.",
  p:"Muita gente não procura política, mas confia nas suas comunidades. Deixá-las de lado as entrega à desinformação e ao discurso de ódio.",
  c:["Voluntários que já fazem parte de cada nicho","Conteúdo a partir dos interesses da comunidade","Respeito às regras de cada espaço"]},
 {id:"tec",col:2,sec:"6 · Tecnologia cívica",t:"Tecnologia cívica",
  o:"Site e acervo, subdomínios estaduais, Quem cobrar, painéis de votações e gastos, bots, cadastro de militantes, agenda de núcleos, plataforma de decisão e ambiente de formação.",
  p:"Ferramentas próprias transformam informação em ação e reduzem a dependência de plataformas que podem banir contas a qualquer momento.",
  c:["Software livre e código aberto","Privacidade desde o início e LGPD","Funciona em celular simples","Reaproveitar ferramentas livres antes de criar"]},

 {id:"nucleos",col:3,sec:"7 · Organização de base",t:"Núcleos territoriais e de trabalho",nw:1,
  o:"Grupos pequenos e autônomos em bairros, escolas, universidades e locais de trabalho. São a célula básica do movimento.",
  p:"Movimento que só existe na internet some quando o algoritmo muda. Núcleos com reunião regular criam laços de confiança e capacidade real de mobilização.",
  c:["Reuniões regulares abertas à comunidade","Coordenação rotativa","Responsáveis por formação, comunicação e segurança","Autonomia para agir com o programa e o material"]},
 {id:"frentes",col:3,sec:"7 · Organização de base",t:"Frentes setoriais",nw:1,
  o:"Frentes de juventude, mulheres, negra, LGBTQIA+, indígena e povos tradicionais, do campo e de pessoas com deficiência.",
  p:"Opressões diferentes pedem pautas e linguagens próprias. As frentes garantem que quem vive cada luta a lidere dentro do movimento.",
  c:["Pautas próprias levadas ao programa","Trabalho junto às organizações que já atuam em cada causa","Coordenação com os núcleos, sem duplicar estrutura"]},
 {id:"sindical",col:3,sec:"8 · Lutas",t:"Sindicatos e movimentos sociais",nw:1,
  o:"Relação permanente com sindicatos e com movimentos de moradia, sem-terra, estudantis e populares, oferecendo pesquisa, comunicação e formação.",
  p:"A classe trabalhadora já tem organizações com décadas de luta. Somar a elas, em vez de competir, multiplica a força.",
  c:["Dossiês e dados para negociações e greves","Apoio de comunicação a campanhas salariais","Formação conjunta","Participação em fóruns e plenárias unificadas"]},
 {id:"solid",col:3,sec:"8 · Lutas",t:"Solidariedade e ajuda mútua",nw:1,
  o:"Cozinhas solidárias, cursinhos populares, hortas comunitárias, mutirões e plantões de orientação sobre direitos.",
  p:"Resolver problemas concretos cria confiança e mostra na prática o que o movimento defende. É a política que a pessoa sente no dia a dia.",
  c:["Ações organizadas pelos núcleos","Prestação de contas aberta","Cada ação é também espaço de escuta e conversa política","Sem trocar ajuda por apoio político"]},
 {id:"campanhas",col:3,sec:"8 · Lutas",t:"Campanhas e lutas",nw:1,
  o:"Campanhas com objetivo concreto, como tarifa zero, contra despejos ou por reajuste, com alvo, metas e prazos.",
  p:"Vitórias concretas mostram que organização funciona e trazem novas pessoas. Sem elas, o movimento só denuncia.",
  c:["Objetivo alcançável e alvo definido","Etapas: abaixo-assinado, audiência, ato, negociação","Comunicação integrada em todos os canais","Balanço público ao final"]},
 {id:"ruas",col:3,sec:"8 · Lutas",t:"Atos de rua",
  o:"Cartilhas, rodas de preparação e porta-vozes para que cada ato tenha argumentos claros e respostas às críticas.",
  p:"Quem vai ao ato bem informado conversa com quem passa e resiste a narrativas que reduzem a pauta a desordem.",
  c:["Cartilha impressa e digital","Rodas de preparação","Porta-vozes treinados","Registro e balanço depois do ato"]},
 {id:"intel",col:3,sec:"8 · Lutas",t:"Inteligência e planejamento dos atos",
  o:"Análise de risco, escolha de local, dia e horário, logística e preparo para agir com segurança diante de truculência.",
  p:"Ato mal planejado expõe os participantes e fica vulnerável à repressão. Com preparação, alcança mais gente e protege os mais vulneráveis.",
  c:["Nível de risco e plano proporcional","Aviso prévio e caráter pacífico explícito","Pontos de apoio, cuidado e comunicação segura","Registro e denúncia de abusos"]},
 {id:"inst",col:3,sec:"9 · Ação institucional",t:"Ação institucional",nw:1,
  o:"Incidência em câmaras e assembleias, audiências públicas, conselhos participativos, projetos de iniciativa popular e apoio a candidaturas comprometidas com o programa, dentro da lei eleitoral.",
  p:"Leis e orçamento passam pelas instituições; abandoná-las entrega esse espaço aos adversários. A ação institucional fica subordinada ao movimento, e não o contrário.",
  c:["Participação em conselhos e audiências","Projetos de iniciativa popular","Compromissos públicos assinados por candidaturas apoiadas","Mandatos acompanhados pelas mesmas fichas","Respeito estrito à legislação eleitoral"]},

 {id:"formacao",col:4,sec:"10 · Formação",t:"Formação e multiplicadores",
  o:"Trilhas gratuitas em ciências, debate, oratória, comunicação digital, leitura crítica de mídia, história, economia, direito, segurança em atos e educação popular.",
  p:"Um movimento só cresce de forma consistente quando seus membros sabem pesquisar, argumentar, organizar e ensinar.",
  c:["Aulas curtas, encontros ao vivo e exercícios","Programa do movimento como conteúdo básico","Formação de multiplicadores para cada núcleo","Organização comunitária como trilha própria"]},
 {id:"marx",col:4,sec:"10 · Formação",t:"Marxismo e pensamento de esquerda",
  o:"Fundamentos do marxismo e suas vertentes, os intérpretes do Brasil, o pensamento latino-americano e outras tradições da esquerda, com seus debates e críticas.",
  p:"Entender a formação social brasileira dá profundidade ao programa e evita caricaturas. Conhecer as críticas permite debater com seriedade.",
  c:["Textos originais e grupos de leitura guiada","Caio Prado Jr., Florestan, Clóvis Moura, Lélia Gonzalez, Marini","Balanço histórico das experiências socialistas","Trilhas por nível"]},
 {id:"ciber",col:4,sec:"11 · Proteção",t:"Cibersegurança pessoal",
  o:"Formação acessível em senhas, dois fatores, mensageiros criptografados, proteção contra doxxing e cuidados com o celular em atos.",
  p:"Militantes podem virar alvo de vigilância e perseguição. Um único membro desprotegido pode expor um núcleo inteiro.",
  c:["Análise de risco por pessoa e função","Signal, Proton, Tuta e Briar","Resposta a incidentes"]},
 {id:"seg",col:4,sec:"11 · Proteção",t:"Segurança dos membros",
  o:"Regras comuns de proteção: níveis de acesso, pseudônimo opcional e protocolo para invasão, vazamento ou ameaça.",
  p:"Quem se organiza politicamente pode sofrer ataques. A segurança é coletiva.",
  c:["Formação em cibersegurança obrigatória ao entrar","Acesso só ao necessário para cada função","Protocolo de incidentes"]},
 {id:"jur",col:4,sec:"11 · Proteção",t:"Apoio jurídico",
  o:"Rede de advogados parceiros que revisa materiais, acompanha atos, orienta militantes e apoia comunidades em conflitos como despejos.",
  p:"Publicações, atos e lutas por direitos geram processos e abordagens policiais.",
  c:["Revisão de dossiês sensíveis","Plantão em atos","Cartilha de direitos","Escritórios populares e defensorias"]},
 {id:"crise",col:4,sec:"11 · Proteção",t:"Resposta rápida",
  o:"Protocolo com comitê eleito, canais de decisão e respostas prontas para ataques coordenados e crises.",
  p:"Ataques ao movimento exigem reação organizada, com fatos, e não improviso.",
  c:["Monitoramento de menções","Comitê de crise pequeno e eleito","Resposta com fontes, sem provocações"]},
 {id:"demo",col:4,sec:"7 · Organização de base",t:"Democracia interna",nw:1,
  o:"Assembleias, plataforma de propostas e votações, coordenações com mandato e revogáveis, e transparência sobre decisões e contas.",
  p:"Um movimento que defende democracia precisa praticá-la por dentro. Centralização sufoca iniciativas e afasta as pessoas.",
  c:["Decisões importantes por votação aberta aos membros","Mandatos curtos e rotatividade","Atas e contas públicas","Revisão periódica do próprio plano"]},
 {id:"aliancas",col:4,sec:"9 · Alianças",t:"Alianças e internacionalismo",nw:1,
  o:"Frentes com outras organizações de esquerda e democráticas em torno de pautas comuns, e intercâmbio com movimentos da América Latina e do mundo.",
  p:"Nenhuma organização muda o país sozinha. Clima, dívida e poder das big techs são problemas globais.",
  c:["Critérios: princípios comuns, independência e transparência","Acordos por escrito","Atos e campanhas unificadas","Intercâmbio de formação e experiências"]},
 {id:"fin",col:4,sec:"12 · Financiamento",t:"Financiamento independente",
  o:"Contribuição de membros proporcional à renda, financiamento coletivo, Pix, festas, loja e editais, ainda em estudo.",
  p:"Quem paga influencia. Um movimento popular precisa ser sustentado pelas pessoas que o compõem para manter a independência.",
  c:["Sem dinheiro de empresas investigadas ou com condições","Contribuição baixa e de muita gente","Prestação de contas pública","Fundo de reserva e de solidariedade"]},
 {id:"lic",col:4,sec:"12 · Acesso aberto",t:"Licença aberta",
  o:"Conteúdo sob Creative Commons (por exemplo, CC BY-NC-SA): crédito obrigatório, uso comercial só com autorização e derivados sob a mesma licença.",
  p:"A licença deixa núcleos, aliados e qualquer pessoa reutilizarem o material sem medo, multiplicando o alcance.",
  c:["Licença indicada em cada material","Arquivos-fonte disponíveis","Guia simples de uso"]}
];

/* [de, para, por quê]: a seta sai de "de" e aponta para "para" */
var E=[
 ["escuta","programa","O programa é revisado com os problemas e prioridades que a escuta revela."],
 ["dossie","programa","Cada proposta do programa se apoia em pesquisa de dossiês."],
 ["demo","programa","O programa é debatido e votado pelos membros."],
 ["frentes","programa","Cada frente leva ao programa as pautas de quem vive aquela luta."],
 ["marx","programa","A análise da formação social brasileira dá profundidade ao programa."],
 ["programa","campanhas","As campanhas transformam pontos do programa em objetivos concretos."],
 ["programa","inst","Os compromissos de candidaturas e os projetos de lei partem do programa."],
 ["programa","aliancas","As alianças se fazem em torno de pontos comuns do programa."],
 ["programa","formacao","O programa é conteúdo básico da formação de todo membro."],
 ["livre","lic","A licença aberta é a forma jurídica do pilar livre."],
 ["livre","impressos","Impresso em folha comum alcança quem tem pouca internet."],
 ["livre","tec","As ferramentas funcionam em celular simples e com pouca internet."],
 ["livre","fin","O financiamento não pode bloquear o acesso ao conteúdo principal."],
 ["inter","dossie","Os dossiês nascem de equipes mistas, com lideranças comunitárias."],
 ["inter","audio","Pesquisadores, roteiristas e artistas fazem os filmes juntos."],
 ["inter","formacao","As trilhas cruzam ciência, história, economia, direito e comunicação."],
 ["multi","redes","Ocupar cada rede com sua linguagem é o pilar aplicado à internet."],
 ["multi","nichos","O pilar manda estar também nas comunidades de interesse."],
 ["multi","nucleos","Os núcleos garantem presença física nos bairros e locais de trabalho."],
 ["antro","aliancas","Unidade na ação com outras forças de esquerda."],
 ["antro","sindical","Somar às organizações que já existem em vez de competir com elas."],
 ["antro","demo","Divergência sem ruptura: debate interno com regras claras."],
 ["antro","tec","Reaproveitar ferramentas livres antes de criar."],
 ["nucleos","escuta","Os núcleos aplicam questionários e fazem rodas de conversa no território."],
 ["solid","escuta","O contato diário nas ações de solidariedade revela os problemas reais."],
 ["escuta","campanhas","As campanhas prioritárias saem do que a escuta aponta."],
 ["escuta","resp","Cada problema levantado é cruzado com o mapa de responsabilidades."],
 ["arquivo","fatos","As fontes de cada notícia já estão preservadas no arquivo."],
 ["arquivo","fichas","Cada referência das fichas leva à fonte arquivada."],
 ["confi","fatos","Cada notícia exibe o selo de confiabilidade."],
 ["confi","dossie","No dossiê, cada afirmação é marcada com seu grau de certeza."],
 ["confi","crise","O selo permite mostrar exatamente o que foi afirmado e com qual prova."],
 ["fatos","fichas","Cada novo fato atualiza a ficha do caso e dos envolvidos."],
 ["fatos","redes","Os boletins do site circulam nas redes e no WhatsApp."],
 ["fatos","tec","O organizador de fatos é parte do site e acervo público."],
 ["monitor","fichas","Como cada parlamentar votou entra na ficha dele."],
 ["monitor","tec","Os painéis públicos de votações e gastos vêm do monitoramento."],
 ["monitor","inst","Alertas de votação dizem quando e onde pressionar."],
 ["monitor","campanhas","Prazos de votação definem o calendário das campanhas."],
 ["fichas","resp","A ficha do responsável atual mostra promessas, votos e ações."],
 ["fichas","cortes","Linhas do tempo de declarações viram cortes."],
 ["fichas","dossie","As fichas reúnem a base factual dos dossiês."],
 ["fichas","inst","Os mandatos apoiados são acompanhados pelas mesmas fichas, com a mesma exigência."],
 ["resp","campanhas","O mapa de responsabilidades define o alvo de cada campanha."],
 ["resp","tec","A ferramenta Quem cobrar põe o mapa nas mãos de qualquer pessoa."],
 ["trabalho","sindical","Dados sobre exploração e acidentes apoiam negociações e greves."],
 ["trabalho","fichas","A Lista Suja é cruzada com doações e relações com atores políticos."],
 ["trabalho","cortes","Cada atualização da lista vira cortes e cartões."],
 ["sindical","trabalho","Sindicatos trazem denúncias e dados de dentro dos locais de trabalho."],
 ["dossie","audio","Todo documentário parte de um dossiê; podcasts usam seus dados."],
 ["dossie","campanhas","Os dossiês dão os argumentos e números de cada campanha."],
 ["dossie","ruas","As cartilhas dos atos são feitas a partir dos dossiês."],
 ["dossie","sindical","Pesquisas entregues a sindicatos e movimentos parceiros."],
 ["audio","cortes","Cada filme e episódio gera cortes."],
 ["audio","nucleos","Cine-debates e rodas de escuta nos núcleos."],
 ["cortes","redes","O mesmo corte é adaptado a cada rede de vídeos curtos."],
 ["impressos","nucleos","Os núcleos imprimem e distribuem os modelos no bairro."],
 ["impressos","ruas","Panfletos e cartilhas são distribuídos nos atos."],
 ["redes","nucleos","As redes convidam quem se interessa a entrar num núcleo perto de casa."],
 ["redes","crise","O monitoramento das redes detecta ataques no início."],
 ["nichos","nucleos","Comunidades de interesse também viram núcleos temáticos."],
 ["frentes","nichos","As frentes lideram a atuação nas comunidades de identidade."],
 ["tec","nucleos","Cadastro, agenda e divisão de tarefas dos núcleos."],
 ["tec","demo","A plataforma de decisão coletiva dá forma prática à democracia interna."],
 ["tec","formacao","O ambiente de formação organiza as trilhas."],
 ["nucleos","solid","Os núcleos organizam cozinhas, cursinhos e mutirões."],
 ["nucleos","ruas","Os núcleos mobilizam o bairro para os atos."],
 ["nucleos","demo","Os núcleos são a base das assembleias e votações."],
 ["solid","nucleos","Quem é ajudado e quem ajuda conhece o núcleo e pode entrar nele."],
 ["frentes","campanhas","As frentes propõem e conduzem campanhas sobre suas pautas."],
 ["sindical","campanhas","Sindicatos e movimentos somam força às campanhas."],
 ["sindical","ruas","Mobilização das categorias nos atos unificados."],
 ["campanhas","redes","Cada campanha tem comunicação integrada em todas as redes."],
 ["campanhas","ruas","Atos são etapas planejadas das campanhas."],
 ["campanhas","inst","A pressão das campanhas chega às votações e audiências."],
 ["intel","ruas","A inteligência diz onde, quando e com que segurança o ato acontece."],
 ["ruas","arquivo","O registro dos atos alimenta o arquivo e protege contra versões distorcidas."],
 ["inst","monitor","Projetos apresentados e audiências realizadas entram no monitoramento."],
 ["formacao","nucleos","Multiplicadores formados levam a formação a cada núcleo."],
 ["formacao","ruas","Oratória e debate preparam porta-vozes."],
 ["formacao","redes","A trilha de comunicação digital prepara quem publica."],
 ["formacao","dossie","Leitura de pesquisas e estatística são a matéria-prima dos dossiês."],
 ["marx","formacao","O pensamento de esquerda é uma das trilhas da formação."],
 ["ciber","seg","Todo membro faz a formação em cibersegurança ao entrar."],
 ["ciber","intel","A segurança digital no ato aplica a formação em cibersegurança."],
 ["seg","tec","Níveis de acesso e privacidade definem como as ferramentas guardam dados."],
 ["seg","crise","O protocolo de incidentes integra a resposta a ataques."],
 ["jur","dossie","Dossiês que citam pessoas passam por análise jurídica."],
 ["jur","ruas","Advogados de plantão durante os atos."],
 ["jur","crise","Crises com risco de processo envolvem o apoio jurídico desde o início."],
 ["demo","fin","O uso do dinheiro é decidido coletivamente."],
 ["demo","crise","O comitê de crise é eleito e presta contas."],
 ["aliancas","ruas","Atos unificados com organizações aliadas."],
 ["aliancas","jur","Escritórios populares e defensorias entram pela rede de alianças."],
 ["aliancas","campanhas","Campanhas comuns ganham escala com aliados."],
 ["fin","audio","Recursos financiam filmes e equipamentos."],
 ["fin","solid","Um fundo de solidariedade apoia as ações nos territórios."],
 ["lic","cortes","A licença permite que qualquer perfil republique os cortes."],
 ["lic","nucleos","Os núcleos adaptam o material à sua realidade sem pedir permissão."]
];

var PATHS=[
 {t:"Da escuta à vitória",s:"Como um problema do bairro vira campanha, pressão e lei.",
  steps:[["nucleos","O núcleo do bairro aplica questionários de porta em porta."],
   ["escuta","O diagnóstico mostra que a maior queixa é o preço e a frequência do ônibus."],
   ["resp","O mapa de responsabilidades indica que o transporte coletivo municipal cabe à prefeitura e à câmara."],
   ["campanhas","Nasce uma campanha com objetivo, alvo e prazos."],
   ["dossie","Um dossiê reúne custos, contratos de concessão e experiências de tarifa zero em outras cidades."],
   ["redes","Cortes e cartões explicam a campanha em cada rede."],
   ["ruas","Atos e audiências públicas pressionam a câmara."],
   ["inst","Um projeto de iniciativa popular é protocolado."],
   ["monitor","O monitoramento registra como cada vereador votou, e o resultado vai para as fichas."]]},
 {t:"Do fato à rua",s:"Como uma informação vira pesquisa, filme, corte e argumento num ato.",
  steps:[["arquivo","Um documento ou vídeo é capturado e arquivado com data e hash."],
   ["confi","A informação recebe seu selo de confiabilidade."],
   ["fatos","O site publica a notícia no contexto do caso."],
   ["fichas","As fichas do caso e dos envolvidos são atualizadas."],
   ["dossie","O tema vira dossiê, revisado por duas pessoas."],
   ["audio","O dossiê vira documentário e episódio de podcast."],
   ["cortes","Os filmes geram cortes de até 90 segundos."],
   ["redes","Os cortes circulam em todas as redes."],
   ["ruas","O dossiê vira cartilha para o ato."],
   ["arquivo","O registro do ato volta ao arquivo. O ciclo recomeça."]]},
 {t:"Do vizinho ao militante",s:"Como alguém conhece o movimento e passa a organizar outras pessoas.",
  steps:[["solid","Uma vizinha conhece a cozinha solidária do bairro."],
   ["nucleos","É convidada para a reunião aberta do núcleo."],
   ["ciber","Ao entrar, faz a formação em cibersegurança."],
   ["seg","Recebe acesso ao que sua função exige."],
   ["formacao","Faz trilhas de oratória, história e organização comunitária."],
   ["marx","Aprofunda o estudo nos grupos de leitura."],
   ["demo","Vota nas assembleias e ajuda a revisar o programa."],
   ["formacao","Vira multiplicadora e forma as próximas pessoas do núcleo."]]},
 {t:"Como o movimento se sustenta",s:"Como manter independência, proteção e continuidade.",
  steps:[["livre","Tudo é gratuito e aberto: o dinheiro não pode vir de bloquear acesso."],
   ["lic","A licença deixa núcleos e aliados multiplicarem o material sem custo."],
   ["fin","Contribuições baixas de muita gente garantem independência."],
   ["demo","Os membros decidem como o dinheiro é usado, com contas públicas."],
   ["aliancas","Alianças trazem apoio jurídico, espaços e escala."],
   ["jur","A rede jurídica protege o que é publicado e quem vai às ruas."],
   ["crise","A resposta rápida protege a credibilidade do movimento."]]}
];

var SECS=[
 {n:1,t:"Apresentação e pilares",o:"Um movimento que une pesquisa, comunicação, organização de base e luta, apoiado em três pilares: livre, interdisciplinar e multimodal.",i:"Define a identidade e o modo de trabalho de todas as outras seções.",ids:["livre","inter","multi"]},
 {n:2,t:"Programa e projeto de país",nw:1,o:"O que o movimento defende, construído coletivamente e revisado com base na escuta e na pesquisa.",i:"Dá direção comum a núcleos, frentes, campanhas, alianças e ação institucional.",ids:["programa"]},
 {n:3,t:"Antropofagia e unidade",o:"Devorar boas ideias, evitar a autofagia e buscar unidade na ação.",i:"Protege o movimento do que mais enfraquece a esquerda: a divisão interna.",ids:["antro"]},
 {n:4,t:"Conhecimento",o:"Escuta popular, site de fatos, fichas, selos, arquivo, monitoramento, responsabilidades e observatório do trabalho.",i:"É a base de credibilidade de tudo o que o movimento diz e cobra.",ids:["escuta","fatos","fichas","confi","arquivo","monitor","resp","trabalho"]},
 {n:5,t:"Comunicação",o:"Dossiês, documentários, podcasts, cortes, impressos, redes e nichos.",i:"Leva as ideias do movimento a cada público e traz gente nova para os núcleos.",ids:["dossie","audio","cortes","impressos","redes","nichos"]},
 {n:6,t:"Tecnologia cívica",o:"Site, Quem cobrar, painéis, bots, cadastro, agenda e plataforma de decisão.",i:"Transforma informação em ação e organização sem depender das big techs.",ids:["tec"]},
 {n:7,t:"Organização de base",nw:1,o:"Núcleos territoriais e de trabalho, frentes setoriais e democracia interna.",i:"É o que dá corpo ao movimento: gente que se conhece, se reúne e decide junto.",ids:["nucleos","frentes","demo"]},
 {n:8,t:"Lutas",nw:1,o:"Campanhas, solidariedade, articulação com sindicatos e movimentos, atos e planejamento dos atos.",i:"É onde a organização vira conquista concreta na vida das pessoas.",ids:["campanhas","solid","sindical","ruas","intel"]},
 {n:9,t:"Ação institucional e alianças",nw:1,o:"Incidência, conselhos, iniciativa popular, candidaturas comprometidas, frentes e internacionalismo.",i:"Leva as lutas para onde se decidem leis e orçamento, sem que o movimento se subordine às eleições.",ids:["inst","aliancas"]},
 {n:10,t:"Formação",o:"Trilhas gratuitas, formação de multiplicadores e estudo do marxismo e do pensamento de esquerda.",i:"Transforma apoiadores em organizadores capazes de formar outros.",ids:["formacao","marx"]},
 {n:11,t:"Proteção",o:"Cibersegurança, segurança dos membros, apoio jurídico e resposta rápida.",i:"Protege as pessoas e a credibilidade que sustentam o movimento.",ids:["ciber","seg","jur","crise"]},
 {n:12,t:"Financiamento e acesso aberto",o:"Financiamento independente, ainda em estudo, e licença aberta.",i:"Garante continuidade e independência sem fechar o conteúdo.",ids:["fin","lic"]}
];


// ===== O plano em Markdown: ler e escrever =====
// Formato:
//   # Camada: Título            (a linha seguinte, se for texto, é o subtítulo da camada)
//   ## Título do ponto {#id}    (o {#id} é opcional; sem ele, o id sai do título)
//   Seção: 2 · Programa / Novo: sim / O que é: … / Por que importa: …
//   Como se faz:   - item
//   Entrega para:  - [[id]] por quê
//   # Percurso: Título          (texto = subtítulo; passos: 1. [[id]] texto)
//   # Seção 1: Título           (Novo / O que é / Papel no conjunto / Pontos: [[id]] [[id]])
var PlanoMD = (function () {
  function chave(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); }
  function slug(s) { return chave(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'ponto'; }
  var CAMPOS = { 'secao': 'sec', 'novo': 'nw', 'o que e': 'o', 'por que importa': 'p', 'como se faz': 'c', 'entrega para': 'out',
    'papel no conjunto': 'i', 'papel': 'i', 'pontos': 'ids' };
  var SIM = { sim: 1, s: 1, yes: 1, true: 1, x: 1 };

  function ler(texto) {
    var cols = [], nos = [], arestas = [], percursos = [], secoes = [], erros = [], avisos = [];
    var ctx = null, lista = null, ultimoTexto = null, colAtual = -1, emComentario = false;
    var linhas = String(texto || '').replace(/\r\n?/g, '\n').split('\n');
    linhas.forEach(function (bruta, i) {
      var n = i + 1, l = bruta.trim(), m;
      if (emComentario) { if (l.indexOf('-->') >= 0) emComentario = false; return; }
      if (l.indexOf('<!--') === 0) { if (l.indexOf('-->') < 0) emComentario = true; return; }
      if (!l) { ultimoTexto = null; return; }
      if ((m = /^#\s+camada\s*:\s*(.+)$/i.exec(l))) {
        cols.push({ t: m[1].trim(), s: '' }); colAtual = cols.length - 1;
        ctx = { tipo: 'camada', obj: cols[colAtual] }; lista = null; ultimoTexto = null; return;
      }
      if ((m = /^#\s+percurso\s*:\s*(.+)$/i.exec(l))) {
        var p = { t: m[1].trim(), s: '', steps: [] }; percursos.push(p);
        ctx = { tipo: 'percurso', obj: p }; lista = null; ultimoTexto = null; return;
      }
      if ((m = /^#\s+(\S+)\s+(\d+)\s*[:·.-]\s*(.+)$/.exec(l)) && chave(m[1]) === 'secao') {
        m = [m[0], m[2], m[3]];
        var s = { n: Number(m[1]), t: m[2].trim(), o: '', i: '', ids: [], linha: n }; secoes.push(s);
        ctx = { tipo: 'secao', obj: s }; lista = null; ultimoTexto = null; return;
      }
      if (/^#\s/.test(l)) { erros.push({ linha: n, msg: 'Título "# …" desconhecido. Use "# Camada: …", "# Percurso: …" ou "# Seção N: …".' }); ctx = null; return; }
      if ((m = /^##\s+(.+?)\s*(?:\{#([^}]*)\})?\s*$/.exec(l))) {
        if (colAtual < 0 || !ctx || (ctx.tipo !== 'camada' && ctx.tipo !== 'no')) {
          erros.push({ linha: n, msg: 'Ponto "## ' + m[1] + '" fora de uma camada. Ponha-o depois de um "# Camada: …".' }); ctx = null; return;
        }
        var id = m[2] !== undefined ? slug(m[2]) : slug(m[1]);
        var no = { id: id, col: colAtual, sec: '', t: m[1].trim(), o: '', p: '', c: [], linha: n };
        nos.push(no); ctx = { tipo: 'no', obj: no }; lista = null; ultimoTexto = null; return;
      }
      if (!ctx) { avisos.push({ linha: n, msg: 'Linha fora de qualquer camada, percurso ou seção: ignorada.' }); return; }
      var o = ctx.obj;
      // Itens de lista
      if ((m = /^[-*+]\s+(.*)$/.exec(l))) {
        var item = m[1].trim();
        if (ctx.tipo === 'no' && lista === 'c') { o.c.push(item); return; }
        if (ctx.tipo === 'no' && lista === 'out') {
          var e = /^\[\[([^\]]+)\]\]\s*[:—–-]?\s*(.*)$/.exec(item);
          if (!e) { erros.push({ linha: n, msg: 'Em "Entrega para", cada item é "- [[id]] por quê".' }); return; }
          arestas.push({ de: o.id, para: slug(e[1]), w: e[2].trim(), linha: n }); return;
        }
        avisos.push({ linha: n, msg: 'Item de lista sem "Como se faz:" ou "Entrega para:" antes: ignorado.' }); return;
      }
      if ((m = /^\d+[.)]\s+(.*)$/.exec(l)) && ctx.tipo === 'percurso') {
        var ps = /^\[\[([^\]]+)\]\]\s*[:—–-]?\s*(.*)$/.exec(m[1].trim());
        if (!ps) { erros.push({ linha: n, msg: 'Cada passo do percurso é "1. [[id]] o que acontece".' }); return; }
        o.steps.push([slug(ps[1]), ps[2].trim(), n]); return;
      }
      // Campos "Nome: valor"
      if ((m = /^([^:]{2,24}):\s*(.*)$/.exec(l)) && CAMPOS[chave(m[1])]) {
        var k = CAMPOS[chave(m[1])], v = m[2].trim();
        lista = null; ultimoTexto = null;
        if (ctx.tipo === 'camada') { avisos.push({ linha: n, msg: 'Campos ficam dentro de um ponto "## …": ignorado.' }); return; }
        if (k === 'nw') { if (ctx.tipo === 'percurso') return; o.nw = SIM[chave(v)] ? 1 : 0; return; }
        if (ctx.tipo === 'secao') {
          if (k === 'o' || k === 'i') { o[k] = v; ultimoTexto = k; return; }
          if (k === 'ids') { var r = /\[\[([^\]]+)\]\]/g, x; while ((x = r.exec(v))) o.ids.push(slug(x[1])); lista = 'ids'; return; }
          avisos.push({ linha: n, msg: '"' + m[1] + '" não vale numa seção: ignorado.' }); return;
        }
        if (ctx.tipo === 'no') {
          if (k === 'sec') { o.sec = v; return; }
          if (k === 'o' || k === 'p') { o[k] = v; ultimoTexto = k; return; }
          if (k === 'c' || k === 'out') { lista = k; if (v) avisos.push({ linha: n, msg: 'Escreva os itens de "' + m[1] + '" nas linhas de baixo, com "- ".' }); return; }
          avisos.push({ linha: n, msg: '"' + m[1] + '" não vale num ponto: ignorado.' }); return;
        }
      }
      // Texto solto: subtítulo (camada, percurso) ou continuação do último campo de texto
      if (ctx.tipo === 'camada' || ctx.tipo === 'percurso') { o.s = o.s ? o.s + ' ' + l : l; return; }
      if (ultimoTexto) { o[ultimoTexto] = (o[ultimoTexto] ? o[ultimoTexto] + ' ' : '') + l; return; }
      if (ctx.tipo === 'secao' && lista === 'ids' && /\[\[/.test(l)) { var r2 = /\[\[([^\]]+)\]\]/g, y; while ((y = r2.exec(l))) o.ids.push(slug(y[1])); return; }
      avisos.push({ linha: n, msg: 'Texto sem campo ("O que é:", "Por que importa:"…): ignorado.' });
    });

    // Conferências: ids repetidos e ligações para pontos que não existem
    var porId = {};
    nos.forEach(function (no) {
      if (porId[no.id]) erros.push({ linha: no.linha, msg: 'O id "' + no.id + '" já foi usado na linha ' + porId[no.id].linha + '. Dê um {#id} diferente.' });
      else porId[no.id] = no;
    });
    var vistas = {};
    arestas = arestas.filter(function (a) {
      if (!porId[a.para]) { erros.push({ linha: a.linha, msg: 'Não existe ponto com id "' + a.para + '".' }); return false; }
      if (a.para === a.de) { avisos.push({ linha: a.linha, msg: 'Um ponto não pode entregar para si mesmo: ignorado.' }); return false; }
      if (vistas[a.de + '>' + a.para]) { avisos.push({ linha: a.linha, msg: 'Ligação repetida: ignorada.' }); return false; }
      vistas[a.de + '>' + a.para] = 1; return true;
    });
    percursos.forEach(function (p) { p.steps.forEach(function (s) { if (!porId[s[0]]) erros.push({ linha: s[2], msg: 'Passo com id "' + s[0] + '", que não existe.' }); }); });
    secoes.forEach(function (s) { s.ids.forEach(function (id) { if (!porId[id]) erros.push({ linha: s.linha, msg: 'A seção ' + s.n + ' cita "' + id + '", que não existe.' }); }); });
    if (!nos.length) erros.push({ linha: 1, msg: 'O plano precisa de pelo menos uma camada com um ponto.' });
    cols.forEach(function (c, ci) { if (!nos.some(function (no) { return no.col === ci; })) avisos.push({ linha: 1, msg: 'A camada "' + c.t + '" está vazia.' }); });

    return {
      erros: erros, avisos: avisos,
      dados: {
        COLS: cols,
        N: nos.map(function (no) { var x = { id: no.id, col: no.col, sec: no.sec, t: no.t, o: no.o, p: no.p, c: no.c }; if (no.nw) x.nw = 1; return x; }),
        E: arestas.map(function (a) { return [a.de, a.para, a.w]; }),
        PATHS: percursos.filter(function (p) { return p.steps.length; }).map(function (p) { return { t: p.t, s: p.s, steps: p.steps.map(function (s) { return [s[0], s[1]]; }) }; }),
        SECS: secoes.map(function (s) { var x = { n: s.n, t: s.t, o: s.o, i: s.i, ids: s.ids }; if (s.nw) x.nw = 1; return x; })
      }
    };
  }

  var GUIA = [
    '<!--',
    'Plano em Markdown. Edite e veja o mapa mudar na hora.',
    '  # Camada: Título         uma coluna do mapa (a linha de baixo é o subtítulo)',
    '  ## Ponto {#id}           um ponto da camada; o id é usado nas ligações [[id]]',
    '  Seção: / Novo: sim / O que é: / Por que importa:',
    '  Como se faz:             seguido de itens "- …"',
    '  Entrega para:            seguido de itens "- [[id]] por quê" (as setas do mapa)',
    '  # Percurso: Título       subtítulo na linha de baixo; passos "1. [[id]] texto"',
    '  # Seção N: Título        Novo: / O que é: / Papel no conjunto: / Pontos: [[id]] [[id]]',
    '-->'
  ].join('\n');

  function escrever(d) {
    var saida = [GUIA, ''];
    var deOrigem = {};
    d.E.forEach(function (e) { (deOrigem[e[0]] = deOrigem[e[0]] || []).push(e); });
    d.COLS.forEach(function (c, ci) {
      saida.push('# Camada: ' + c.t);
      if (c.s) saida.push(c.s);
      saida.push('');
      d.N.filter(function (n) { return n.col === ci; }).forEach(function (n) {
        saida.push('## ' + n.t + ' {#' + n.id + '}');
        if (n.sec) saida.push('Seção: ' + n.sec);
        if (n.nw) saida.push('Novo: sim');
        if (n.o) saida.push('O que é: ' + n.o);
        if (n.p) saida.push('Por que importa: ' + n.p);
        if (n.c && n.c.length) { saida.push('Como se faz:'); n.c.forEach(function (x) { saida.push('- ' + x); }); }
        var sai = deOrigem[n.id] || [];
        if (sai.length) { saida.push('Entrega para:'); sai.forEach(function (e) { saida.push('- [[' + e[1] + ']] ' + e[2]); }); }
        saida.push('');
      });
    });
    d.PATHS.forEach(function (p) {
      saida.push('# Percurso: ' + p.t);
      if (p.s) saida.push(p.s);
      p.steps.forEach(function (s, i) { saida.push((i + 1) + '. [[' + s[0] + ']] ' + s[1]); });
      saida.push('');
    });
    d.SECS.forEach(function (s) {
      saida.push('# Seção ' + s.n + ': ' + s.t);
      if (s.nw) saida.push('Novo: sim');
      if (s.o) saida.push('O que é: ' + s.o);
      if (s.i) saida.push('Papel no conjunto: ' + s.i);
      if (s.ids && s.ids.length) saida.push('Pontos: ' + s.ids.map(function (id) { return '[[' + id + ']]'; }).join(' '));
      saida.push('');
    });
    return saida.join('\n').replace(/\n+$/, '\n');
  }
  return { ler: ler, escrever: escrever };
})();


// ===== Plano de Fundação do Tempo Continuum (segue o "Manifesto de Fundação") =====
var PLANO_TC = `<!--
Plano de Fundação do Tempo Continuum em Markdown. Edite e veja o mapa mudar na hora.
  # Camada: Título         uma coluna do mapa (a linha de baixo é o subtítulo)
  ## Ponto {#id}           um ponto da camada; o id é usado nas ligações [[id]]
  Seção: / Novo: sim / O que é: / Por que importa:
  Como se faz:             seguido de itens "- …"
  Entrega para:            seguido de itens "- [[id]] por quê" (as setas do mapa)
  # Percurso: Título       subtítulo na linha de baixo; passos "1. [[id]] texto"
  # Seção N: Título        Novo: / O que é: / Papel no conjunto: / Pontos: [[id]] [[id]]
-->

# Camada: Fundamentos
A rede, seus pilares e seu princípio central

## Think tank e rede livre {#rede}
Seção: 1 · Apresentação
O que é: Uma espécie de think tank: um centro de pesquisa e elaboração de ideias que estuda a realidade brasileira, produz análises e propostas e oferece base teórica e dados para o debate público e para os movimentos sociais. Ao mesmo tempo, um ecossistema de produção de conteúdo, que transforma pesquisa em documentários, vídeos curtos e longos, podcasts, livros e materiais de formação.
Por que importa: Nossa ambição é construir uma rede livre de produção de conteúdo interdisciplinar, controlada por todos os voluntários que dela participam. Pesquisadores, artistas, comunicadores, educadores e militantes de rua trabalham juntos, cada um com seu saber, num mesmo esforço.
Como se faz:
- A rede se apoia em três pilares: livre e acessível, interdisciplinar e multimodal
- Cada objetivo traz descrição, justificativa (por que fazemos) e metodologia (como poderíamos fazer)
- Documento vivo, revisado coletivamente
Entrega para:
- [[dossie]] Como centro de pesquisa, produz análises e propostas com base teórica e dados.
- [[decisao]] A rede é controlada por todos os voluntários que dela participam.

## Livre e acessível {#livre}
Seção: 1 · Pilar
O que é: Todo o conteúdo e as ferramentas são abertos e precisam chegar ao maior número de públicos possível. Qualquer pessoa pode acessar, copiar, adaptar e redistribuir o que produzimos, sem pagar e sem pedir permissão, desde que respeite a licença.
Por que importa: Informação política trancada atrás de pagamento, jargão ou formatos difíceis só alcança quem já tem acesso e formação. O conteúdo precisa ser fácil de encontrar, de entender e de compartilhar, inclusive para quem tem pouca internet, pouco tempo ou alguma deficiência.
Como se faz:
- Linguagem simples e direta e conteúdo gratuito
- Oferta em vários formatos: texto, áudio, vídeo e impresso
- Legendas e, caso possível, Libras
- Glossário: explicar termos técnicos e políticos sempre que aparecerem
- Checklist de acessibilidade: lista mínima que todo conteúdo cumpre antes de ser publicado
Entrega para:
- [[licenca]] Qualquer pessoa pode copiar, adaptar e redistribuir, desde que respeite a licença.
- [[impressos]] Oferta em vários formatos, inclusive impresso, para quem tem pouca internet.
- [[financiamento]] O conteúdo principal permanece gratuito; recompensas para apoiadores são extras.
- [[site]] Ferramentas simples e acessíveis, que funcionam em celulares simples e com pouca internet.

## Interdisciplinar {#inter}
Seção: 1 · Pilar
O que é: Nenhuma área do conhecimento explica a realidade sozinha. Por isso juntamos ciência, arte, comunicação, direito e educação no nosso meio de produção. Um dossiê pode virar documentário, livro, corte, cartilha e aula.
Por que importa: Na falta de água em um bairro, as ciências sociais mostram quem é afetado; a engenharia e as ciências ambientais, por que a água falta; a economia, quanto custa e quem paga; o direito, quem é responsável e como cobrar. E de nada adianta uma boa análise se ela não chegar às pessoas: arte, jornalismo, design e educação transformam pesquisa em algo que a população entende, sente e compartilha.
Como se faz:
- Equipes mistas desde o início de cada projeto: pesquisadores de diferentes áreas, comunicadores, artistas e educadores
- Especialistas convidados para revisar os temas fora da nossa área
- Planejar, já na pesquisa, em quais formatos o resultado vai circular
Entrega para:
- [[dossie]] Um dossiê pode virar documentário, livro, corte, cartilha e aula.
- [[documentario]] Pesquisadores, roteiristas, cinegrafistas, editores e artistas trabalham juntos desde o início.

## Multimodal {#multi}
Seção: 1 · Pilar
O que é: Estar presente em todos os espaços onde as pessoas vivem, conversam e se informam: na internet e nas ruas, nos vídeos curtos e longos, na televisão, no rádio e no podcast, na literatura, na música, na cultura popular, nas comunidades de fãs e nos espaços de lazer. A mesma ideia ganha a linguagem de cada lugar, sem perder a essência.
Por que importa: Cada pessoa se informa de um jeito e em lugares diferentes, e nenhum canal sozinho alcança toda a população. Quem fica de fora de um espaço deixa esse espaço livre para outras narrativas, muitas vezes desinformativas.
Como se faz:
- Cada pesquisa nasce pensada para virar vários produtos
- Cada formato tem uma equipe que conhece sua linguagem
- O desempenho em cada espaço é acompanhado para redirecionar esforços para onde o impacto for maior
Entrega para:
- [[dossie]] Cada pesquisa nasce pensada para virar vários produtos.
- [[redes]] Seguindo o pilar multimodal, estar em todas as redes, com conteúdo adaptado a cada uma.
- [[nichos]] Estar também nas comunidades de fãs e nos espaços de lazer.

## Mais antropofagia, menos autofagia {#antro}
Seção: 2 · Princípio central
O que é: Devorar boas ideias de qualquer lugar e transformá-las em algo nosso. O contrário disso é a autofagia: o movimento que se consome em brigas internas, testes de pureza e disputas por controle.
Por que importa: Movimentos costumam se enfraquecer mais por divisões internas do que por ataques externos. E muitas técnicas eficazes de comunicação e organização já existem; reinventar tudo do zero desperdiça tempo e energia.
Como se faz:
- Não ter medo de copiar: estudar o que funciona em outros coletivos, na mídia e até nos adversários, adaptar e dar crédito
- Divergência sem ruptura: discordâncias debatidas internamente, sem exposição pública de companheiros
- Não sufocar o movimento: grupos e pessoas têm autonomia para produzir com nosso material e nossa licença aberta
- Porta aberta: acolher quem chega com dúvidas ou visões diferentes, priorizando o que nos une
- Revisão periódica: em cada avaliação coletiva, perguntar se estamos abrindo espaço ou sufocando iniciativas
Entrega para:
- [[site]] Reaproveitar antes de criar: usar e adaptar ferramentas livres que já existem.
- [[parcerias]] Colaborar com outros coletivos e projetos, no espírito da antropofagia.
- [[decisao]] Divergência sem ruptura e decisões que não sufocam iniciativas.

# Camada: Pesquisa e arquivo
A base de tudo o que o site publica

## Site organizador de fatos políticos {#fatos}
Seção: 3.1 · Pesquisa e arquivo
O que é: Um site que funciona como organizador dos fatos políticos. Em vez de publicar notícias soltas, encaixa cada acontecimento em seu contexto: o tema a que pertence, o que veio antes, os atores envolvidos e as fontes que comprovam o fato.
Por que importa: O noticiário é rápido e fragmentado. As pessoas veem manchetes isoladas, sem entender o contexto nem acompanhar o desenrolar de um caso. Um organizador permite seguir um tema do começo ao fim, separar fato de opinião e lembrar o que realmente aconteceu.
Como se faz:
- Fatos antes de opinião: notícias curtas e objetivas, separadas das análises e colunas
- Organização por temas e casos, com linha do tempo
- Ligação com o acervo: cada notícia aponta para fichas, dossiês e linhas do tempo, com o selo de confiabilidade
- Fontes visíveis e preservadas, arquivadas no momento da publicação
- Resumos periódicos: boletins diários e semanais nas redes sociais e no WhatsApp
- Correções públicas, com data e explicação
Entrega para:
- [[site]] O organizador integra o site e acervo previstos na Tecnologia cívica.
- [[redes]] Boletins diários e semanais distribuídos nas redes sociais e no WhatsApp.
- [[casos]] Cada fato entra na página do tema ou caso a que pertence.

## Fichas de atores políticos {#atores}
Seção: 3.1 · Pesquisa e arquivo
O que é: Fichas em formato wiki, como a Wikipédia, que reúnem num só lugar quem a pessoa é, o que defende e o que de fato fez: dados biográficos, cargos, partido, votações, declarações públicas, financiamento de campanha e processos.
Por que importa: Informações sobre políticos ficam espalhadas e se perdem.
Como se faz:
- Caixa de resumo, texto em seções padronizadas e links internos entre fichas
- Referências numeradas para a fonte primária arquivada, com o selo de confiabilidade
- Histórico de edições e edição colaborativa com revisão
- Categorias por tema, partido, região, cargo e tipo de caso
- Priorização: começar pelos atores de maior impacto e ampliar aos poucos para lideranças locais
- Atualização contínua e revisão geral a cada seis meses
- Versão resumida: cartão de uma página para redes e impressos
Entrega para:
- [[fatos]] Cada notícia aponta para as fichas dos atores envolvidos.
- [[quemcobrar]] A ferramenta mostra a ficha de quem ocupa o cargo responsável.
- [[podcast]] Fichas servem de base para dar dados e fontes às conversas.
- [[bots]] Consulta rápida às fichas pelo WhatsApp e pelo Telegram.

## Fichas de casos {#casos}
Seção: 3.1 · Pesquisa e arquivo
O que é: Fichas de escândalos, obras públicas, projetos de lei, crises, decisões judiciais e outros acontecimentos que se desenrolam ao longo de meses ou anos, reunindo em um só lugar tudo o que se sabe sobre cada caso.
Por que importa: Casos políticos costumam ser noticiados em pedaços, espalhados por muitos veículos e datas, e o público perde o fio da história. A ficha permite entender o que aconteceu, quem está envolvido, em que pé está e o que ainda falta esclarecer.
Como se faz:
- Resumo, linha do tempo, atores envolvidos (com link para suas fichas), valores e situação atual
- Selo de confiabilidade de cada informação, perguntas em aberto e fontes
- Atualizada a cada novo fato, no mesmo formato wiki das fichas de atores
Entrega para:
- [[fatos]] A ficha de caso alimenta as notícias do site.
- [[atores]] Os atores envolvidos levam às suas próprias fichas.

## Catalogação de conteúdo {#catalogo}
Seção: 3.1 · Pesquisa e arquivo
O que é: Cada item recebe data, tema, atores envolvidos, tipo de mídia e fonte, com categorias e etiquetas fixas definidas num guia de catalogação.
Por que importa: Um acervo sem organização é inútil na hora de procurar algo. Catalogar torna o material encontrável.
Como se faz:
- Guia de catalogação: documento curto e público com categorias, etiquetas e regras de nomeação
- Ferramenta comum: banco de dados aberto e pesquisável (planilha no início, sistema próprio depois)
- Conexões entre itens: cada registro aponta para fichas, dossiês e conteúdos relacionados
- Tags de local, envolvidos e tema em cada matéria
Entrega para:
- [[site]] O banco de dados da catalogação é a base do site e acervo público.
- [[atores]] Cada registro aponta para as fichas relacionadas.
- [[dossie]] Cada registro aponta para os dossiês relacionados.

## Grau de confiabilidade {#confi}
Seção: 3.1 · Pesquisa e arquivo
O que é: Todo conteúdo recebe um selo visível com uma das categorias: Fato, Dado, Investigação, Suspeita ou Boato. A categoria só muda quando surgem novas provas.
Por que importa: Misturar fato comprovado com suspeita ou boato destrói a credibilidade e abre espaço para acusações de desinformação. Deixar claro o grau de certeza protege o coletivo e respeita o leitor.
Como se faz:
- Fato: comprovado por fonte primária ou registro público
- Dado: número de fonte identificada, com origem, data e metodologia
- Investigação: apuração em andamento, com indícios mas sem conclusão
- Suspeita: hipótese plausível sem provas suficientes, só com interesse público e aviso explícito
- Boato: só mencionado para ser checado ou desmentido, nunca para ser espalhado
Entrega para:
- [[fatos]] Cada notícia traz o selo de confiabilidade da informação.
- [[dossie]] No dossiê, cada afirmação é marcada como fato, dado, investigação ou suspeita.
- [[atores]] As referências numeradas das fichas trazem o selo.

## Armazenamento contra alterações {#arquivo}
Seção: 3.1 · Pesquisa e arquivo
O que é: Arquivar cada fonte no momento da coleta (Internet Archive, capturas de tela com data e hash do arquivo) e manter backups em pelo menos três locais independentes.
Por que importa: Publicações são apagadas e páginas oficiais mudam. Sem cópia preservada, o registro histórico desaparece.
Como se faz:
- Captura no momento da coleta: nenhuma fonte entra no acervo sem cópia preservada
- Prova de integridade: data, hora, endereço original e hash de cada arquivo
- Redundância geográfica: cópias em serviços diferentes e com voluntários de cidades distintas
- Formatos duráveis: PDF/A, MP4, PNG, texto puro
- Teste de recuperação dos backups
Entrega para:
- [[fatos]] Fontes primárias arquivadas no momento da publicação.
- [[atores]] Cada referência da ficha leva à fonte primária arquivada.

## Linhas do tempo de declarações {#linhas}
Seção: 3.1 · Pesquisa e arquivo
O que é: Cada ficha ganha uma linha do tempo com declarações, votações e eventos, todos datados e com fonte.
Por que importa: Mudanças de posição só ficam visíveis quando as falas são colocadas em ordem.
Como se faz:
- Comparação lado a lado quando uma fala ou voto contradiz uma posição anterior
- Contexto de cada mudança (eleição, crise, troca de partido), sem julgamento
- Formato visual: linhas do tempo interativas no site e versões em imagem e vídeo
Entrega para:
- [[atores]] Cada ficha ganha uma linha do tempo.
- [[cortes]] As linhas do tempo alimentam cortes.
- [[dossie]] As linhas do tempo alimentam dossiês.
- [[documentario]] As linhas do tempo alimentam roteiros de documentário.

## Monitoramento de leis, votações e gastos {#monitor}
Seção: 3.2 · Pesquisa e arquivo
O que é: Acompanhamento regular dos portais das casas legislativas e de transparência, com alertas sobre temas prioritários e resumos periódicos.
Por que importa: O que acontece no Legislativo e nos orçamentos afeta a vida de todos, mas recebe pouca atenção. Grande parte da população não teve acesso a formação política, o que a deixa vulnerável à desinformação. É preciso que a informação chegue de forma simples, rápida e gratuita a qualquer pessoa.
Como se faz:
- Tradução para a vida real: o que muda na vida das pessoas, sem jargão jurídico
- Resumos periódicos: o que foi votado e como cada parlamentar votou
- Gastos públicos: orçamento e emendas parlamentares
- Distribuição em todos os canais: vídeo curto, áudio, mensagem, impresso e rua
- Educação sobre o processo legislativo e os meios de participação popular
Entrega para:
- [[fatos]] O que foi votado e como cada parlamentar votou entra nos boletins do site.
- [[paineis]] Painéis e buscas públicas de votações e gastos.
- [[bots]] Alertas sobre votações importantes.

## De quem é a responsabilidade {#resp}
Seção: 3.3 · Pesquisa e arquivo
O que é: Explicar, de forma simples e repetida em todos os canais, quem responde por cada área (prefeitura, governo do estado, governo federal ou Congresso Nacional), com base no que a Constituição e as leis determinam.
Por que importa: Muita gente não sabe se um problema é do prefeito, do governador, do presidente ou do Congresso. Sem essa informação, a cobrança vai para o lugar errado, e quem tem a responsabilidade escapa dela.
Como se faz:
- Mapa de responsabilidades com as principais áreas e seus responsáveis
- Responsabilidades compartilhadas explicadas sem simplificar demais
- Do problema ao responsável: partir de situações do dia a dia
- Todos os formatos: cortes, cartões, memes, podcast, cartazes, cartilhas e banquinhas de rua
- Canais de cobrança: ouvidorias, gabinetes, câmaras, assembleias, audiências e Lei de Acesso à Informação
Entrega para:
- [[quemcobrar]] A ferramenta Quem cobrar põe o mapa de responsabilidades nas mãos de qualquer pessoa.
- [[atores]] Cada problema aponta para a ficha do responsável atual.
- [[ruas]] Cartilhas para os atos e conversas nas banquinhas de rua.
- [[impressos]] Cartazes impressos sobre quem responde por cada área.

## Lista Suja do Trabalho Escravo {#listasuja}
Seção: 3.4 · Pesquisa e arquivo
O que é: Ajudar a divulgar o Cadastro de Empregadores que tenham submetido trabalhadores a condições análogas à escravidão, publicado pelo Ministério do Trabalho e Emprego, atualizado em abril e em outubro.
Por que importa: O trabalho análogo à escravidão ainda existe no Brasil, mas a lista oficial tem pouca repercussão e é difícil de consultar. Divulgá-la permite que consumidores, trabalhadores, empresas, bancos e o poder público saibam quem foi flagrado e evitem financiar esse tipo de exploração.
Como se faz:
- Acompanhamento das atualizações, organizadas por estado, município, setor e trabalhadores resgatados
- Ligação com a política: cruzar com doações de campanha e contratos públicos, sempre com fonte
- Informação precisa e responsável: dados oficiais fiéis, com data e link, e explicação das regras do cadastro
- Orientação ao público sobre como denunciar pelos canais oficiais, como o Sistema Ipê
Entrega para:
- [[atores]] Cruzamento com doações de campanha e relações com atores políticos.
- [[subdominios]] Empregadores com tags de local e setor aparecem nos subdomínios estaduais.
- [[cortes]] Cortes, cartões e boletins sobre quem entrou ou saiu da lista.
- [[nichos]] Na moda, debates sobre o trabalho na indústria têxtil, incluindo os casos da Lista Suja.

# Camada: Produção e redes
A pesquisa vira conteúdo e ocupa cada espaço

## Dossiês {#dossie}
Seção: 4.1 · Produção de conteúdo
O que é: A pesquisa de base de cada tema, feita com rigor científico e escrita para ser entendida por qualquer pessoa. Parte de uma pergunta clara, usa fontes primárias e dados verificáveis e indica o grau de confiabilidade de cada informação. É a fundação de todo o trabalho autoral feito depois.
Por que importa: Um dossiê aprofundado vira referência para jornalistas, estudantes e militantes. Reúne em um só lugar o que se sabe sobre um tema, com provas e fontes, e dá segurança ao coletivo: todo conteúdo derivado nasce de uma base já verificada.
Como se faz:
- Escolha dos temas definida coletivamente
- Estrutura padrão: resumo executivo, contexto, linha do tempo, dados, atores, conclusões e fontes
- Confiabilidade de cada afirmação marcada
- Versões em camadas: dossiê completo e resumo de uma página
- Revisão por pelo menos duas pessoas e atualização com histórico de mudanças
Entrega para:
- [[documentario]] Cada documentário parte de um dossiê já pesquisado.
- [[podcast]] Os dossiês dão dados e fontes às conversas.
- [[ruas]] A partir dos dossiês, cartilhas curtas sobre o tema de cada ato.
- [[site]] O acervo público reúne os dossiês.

## Documentários em longa-metragem {#documentario}
Seção: 4.2 · Produção de conteúdo
O que é: Cada documentário parte de um dossiê já pesquisado, segue roteiro revisado por checagem e é publicado gratuitamente.
Por que importa: Temas complexos precisam de tempo e narrativa. O vídeo une imagem, som e emoção, mostra os fatos em vez de só descrevê-los e alcança quem tem pouco tempo ou pouco hábito de leitura.
Como se faz:
- Etapas: pesquisa, roteiro, checagem, gravação, edição, nova checagem e lançamento
- Equipes interdisciplinares desde o início
- Produção colaborativa: imagens captadas por voluntários de diferentes regiões
- Circulação ampla: plataformas de vídeo longo, festivais e exibições comunitárias
Entrega para:
- [[cortes]] Cada documentário gera cortes.
- [[podcast]] Cada documentário gera episódios de podcast.
- [[formacao]] Cada documentário gera material de formação e sessões de cine-debate.

## Podcasts e programas em áudio {#podcast}
Seção: 4.3 · Produção de conteúdo
O que é: Episódios regulares de debate sobre assuntos gerais e da atualidade, em formato de conversa, com convidados de diferentes áreas e pontos de vista.
Por que importa: O áudio acompanha as pessoas no trânsito e no trabalho, alcançando quem não tem tempo para ler. A conversa permite tratar política, economia, cultura, história, ciência e o cotidiano com calma e profundidade.
Como se faz:
- Formatos: mesas de debate, entrevistas e comentário da semana
- Produção simples no começo, melhorando conforme o projeto cresce
- Distribuição: plataformas de podcast, rádios comunitárias e trechos em vídeo
- Vozes diversas de diferentes regiões, áreas e movimentos
Entrega para:
- [[redes]] Episódios no Spotify e nas plataformas de podcast; trechos em vídeo para as redes.

## Cortes para redes sociais {#cortes}
Seção: 4.4 · Produção de conteúdo
O que é: Vídeos de até 90 segundos, com legenda, data e fonte na tela e link para o material completo. Nada é editado de modo a distorcer o contexto da fala original.
Por que importa: A maior parte das pessoas se informa por vídeos curtos. Cortes levam o acervo até onde o público já está.
Como se faz:
- Gancho nos primeiros segundos
- Identidade visual comum
- O mesmo corte adaptado ao formato de cada rede de vídeos curtos
- Resposta rápida, sem abrir mão da checagem
Entrega para:
- [[redes]] Publicação em várias plataformas de vídeos curtos.
- [[banco]] Banco de cortes aberto para qualquer voluntário ou parceiro publicar.

## Materiais impressos {#impressos}
Seção: 4.5 · Produção de conteúdo
O que é: Panfletos, zines, lambe-lambes e cartazes com linguagem direta e QR code para o conteúdo completo.
Por que importa: Nem todos estão nas redes, e o impresso circula de mão em mão nas ruas.
Como se faz:
- Linguagem visual forte: pouco texto e uma mensagem central por peça
- Impressão barata: folha comum, preto e branco
- Pontos de distribuição: feiras, escolas, pontos de ônibus, comércios parceiros e atos
Entrega para:
- [[banco]] Modelos prontos para download, que qualquer pessoa pode imprimir.
- [[ruas]] Impressos distribuídos nos atos de rua.

## Ocupação das redes sociais {#redes}
Seção: 5 · Redes sociais
O que é: Presença em WhatsApp, YouTube, Instagram, TikTok, Facebook, Reddit, X, Kwai, Discord, Threads, Bluesky, Twitch e plataformas de podcast, cada uma com equipe ou responsável, linha editorial própria e metas de publicação.
Por que importa: Cada rede reúne um público diferente, com hábitos, idades e linguagens próprias. Seguindo o pilar multimodal, precisamos estar presentes em todas elas.
Como se faz:
- Mesma base, linguagens diferentes: toda publicação vem do acervo checado
- Disciplina de engajamento: não alimentar provocações nem dar alcance à oposição
- Independência das plataformas: todo material também fica no acervo próprio
- Medição contínua e redistribuição de esforços
Entrega para:
- [[site]] Todo material também fica guardado no acervo próprio, para o caso de banimentos.

## Atuação por nichos e comunidades {#nichos}
Seção: 5.3 · Redes sociais
O que é: Estar presente nas comunidades onde as pessoas se reúnem por gostos, identidades e interesses: música e fandoms, cultura geek, estética e estilo de vida, identidade e comunidades, tecnologia e criação.
Por que importa: Muita gente não procura conteúdo político, mas passa horas em comunidades de música, games, animes, moda ou fé. Nesses espaços a confiança é alta. Ignorá-los os deixa abertos a discursos de ódio e desinformação.
Como se faz:
- Voluntários que já fazem parte de cada nicho e conhecem sua linguagem
- Conteúdo a partir dos interesses da comunidade, nunca forçado, respeitando as regras de cada espaço
- Com os grupos de identidade, trabalho feito junto com quem faz parte deles
Entrega para:
- [[impressos]] Artistas produzem artes, figurinhas, cartazes e animações.
- [[site]] Quem programa é convidado a colaborar nos projetos de tecnologia cívica.

# Camada: Tecnologia cívica
Ferramentas para encontrar, entender e agir

## Site e acervo público {#site}
Seção: 6.1 · Tecnologia cívica
O que é: O centro de toda a produção, reunindo fichas, dossiês, linhas do tempo, vídeos e materiais de formação, com busca simples, filtros por tema e selo de confiabilidade em cada conteúdo. É a versão pública do banco de dados da catalogação.
Por que importa: Informação só vira participação quando as pessoas têm ferramentas simples para encontrá-la, entendê-la e agir. Ferramentas próprias reduzem a dependência das grandes plataformas.
Como se faz:
- Software livre e código aberto
- Privacidade desde o início e respeito à LGPD
- Simplicidade e acessibilidade: funcionar em celulares simples e com pouca internet
- Dados abertos oficiais como base, sempre com link para a origem
- Hospedagem e cópias que não dependam de uma só empresa
Entrega para:
- [[subdominios]] Os subdomínios usam o mesmo acervo e as mesmas tags de local.
- [[bots]] Bots oferecem consulta rápida ao acervo.

## Subdomínios estaduais {#subdominios}
Seção: 6.1 · Tecnologia cívica
O que é: Uma versão do site para cada um dos 26 estados e o Distrito Federal, mostrando apenas os políticos, casos e notícias daquele estado e de seus municípios.
Por que importa: O morador encontra rapidamente o que afeta sua realidade, e os núcleos locais ganham um canal próprio para divulgar seu trabalho, sem trabalho duplicado.
Como se faz:
- Mesmo acervo e mesmas tags de local: cada conteúdo aparece automaticamente no estado certo
- Destaques escolhidos pelo núcleo local de cada estado

## Quem cobrar {#quemcobrar}
Seção: 6.1 · Tecnologia cívica
O que é: A pessoa descreve um problema do dia a dia e a ferramenta mostra qual esfera é responsável, quem ocupa o cargo hoje, a ficha dessa pessoa e os canais para cobrar.
Por que importa: Saber quem cobrar é o primeiro passo para que a população participe de verdade.
Como se faz:
- Partir de situações reais ("o posto de saúde está sem médico", "a rua está sem iluminação")
- Indicar os canais de cobrança de cada esfera
Entrega para:
- [[subdominios]] Cada versão estadual pode ter o Quem cobrar com os responsáveis locais.

## Painéis de votações e gastos {#paineis}
Seção: 6.1 · Tecnologia cívica
O que é: Consultas públicas sobre como cada parlamentar votou, como o orçamento está sendo gasto e para onde vão as emendas, a partir dos dados abertos oficiais.
Por que importa: Qualquer pessoa pode consultar votações e gastos do seu representante.
Como se faz:
- Dados abertos oficiais das casas legislativas e dos portais de transparência
Entrega para:
- [[subdominios]] Cada versão estadual pode ter um painel da assembleia legislativa e das câmaras municipais.

## Bots no WhatsApp e no Telegram {#bots}
Seção: 6.1 · Tecnologia cívica
O que é: Envio de resumos semanais, consulta rápida às fichas, verificação de boatos e alertas sobre votações importantes.
Por que importa: Levam o acervo para os aplicativos de mensagem que as pessoas já usam.
Como se faz:
- Resumos semanais
- Consulta às fichas
- Verificação de boatos: a pessoa encaminha uma mensagem e recebe a checagem, quando existir
- Alertas de votações

## Organização de voluntários e atos {#voluntarios}
Seção: 6.1 · Tecnologia cívica
O que é: Sistema para cadastro de voluntários por área e disponibilidade, divisão de tarefas, agenda de atividades e escalas de rua.
Por que importa: Organiza o trabalho de quem participa da rede.
Como se faz:
- Cadastro por área e disponibilidade
- Divisão de tarefas e agenda de atividades
- Escalas de rua
Entrega para:
- [[ruas]] Escalas de rua para os atos.

## Plataforma de decisão coletiva {#decisao}
Seção: 6.1 · Tecnologia cívica
O que é: Ferramenta para propostas, debates e votações internas, dando forma prática às decisões coletivas dos voluntários.
Por que importa: A rede é controlada por todos os voluntários que dela participam.
Como se faz:
- Propostas, debates e votações internas
Entrega para:
- [[financiamento]] Prioridades de uso do dinheiro definidas pelos voluntários.
- [[crise]] O comitê de crise é um grupo pequeno e eleito.

## Ambiente de formação {#ambiente}
Seção: 6.1 · Tecnologia cívica
O que é: Cursos organizados por trilhas e níveis, com vídeos, textos, exercícios e acompanhamento do progresso.
Por que importa: Dá estrutura às trilhas de formação gratuitas.
Como se faz:
- Trilhas e níveis
- Vídeos, textos e exercícios
- Acompanhamento do progresso
Entrega para:
- [[formacao]] As trilhas de formação ficam organizadas no ambiente.

## Banco de materiais para download {#banco}
Seção: 6.1 · Tecnologia cívica
O que é: Cortes, figurinhas, cartões, cartazes e impressos prontos para qualquer pessoa usar e compartilhar.
Por que importa: Multiplica o alcance sem depender de uma equipe central.
Como se faz:
- Materiais prontos para usar e compartilhar
Entrega para:
- [[redes]] Qualquer pessoa usa e compartilha os materiais nas suas redes.

# Camada: Rua, formação e proteção
Gente preparada, protegida e com recursos

## Ação nas ruas {#ruas}
Seção: 7 · Ação nas ruas
O que é: A partir dos dossiês e do acervo, preparar cartilhas curtas sobre o tema de cada ato, com dados verificados, argumentos centrais e respostas às críticas mais comuns, entregues com antecedência a organizadores e participantes.
Por que importa: Manifestações ganham força quando os participantes entendem e sabem explicar suas pautas. Atos sem base clara ficam vulneráveis a narrativas que reduzem a pauta a confusão ou desordem.
Como se faz:
- Materiais por formato: cartilha impressa, versão digital, vídeo curto, cartões e palavras de ordem com base em dados
- Rodas de preparação antes do ato
- Porta-vozes preparados para a imprensa e as redes
- Apoio a outros movimentos com pesquisa e material
- Registro dos atos em foto e vídeo
- Balanço depois do ato
Entrega para:
- [[site]] O registro dos atos alimenta o acervo e protege contra versões distorcidas.

## Inteligência e planejamento dos atos {#intel}
Seção: 7 · Ação nas ruas
O que é: Um núcleo que estuda e planeja cada ato antes que ele aconteça: avalia riscos, escolhe locais, dias e horários, organiza a logística e prepara os participantes para agir com segurança, inclusive diante de truculência.
Por que importa: Atos mal planejados expõem os participantes a riscos desnecessários e ficam vulneráveis a provocações e à repressão. Com preparação, o ato alcança mais gente e protege quem está nele.
Como se faz:
- Análise de risco e plano de segurança proporcional
- Escolha do local, do dia e do horário
- Aviso prévio à autoridade e caráter pacífico explícito
- Logística, comunicação segura e equipes de cuidado
- Como agir diante de truculência e registro de abusos
- Denúncia e responsabilização depois do ato
- Afastamento de provocadores e infiltrados
Entrega para:
- [[ruas]] O planejamento diz onde, quando e com que segurança o ato acontece.

## Formação {#formacao}
Seção: 8.1 · Formação
O que é: Trilhas com aulas curtas gravadas, encontros ao vivo, materiais de leitura e exercícios práticos, todos gratuitos: ciências, debate, oratória, divulgação digital, disciplina de engajamento, leitura crítica de mídia, história, economia e direito, segurança em atos e formação de multiplicadores.
Por que importa: Um movimento só cresce de forma consistente quando seus membros sabem pesquisar, argumentar e comunicar. A formação transforma apoiadores em multiplicadores.
Como se faz:
- Ciências: método científico, leitura de pesquisas e estatística básica
- Debate e oratória, com treinos práticos
- Divulgação digital e disciplina de engajamento
- Leitura crítica de mídia
- História, economia e direito básico
- Segurança em atos de rua
- Formação de multiplicadores com técnicas de educação popular
Entrega para:
- [[dossie]] Estudos científicos e relatórios oficiais são a matéria-prima dos dossiês.
- [[redes]] A divulgação digital segue as orientações da Ocupação das redes sociais.
- [[ruas]] Oratória, debate e segurança em atos preparam quem vai às ruas.

## Cibersegurança pessoal {#ciber}
Seção: 8.2 · Formação
O que é: Formação completa e acessível em segurança digital: análise de risco, contas e senhas, e-mail privado, comunicação segura, celular e computador, navegação, engenharia social, doxxing, segurança em atos e resposta a incidentes.
Por que importa: Quem expõe atores políticos pode virar alvo de vigilância, invasão de contas, vazamento de dados e perseguição. Um único membro desprotegido pode comprometer todo o coletivo.
Como se faz:
- Gerenciadores de senhas e dois fatores por aplicativo ou chave física
- Proton Mail e Tuta; Signal, Matrix/Element e Briar
- Criptografia do aparelho e backups criptografados
- Proteção contra doxxing e cuidados com fotos
- Atualização constante do conteúdo
Entrega para:
- [[seguranca]] Todo voluntário passa pela formação em cibersegurança ao entrar.
- [[intel]] Segurança digital no ato: proteger o celular e evitar expor o rosto de outros manifestantes.

## Marxismo e suas vertentes {#marxismo}
Seção: 8.3 · Formação
O que é: Estudo a partir dos textos originais e de comentadores: fundamentos, leninismo, trotskismo, marxismo-leninismo, maoísmo, Gramsci, Escola de Frankfurt, marxismo latino-americano, marxismo no Brasil, debates e críticas.
Por que importa: Conhecer as diferentes vertentes, seus debates internos e as críticas que recebem permite entender a história, analisar a realidade com mais profundidade e participar de debates com seriedade, evitando caricaturas.
Como se faz:
- Grupos de estudo com leitura guiada
- Aulas em vídeo e podcast e apostilas em linguagem simples
- Cada vertente no seu contexto histórico, com autores, divergências e críticas
- Trilhas por nível, da introdução à leitura de O Capital
Entrega para:
- [[ambiente]] Trilhas por nível no ambiente de formação.
- [[podcast]] Aulas em vídeo e podcast.

## Segurança digital dos membros {#seguranca}
Seção: 9.1 · Proteção
O que é: Autenticação em dois fatores, gerenciador de senhas, comunicação interna criptografada e cuidado com dados pessoais expostos na internet.
Por que importa: Quem expõe atores políticos pode virar alvo de ataques, vazamento de dados pessoais e perseguição.
Como se faz:
- Treinamento obrigatório ao entrar
- Níveis de acesso: só os sistemas necessários para cada função
- Proteção de identidade: pseudônimo nas áreas mais expostas
- Protocolo de incidentes
Entrega para:
- [[crise]] O protocolo de incidentes dá os passos em caso de invasão, vazamento ou ameaça.

## Apoio jurídico {#juridico}
Seção: 9.2 · Proteção
O que é: Rede de advogados parceiros para revisar materiais sensíveis e acompanhar atos, além de orientação aos membros sobre seus direitos.
Por que importa: Publicações e atos podem gerar processos e abordagens policiais.
Como se faz:
- Revisão de conteúdos sensíveis antes de publicar
- Plantão em atos
- Cartilha de direitos
Entrega para:
- [[dossie]] Dossiês que citam pessoas passam por análise jurídica antes de publicados.
- [[ruas]] Advogados de prontidão durante as manifestações.

## Plano de resposta rápida {#crise}
Seção: 9.3 · Proteção
O que é: Protocolo com responsáveis definidos, canais de decisão e modelos de resposta prontos para ataques coordenados e crises de imagem.
Por que importa: Ataques coordenados e crises de imagem exigem reação organizada, não improvisada.
Como se faz:
- Monitoramento de menções ao coletivo
- Comitê de crise pequeno e eleito
- Resposta com fatos, fontes e transparência, sem provocações
- Avaliação posterior de cada crise

## Parcerias {#parcerias}
Seção: 9.4 · Proteção
O que é: Acordos com coletivos, universidades e imprensa independente para pesquisa, divulgação e uso compartilhado do acervo.
Por que importa: Colaborar amplia alcance e qualidade sem duplicar esforços.
Como se faz:
- Critérios claros: checagem, acesso aberto e independência
- Acordos por escrito
- Troca de saberes: oficinas e intercâmbio de voluntários
- Rede ampliada: escolas, rádios comunitárias, cineclubes, sindicatos e associações de bairro
Entrega para:
- [[juridico]] Acordos com escritórios populares, núcleos de prática jurídica e defensorias.
- [[podcast]] Rádios comunitárias na rede ampliada.
- [[documentario]] Cineclubes para exibições comunitárias.

## Financiamento {#financiamento}
Seção: 10.1 · Financiamento
O que é: Ponto em aberto: o modelo ainda precisa ser bastante estudado. Hipóteses: apoio direto do público, venda de produtos e serviços, receitas das plataformas, eventos e cultura, editais e instituições, formas coletivas e solidárias.
Por que importa: Sem recursos o trabalho não se sustenta, mas informação política trancada atrás de pagamento só alcança quem já pode pagar. Queremos sustentabilidade e alcance.
Como se faz:
- Diversificação das fontes
- Contribuição acessível, com valores baixos
- Limites de independência: recusar recursos com condições ou de quem é alvo das pesquisas
- Decisão coletiva sobre gastos
- Reserva de segurança
Entrega para:
- [[documentario]] Campanhas pontuais para projetos específicos, como um documentário.
- [[juridico]] Fundo de reserva para períodos difíceis e emergências jurídicas.

## Licença aberta {#licenca}
Seção: 10.2 · Acesso aberto
O que é: Publicar sob licença Creative Commons (por exemplo, CC BY-NC-SA), exigindo crédito, proibindo o uso comercial sem autorização e determinando que obras derivadas sigam a mesma licença.
Por que importa: Uma licença aberta permite que outras pessoas compartilhem e reutilizem o material sem medo, multiplicando o alcance.
Como se faz:
- Aviso em todo material
- Arquivos-fonte disponíveis: roteiros, imagens e dados brutos
- Guia de uso simples
Entrega para:
- [[banco]] Arquivos-fonte disponíveis para facilitar a reutilização.
- [[antro]] Grupos e pessoas têm autonomia para produzir com nosso material e nossa licença aberta.

# Percurso: Do fato ao acervo
Como um acontecimento entra no site com contexto, fonte e selo.
1. [[arquivo]] A fonte é arquivada no momento da coleta, com data, hora e hash.
2. [[confi]] A informação recebe seu selo: fato, dado, investigação, suspeita ou boato.
3. [[fatos]] O site publica a notícia curta e objetiva, separada de opinião, no contexto do tema.
4. [[casos]] A ficha do caso é atualizada com o novo fato e a linha do tempo.
5. [[atores]] A notícia aponta para as fichas dos atores envolvidos.
6. [[site]] Tudo fica no site e acervo público, com busca e filtros.
7. [[redes]] Os boletins diários e semanais circulam nas redes sociais e no WhatsApp.

# Percurso: Da pesquisa a todos os formatos
Como um dossiê vira documentário, podcast, corte, impresso e cartilha.
1. [[dossie]] O dossiê reúne, com rigor científico e linguagem simples, o que se sabe sobre um tema.
2. [[documentario]] O documentário parte do dossiê, com roteiro checado antes e depois da edição.
3. [[podcast]] O documentário gera episódios de podcast.
4. [[cortes]] O documentário gera cortes de até 90 segundos, com fonte na tela.
5. [[redes]] Os cortes são adaptados ao formato de cada rede.
6. [[banco]] Os cortes ficam no banco aberto, para qualquer voluntário ou parceiro publicar.

# Percurso: Do problema a quem cobrar
Como uma queixa do dia a dia chega ao responsável certo.
1. [[resp]] O mapa de responsabilidades mostra quem responde por cada área.
2. [[quemcobrar]] A pessoa descreve o problema e a ferramenta mostra a esfera responsável.
3. [[atores]] A ficha de quem ocupa o cargo mostra promessas, votações e ações.
4. [[subdominios]] No subdomínio do estado aparecem os responsáveis locais.
5. [[ruas]] O tema vira cartilha e conversa nas banquinhas de rua.

# Percurso: Do ato ao acervo
Como um ato é planejado, protegido e registrado.
1. [[intel]] O núcleo de inteligência avalia o risco e escolhe local, dia e horário.
2. [[ciber]] Os participantes aplicam os cuidados de segurança digital no ato.
3. [[ruas]] Cartilhas, rodas de preparação e porta-vozes preparam o ato.
4. [[juridico]] Advogados ficam de plantão durante a manifestação.
5. [[site]] O registro do ato alimenta o acervo e protege contra versões distorcidas.

# Seção 1: Apresentação
O que é: A rede livre e interdisciplinar e seus pilares: livre e acessível, interdisciplinar e multimodal.
Papel no conjunto: Um think tank e um ecossistema de produção de conteúdo, controlado por todos os voluntários.
Pontos: [[rede]] [[livre]] [[inter]] [[multi]]

# Seção 2: Mais antropofagia, menos autofagia
O que é: O princípio central do coletivo: devorar boas ideias e evitar brigas internas, testes de pureza e disputas por controle.
Papel no conjunto: Movimentos se enfraquecem mais por divisões internas do que por ataques externos.
Pontos: [[antro]]

# Seção 3: Pesquisa e arquivo
O que é: Site organizador de fatos, fichas de atores e de casos, catalogação, confiabilidade, armazenamento, linhas do tempo, monitoramento, responsabilidades e Lista Suja.
Papel no conjunto: A base de tudo o que o site publica.
Pontos: [[fatos]] [[atores]] [[casos]] [[catalogo]] [[confi]] [[arquivo]] [[linhas]] [[monitor]] [[resp]] [[listasuja]]

# Seção 4: Produção de conteúdo
O que é: Dossiês, documentários em longa-metragem, podcasts, cortes para redes e materiais impressos.
Papel no conjunto: Cada pesquisa, em geral um dossiê, nasce pensada para circular em vários formatos.
Pontos: [[dossie]] [[documentario]] [[podcast]] [[cortes]] [[impressos]]

# Seção 5: Ocupação das redes sociais
O que é: Como atuar em cada rede, princípios comuns e atuação por nichos.
Papel no conjunto: Cada rede reúne um público diferente; precisamos estar em todas, com conteúdo adaptado.
Pontos: [[redes]] [[nichos]]

# Seção 6: Tecnologia cívica
O que é: Site, ferramentas, bots e sistemas para facilitar a cidadania e a organização.
Papel no conjunto: Informação só vira participação quando as pessoas têm ferramentas simples para encontrá-la, entendê-la e agir.
Pontos: [[site]] [[subdominios]] [[quemcobrar]] [[paineis]] [[bots]] [[voluntarios]] [[decisao]] [[ambiente]] [[banco]]

# Seção 7: Ação nas ruas
O que é: Suporte teórico para atos e inteligência e planejamento dos atos.
Papel no conjunto: Manifestações ganham força quando os participantes entendem e sabem explicar suas pautas.
Pontos: [[ruas]] [[intel]]

# Seção 8: Formação
O que é: Áreas de formação, cibersegurança pessoal e marxismo e suas vertentes.
Papel no conjunto: A formação transforma apoiadores em multiplicadores.
Pontos: [[formacao]] [[ciber]] [[marxismo]]

# Seção 9: Credibilidade, proteção e organização
O que é: Segurança digital dos membros, apoio jurídico, plano de resposta rápida e parcerias.
Papel no conjunto: Protege quem participa e amplia o alcance sem duplicar esforços.
Pontos: [[seguranca]] [[juridico]] [[crise]] [[parcerias]]

# Seção 10: Financiamento e acesso aberto
O que é: Meios de financiamento, ainda em estudo, e licença aberta do conteúdo.
Papel no conjunto: Sustentabilidade e alcance ao mesmo tempo.
Pontos: [[financiamento]] [[licenca]]
`;


// ===== Texto limpo em .docx (Word, LibreOffice, Google Docs), montado no navegador =====
var PlanoDocx = (function () {
  function slug(t) { return String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function x(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // Texto com **negrito** e *itálico* em trechos (runs) do Word; [[id]] vira o nome do ponto
  function runs(t, base, BY) {
    t = String(t || '').replace(/\[\[([^\]]+)\]\]/g, function (m, id) { return BY && BY[id] ? BY[id].t : id; });
    var saida = '', re = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g, i = 0, m;
    function run(txt, b, it) {
      if (!txt) return;
      var pr = (b || base === 'b' ? '<w:b/>' : '') + (it || base === 'i' ? '<w:i/>' : '');
      saida += '<w:r>' + (pr ? '<w:rPr>' + pr + '</w:rPr>' : '') + '<w:t xml:space="preserve">' + x(txt) + '</w:t></w:r>';
    }
    while ((m = re.exec(t))) { run(t.slice(i, m.index)); if (m[2]) run(m[2], true); else run(m[3], false, true); i = re.lastIndex; }
    run(t.slice(i));
    return saida;
  }
  function par(conteudo, estilo, extra) {
    return '<w:p>' + (estilo || extra ? '<w:pPr>' + (estilo ? '<w:pStyle w:val="' + estilo + '"/>' : '') + (extra || '') + '</w:pPr>' : '') + conteudo + '</w:p>';
  }
  function rotulo(r, texto, BY) { return par('<w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">' + x(r) + ' </w:t></w:r>' + runs(texto, '', BY)); }
  function item(conteudo) { return par(conteudo, 'Item', '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>'); }

  function documento(info, d) {
    var BY = d.BY, b = [];
    var nome = function (id) { return BY[id] ? BY[id].t : id; };
    b.push(par(runs('Mapas do Movimento'), 'Sobretitulo'));
    b.push(par(runs(info.nome), 'Title'));
    info.intro.forEach(function (p) { b.push(par(runs(p.t), p.lema ? 'Lema' : null)); });
    var total = d.N.length, novos = d.N.filter(function (n) { return n.nw; }).length;
    b.push(par(runs(d.COLS.length + ' camadas, ' + total + ' pontos, ' + d.E.length + ' ligações, ' + d.PATHS.length + ' percursos e ' + d.SECS.length + ' seções.'), 'Nota'));

    b.push(par(runs(info.mapaTitulo), 'Heading1'));
    d.COLS.forEach(function (c, ci) {
      b.push(par(runs('Camada ' + (ci + 1) + ': ' + c.t), 'Heading2'));
      if (c.s) b.push(par(runs(c.s, 'i')));
      d.N.filter(function (n) { return n.col === ci; }).forEach(function (n) {
        b.push(par(runs(n.t + (n.nw ? ' (novo)' : '')), 'Heading3'));
        if (n.sec) b.push(par(runs('Seção ' + n.sec), 'Nota'));
        if (n.o) b.push(rotulo('O que é:', n.o, BY));
        if (n.p) b.push(rotulo('Por que importa:', n.p, BY));
        if (n.c && n.c.length) { b.push(rotulo('Como se faz:', '', BY)); n.c.forEach(function (t) { b.push(item(runs(t, '', BY))); }); }
        var sai = d.E.filter(function (e) { return e[0] === n.id; }), chega = d.E.filter(function (e) { return e[1] === n.id; });
        if (sai.length) { b.push(rotulo('Entrega para:', '', BY)); sai.forEach(function (e) { b.push(item(runs('**' + nome(e[1]) + '**' + (e[2] ? ': ' + e[2] : ''), '', BY))); }); }
        if (chega.length) { b.push(rotulo('Recebe de:', '', BY)); chega.forEach(function (e) { b.push(item(runs('**' + nome(e[0]) + '**' + (e[2] ? ': ' + e[2] : ''), '', BY))); }); }
      });
    });

    if (d.PATHS.length) {
      b.push(par(runs('Percursos'), 'Heading1'));
      d.PATHS.forEach(function (p) {
        b.push(par(runs(p.t), 'Heading2'));
        if (p.s) b.push(par(runs(p.s, 'i', BY)));
        p.steps.forEach(function (st, i) {
          b.push(par(runs((i + 1) + '. **' + nome(st[0]) + '**: ' + st[1], '', BY), 'Passo'));
        });
      });
    }
    if (d.SECS.length) {
      b.push(par(runs('As seções'), 'Heading1'));
      d.SECS.forEach(function (s) {
        b.push(par(runs(s.n + '. ' + s.t + (s.nw ? ' (nova)' : '')), 'Heading2'));
        if (s.o) b.push(rotulo('O que é:', s.o, BY));
        if (s.i) b.push(rotulo('Papel no conjunto:', s.i, BY));
        if (s.ids && s.ids.length) b.push(rotulo('Pontos:', s.ids.map(nome).join(', '), BY));
      });
    }
    return b.join('');
  }

  var W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
  function estilo(id, nome, ppr, rpr, extra) {
    return '<w:style w:type="paragraph" w:styleId="' + id + '"><w:name w:val="' + nome + '"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/>' + (extra || '') +
      '<w:pPr>' + ppr + '</w:pPr><w:rPr>' + rpr + '</w:rPr></w:style>';
  }
  var ESTILOS = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles ' + W + '>' +
    '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Montserrat" w:hAnsi="Montserrat" w:cs="Arial"/><w:sz w:val="22"/><w:lang w:val="pt-BR"/></w:rPr></w:rPrDefault>' +
    '<w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>' +
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>' +
    estilo('Title', 'Title', '<w:spacing w:after="240"/>', '<w:sz w:val="56"/><w:color w:val="101010"/>', '<w:qFormat/>') +
    estilo('Sobretitulo', 'Sobretítulo', '<w:spacing w:after="60"/>', '<w:caps/><w:spacing w:val="20"/><w:sz w:val="18"/><w:color w:val="556A2F"/>') +
    estilo('Lema', 'Lema', '<w:spacing w:after="200"/>', '<w:sz w:val="30"/><w:color w:val="556A2F"/>') +
    estilo('Nota', 'Nota', '<w:spacing w:after="80"/>', '<w:sz w:val="18"/><w:color w:val="5A584C"/>') +
    estilo('Heading1', 'heading 1', '<w:keepNext/><w:pageBreakBefore/><w:spacing w:before="0" w:after="240"/><w:outlineLvl w:val="0"/>', '<w:sz w:val="40"/><w:color w:val="556A2F"/>', '<w:qFormat/>') +
    estilo('Heading2', 'heading 2', '<w:keepNext/><w:spacing w:before="360" w:after="120"/><w:pBdr><w:top w:val="single" w:sz="12" w:space="6" w:color="101010"/></w:pBdr><w:outlineLvl w:val="1"/>', '<w:sz w:val="30"/>', '<w:qFormat/>') +
    estilo('Heading3', 'heading 3', '<w:keepNext/><w:spacing w:before="280" w:after="60"/><w:outlineLvl w:val="2"/>', '<w:b/><w:sz w:val="24"/>', '<w:qFormat/>') +
    estilo('Item', 'Item de lista', '<w:spacing w:after="60"/><w:ind w:left="567" w:hanging="283"/>', '') +
    estilo('Passo', 'Passo', '<w:spacing w:after="100"/><w:ind w:left="454" w:hanging="454"/>', '') +
    '</w:styles>';
  var NUMERACAO = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering ' + W + '>' +
    '<w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/>' +
    '<w:pPr><w:ind w:left="567" w:hanging="283"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>';

  function arquivos(corpo, titulo) {
    var agora = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
    return [
      ['[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
        '<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>' +
        '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>'],
      ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>'],
      ['docProps/core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dc:title>' + x(titulo) + '</dc:title><dc:creator>Tempo Continuum</dc:creator><dc:language>pt-BR</dc:language>' +
        '<dcterms:created xsi:type="dcterms:W3CDTF">' + agora + '</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">' + agora + '</dcterms:modified></cp:coreProperties>'],
      ['word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>'],
      ['word/styles.xml', ESTILOS],
      ['word/numbering.xml', NUMERACAO],
      ['word/document.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ' + W + '><w:body>' + corpo +
        '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr></w:body></w:document>']
    ];
  }

  // ---- Zip sem compressão (o formato do .docx), com CRC-32
  var TAB = (function () { var t = [], c, n, k; for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(b) { var c = 0xFFFFFFFF; for (var i = 0; i < b.length; i++) c = TAB[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function zip(lista) {
    var enc = new TextEncoder(), partes = [], central = [], pos = 0;
    var d = new Date(), hora = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), dia = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    function cab(n) { return new DataView(new ArrayBuffer(n)); }
    lista.forEach(function (a) {
      var nome = enc.encode(a[0]), dados = enc.encode(a[1]), crc = crc32(dados);
      var h = cab(30);
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
      h.setUint16(10, hora, true); h.setUint16(12, dia, true); h.setUint32(14, crc, true);
      h.setUint32(18, dados.length, true); h.setUint32(22, dados.length, true); h.setUint16(26, nome.length, true); h.setUint16(28, 0, true);
      var c = cab(46);
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
      c.setUint16(12, hora, true); c.setUint16(14, dia, true); c.setUint32(16, crc, true); c.setUint32(20, dados.length, true); c.setUint32(24, dados.length, true);
      c.setUint16(28, nome.length, true); c.setUint32(42, pos, true);
      partes.push(h.buffer, nome, dados);
      central.push(c.buffer, nome);
      pos += 30 + nome.length + dados.length;
    });
    var tam = central.reduce(function (s, p) { return s + p.byteLength; }, 0);
    var f = cab(22);
    f.setUint32(0, 0x06054b50, true); f.setUint16(8, lista.length, true); f.setUint16(10, lista.length, true);
    f.setUint32(12, tam, true); f.setUint32(16, pos, true);
    return new Blob(partes.concat(central, [f.buffer]), { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  }
  function baixar(nomeArquivo, corpo, titulo) {
    var blob = zip(arquivos(corpo, titulo || nomeArquivo.replace(/\.docx$/, '')));
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = nomeArquivo;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  }
  return { documento: documento, baixar: baixar, slug: slug, zip: zip, arquivos: arquivos };
})();

// ===== Um plano: mapa, painel, percursos, seções e editor em Markdown =====
// cfg: { chave, nome, arquivo (em site/local/), original (Markdown), intro (HTML), mapaTitulo }
// Cada aba da página é um plano criado por esta função, com seus próprios dados e seu próprio arquivo.
function criarPlano(cfg) {
  var K = cfg.chave, ARQUIVO = cfg.arquivo, ORIGINAL = cfg.original;
  var COLS = [], N = [], E = [], PATHS = [], SECS = [], BY = {};
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var raiz = document.createElement('div');
  raiz.className = 'pl-plano';
  raiz.id = 'plano-' + K;
  raiz.innerHTML =
    '<div class="pl-intro">' + cfg.intro + '</div>' +
    '<div class="pl-topo">' +
      '<nav class="pl-atalhos" aria-label="Partes do plano"><a href="#' + K + '-mapa">' + esc(cfg.mapaTitulo) + '</a><a href="#' + K + '-percursos">Percursos</a><a href="#' + K + '-secoes">As seções</a><a href="#' + K + '-editor">Editar em Markdown</a><button type="button" class="pl-btn prim pl-docx">Baixar texto (.docx)</button></nav>' +
      '<div class="pl-stats"></div>' +
    '</div>' +
    '<section class="pl-sec" id="' + K + '-mapa" aria-labelledby="' + K + '-h-mapa">' +
      '<div class="pl-shead"><h2 id="' + K + '-h-mapa"><span class="pl-hl">' + esc(cfg.mapaTitulo) + '</span></h2>' +
      '<p>As camadas vão dos fundamentos ao que sustenta o trabalho. As setas saem do ponto que entrega e apontam para o ponto que recebe.</p></div>' +
      '<div class="pl-mapalayout"><div>' +
        '<div class="pl-mapa"><svg aria-hidden="true"><defs>' +
          '<marker id="' + K + '-mk-faint" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" markerUnits="userSpaceOnUse" orient="auto"><path class="mk-faint" d="M0,0 L10,5 L0,10 z"/></marker>' +
          '<marker id="' + K + '-mk-out" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto"><path class="mk-out" d="M0,0 L10,5 L0,10 z"/></marker>' +
          '<marker id="' + K + '-mk-in" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path class="mk-in" d="M0,0 L10,5 L0,10 z"/></marker>' +
        '</defs><g class="pl-arestas"></g></svg></div>' +
        '<div class="pl-legenda"><span><i></i>Sai do ponto escolhido (ele entrega)</span><span><i class="d"></i>Chega ao ponto escolhido (ele recebe)</span><span>Passe o mouse para prever; clique para fixar.</span></div>' +
      '</div><aside class="pl-painel" aria-live="polite"></aside></div>' +
    '</section>' +
    '<section class="pl-sec" id="' + K + '-percursos" aria-labelledby="' + K + '-h-perc">' +
      '<div class="pl-shead"><h2 id="' + K + '-h-perc"><span class="pl-hl">Percursos</span></h2>' +
      '<p>Situações concretas que atravessam o plano inteiro. Cada passo mostra o ponto que passa o trabalho adiante e a ligação que existe entre eles.</p></div>' +
      '<div class="pl-percursos"><div class="pl-abas" role="tablist" aria-label="Escolha um percurso"></div><div class="pl-trilha" role="tabpanel"></div></div>' +
    '</section>' +
    '<section class="pl-sec" id="' + K + '-secoes" aria-labelledby="' + K + '-h-sec">' +
      '<div class="pl-shead"><h2 id="' + K + '-h-sec"><span class="pl-hl pl-titulo-secoes">As seções</span></h2>' +
      '<p>' + cfg.secoesTexto + '</p></div>' +
      '<div class="pl-grade"></div>' +
    '</section>' +
    '<section class="pl-sec" id="' + K + '-editor" aria-labelledby="' + K + '-h-ed">' +
      '<div class="pl-shead"><h2 id="' + K + '-h-ed"><span class="pl-hl">Editar em Markdown</span></h2>' +
      '<p>O plano inteiro em texto: camadas, pontos, setas, percursos e seções. O mapa muda enquanto você escreve; "Salvar" grava em admin/mapas/' + esc(ARQUIVO) + ' (no editor online, vai para o GitHub quando um revisor publicar).</p></div>' +
      '<div class="pl-ed-barra">' +
        '<button type="button" class="pl-btn prim" data-ed="salvar">Salvar</button>' +
        '<button type="button" class="pl-btn" data-ed="recarregar">Voltar ao que está salvo</button>' +
        '<button type="button" class="pl-btn" data-ed="original">Restaurar o plano original</button>' +
        '<span class="pl-ed-status" role="status"></span>' +
      '</div>' +
      '<div class="pl-ed-layout">' +
        '<textarea class="pl-ed-texto" spellcheck="false" aria-label="' + esc(cfg.nome) + ' em Markdown"></textarea>' +
        '<aside class="pl-ed-guia" aria-label="Como escrever">' +
          '<h3>Como escrever</h3>' +
          '<pre># Camada: Fundamentos\nPor que existimos…\n\n## Dossiês {#dossie}\nSeção: 4.1 · Produção\nNovo: sim\nO que é: …\nPor que importa: …\nComo se faz:\n- um item\n- outro item\nEntrega para:\n- [[cortes]] por quê\n\n# Percurso: Do fato ao acervo\nComo um fato vira acervo.\n1. [[arquivo]] o que acontece\n2. [[fatos]] …\n\n# Seção 4: Produção\nO que é: …\nPapel no conjunto: …\nPontos: [[dossie]] [[cortes]]</pre>' +
          '<ul><li>Cada <b>## ponto</b> fica na camada de cima dele, na ordem do texto.</li>' +
          '<li>O <b>{#id}</b> é o nome curto usado nas ligações <b>[[id]]</b>. Sem ele, o id sai do título.</li>' +
          '<li>As setas saem de <b>Entrega para</b>: escreva cada ligação só uma vez, no ponto que entrega.</li>' +
          '<li>Texto entre &lt;!-- e --&gt; é comentário e não aparece.</li>' +
          '<li>Ctrl+S salva.</li></ul>' +
        '</aside>' +
      '</div>' +
      '<div class="pl-ed-msgs" aria-live="polite"></div>' +
    '</section>';

  var $ = function (sel) { return raiz.querySelector(sel); };
  var mapa = $('.pl-mapa'), svg = $('.pl-mapa svg'), camada = $('.pl-arestas'), painel = $('.pl-painel');
  var abas = $('.pl-abas'), trilha = $('.pl-trilha'), grade = $('.pl-grade'), stats = $('.pl-stats');
  var texto = $('.pl-ed-texto'), status = $('.pl-ed-status'), msgs = $('.pl-ed-msgs');
  var atual = null, pi = 0, si = 0, noEl = {};
  $('.pl-docx').addEventListener('click', function () {
    var intro = document.createElement('div'); intro.innerHTML = cfg.intro;
    var ps = Array.prototype.map.call(intro.querySelectorAll('p'), function (p) { return { t: p.textContent, lema: p.classList.contains('pl-lema') }; });
    try {
      PlanoDocx.baixar('mapa-' + PlanoDocx.slug(cfg.nome) + '.docx',
        PlanoDocx.documento({ nome: cfg.nome, mapaTitulo: cfg.mapaTitulo, intro: ps }, { COLS: COLS, N: N, E: E, PATHS: PATHS, SECS: SECS, BY: BY }),
        'Mapas do Movimento: ' + cfg.nome);
    } catch (e) { alert('Não consegui gerar o .docx: ' + (e.message || e)); }
  });
  // Atalhos: rolam até a parte sem mexer no endereço do editor
  $('.pl-atalhos').addEventListener('click', function (ev) {
    if (!ev.target.closest('a')) return;
    var a = ev.target.closest('a');
    ev.preventDefault();
    var alvo = raiz.querySelector(a.getAttribute('href'));
    if (alvo) alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ---- Monta tudo a partir dos dados
  function reconstruir() {
    BY = {};
    N.forEach(function (n) { BY[n.id] = n; n.out = []; n.inn = []; });
    E.forEach(function (e) { BY[e[0]].out.push({ id: e[1], w: e[2] }); BY[e[1]].inn.push({ id: e[0], w: e[2] }); });
    var nNovos = N.filter(function (n) { return n.nw; }).length;
    var numeros = [[SECS.length, 'seções no plano'], [N.length, 'pontos no mapa'], [E.length, 'setas de ligação']];
    if (nNovos) numeros.push([nNovos, cfg.novosTexto || 'pontos novos']);
    else numeros.push([PATHS.length, 'percursos']);
    stats.innerHTML = numeros.map(function (s) { return '<div class="pl-stat"><strong>' + s[0] + '</strong><span>' + s[1] + '</span></div>'; }).join('');
    $('.pl-titulo-secoes').textContent = SECS.length === 1 ? 'A seção' : 'As ' + SECS.length + ' seções';

    // Colunas do mapa
    Array.prototype.slice.call(mapa.querySelectorAll('.pl-col')).forEach(function (c) { c.remove(); });
    mapa.style.setProperty('--pl-cols', String(Math.max(1, COLS.length)));
    noEl = {};
    COLS.forEach(function (c, ci) {
      var col = document.createElement('div');
      col.className = 'pl-col';
      col.innerHTML = '<div class="pl-colhead"><b>' + (ci + 1) + '. ' + esc(c.t) + '</b><span>' + esc(c.s) + '</span></div>';
      N.filter(function (n) { return n.col === ci; }).forEach(function (n) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'pl-no'; b.dataset.id = n.id;
        b.innerHTML = '<span class="pl-tag t-out">recebe</span><span class="pl-tag t-in">entrega</span><small>' + esc(n.sec) + (n.nw ? ' · novo' : '') + '</small><span>' + esc(n.t) + '</span>';
        b.addEventListener('click', function () { escolher(n.id, false); });
        b.addEventListener('mouseenter', function () { if (window.matchMedia('(hover:hover)').matches) destacar(n.id); });
        b.addEventListener('mouseleave', function () { destacar(atual); });
        noEl[n.id] = b;
        col.appendChild(b);
      });
      mapa.appendChild(col);
    });

    // Percursos
    abas.innerHTML = '';
    PATHS.forEach(function (p, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'pl-aba'; b.setAttribute('role', 'tab'); b.id = K + '-aba-' + i;
      b.innerHTML = '<b>' + esc(p.t) + '</b><span>' + esc(p.s) + '</span>';
      b.addEventListener('click', function () { pi = i; si = 0; desenharPercurso(); });
      abas.appendChild(b);
    });
    if (pi >= PATHS.length) { pi = 0; si = 0; }
    if (PATHS[pi] && si >= PATHS[pi].steps.length) si = 0;

    // Seções
    grade.innerHTML = SECS.map(function (s) {
      return '<article class="pl-cartao"><span class="n">' + String(s.n).padStart(2, '0') + '</span>' + (s.nw ? '<span class="novo">Nova</span>' : '') + '<h3>' + esc(s.t) + '</h3>' +
        (s.o ? '<p>' + esc(s.o) + '</p>' : '') + (s.i ? '<p class="imp"><b style="font-weight:500;color:var(--ink)">Papel no conjunto:</b> ' + esc(s.i) + '</p>' : '') +
        '<div class="pl-chips">' + s.ids.map(function (id) { return '<button type="button" class="pl-chip" data-mapa="' + id + '">' + esc(BY[id].t) + '</button>'; }).join('') + '</div></article>';
    }).join('');

    if (!BY[atual]) atual = BY[cfg.inicio] ? cfg.inicio : (N[0] && N[0].id);
    desenharPainel(atual); destacar(atual); desenharPercurso();
  }

  function caixa(id) {
    var r = noEl[id].getBoundingClientRect(), m = mapa.getBoundingClientRect();
    return { l: r.left - m.left, r: r.right - m.left, y: r.top + r.height / 2 - m.top };
  }
  // A seta sempre sai do ponto de origem (a) e termina na borda do destino (b)
  function caminho(a, b, k) {
    var A = caixa(a), B = caixa(b), ca = BY[a].col, cb = BY[b].col, off = (k % 3 - 1) * 5, x1, x2, y1 = A.y + off, y2 = B.y + off, dx;
    if (ca === cb) {
      x1 = A.r; x2 = B.r + 1;
      var bx = Math.max(x1, x2) + 18 + Math.min(46, Math.abs(y1 - y2) / 5);
      return 'M' + x1 + ',' + y1 + ' C' + bx + ',' + y1 + ' ' + bx + ',' + y2 + ' ' + x2 + ',' + y2;
    }
    if (ca < cb) { x1 = A.r; x2 = B.l - 1; dx = (x2 - x1) / 2; return 'M' + x1 + ',' + y1 + ' C' + (x1 + dx) + ',' + y1 + ' ' + (x2 - dx) + ',' + y2 + ' ' + x2 + ',' + y2; }
    x1 = A.l; x2 = B.r + 1; dx = (x1 - x2) / 2;
    return 'M' + x1 + ',' + y1 + ' C' + (x1 - dx) + ',' + y1 + ' ' + (x2 + dx) + ',' + y2 + ' ' + x2 + ',' + y2;
  }
  function desenharArestas(foco) {
    // Aba escondida ou tela estreita: sem setas (as posições dos pontos não existem)
    if (!raiz.isConnected || raiz.hidden || getComputedStyle(svg).display === 'none') { camada.innerHTML = ''; return; }
    var fracas = '', fortes = '';
    E.forEach(function (e, k) {
      if (foco && e[0] === foco) fortes += '<path class="pl-aresta out" marker-end="url(#' + K + '-mk-out)" d="' + caminho(e[0], e[1], k) + '"/>';
      else if (foco && e[1] === foco) fortes += '<path class="pl-aresta inn" marker-end="url(#' + K + '-mk-in)" d="' + caminho(e[0], e[1], k) + '"/>';
      else fracas += '<path class="pl-aresta" marker-end="url(#' + K + '-mk-faint)" d="' + caminho(e[0], e[1], k) + '"/>';
    });
    camada.innerHTML = fracas + fortes;
  }
  function destacar(id) {
    var o = {}, i = {};
    if (BY[id]) { BY[id].out.forEach(function (x) { o[x.id] = 1; }); BY[id].inn.forEach(function (x) { i[x.id] = 1; }); }
    mapa.classList.toggle('foco', !!BY[id]);
    Object.keys(noEl).forEach(function (k) {
      var el = noEl[k];
      el.classList.toggle('sel', k === id);
      el.classList.toggle('out', !!o[k] && k !== id);
      el.classList.toggle('inn', !!i[k] && !o[k] && k !== id);
      el.setAttribute('aria-pressed', k === atual ? 'true' : 'false');
    });
    desenharArestas(BY[id] ? id : null);
  }
  function lista(arr, dir) {
    if (!arr.length) return '<p class="pl-nada">Nenhuma ligação nesta direção.</p>';
    return '<ul class="pl-links">' + arr.slice().sort(function (a, b) { return BY[a.id].col - BY[b.id].col; }).map(function (x) {
      var m = BY[x.id];
      return '<li><button type="button" data-ir="' + m.id + '"><span class="ar ' + (dir === 'o' ? 'o' : '') + '" aria-hidden="true">' + (dir === 'o' ? '→' : '←') + '</span><b>' + esc(m.t) + '</b><span class="w">' + esc(x.w) + '</span></button></li>';
    }).join('') + '</ul>';
  }
  function desenharPainel(id) {
    var n = BY[id];
    if (!n) { painel.innerHTML = '<p class="pl-nada">Nenhum ponto no plano.</p>'; return; }
    painel.innerHTML =
      '<span class="pl-eyebrow">' + esc(n.sec) + ' · camada ' + (n.col + 1) + ', ' + esc(COLS[n.col].t) + (n.nw ? ' · novo' : '') + '</span>' +
      '<h3>' + esc(n.t) + '</h3>' +
      (n.o ? '<div><h4>O que é</h4><p>' + esc(n.o) + '</p></div>' : '') +
      (n.p ? '<div class="pl-porque"><h4>Por que importa</h4><p>' + esc(n.p) + '</p></div>' : '') +
      (n.c.length ? '<div><h4>Como se faz</h4><ul>' + n.c.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></div>' : '') +
      '<div><h4>Entrega para (' + n.out.length + ')</h4>' + lista(n.out, 'o') + '</div>' +
      '<div><h4>Recebe de (' + n.inn.length + ')</h4>' + lista(n.inn, 'i') + '</div>';
  }
  painel.addEventListener('click', function (ev) { var b = ev.target.closest('[data-ir]'); if (b) escolher(b.dataset.ir, false); });
  function rolar(el) {
    var reduz = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    el.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth', block: 'start' });
  }
  function escolher(id, irAoMapa) {
    atual = id; desenharPainel(id); destacar(id);
    if (irAoMapa) rolar($('#' + K + '-mapa'));
    else if (window.innerWidth <= 1150) rolar(painel);
  }

  function setaEntre(a, b) {
    for (var k = 0; k < E.length; k++) {
      var e = E[k];
      if (e[0] === a && e[1] === b) return BY[a].t + ' → ' + BY[b].t + ': ' + e[2];
      if (e[0] === b && e[1] === a) return BY[b].t + ' → ' + BY[a].t + ' (no sentido inverso): ' + e[2];
    }
    return '';
  }
  function desenharPercurso() {
    var p = PATHS[pi];
    if (!p) { trilha.innerHTML = '<p class="pl-nada">Nenhum percurso no plano.</p>'; return; }
    Array.prototype.forEach.call(abas.children, function (t, i) { t.setAttribute('aria-selected', i === pi ? 'true' : 'false'); t.tabIndex = i === pi ? 0 : -1; });
    var passos = p.steps.map(function (s, i) {
      var n = BY[s[0]], via = i > 0 ? setaEntre(p.steps[i - 1][0], s[0]) : '';
      return '<li class="' + (i === si ? 'cur' : (i < si ? 'feito' : '')) + '" data-i="' + i + '"><span class="pl-num">' + (i + 1) + '</span>' +
        '<div class="pl-passo"><span class="pl-eyebrow">' + esc(n.sec) + '</span><b>' + esc(n.t) + '</b><p>' + esc(s[1]) + '</p>' +
        (via && i === si ? '<span class="via">Seta no plano: ' + esc(via) + '</span>' : '') +
        (i === si ? '<button type="button" class="pl-irmapa" data-mapa="' + n.id + '">Ver este ponto no mapa</button>' : '') + '</div></li>';
    }).join('');
    trilha.setAttribute('aria-labelledby', K + '-aba-' + pi);
    trilha.innerHTML = '<div class="pl-trilha-topo"><p>Passo ' + (si + 1) + ' de ' + p.steps.length + '. Clique em um passo ou use os botões.</p>' +
      '<div class="pl-ctrl"><button type="button" class="pl-btn" data-passo="-1"' + (si === 0 ? ' disabled' : '') + '>Anterior</button>' +
      '<button type="button" class="pl-btn prim" data-passo="1"' + (si === p.steps.length - 1 ? ' disabled' : '') + '>Próximo passo</button></div></div>' +
      '<ol class="pl-passos">' + passos + '</ol>';
  }
  trilha.addEventListener('click', function (ev) {
    var m = ev.target.closest('[data-mapa]'); if (m) { escolher(m.dataset.mapa, true); return; }
    var d = ev.target.closest('[data-passo]');
    if (d) { si = Math.max(0, Math.min(PATHS[pi].steps.length - 1, si + Number(d.dataset.passo))); desenharPercurso(); return; }
    var li = ev.target.closest('li[data-i]'); if (li) { si = +li.dataset.i; desenharPercurso(); }
  });
  abas.addEventListener('keydown', function (ev) {
    if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].indexOf(ev.key) < 0 || !PATHS.length) return;
    ev.preventDefault();
    var d = (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') ? 1 : -1;
    pi = (pi + d + PATHS.length) % PATHS.length; si = 0; desenharPercurso(); abas.children[pi].focus();
  });
  grade.addEventListener('click', function (ev) { var b = ev.target.closest('[data-mapa]'); if (b) escolher(b.dataset.mapa, true); });

  var raf;
  function redesenhar() { cancelAnimationFrame(raf); raf = requestAnimationFrame(function () { desenharArestas(BY[atual] ? atual : null); }); }
  window.addEventListener('resize', redesenhar);
  if (window.ResizeObserver) new ResizeObserver(redesenhar).observe(mapa);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(redesenhar);

  // ---- Editor em Markdown
  var salvo = null, sujo = false, espera;
  function usar(d) { COLS = d.COLS; N = d.N; E = d.E; PATHS = d.PATHS; SECS = d.SECS; reconstruir(); redesenhar(); }
  function aplicar(md) {
    var r = PlanoMD.ler(md);
    var linhas = r.erros.map(function (e) { return '<li class="erro"><b>Linha ' + e.linha + ':</b> ' + esc(e.msg) + '</li>'; })
      .concat(r.avisos.map(function (e) { return '<li><b>Linha ' + e.linha + ':</b> ' + esc(e.msg) + '</li>'; }));
    msgs.innerHTML = linhas.length
      ? '<p>' + (r.erros.length ? '<b class="pl-ed-ruim">O mapa não mudou: corrija ' + (r.erros.length === 1 ? 'o erro' : 'os ' + r.erros.length + ' erros') + ' abaixo.</b>' : 'Avisos (o mapa foi atualizado):') + '</p><ul>' + linhas.join('') + '</ul>'
      : '';
    if (r.erros.length) return false;
    usar(r.dados);
    return true;
  }
  function mostrarStatus(t, ruim) { status.textContent = t; status.classList.toggle('pl-ed-ruim', !!ruim); }
  function marcar() {
    sujo = texto.value !== salvo;
    mostrarStatus(sujo ? (salvo === null ? 'Plano original, ainda não salvo' + (texto.value !== ORIGINAL ? ' (com alterações)' : '') : 'Alterações não salvas') : 'Salvo em admin/mapas/' + ARQUIVO, false);
  }
  texto.addEventListener('input', function () {
    marcar();
    clearTimeout(espera);
    espera = setTimeout(function () { aplicar(texto.value); }, 500);
  });
  texto.addEventListener('keydown', function (ev) {
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's') { ev.preventDefault(); salvar(); }
    if (ev.key === 'Tab' && !ev.shiftKey && !ev.ctrlKey && !ev.altKey) {   // Tab insere espaços em vez de sair do campo
      ev.preventDefault();
      texto.setRangeText('  ', texto.selectionStart, texto.selectionEnd, 'end');
      texto.dispatchEvent(new Event('input'));
    }
  });
  function salvar() {
    clearTimeout(espera);
    if (!aplicar(texto.value)) { mostrarStatus('Não salvei: há erros no texto', true); return; }
    var conteudo = texto.value;
    mostrarStatus('Salvando…');
    fetch('/api/mapa', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-TC-Editor': '1' }, body: JSON.stringify({ nome: ARQUIVO, texto: conteudo }) })
      .then(function (r) { return r.json().then(function (j) { if (r.status === 401 && j.entrar) { location.href = 'entrar.html'; return new Promise(function () {}); } if (!r.ok) throw new Error(j.erro || r.status); }); })
      .then(function () { salvo = conteudo; marcar(); })
      .catch(function (e) { mostrarStatus('Não salvou: ' + e.message + '. O servidor (scripts/servidor.py) está rodando?', true); });
  }
  function carregar(md, eSalvo) {
    texto.value = md;
    salvo = eSalvo ? md : null;
    if (!aplicar(md)) usar(PlanoMD.ler(ORIGINAL).dados);   // arquivo salvo com erro: mostra o texto, mas o mapa fica com o original
    marcar();
  }
  raiz.querySelector('.pl-ed-barra').addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-ed]'); if (!b) return;
    var acao = b.dataset.ed;
    if (acao === 'salvar') salvar();
    if (acao === 'recarregar') {
      if (sujo && !confirm('Descartar as alterações e voltar ao texto salvo?')) return;
      lerArquivo();
    }
    if (acao === 'original') {
      if (texto.value !== ORIGINAL && !confirm('Trocar o texto pelo plano original? Ele só substitui o arquivo quando você salvar.')) return;
      texto.value = ORIGINAL; aplicar(ORIGINAL); marcar();
    }
  });
  function lerArquivo() {
    fetch('mapas/' + ARQUIVO, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('sem arquivo'); return r.text(); })
      .then(function (md) { carregar(md, true); })
      .catch(function () { carregar(ORIGINAL, false); });
  }

  usar(PlanoMD.ler(ORIGINAL).dados);
  lerArquivo();
  return {
    chave: K, nome: cfg.nome, raiz: raiz, redesenhar: redesenhar,
    temAlteracoes: function () { return sujo && salvo !== null; }
  };
}

// ===== A página: duas abas (Tempo Continuum e Movimento político) =====
window.TCPlanos = (function () {
  var caixa = null, planos, barra, atual = null;
  function criar() {
  planos = [
    criarPlano({
      chave: 'tc', nome: 'Tempo Continuum', arquivo: 'plano-tc.md', original: PLANO_TC, inicio: 'dossie',
      mapaTitulo: 'Mapa do coletivo',
      intro: '<p class="pl-lema">Conhecer o passado. Organizar o presente. Construir o futuro.</p>' +
        '<p>O Plano de Fundação do Tempo Continuum: uma espécie de <i>think tank</i>, um centro de pesquisa e elaboração de ideias que estuda a realidade brasileira, e ao mesmo tempo um ecossistema de produção de conteúdo, apoiado em três pilares: livre e acessível, interdisciplinar e multimodal.</p>',
      secoesTexto: 'O Plano de Fundação em um olhar, na ordem do índice. Documento vivo, revisado coletivamente.'
    }),
    criarPlano({
      chave: 'movimento', nome: 'Movimento político', arquivo: 'plano.md', inicio: 'nucleos',
      original: PlanoMD.escrever({ COLS: COLS, N: N, E: E, PATHS: PATHS, SECS: SECS }),
      mapaTitulo: 'Mapa do movimento', novosTexto: 'pontos novos em relação ao coletivo',
      intro: '<p class="pl-lema">Do coletivo ao movimento</p>' +
        '<p>Um movimento de esquerda que pesquisa, comunica, organiza e luta, com cada parte alimentando a outra. O plano do coletivo era produzir conhecimento e conteúdo; o movimento usa a mesma base e acrescenta programa, núcleos de base, frentes, campanhas, solidariedade, ação institucional e democracia interna.</p>',
      secoesTexto: 'O plano do movimento em um olhar. As seções marcadas como novas não existiam no plano do coletivo; as demais foram ampliadas.'
    })
  ];

  caixa = document.createElement('div');
  caixa.id = 'plano';
  barra = document.createElement('div');
  barra.className = 'pl-planos';
  barra.setAttribute('role', 'tablist');
  barra.setAttribute('aria-label', 'Escolha o plano');
  caixa.appendChild(barra);
  planos.forEach(function (p, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'pl-plano-aba'; b.id = 'aba-' + p.chave;
    b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'plano-' + p.chave);
    b.textContent = p.nome;
    b.addEventListener('click', function () { mostrar(p.chave, true); });
    barra.appendChild(b);
    p.raiz.setAttribute('role', 'tabpanel');
    p.raiz.setAttribute('aria-labelledby', 'aba-' + p.chave);
    caixa.appendChild(p.raiz);
  });
  barra.addEventListener('keydown', function (ev) {
    if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
    var i = planos.map(function (p) { return p.chave; }).indexOf(atual);
    var p = planos[(i + (ev.key === 'ArrowRight' ? 1 : -1) + planos.length) % planos.length];
    mostrar(p.chave, true); document.getElementById('aba-' + p.chave).focus();
  });

  }
  function mostrar(chave, gravar) {
    atual = chave;
    planos.forEach(function (p) {
      var ativo = p.chave === chave, aba = barra.querySelector('#aba-' + p.chave);
      p.raiz.hidden = !ativo;
      aba.setAttribute('aria-selected', ativo ? 'true' : 'false');
      aba.tabIndex = ativo ? 0 : -1;
      if (ativo) p.redesenhar();
    });
    if (gravar) {
      try { history.replaceState(null, '', '#mapas/' + chave); } catch (e) {}
      try { localStorage.setItem('tc-plano-aba', chave); } catch (e) {}
    }
  }
  window.addEventListener('beforeunload', function (ev) {
    if (planos && planos.some(function (p) { return p.temAlteracoes(); })) { ev.preventDefault(); ev.returnValue = ''; }
  });
  // Põe os planos no lugar (o editor apaga a área ao trocar de tela; os planos continuam na memória, com o que foi digitado)
  function montar(lugar, aba) {
    if (!caixa) criar();
    lugar.appendChild(caixa);
    var guardada = ''; try { guardada = localStorage.getItem('tc-plano-aba') || ''; } catch (e) {}
    var existe = function (c) { return planos.some(function (p) { return p.chave === c; }); };
    mostrar(existe(aba) ? aba : existe(atual) ? atual : existe(guardada) ? guardada : 'tc', true);
  }
  return { montar: montar };
})();
