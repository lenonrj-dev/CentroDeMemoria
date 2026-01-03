export type SectionKey =
  | "documentos"
  | "depoimentos"
  | "referencia-bibliografica"
  | "jornais-de-epoca"
  | "acervo-fotografico";

export type SectionItem = {
  title: string;
  summary: string;
  date: string;
  href: string;
  thumb: string;
};

export type CitySection = {
  key: SectionKey;
  title: string;
  description: string;
  href: string;
  thumb: string;
  items: SectionItem[];
};

export type CityData = {
  slug: string;
  name: string;
  description: string;
  coverage: string;
  focus: string[];
  image: string;
  sections: CitySection[];
};

const commonRefs = {
  docThumb: "/file.svg",
  imgThumb: "/hero.png",
  coverVr: "/hero.png",
  coverBm: "/CUT.png",
  iconRef: "/globe.svg",
  iconJornal: "/window.svg",
};

export const cities: CityData[] = [
  {
    slug: "volta-redonda",
    name: "Volta Redonda",
    description:
      "Eixo industrial com greves históricas, organização por seção e produção documental intensa ligada à construção civil e metalurgia.",
    coverage:
      "Anos 1940–2000 | movimentos paredistas, cotidiano fabril e memória sindical.",
    focus: [
      "Documentação sindical",
      "História oral",
      "Clippings e bibliografia",
      "Fotografia de mobilização",
    ],
    image: commonRefs.coverVr,
    sections: [
      {
        key: "documentos",
        title: "Documentos",
        description: "Atas, ofícios e relatórios das bases de Volta Redonda.",
        href: "/acervo/volta-redonda/documentos",
        thumb: commonRefs.docThumb,
        items: [
          {
            title: "Ata de Assembleia – 1961",
            summary: "Deliberação sobre pauta salarial e comissão de base.",
            date: "1961-09-18",
            href: "/acervo/volta-redonda/documentos",
            thumb: commonRefs.docThumb,
          },
          {
            title: "Relatório de Gestão – 1965",
            summary: "Síntese de atividades e finanças da categoria.",
            date: "1965-12-20",
            href: "/acervo/volta-redonda/documentos",
            thumb: commonRefs.docThumb,
          },
        ],
      },
      {
        key: "depoimentos",
        title: "Depoimentos",
        description: "História oral com lideranças e chão de fábrica.",
        href: "/acervo/volta-redonda/depoimentos",
        thumb: commonRefs.imgThumb,
        items: [
          {
            title: "Entrevista com M. Santos – 1983",
            summary: "Relatos de organização por seção e alianças.",
            date: "1983-11-02",
            href: "/acervo/volta-redonda/depoimentos",
            thumb: commonRefs.imgThumb,
          },
          {
            title: "Depoimento A. Oliveira – 1978",
            summary: "Memórias de mobilizações e solidariedade.",
            date: "1978-06-15",
            href: "/acervo/volta-redonda/depoimentos",
            thumb: commonRefs.imgThumb,
          },
        ],
      },
      {
        key: "referencia-bibliografica",
        title: "Referência Bibliográfica",
        description: "Clippings, livros e artigos sobre Volta Redonda.",
        href: "/acervo/volta-redonda/referencia-bibliografica",
        thumb: commonRefs.iconRef,
        items: [
          {
            title: "Clipping VR – anos 80",
            summary: "Recortes de imprensa sobre greves e negociações.",
            date: "1980-01-01",
            href: "/acervo/volta-redonda/referencia-bibliografica",
            thumb: commonRefs.iconRef,
          },
          {
            title: "Bibliografia básica",
            summary: "Listagem de livros e artigos de referência.",
            date: "1985-01-01",
            href: "/acervo/volta-redonda/referencia-bibliografica",
            thumb: commonRefs.iconRef,
          },
        ],
      },
      {
        key: "jornais-de-epoca",
        title: "Jornais de época",
        description: "Capas e edições digitalizadas de Volta Redonda.",
        href: "/acervo/volta-redonda/jornais-de-epoca",
        thumb: commonRefs.iconJornal,
        items: [
          {
            title: "Boletim Operário – 1952",
            summary: "Paralisações e negociações no início de 1952.",
            date: "1952-03-10",
            href: "/acervo/volta-redonda/jornais-de-epoca",
            thumb: commonRefs.iconJornal,
          },
          {
            title: "Edição histórica – 1953",
            summary: "Chamadas e registros fotográficos.",
            date: "1953-07-05",
            href: "/acervo/volta-redonda/jornais-de-epoca",
            thumb: commonRefs.iconJornal,
          },
        ],
      },
      {
        key: "acervo-fotografico",
        title: "Acervo Fotográfico",
        description: "Mobilização e cotidiano fabril em imagens.",
        href: "/acervo/volta-redonda/acervo-fotografico",
        thumb: commonRefs.imgThumb,
        items: [
          {
            title: "Pátio da fábrica – 1948",
            summary: "Registro do cotidiano e do ambiente industrial.",
            date: "1948-06-01",
            href: "/acervo/volta-redonda/acervo-fotografico",
            thumb: commonRefs.imgThumb,
          },
          {
            title: "Assembleia na praça",
            summary: "Momento de votação e mobilização.",
            date: "1950-01-01",
            href: "/acervo/volta-redonda/acervo-fotografico",
            thumb: commonRefs.imgThumb,
          },
        ],
      },
    ],
  },
  {
    slug: "barra-mansa",
    name: "Barra Mansa",
    description:
      "Redes regionais de apoio, organização por bairros e memória operária conectada ao Vale do Paraíba.",
    coverage:
      "Anos 1930–2000 | bases locais, assembleias e cultura sindical.",
    focus: [
      "Atas e ofícios",
      "Relatos de trabalhadores",
      "Recortes de imprensa",
      "Fotografia do território",
    ],
    image: commonRefs.coverBm,
    sections: [
      {
        key: "documentos",
        title: "Documentos",
        description: "Ofícios, atas e normativas locais de Barra Mansa.",
        href: "/acervo/barra-mansa/documentos",
        thumb: commonRefs.docThumb,
        items: [
          {
            title: "Ofício ao MT – 1958",
            summary: "Pedido de mediação em dissídio coletivo.",
            date: "1958-02-09",
            href: "/acervo/barra-mansa/documentos",
            thumb: commonRefs.docThumb,
          },
          {
            title: "Ata de assembleia – 1950",
            summary: "Chamada à organização e calendário de reuniões.",
            date: "1950-11-14",
            href: "/acervo/barra-mansa/documentos",
            thumb: commonRefs.docThumb,
          },
        ],
      },
      {
        key: "depoimentos",
        title: "Depoimentos",
        description: "Vozes de trabalhadores e dirigentes locais.",
        href: "/acervo/barra-mansa/depoimentos",
        thumb: commonRefs.imgThumb,
        items: [
          {
            title: "Depoimento A. Oliveira – 1978",
            summary: "Memórias de mobilizações e solidariedade.",
            date: "1978-06-15",
            href: "/acervo/barra-mansa/depoimentos",
            thumb: commonRefs.imgThumb,
          },
          {
            title: "Relato comunitário – 1980",
            summary: "Redes de apoio intersindical.",
            date: "1980-01-01",
            href: "/acervo/barra-mansa/depoimentos",
            thumb: commonRefs.imgThumb,
          },
        ],
      },
      {
        key: "referencia-bibliografica",
        title: "Referência Bibliográfica",
        description: "Bibliografia e catálogos sobre Barra Mansa.",
        href: "/acervo/barra-mansa/referencia-bibliografica",
        thumb: commonRefs.iconRef,
        items: [
          {
            title: "Clipping BM – década de 80",
            summary: "Recortes de imprensa sobre negociações locais.",
            date: "1985-01-01",
            href: "/acervo/barra-mansa/referencia-bibliografica",
            thumb: commonRefs.iconRef,
          },
          {
            title: "Bibliografia básica",
            summary: "Lista de livros e artigos sobre o território.",
            date: "1990-01-01",
            href: "/acervo/barra-mansa/referencia-bibliografica",
            thumb: commonRefs.iconRef,
          },
        ],
      },
      {
        key: "jornais-de-epoca",
        title: "Jornais de época",
        description: "Recortes e edições históricas de Barra Mansa.",
        href: "/acervo/barra-mansa/jornais-de-epoca",
        thumb: commonRefs.iconJornal,
        items: [
          {
            title: "Edição histórica – 1937",
            summary: "Cobertura de marchas e assembleias.",
            date: "1937-07-17",
            href: "/acervo/barra-mansa/jornais-de-epoca",
            thumb: commonRefs.iconJornal,
          },
          {
            title: "Boletim local – 1953",
            summary: "Chamadas e registros fotográficos.",
            date: "1953-07-05",
            href: "/acervo/barra-mansa/jornais-de-epoca",
            thumb: commonRefs.iconJornal,
          },
        ],
      },
      {
        key: "acervo-fotografico",
        title: "Acervo Fotográfico",
        description: "Imagens de mobilização e cotidiano da cidade.",
        href: "/acervo/barra-mansa/acervo-fotografico",
        thumb: commonRefs.imgThumb,
        items: [
          {
            title: "Registro de assembleia",
            summary: "Votação e mobilização na praça central.",
            date: "1950-01-01",
            href: "/acervo/barra-mansa/acervo-fotografico",
            thumb: commonRefs.imgThumb,
          },
          {
            title: "Cena urbana",
            summary: "Cotidiano do território industrial.",
            date: "1948-06-01",
            href: "/acervo/barra-mansa/acervo-fotografico",
            thumb: commonRefs.imgThumb,
          },
        ],
      },
    ],
  },
];

export function getCity(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getSection(city: CityData, key: SectionKey): CitySection | undefined {
  return city.sections.find((s) => s.key === key);
}

