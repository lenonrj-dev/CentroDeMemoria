import type { HomeContent } from "../../../../lib/content-types";

// =========================
// HOME - HERO SECTION
// =========================
const homeHero: HomeContent["hero"] = {
  imageSrc:
    "https://res.cloudinary.com/dc7u5spia/image/upload/v1764889980/1_de_janeiro_de_1959_1920_x_1080_px_sbykwi.png",
  alt: "Centro de Memória Operária Digitalizada Rubem Machado",
  logos: [
    {
      src: "https://res.cloudinary.com/dc7u5spia/image/upload/v1764890044/Cut_uevy1s.svg",
      alt: "Logotipo CUT",
      wrapperClassName: "relative h-24 w-24 sm:h-28 sm:w-28",
      className: "object-contain drop-shadow-lg",
    },
    {
      src: "https://res.cloudinary.com/dc7u5spia/image/upload/v1765284186/Cmodrm_n4bbul.svg",
      alt: "Identidade institucional",
      wrapperClassName: "relative w-auto",
      className: "object-contain drop-shadow-lg",
    },
    {
      src: "https://res.cloudinary.com/dc7u5spia/image/upload/v1764962454/Design_sem_nome_jzkh9u.svg",
      alt: "Símbolo complementar",
      className: "object-contain drop-shadow-lg",
    },
  ],
};

// =========================
// HOME - SEARCH BAR SECTION
// =========================
const homeSearch: HomeContent["search"] = {
  title: "Centro de Memória Operária Digitalizada Rubem Machado",
  tagline: "Bem-vindos e bem-vindas ao nosso acervo virtual. Boa pesquisa!",
  description: "Busque por termos, nomes ou datas e siga para o acervo completo.",
  placeholder: "Busque por termos, nomes, datas.",
  buttonLabel: "Pesquisar",
  categoryLabel: "Categoria",
  categories: [
    { value: "all", label: "Todo o conteúdo" },
    { value: "documentos", label: "Documentos" },
    { value: "fotos", label: "Fotos" },
    { value: "jornais", label: "Jornais de época" },
    { value: "depoimentos", label: "Depoimentos" },
    { value: "pessoas", label: "Acervos pessoais" },
    { value: "bibliografia", label: "Bibliografia" },
  ],
  socials: [
    { platform: "facebook", href: "https://facebook.com" },
    { platform: "instagram", href: "https://instagram.com" },
    { platform: "youtube", href: "https://youtube.com" },
  ],
  logos: [homeHero.logos[0], homeHero.logos[2]]
    .filter(Boolean)
    .map((logo) => ({
      src: logo.src,
      alt: logo.alt,
      className: logo.className,
    })),
};

// =========================
// HOME - FEATURED COLLECTIONS (SecondSection)
// =========================
const homeFeaturedCollections: HomeContent["featuredCollections"] = {
  eyebrow: "Dom Waldyr em foco",
  title: "Recortes do fundo Dom Waldyr",
  description:
    "Documentos, fotografias e jornais que registram a atuação de Dom Waldyr junto aos trabalhadores e às comunidades do Sul Fluminense.",
  primaryCta: { label: "Explorar fundo Dom Waldyr", href: "/acervo/fundos/dom-waldyr" },
  secondaryCta: { label: "Ver acervo pessoal", href: "/acervo-pessoal/dom-waldyr" },
  items: [
    {
      title: "Cartas e notas pastorais",
      description:
        "Recortes de cartas, relatórios e notas que revelam a mediação social e a defesa de direitos humanos.",
      href: "/acervo/fundos/dom-waldyr#documentos",
      cover:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1765292802/DOCUMENTA%C3%87%C3%83O_HIST%C3%93RICA_g0pzkc.png",
      badge: "Documentos",
    },
    {
      title: "Jornais solidários e circulares",
      description:
        "Edições pastorais que acompanharam greves e mobilizações com mensagens públicas de apoio.",
      href: "/acervo/fundos/dom-waldyr#jornais",
      cover:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1765237328/Jornal_do_Brasil_-_2%C2%AA_Auditoria_do_Ex%C3%A9rcito_xzf1q2.jpg",
      badge: "Jornais",
    },
    {
      title: "Depoimentos e memória oral",
      description:
        "Relatos de agentes pastorais, lideranças e comunidades sobre as escutas e mediações.",
      href: "/acervo/fundos/dom-waldyr#depoimentos",
      cover:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1764469350/Pres%C3%A9pio_Igreja_Santa_Cec%C3%ADlia_-_dezembro_de_1968_nwjnrn.jpg",
      badge: "Depoimentos",
    },
    {
      title: "Acervo fotográfico pastoral",
      description:
        "Imagens de assembleias, visitas e encontros comunitários com metadados essenciais.",
      href: "/acervo/fundos/dom-waldyr#acervo-fotografico",
      cover:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
      badge: "Fotos",
    },
  ],
  footnote: "Seleção editorial guiada pelo Fundo Dom Waldyr e pelos registros já digitalizados.",
};

