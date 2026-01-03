import { PersonalArchiveModel } from "../models/personal-archive";

const RUBEM_COVER =
  "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg";
const RUBEM_PORTRAIT = "https://res.cloudinary.com/diwvlsgsw/image/upload/v1762965931/images_2_wysfnt.jpg";

const DOM_PORTRAIT =
  "https://res.cloudinary.com/dc7u5spia/image/upload/v1764469350/Pres%C3%A9pio_Igreja_Santa_Cec%C3%ADlia_-_dezembro_de_1968_nwjnrn.jpg";

const seeds = [
  {
    title: "Acervo Pessoal - Rubem Machado",
    slug: "rubem-machado",
    description:
      "Acervo pessoal com documentos, fotografias, entrevistas e registros do movimento operario em Volta Redonda.",
    coverImageUrl: RUBEM_COVER,
    status: "published",
    tags: ["Volta Redonda", "Movimento operario", "Jornais", "Historia oral"],
    relatedPersonSlug: "rubem-machado",
    content: {
      hero: {
        label: "Acervo Pessoal",
        name: "Rubem Machado",
        roles: ["Lideranca sindical", "Editor de boletins", "Organizador de base"],
        summary:
          "Figura central nas mobilizacoes operarias de Volta Redonda, articulou boletins e assembleias enquanto registrava documentos e fotografias do periodo.",
        biography:
          "O acervo reune fotografias de cotidiano fabril, atas de assembleias, boletins operarios e depoimentos gravados ao longo de decadas.",
        cover: RUBEM_COVER,
        portrait: RUBEM_PORTRAIT,
        stats: [
          { label: "Periodo", value: "1940-1970" },
          { label: "Local", value: "Volta Redonda - RJ" },
          { label: "Series", value: "Fotos, Documentos, Entrevistas, Boletins" },
        ],
        primaryCta: { label: "Ver fotografias", href: "/acervo/fotos" },
        secondaryCta: { label: "Explorar acervo completo", href: "/acervo" },
      },
      gallery: [
        {
          src: RUBEM_COVER,
          alt: "Funcionarios da siderurgica em Volta Redonda",
        },
        {
          src: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821791/Tropas_policiais_de_Barra_Mansa_Nova_Igua%C3%A7u_e_Niter%C3%B3i_reprimem_manifesta%C3%A7%C3%A3o_popular_em_ocasi%C3%A3o_do_assassinato_do_L%C3%ADder_sindical_Rubem_Machado_em_Volta_Redonda-RJ_1_iuqf4r.png",
          alt: "Registro de manifestacao popular em Volta Redonda",
        },
        {
          src: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821791/Tropas_policiais_de_Barra_Mansa_Nova_Igua%C3%A7u_e_Niter%C3%B3i_reprimem_manifesta%C3%A7%C3%A3o_popular_em_ocasi%C3%A3o_do_assassinato_do_L%C3%ADder_sindical_Rubem_Machado_em_Volta_Redonda-RJ_2_uls3kf.png",
          alt: "Cortejo e multidao na decada de 1950",
        },
        {
          src: RUBEM_PORTRAIT,
          alt: "Boletim operario da epoca",
        },
      ],
      documents: [
        {
          title: "Ata de Assembleia - Setembro de 1961",
          href: "/acervo/documentos/ata-1961-09",
          meta: "Documento - 18/09/1961",
        },
        {
          title: "Boletim Operario - Marco de 1952",
          href: "/acervo/boletins/1952-03",
          meta: "Jornal - 10/03/1952",
        },
        {
          title: "Boletim Operario - Julho de 1953",
          href: "/acervo/boletins/1953-07",
          meta: "Jornal - 05/07/1953",
        },
      ],
      interviews: [
        {
          title: "Entrevista com M. Santos - 1983",
          href: "/acervo/entrevistas/m-santos-1983",
          meta: "Audio + transcricao",
        },
      ],
      timeline: [
        { year: "1946", text: "Inicio das comissoes de fabrica e formacao politica local." },
        { year: "1952", text: "Coordenacao do Boletim Operario e rede de distribuicao regional." },
        { year: "1959", text: "Amplia a mobilizacao intersindical e frentes de solidariedade." },
        { year: "1961", text: "Assembleia com indicativo de greve e ata preservada." },
        { year: "1964", text: "Perseguicoes politicas e preservacao clandestina de materiais." },
      ],
      about: {
        heading: "Sobre o acervo",
        description:
          "O acervo reune fotografias, jornais com anotacoes, atas e entrevistas que guardam a memoria das mobilizacoes operarias.",
        links: [
          { label: "Jornais", href: "/jornais-de-epoca", icon: "newspaper" },
          { label: "Bibliografia", href: "/producao-bibliografica", icon: "book" },
        ],
      },
      quote: {
        text:
          "Organizar e construir memoria viva. Cada jornal passado de mao em mao tambem guardava nossas historias.",
        author: "Contemporaneos",
        note: "Relato registrado durante a selecao do acervo.",
      },
      downloads: [
        { label: "Guia do acervo (PDF)", href: "#" },
        { label: "Press kit (ZIP)", href: "#" },
      ],
      navigation: {
        backLabel: "Voltar ao acervo",
        backHref: "/acervo",
        note: "Para solicitacoes de uso e reproducao, consulte ",
        noteLink: { label: "Acesso a Informacao", href: "/acesso-a-informacao" },
      },
      faq: [
        {
          q: "Qual o alcance temporal dos materiais?",
          a: "O foco esta em registros entre 1940 e 1970, com destaque para documentos do movimento operario.",
        },
        {
          q: "Posso reproduzir imagens e documentos?",
          a: "Verifique licencas e direitos indicados nos itens; pedidos especiais sao avaliados via Acesso a Informacao.",
        },
        {
          q: "Como contribuir com novas doacoes?",
          a: "Entre em contato pelo formulario oficial e envie detalhes sobre a origem do material.",
        },
      ],
      steps: [
        { icon: "search", title: "Localize", text: "Use a busca ou filtros para chegar ao conteudo." },
        { icon: "check", title: "Verifique", text: "Leia os termos de uso e permissoes disponiveis." },
        { icon: "shield", title: "Solicite", text: "Envie um pedido com justificativa quando necessario." },
      ],
    },
  },
  {
    title: "Acervo Pessoal - Dom Waldyr Calheiros",
    slug: "dom-waldyr",
    description:
      "Acervo pessoal com cartas, relatos e registros de mediacao social de Dom Waldyr, com foco em direitos humanos.",
    coverImageUrl: DOM_PORTRAIT,
    status: "published",
    tags: ["Direitos humanos", "Pastoral operaria", "Ditadura", "Mediacao"],
    relatedPersonSlug: "dom-waldyr",
    relatedFundKey: "dom-waldyr",
    content: {
      hero: {
        label: "Acervo Pessoal",
        name: "Dom Waldyr Calheiros",
        roles: ["Bispo", "Mediacao social", "Pastoral operaria"],
        summary:
          "Acervo pessoal com registros de mediacao social, cartas pastorais e apoio a movimentos de trabalhadores.",
        biography:
          "O conjunto preserva recortes, documentos e fotografias ligados a defesa de direitos humanos e articulacao social.",
        cover: DOM_PORTRAIT,
        portrait: DOM_PORTRAIT,
        stats: [
          { label: "Periodo", value: "1960-1990" },
          { label: "Local", value: "Volta Redonda - RJ" },
          { label: "Series", value: "Cartas, Documentos, Jornais, Fotografias" },
        ],
        primaryCta: { label: "Ver documentos", href: "/acervo/documentos" },
        secondaryCta: { label: "Explorar fundo Dom Waldyr", href: "/acervo/fundos/dom-waldyr" },
      },
      gallery: [{ src: DOM_PORTRAIT, alt: "Registro fotografico de Dom Waldyr" }],
      navigation: {
        backLabel: "Voltar ao acervo",
        backHref: "/acervo",
        note: "Para solicitacoes de uso e reproducao, consulte ",
        noteLink: { label: "Acesso a Informacao", href: "/acesso-a-informacao" },
      },
    },
  },
];

export async function ensurePersonalArchivesSeeded() {
  for (const seed of seeds) {
    const exists = await PersonalArchiveModel.exists({ slug: seed.slug });
    if (exists) continue;
    await PersonalArchiveModel.create({
      ...seed,
      publishedAt: seed.status === "published" ? new Date() : null,
    });
  }
}
