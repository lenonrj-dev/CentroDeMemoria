import type { FieldHelp } from "./FieldHelpTooltip";

export const HELP = {
  title: {
    what: "Título principal do item.",
    where: "Aparece no card, nas listas e no topo da página de leitura.",
    example: "Carta do sindicato (1980).",
  },
  slug: {
    what: "Identificador da URL, sem espaços e caracteres especiais.",
    where: "Usado nas rotas públicas do item.",
    example: "carta-do-sindicato-1980",
  },
  description: {
    what: "Resumo curto e objetivo do conteúdo.",
    where: "Aparece no card e no início da leitura.",
    example: "Resumo da carta e contexto histórico.",
  },
  coverImageUrl: {
    what: "Imagem de capa do item.",
    where: "Aparece no card e em destaques.",
    example: "https://res.cloudinary.com/.../cover.jpg",
  },
  tags: {
    what: "Palavras-chave para filtro e busca.",
    where: "Usado em filtros por tema, cidade ou fundo.",
    example: "dom-waldyr, volta-redonda",
  },
  relatedPersonSlug: {
    what: "Vínculo com um acervo pessoal.",
    where: "Exibe o item na página da pessoa.",
    example: "dom-waldyr",
  },
  relatedFundKey: {
    what: "Vínculo com um fundo do acervo.",
    where: "Exibe o item na página do fundo.",
    example: "dom-waldyr",
  },
  year: {
    what: "Ano principal do item.",
    where: "Usado em filtros e ordenação.",
    example: "1980",
  },
  authors: {
    what: "Autores do documento.",
    where: "Aparece nos detalhes e em filtros.",
    example: "Nome 1, Nome 2",
  },
  source: {
    what: "Origem do material.",
    where: "Aparece nos detalhes do item.",
    example: "Arquivo do sindicato",
  },
  collection: {
    what: "Coleção ou cidade do item.",
    where: "Organiza o item em listagens.",
    example: "Barra Mansa",
  },
  featured: {
    what: "Marca o item como destaque.",
    where: "Prioriza a exibição em listas e na home.",
    example: "Ative para destacar no site.",
  },
  sortOrder: {
    what: "Ordem manual (número).",
    where: "Usado quando o site ordena por destaque.",
    example: "1",
  },
  fileUrl: {
    what: "Arquivo principal do item.",
    where: "Usado para leitura ou visualização.",
    example: "https://.../arquivo.pdf",
  },
  documentType: {
    what: "Tipo de conteúdo do documento.",
    where: "Define como o leitor exibe o item.",
    example: "pdf, image ou mixed",
  },
  images: {
    what: "Páginas em imagem.",
    where: "Aparecem no leitor do documento.",
    example: "https://.../page-01.jpg",
  },
  citation: {
    what: "Referência bibliográfica completa.",
    where: "Aparece no texto principal da página.",
    example: "SOBRENOME, Nome. Título. Editora, ano.",
  },
  publisher: {
    what: "Editora ou entidade responsável.",
    where: "Aparece nos detalhes da referência.",
    example: "Editora X",
  },
  isbn: {
    what: "Código ISBN do item.",
    where: "Aparece nos detalhes da referência.",
    example: "9780000000000",
  },
  externalUrl: {
    what: "Link externo complementar.",
    where: "Aparece como link na página do item.",
    example: "https://site-oficial.com",
  },
  attachments: {
    what: "Links extras do item.",
    where: "Aparecem como mídias adicionais.",
    example: "PDF completo, imagem de capa",
  },
  status: {
    what: "Situação do item.",
    where: "Somente itens publicados aparecem no site.",
    example: "draft ou published",
  },
  search: {
    what: "Pesquisa por palavras-chave.",
    where: "Filtra os itens da lista.",
    example: "greve, 1980, carta",
  },
  email: {
    what: "E-mail autorizado do admin.",
    where: "Usado apenas para login no admin.",
    example: "admin@exemplo.com",
  },
  password: {
    what: "Senha de acesso do admin.",
    where: "Usada apenas para login no admin.",
    example: "********",
  },
  listView: {
    what: "Modo de visualização da lista.",
    where: "Aparece somente no admin.",
    example: "Tabela ou cards",
  },
  mediaType: {
    what: "Tipo de mídia do item.",
    where: "Define se é vídeo, imagem ou texto.",
    example: "youtube",
  },
  youtubeUrl: {
    what: "Link do YouTube.",
    where: "Gera o embed do vídeo no site.",
    example: "https://youtu.be/ID",
  },
  imageUrl: {
    what: "Imagem principal.",
    where: "Exibida no card e nos detalhes.",
    example: "https://res.cloudinary.com/.../foto.jpg",
  },
  quote: {
    what: "Trecho principal do depoimento.",
    where: "Aparece na listagem e nos detalhes.",
    example: "Relato curto sobre o tema.",
  },
  role: {
    what: "Cargo ou função do autor.",
    where: "Aparece junto ao nome.",
    example: "Operário, líder sindical",
  },
  location: {
    what: "Localização relacionada.",
    where: "Aparece nos detalhes do item.",
    example: "Volta Redonda",
  },
  date: {
    what: "Data principal do item.",
    where: "Aparece nas listas e nos detalhes.",
    example: "1980-05-12",
  },
  coverPreview: {
    what: "Ajuste visual do preview.",
    where: "Somente no admin; não altera a imagem original.",
    example: "Largura 520px, altura 160px",
  },
} satisfies Record<string, FieldHelp>;