// =========================
// HOME - PERSONAL TIMELINE (ThirdSection)
// =========================
const homePersonalTimeline: HomeContent["personalTimeline"] = {
  eyebrow: "Acervo Dom Waldyr Calheiros",
  title: "Ação pastoral, ditadura e movimento operário",
  description:
    "Marcos da atuação de Dom Waldyr junto aos trabalhadores: visitas pastorais, defesa de direitos humanos e mediações sociais no Sul Fluminense.",
  items: [
    {
      title: "Escutas iniciais e cadernos de campo",
      description:
        "Relatos das primeiras visitas às vilas operárias e o início da metodologia pastoral de registro.",
      href: "/acervo/fundos/dom-waldyr/historias/introducao",
    },
    {
      title: "Prisioneiros políticos e direitos humanos",
      description:
        "Cartas, dossiês e registros de acompanhamento de presos políticos e suas famílias.",
      href: "/acervo/fundos/dom-waldyr/historias/prisioneiros",
    },
    {
      title: "Conflitos e mediações regionais",
      description:
        "Negociações, cartas e protocolos de proteção a lideranças ameaçadas.",
      href: "/acervo/fundos/dom-waldyr/historias/conflito",
    },
    {
      title: "Breve biografia",
      description:
        "Um resumo biográfico com recortes documentais e linhas de atuação pastoral.",
      href: "/acervo/fundos/dom-waldyr/historias/breve-biografia",
    },
    {
      title: "Acervo pessoal em construção",
      description:
        "Panorama do acervo pessoal com documentos, fotos e referências já catalogadas.",
      href: "/acervo-pessoal/dom-waldyr",
    },
  ],
  aside: {
    label: "Perfil em foco",
    name: "Dom Waldyr Calheiros",
    role: "Bispo e articulador pastoral",
    avatar:
      "https://res.cloudinary.com/dc7u5spia/image/upload/v1764469350/Pres%C3%A9pio_Igreja_Santa_Cec%C3%ADlia_-_dezembro_de_1968_nwjnrn.jpg",
    highlights: [
      "Ação pastoral junto aos operários",
      "Defesa de direitos humanos",
      "Mediação em conflitos trabalhistas",
      "Memória documental preservada",
    ],
  },
  footnote: "Recortes editoriais do Fundo Dom Waldyr para orientar a pesquisa.",
};

