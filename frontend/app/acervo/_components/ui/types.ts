export type BreadcrumbItem = { label: string; href?: string };

export type DocumentCardProps = {
  title: string;
  summary: string;
  date: string;
  location?: string;
  tags?: string[];
  href?: string;
};

export type DepoimentoCardProps = {
  author: string;
  role?: string;
  excerpt: string;
  date?: string;
  theme?: string;
  avatar?: string;
  href?: string;
  mediaType?: "youtube" | "image" | "text";
  youtubeId?: string;
  imageUrl?: string;
};

export type ReferenciaCardProps = {
  title: string;
  authors: string;
  year: string;
  type: "Livro" | "Artigo" | "Tese";
  source: string;
  citation: string;
};

export type PhotoItem = {
  src: string;
  alt: string;
  year: string;
  location: string;
  description: string;
  tags?: string[];
};

export type TimelineItem = {
  year: string;
  title: string;
  description: string;
};
