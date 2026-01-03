// app/acervo/api.ts
// Base de dados mockada + helpers para coleções e itens do Acervo.
// Troque pelos seus dados reais quando quiser (mantém mesma API).

export const COLLECTION_META = {
  boletins: { label: "Jornais de Época", typeLabel: "Jornal" },
  documentos: { label: "Documentos", typeLabel: "Documento" },
  entrevistas: { label: "História Oral", typeLabel: "Entrevista" },
  cartazes: { label: "Cartazes & Panfletos", typeLabel: "Cartaz" },
  fotos: { label: "Acervo Fotográfico", typeLabel: "Foto" }, // já existe sua seção
} as const;

export type CollectionKey = keyof typeof COLLECTION_META;

type FileEntry = { label: string; url: string };

export type AcervoItem = {
  id: string;
  collection: CollectionKey;
  slug: string;
  title: string;
  date: string;
  location: string;
  cover: string;
  mediaType?: "youtube" | "image" | "text";
  youtubeId?: string;
  imageUrl?: string;
  tags: string[];
  summary: string;
  body: string[];
  files: FileEntry[];
};

const IMG =
  "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg";

export const ACERVO_ITEMS: AcervoItem[] = [
  // ==================== BOLETINS ====================
  {
    id: "boletins/1952-03",
    collection: "boletins",
    slug: "1952-03",
    title: "Boletim Operário – Março de 1952",
    date: "1952-03-10",
    location: "VR–RJ",
    cover: IMG,
    tags: ["Boletins", "Greves", "Metalúrgicos"],
    summary: "Paralisações e negociações de base no início de 1952 com pautas salariais.",
    body: [
      "Reportagens sobre piquetes em portarias e análise de conjuntura do custo de vida.",
      "Carta da Redação reforça assembleias como espaço soberano de deliberação.",
    ],
    files: [{ label: "PDF digitalizado", url: IMG }],
  },
  {
    id: "boletins/1953-07",
    collection: "boletins",
    slug: "1953-07",
    title: "Boletim Operário – Julho de 1953",
    date: "1953-07-05",
    location: "VR–RJ",
    cover: IMG,
    tags: ["Boletins", "Greves"],
    summary: "Edição dedicada às negociações do semestre e depoimentos de lideranças.",
    body: ["Mesa de negociação e cobertura fotográfica das assembleias."],
    files: [{ label: "PDF digitalizado", url: IMG }],
  },
  {
    id: "boletins/1950-11",
    collection: "boletins",
    slug: "1950-11",
    title: "Boletim Operário – Novembro de 1950",
    date: "1950-11-14",
    location: "VR–RJ",
    cover: IMG,
    tags: ["Boletins", "Organização"],
    summary: "Chamada à organização por seção e calendário de reuniões por bairro.",
    body: ["Editorial sobre sindicalização e comissões de fábrica."],
    files: [{ label: "PDF digitalizado", url: IMG }],
  },

  // ==================== DOCUMENTOS ====================
  {
    id: "documentos/ata-1961-09",
    collection: "documentos",
    slug: "ata-1961-09",
    title: "Ata de Assembleia – Setembro de 1961",
    date: "1961-09-18",
    location: "Sede do Sindicato",
    cover: IMG,
    tags: ["Atas", "Assembleia"],
    summary: "Registro deliberativo sobre pauta salarial e eleição de delegados.",
    body: [
      "Aprovação de indicativo de greve caso não haja avanço na próxima rodada.",
      "Eleita comissão de comunicação para ampliar distribuição de boletins.",
    ],
    files: [
      { label: "PDF (fac-símile)", url: IMG },
      { label: "Transcrição (txt)", url: "#" },
    ],
  },
  {
    id: "documentos/oficio-1958-02",
    collection: "documentos",
    slug: "oficio-1958-02",
    title: "Ofício ao Ministério do Trabalho – Fevereiro de 1958",
    date: "1958-02-09",
    location: "Rio de Janeiro",
    cover: IMG,
    tags: ["Ofícios", "Negociação"],
    summary: "Pedido de mediação em dissídio coletivo e abertura de mesa tripartite.",
    body: ["Ofício protocolado com pauta e documentação anexa."],
    files: [{ label: "PDF digitalizado", url: IMG }],
  },
  {
    id: "documentos/relatorio-1965",
    collection: "documentos",
    slug: "relatorio-1965",
    title: "Relatório de Gestão – 1965",
    date: "1965-12-20",
    location: "VR–RJ",
    cover: IMG,
    tags: ["Relatórios", "Prestação de contas"],
    summary: "Síntese de atividades, finanças e participação em conselhos.",
    body: ["Quadros de evolução de associados e balanço orçamentário."],
    files: [{ label: "PDF digitalizado", url: IMG }],
  },

  // ==================== ENTREVISTAS ====================
  {
    id: "entrevistas/m-santos-1983",
    collection: "entrevistas",
    slug: "m-santos-1983",
    title: "Entrevista com M. Santos – 1983",
    date: "1983-11-02",
    location: "Estúdio do Sindicato",
    cover: IMG,
    tags: ["Oral", "Lideranças"],
    summary: "Depoimento sobre organização por seção e construção de alianças.",
    body: ["Relatos de greves gerais e implicações na base por turnos."],
    files: [
      { label: "Áudio (mp3)", url: "#" },
      { label: "Transcrição (pdf)", url: "#" },
    ],
  },
  {
    id: "entrevistas/a-oliveira-1978",
    collection: "entrevistas",
    slug: "a-oliveira-1978",
    title: "Entrevista com A. Oliveira – 1978",
    date: "1978-06-15",
    location: "VR–RJ",
    cover: IMG,
    tags: ["Oral", "Memória"],
    summary: "Memórias de mobilizações e redes de solidariedade intersindical.",
    body: ["Registros de campanhas salariais e apoio de associações de bairro."],
    files: [{ label: "Áudio (mp3)", url: "#" }],
  },

  // ==================== CARTAZES ====================
  {
    id: "cartazes/1979-mob",
    collection: "cartazes",
    slug: "1979-mob",
    title: "Cartaz de Mobilização – 1979",
    date: "1979-04-20",
    location: "VR–RJ",
    cover: IMG,
    tags: ["Cartazes", "Mobilização"],
    summary: "Convocação para assembleia unificada com palavras de ordem.",
    body: ["Orientações sobre votação e concentração na praça central."],
    files: [{ label: "Imagem (alta)", url: IMG }],
  },
  {
    id: "cartazes/1984-assembleia",
    collection: "cartazes",
    slug: "1984-assembleia",
    title: "Cartaz – Assembleia Geral 1984",
    date: "1984-09-03",
    location: "Ginásio Municipal",
    cover: IMG,
    tags: ["Cartazes", "Assembleia"],
    summary: "Arte gráfica convocando assembleia de deliberação de pauta.",
    body: ["Layout com horários, local e QR para panfleto digital."],
    files: [{ label: "Imagem (alta)", url: IMG }],
  },
  {
    id: "cartazes/1972-1maio",
    collection: "cartazes",
    slug: "1972-1maio",
    title: "Cartaz – 1º de Maio 1972",
    date: "1972-05-01",
    location: "VR–RJ",
    cover: IMG,
    tags: ["Cartazes", "Comemorações"],
    summary: "Programação cultural e ato público no Dia do Trabalhador.",
    body: ["Programação musical e atos simbólicos de homenagem."],
    files: [{ label: "Imagem (alta)", url: IMG }],
  },
];

export function getCollectionItems(collection: CollectionKey): AcervoItem[] {
  return ACERVO_ITEMS.filter((it) => it.collection === collection);
}

export function getItem(collection: CollectionKey, slug: string): AcervoItem | undefined {
  return ACERVO_ITEMS.find((it) => it.collection === collection && it.slug === slug);
}

export function searchItems(q = ""): AcervoItem[] {
  const s = q.trim().toLowerCase();
  if (!s) return ACERVO_ITEMS;
  return ACERVO_ITEMS.filter((it) =>
    `${it.title} ${it.summary} ${it.tags.join(" ")}`.toLowerCase().includes(s)
  );
}

export function relatedFor(item: AcervoItem, limit = 6): AcervoItem[] {
  const pool = ACERVO_ITEMS.filter((it) => it.collection === item.collection && it.id !== item.id);
  const scored = pool
    .map((it) => ({ it, score: it.tags.filter((t) => item.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.it);
}