// =========================
// HOME - JOURNALS (FourthSection)
// =========================
const homeJournals: HomeContent["journals"] = {
  eyebrow: "Jornais de época",
  title: "Uma janela para o passado",
  description:
    "Seleção editorial com recortes ligados ao movimento operário e à atuação pastoral de Dom Waldyr. Veja capas, chamadas e siga para a leitura completa.",
  cta: { label: "Ver todos os jornais", href: "/jornais-de-epoca" },
  filters: [
    { value: "all", label: "Todos" },
    { value: "1910s", label: "1910s" },
    { value: "1920s", label: "1920s" },
    { value: "1930s", label: "1930s" },
    { value: "1940s", label: "1940s" },
    { value: "1950s", label: "1950s" },
    { value: "1960s", label: "1960s" },
  ],
  items: [
    {
      title: "O Operário",
      date: "12/05/1913",
      decade: "1910s",
      description: "Edição dedicada à organização de base e às primeiras pautas salariais.",
      href: "/jornais-de-epoca/o-operario-1913-05-12",
      cover:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821799/Tropas_policiais_de_Barra_Mansa_Nova_Igua%C3%A7u_e_Niter%C3%B3i_reprimem_manifesta%C3%A7%C3%A3o_popular_em_ocasi%C3%A3o_do_assassinato_do_l%C3%ADder_sindical_Rubem_Machado_em_Volta_Redonda-RJ_2_fpkf7o.png",
      tags: ["organização", "salários"],
    },
    {
      title: "Folha do Trabalhador",
      date: "03/09/1921",
      decade: "1920s",
      description: "Relatos de mobilizações em bairros fabris e formação de comissões.",
      href: "/jornais-de-epoca/folha-trabalhador-1921-09-03",
      cover:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821791/Tropas_policiais_de_Barra_Mansa_Nova_Igua%C3%A7u_e_Niter%C3%B3i_reprimem_manifesta%C3%A7%C3%A3o_popular_em_ocasi%C3%A3o_do_assassinato_do_l%C3%ADder_sindical_Rubem_Machado_em_Volta_Redonda-RJ_1_iuqf4r.png",
      tags: ["mobilização", "comissões"],
    },
    {
      title: "Gazeta Sindical",
      date: "28/02/1932",
      decade: "1930s",
      description: "Análise das greves históricas e estratégias de negociação coletiva.",
      href: "/jornais-de-epoca/gazeta-sindical-1932-02-28",
      cover: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821783/construcao_da_cia_nestle_1936_t6voez.jpg",
      tags: ["greves", "negociação"],
    },
    {
      title: "O Dia do Povo",
      date: "17/07/1937",
      decade: "1930s",
      description: "Cobertura de marchas, assembleias e da vida cotidiana nos galpões.",
      href: "/jornais-de-epoca/o-dia-do-povo-1937-07-17",
      cover:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821751/O_papel_importante_do_Partido_Comunista_Brasileiro_PCB_na_organiza%C3%A7%C3%A3o_k9culm.jpg",
      tags: ["assembleias", "cotidiano"],
    },
    {
      title: "Tribuna Operária",
      date: "22/10/1944",
      decade: "1940s",
      description: "Edição especial sobre segurança, saúde e reformas dos locais de trabalho.",
      href: "/jornais-de-epoca/tribuna-operaria-1944-10-22",
      cover:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821766/504057774_122115082838853401_3435107802977189504_n_pheezs.jpg",
      tags: ["saúde", "segurança"],
    },
    {
      title: "Voz da Fábrica",
      date: "09/01/1949",
      decade: "1940s",
      description: "Crônicas de turno, refeitórios e novas demandas do pós-guerra.",
      href: "/jornais-de-epoca/voz-da-fabrica-1949-01-09",
      cover:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821751/O_papel_importante_do_Partido_Comunista_Brasileiro_PCB_na_organiza%C3%A7%C3%A3o_k9culm.jpg",
      tags: ["turnos", "pós-guerra"],
    },
    {
      title: "Correio Popular",
      date: "11/06/1953",
      decade: "1950s",
      description: "Editorial sobre custo de vida e tabelas comparativas de preços.",
      href: "/jornais-de-epoca/correio-popular-1953-06-11",
      cover:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821733/A_industrializa%C3%A7%C3%A3o_no_Sul_Fluminense_juqrcc.jpg",
      tags: ["custo de vida", "preços"],
    },
    {
      title: "Jornal do Metal",
      date: "30/11/1957",
      decade: "1950s",
      description: "Reportagens fotográficas das linhas de montagem e novas tecnologias.",
      href: "/jornais-de-epoca/jornal-do-metal-1957-11-30",
      cover:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821738/Manchete_6_de_fevereiro_de_1960_fh5bkv.jpg",
      tags: ["montagem", "tecnologia"],
    },
    {
      title: "A Voz do Sindicato",
      date: "04/04/1962",
      decade: "1960s",
      description: "Plano de lutas, calendário de assembleias e entrevistas com lideranças.",
      href: "/jornais-de-epoca/voz-do-sindicato-1962-04-04",
      cover:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821733/A_industrializa%C3%A7%C3%A3o_no_Sul_Fluminense_juqrcc.jpg",
      tags: ["assembleias", "lideranças"],
    },
    {
      title: "Boletim do Trabalhador",
      date: "18/09/1968",
      decade: "1960s",
      description: "Cartazes, notas rápidas e uma linha do tempo de conquistas.",
      href: "/jornais-de-epoca/boletim-trabalhador-1968-09-18",
      cover:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821814/Obelisco_em_Homenagem_aos_oper%C3%A1rios_de_Barra_Mansa_inaugurado_em_1_de_Maio_de_1933_doyk04.jpg",
      tags: ["cartazes", "memória"],
    },
  ],
  ui: {
    allLabel: "todos os tipos",
    readLabel: "Ler jornal",
    prevLabel: "Anterior",
    nextLabel: "Próximo",
    carouselAriaLabel: "Carrossel de jornais de época",
    coverAltTemplate: "{title} - capa",
  },
};

