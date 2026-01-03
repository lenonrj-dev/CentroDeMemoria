export const heroImage =
  "https://res.cloudinary.com/dc7u5spia/image/upload/v1764469350/Pres%C3%A9pio_Igreja_Santa_Cec%C3%ADlia_-_dezembro_de_1968_nwjnrn.jpg";

export type DocumentItem = {
  title: string;
  summary: string;
  date: string;
  location: string;
  tags: string[];
};

export const documents: DocumentItem[] = [
  {
    title: "Carta Pastoral sobre Justiça Social",
    summary:
      "Enfatiza a defesa dos direitos trabalhistas, a mediação de conflitos na CSN e o apelo por dignidade nas comunidades operárias.",
    date: "1978-06-12",
    location: "Volta Redonda",
    tags: ["Justiça social", "Greves", "Negociação"],
  },
  {
    title: "Relatório das Visitas às Vilas Operárias",
    summary:
      "Registros das condições de moradia, saúde e educação recolhidos durante as visitas pastorais em bairros fabris.",
    date: "1981-03-04",
    location: "Barra Mansa",
    tags: ["Assistência", "Moradia", "Comunidade"],
  },
  {
    title: "Notas sobre Mediação nos Acordos de 1985",
    summary:
      "Síntese das reuniões entre sindicato, empresa e Diocese para mitigar repressões e garantir liberdade de expressão.",
    date: "1985-09-18",
    location: "Volta Redonda",
    tags: ["Mediação", "Direitos humanos"],
  },
];

export type DepoimentoItem = {
  author: string;
  role: string;
  excerpt: string;
  date: string;
  theme: string;
  avatar: string;
  mediaType?: "youtube" | "image" | "text";
  youtubeId?: string;
  imageUrl?: string;
};

export const depoimentos: DepoimentoItem[] = [
  {
    author: "Pe. Antônio Ribeiro",
    role: "Assessoria Pastoral",
    excerpt:
      '"Dom Waldyr caminhava conosco nas portarias, escutando cada grupo. Ele insistia que fé e justiça eram inseparáveis das pautas salariais."',
    date: "1984",
    theme: "Mediação e escuta",
    avatar: "/hero.png",
    mediaType: "image",
    imageUrl: "/hero.png",
  },
  {
    author: "Lúcia Fernandes",
    role: "Agente de Pastoral Operária",
    excerpt:
      '"Nos círculos bíblicos, ele nos pedia para registrar memórias. Esses cadernos hoje são parte do acervo e contam o cotidiano invisível."',
    date: "1982",
    theme: "Memória e registros",
    avatar: "/hero.png",
    mediaType: "image",
    imageUrl: "/hero.png",
  },
];

export type ReferenciaItem = {
  title: string;
  authors: string;
  year: string;
  type: "Livro" | "Artigo" | "Tese";
  source: string;
  citation: string;
};

export const referencias: ReferenciaItem[] = [
  {
    title: "Dom Waldyr e a Pastoral Operária",
    authors: "Moura, C.; Ferreira, J.",
    year: "1998",
    type: "Livro",
    source: "Editora Arquidiocesana",
    citation: "Moura, C.; Ferreira, J. Dom Waldyr e a Pastoral Operária. Editora Arquidiocesana, 1998.",
  },
  {
    title: "Mediação de Conflitos Trabalhistas na Diocese de Barra do Piraí-Volta Redonda",
    authors: "Almeida, P.; Silva, R.",
    year: "2004",
    type: "Artigo",
    source: "Revista Estudos Sociais, v.12",
    citation:
      "Almeida, P.; Silva, R. Mediação de Conflitos Trabalhistas na Diocese de Barra do Piraí-Volta Redonda. Estudos Sociais, 12, 2004.",
  },
];

export type JournalItem = {
  title: string;
  summary: string;
  date: string;
  location: string;
  tags: string[];
};

export const jornais: JournalItem[] = [
  {
    title: "Boletim Solidário",
    summary: "Publicação da Diocese com notas de apoio às greves e convites para assembleias de base.",
    date: "1979-04-10",
    location: "Volta Redonda",
    tags: ["Solidariedade", "Greves"],
  },
  {
    title: "Circular Pastoral: Direitos Humanos",
    summary: "Edição especial destacando denúncias e chamadas para vigília em defesa dos perseguidos.",
    date: "1983-11-22",
    location: "Barra Mansa",
    tags: ["Direitos humanos", "Pastoral"],
  },
];

export type FotoItem = {
  src: string;
  alt: string;
  caption: string;
  year: string;
  location: string;
  description: string;
};

export const fotos: FotoItem[] = [
  {
    src: heroImage,
    alt: "Dom Waldyr em assembleia com trabalhadores",
    caption: "Mediação durante assembleia em 1983",
    year: "1983",
    location: "Volta Redonda",
    description: "Dom Waldyr acompanha assembleia e media pautas trabalhistas ao lado de lideranças locais.",
  },
  {
    src: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
    alt: "Reunião comunitária na paróquia",
    caption: "Círculo de leitura e organização de cadernos de memória",
    year: "1981",
    location: "Barra Mansa",
    description: "Grupo de agentes discutindo relatos para organizar o acervo e registrar memórias comunitárias.",
  },
  {
    src: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
    alt: "Visita pastoral em vila operária",
    caption: "Registro das condições de moradia e saúde",
    year: "1980",
    location: "Volta Redonda",
    description: "Visita pastoral às vilas operárias para observar condições de moradia e demandas sociais.",
  },
];
