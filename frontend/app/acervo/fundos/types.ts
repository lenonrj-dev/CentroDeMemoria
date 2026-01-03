export type BaseItem = { title: string; summary: string; date: string; location?: string; tags?: string[]; image?: string };
export type DepItem = { author: string; role: string; excerpt: string; date: string; theme: string; avatar: string };
export type RefItem = { title: string; authors: string; year: string; type: "Livro" | "Artigo" | "Tese"; source: string; citation: string };
export type PhotoItem = { src: string; alt: string; caption: string; year: string; location: string; description: string };

export type Fund = {
  name: string;
  slug: string;
  summary: string;
  highlights: string[];
  image: string;
  documents: BaseItem[];
  depoimentos: DepItem[];
  referencias: RefItem[];
  jornais: BaseItem[];
  fotos: PhotoItem[];
};