// =========================
// HOME - TEAM (FifthSection)
// =========================
const homeTeam: HomeContent["team"] = {
  eyebrow: "Equipe Técnica",
  title: "Quem faz o Centro de Memória Operária acontecer",
  description:
    "Um time multidisciplinar dedicado à preservação, pesquisa e acesso público. Conheça as funções, competências e frentes de atuação.",
  cta: { label: "Ver equipe completa", href: "/equipe-tecnica" },
  people: [
    {
      name: "Rubem Machado",
      role: "Coordenação Geral & Curadoria",
      bio: "Estratégia do acervo, diretrizes de preservação e validação histórica.",
      photo: "/hero.png",
      tags: ["Curadoria", "Gestão", "Memória"],
      href: "/equipe-tecnica/rubem-machado",
      email: "#",
      linkedin: "#",
    },
    {
      name: "Ana Bezerra",
      role: "Arquivista Chefe",
      bio: "Classificação, descrição e políticas de acesso ao acervo.",
      photo:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
      tags: ["Arquivística", "Catalogação", "Acesso"],
      href: "/equipe-tecnica/ana-bezerra",
      email: "#",
      linkedin: "#",
    },
    {
      name: "Carlos Figueiredo",
      role: "Historiador",
      bio: "Contextualização, recorte temporal e verificação de fontes.",
      photo:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821766/504057774_122115082838853401_3435107802977189504_n_pheezs.jpg",
      tags: ["Pesquisa", "Contexto", "Fontes"],
      href: "/equipe-tecnica/carlos-figueiredo",
      email: "#",
      linkedin: "#",
    },
    {
      name: "Marina Lopes",
      role: "Líder de Digitalização",
      bio: "Fluxo de captura, restauração e padrões de imagem.",
      photo:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821766/504057774_122115082838853401_3435107802977189504_n_pheezs.jpg",
      tags: ["Digitalização", "Restauração", "Metadados"],
      href: "/equipe-tecnica/marina-lopes",
      email: "#",
      linkedin: "#",
    },
    {
      name: "João Nascimento",
      role: "Eng. de Software",
      bio: "Aplicação, pesquisa e interface com o banco de memória.",
      photo:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821766/504057774_122115082838853401_3435107802977189504_n_pheezs.jpg",
      tags: ["Full-stack", "Next.js", "UX"],
      href: "/equipe-tecnica/joao-nascimento",
      email: "#",
      linkedin: "#",
    },
    {
      name: "Lívia Rocha",
      role: "Infra & DevOps",
      bio: "Escalabilidade, backups e observabilidade do ambiente.",
      photo:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821766/504057774_122115082838853401_3435107802977189504_n_pheezs.jpg",
      tags: ["Infra", "S3/KVM", "Segurança"],
      href: "/equipe-tecnica/livia-rocha",
      email: "#",
      linkedin: "#",
    },
    {
      name: "Sofia Mendes",
      role: "Gestão de Conteúdo",
      bio: "Padronização editorial, revisão e publicação de coleções.",
      photo:
        "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821766/504057774_122115082838853401_3435107802977189504_n_pheezs.jpg",
      tags: ["Editorial", "Padrões", "Publicação"],
      href: "/equipe-tecnica/sofia-mendes",
      email: "#",
      linkedin: "#",
    },
  ],
  ui: {
    photoAltTemplate: "Foto de {name}",
    viewProfileLabel: "Ver perfil",
    emailLabel: "Enviar e-mail para {name}",
    linkedinLabel: "LinkedIn de {name}",
  },
};

