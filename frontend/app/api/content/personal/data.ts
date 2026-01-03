import type { PersonalArchiveContent } from "../../../../lib/content-types";

export const personalContent: PersonalArchiveContent = {
  hero: {
    label: "Acervo Pessoal",
    name: "Rubem Machado",
    roles: ["Liderança sindical", "Editor de boletins", "Organizador de base"],
    summary:
      "Figura central nas mobilizações operárias de Volta Redonda, articulou boletins, assembleias e redes de solidariedade enquanto manteve registro minucioso de documentos, fotografias e vídeos.",
    biography:
      "O acervo reúne fotografias de cotidiano fabril, atas de assembleias, boletins operários e depoimentos gravados ao longo de três décadas de militância.",
    cover:
      "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
    portrait: "https://res.cloudinary.com/diwvlsgsw/image/upload/v1762965931/images_2_wysfnt.jpg",
    stats: [
      { label: "Período", value: "1940–1970" },
      { label: "Local", value: "Volta Redonda – RJ" },
      { label: "Séries", value: "Fotos, Documentos, Entrevistas, Boletins" },
    ],
    primaryCta: { label: "Ver fotografias", href: "/acervo/fotos" },
    secondaryCta: { label: "Explorar acervo completo", href: "/acervo" },
  },
  gallery: [
    {
      src: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
      alt: "Funcionários da Siderúrgica Barra Mansa na década de 1950",
    },
    {
      src: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821791/Tropas_policiais_de_Barra_Mansa_Nova_Igua%C3%A7u_e_Niter%C3%B3i_reprimem_manifesta%C3%A7%C3%A3o_popular_em_ocasi%C3%A3o_do_assassinato_do_L%C3%ADder_sindical_Rubem_Machado_em_Volta_Redonda-RJ_1_iuqf4r.png",
      alt: "Repressão a manifestação popular em Volta Redonda",
    },
    {
      src: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821791/Tropas_policiais_de_Barra_Mansa_Nova_Igua%C3%A7u_e_Niter%C3%B3i_reprimem_manifesta%C3%A7%C3%A3o_popular_em_ocasi%C3%A3o_do_assassinato_do_L%C3%ADder_sindical_Rubem_Machado_em_Volta_Redonda-RJ_2_uls3kf.png",
      alt: "Cortejo e multidão na década de 1950",
    },
    {
      src: "https://res.cloudinary.com/diwvlsgsw/image/upload/v1762965931/images_2_wysfnt.jpg",
      alt: "Jornal de época ‘O Operário’",
    },
  ],
  documents: [
    {
      title: "Ata de Assembleia – Setembro de 1961",
      href: "/acervo/documentos/ata-1961-09",
      meta: "Documento · 18/09/1961",
    },
    {
      title: "Boletim Operário – Março de 1952",
      href: "/acervo/boletins/1952-03",
      meta: "Jornal · 10/03/1952",
    },
    {
      title: "Boletim Operário – Julho de 1953",
      href: "/acervo/boletins/1953-07",
      meta: "Jornal · 05/07/1953",
    },
  ],
  interviews: [
    {
      title: "Entrevista com M. Santos – 1983",
      href: "/acervo/entrevistas/m-santos-1983",
      meta: "Áudio + Transcrição",
    },
  ],
  timeline: [
    { year: "1946", text: "Início das comissões de fábrica e formação política local." },
    { year: "1952", text: "Coordenação do Boletim Operário e rede de distribuição regional." },
    { year: "1959", text: "Ampliação da mobilização intersindical e frentes de solidariedade." },
    { year: "1961", text: "Assembleia com indicativo de greve – ata preservada." },
    { year: "1964", text: "Perseguições políticas e conservação clandestina de materiais." },
  ],
  about: {
    heading: "Sobre o acervo",
    description:
      "O acervo reúne fotografias, jornais com anotações, atas e entrevistas que guardam a memória das mobilizações operárias e da construção sindical.",
    links: [
      { label: "Jornais", href: "/jornais-de-epoca", icon: "newspaper" },
      { label: "Bibliografia", href: "/producao-bibliografica", icon: "book" },
    ],
  },
  quote: {
    text:
      "“Organizar é construir memória viva. Cada jornal passado de mão em mão também guardava nossas histórias.”",
    author: "Contemporâneos",
    note: "Depoimento registrado durante a iniciativa de seleção do acervo digital.",
  },
  downloads: [],
  navigation: {
    backLabel: "Voltar ao Acervo",
    backHref: "/acervo",
    note: "Para solicitações de uso e reprodução, consulte ",
    noteLink: { label: "Acesso à Informação", href: "/acesso-a-informacao" },
  },
  faq: [
    {
      q: "Qual o alcance temporal dos materiais?",
      a: "O foco está em registros entre 1940 e 1970, com destaque para documentos produzidos pelo movimento operário fluminense.",
    },
    {
      q: "Posso reproduzir imagens e documentos?",
      a: "Verifique as licenças e direitos indicados nos itens; pedidos especiais são avaliados via Acesso à Informação.",
    },
    {
      q: "Como contribuir com novas doações?",
      a: "Entre em contato por meio do formulário oficial e envie detalhes sobre a origem do material.",
    },
  ],
  steps: [
    { icon: "search", title: "Localize", text: "Use a busca ou filtros para chegar ao conteúdo." },
    { icon: "check", title: "Verifique", text: "Leia os termos de uso e permissões disponíveis." },
    { icon: "shield", title: "Solicite", text: "Envie um pedido com justificativa quando necessário." },
  ],
};