// =========================
// HOME - ACCESS / TRANSPARÊNCIA (SixthSection)
// =========================
const homeAccess: HomeContent["access"] = {
  eyebrow: "Acesso à informação",
  title: "Transparência ativa e busca em um só lugar",
  description:
    "Consulte documentos, políticas e registros do banco de memória. Filtre por tema e avance para páginas com o conteúdo completo.",
  filters: [
    { key: "todas", label: "Todas" },
    { key: "atas", label: "Atas" },
    { key: "relatorios", label: "Relatórios" },
    { key: "contratos", label: "Contratos" },
    { key: "despesas", label: "Despesas" },
    { key: "convenios", label: "Convênios" },
    { key: "boletins", label: "Boletins" },
    { key: "imagens", label: "Imagens" },
  ],
  items: [
    {
      title: "Atas de Assembleia (1950-1980)",
      description: "Deliberações, presença e pautas debatidas em encontros gerais e extraordinários.",
      href: "/acervo/documentos",
      tags: ["atas"],
    },
    {
      title: "Relatórios de gestão",
      description: "Síntese anual de ações, indicadores e prestação de contas das frentes do sindicato.",
      href: "/acervo/documentos",
      tags: ["relatorios", "despesas"],
    },
    {
      title: "Contratos e parcerias",
      description: "Instrumentos firmados com fornecedores e instituições, com objetos e vigências.",
      href: "/acesso-a-informacao/contratos",
      tags: ["contratos", "convenios"],
    },
    {
      title: "Despesas e custos operacionais",
      description: "Notas, empenhos e categorias de gasto com critérios de classificação.",
      href: "/acesso-a-informacao/despesas",
      tags: ["despesas", "relatorios"],
    },
    {
      title: "Convênios institucionais",
      description: "Bases de cooperação, responsabilidades e resultados esperados.",
      href: "/acesso-a-informacao/convenios",
      tags: ["convenios"],
    },
    {
      title: "Boletins e comunicados oficiais",
      description: "Publicações periódicas com decisões, avisos e orientações à categoria.",
      href: "/acervo/boletins",
      tags: ["boletins"],
    },
    {
      title: "Acervo fotográfico - acesso público",
      description: "Conjunto de imagens com termos de uso, créditos e contexto.",
      href: "/acervo/fotos",
      tags: ["imagens"],
    },
    {
      title: "Política de transparência e acesso",
      description: "Diretrizes gerais de disponibilização, prazos e canais de atendimento.",
      href: "/acesso-a-informacao/politica",
      tags: ["relatorios", "contratos", "boletins", "atas", "despesas", "convenios", "imagens"],
    },
  ],
  ui: {
    searchPlaceholder: "Buscar por título, tema ou descrição.",
    filtersLabel: "Filtros",
    resultsTemplate: "{count} resultado(s) - {filter}",
    allFiltersLabel: "todos os tipos",
    prevLabel: "Anterior",
    nextLabel: "Próximo",
    readMoreLabel: "Saiba mais",
    howItWorksTitle: "Como funciona",
    howItWorksSteps: [
      "1. Localize o tema pela busca ou filtros.",
      "2. Acesse a página do conteúdo desejado.",
      "3. Verifique permissões e termos de uso quando aplicável.",
      "4. Precisa de algo específico? Envie um pedido de acesso.",
    ],
    ctaLabel: "Enviar pedido de acesso",
    rightsTitle: "Direitos do requerente",
    rightsItems: [
      "Orientação sobre onde e como acessar informações.",
      "Ser informado sobre a disponibilidade do conteúdo solicitado.",
      "Justificativa em caso de restrição de acesso.",
    ],
    rightsLinkLabel: "Ver política de transparência",
  },
};

// =========================
// HOME - POLÍTICA NACIONAL (SeventhSection)
// =========================
const homePolitics: HomeContent["politics"] = {
  eyebrow: "Política Nacional",
  title: "Em breve: marcos e diretrizes em construção",
  description:
    "Estamos organizando marcos legais, reformas e eixos temáticos. Enquanto isso, navegue por áreas relacionadas no acervo e em Acesso à Informação.",
  featured: {
    title: "O que será publicado",
    description:
      "Análises curtas, documentos-base e linhas do tempo sobre direitos do trabalho, previdência, saúde e educação.",
    href: "/politica-nacional",
    cover: "/hero.png",
    date: "Em breve",
  },
  axes: [
    { key: "todos", label: "Todos" },
    { key: "trabalho", label: "Trabalho" },
    { key: "previdencia", label: "Previdência" },
    { key: "educacao", label: "Educação" },
    { key: "saude", label: "Saúde" },
    { key: "direitos", label: "Direitos" },
  ],
  events: [
    {
      title: "Direitos do trabalho e negociação coletiva",
      date: "Em breve",
      summary: "Panorama com marcos legais, repercussões setoriais e leitura guiada.",
      href: "/politica-nacional",
      axis: ["trabalho", "direitos"],
    },
    {
      title: "Previdência e proteção social",
      date: "Em breve",
      summary: "Cronologia das reformas e impactos por categoria de trabalhadores.",
      href: "/politica-nacional",
      axis: ["previdencia", "direitos"],
    },
    {
      title: "Educação profissional e qualificação",
      date: "Em breve",
      summary: "Histórico de diretrizes nacionais, programas e referências.",
      href: "/politica-nacional",
      axis: ["educacao", "trabalho"],
    },
    {
      title: "Saúde do trabalhador e segurança",
      date: "Em breve",
      summary: "Normas, campanhas e documentos-chave sobre prevenção.",
      href: "/politica-nacional",
      axis: ["saude", "direitos"],
    },
    {
      title: "Habitação e políticas públicas",
      date: "Em breve",
      summary: "Programas, pactos regionais e leituras críticas.",
      href: "/politica-nacional",
      axis: ["direitos"],
    },
  ],
  notes: [
    "Coleção editorial em preparação.",
    "Conteúdos serão liberados por eixos temáticos.",
    "Acompanhe atualizações na página oficial.",
  ],
  methodologyLink: { label: "Ver a página completa", href: "/politica-nacional" },
  searchPlaceholder: "Buscar por tema ou eixo.",
  ui: {
    readAnalysisLabel: "Acompanhar",
    editorialLabel: "Em preparação",
    axesLabel: "Eixos",
    notesLabel: "Notas",
    quickSearchLabel: "Busca rápida",
    footerNote:
      "A área de Política Nacional está em construção. Em breve, conteúdos com fontes verificadas.",
  },
};

export const homeContent: HomeContent = {
  hero: homeHero,
  search: homeSearch,
  featuredCollections: homeFeaturedCollections,
  personalTimeline: homePersonalTimeline,
  journals: homeJournals,
  team: homeTeam,
  access: homeAccess,
  politics: homePolitics,
};
