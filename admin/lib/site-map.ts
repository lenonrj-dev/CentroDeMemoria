import type { AdminModule } from "./public-site";
import { publicUrl } from "./public-site";

export type SitePlacement = {
  label: string;
  path: string;
  url: string;
  displayType: string;
  cardFields: string[];
  readingFields: string[];
};

export type ModuleSiteMap = {
  module: AdminModule;
  label: string;
  placements: SitePlacement[];
};

function place(path: string, label: string, displayType: string, cardFields: string[], readingFields: string[]): SitePlacement {
  return { path, label, url: publicUrl(path), displayType, cardFields, readingFields };
}

export const MODULE_SITE_MAP: ModuleSiteMap[] = [
  {
    module: "documentos",
    label: "Documentos",
    placements: [
      place(
        "/acervo/documentos",
        "Acervo (lista)",
        "grid de cards + filtros",
        ["coverImageUrl", "title", "description", "tags", "status (admin)"],
        ["title", "description", "fileUrl", "images[]", "tags", "publishedAt/year"]
      ),
      place(
        "/acervo/cartazes",
        "Cartazes & panfletos (lista)",
        "grid de cards + filtros",
        ["coverImageUrl", "title", "description", "tags"],
        ["title", "description", "fileUrl/images[]"]
      ),
      place(
        "/acervo/documentos/[slug]",
        "Leitura (página do item)",
        "página de leitura",
        ["coverImageUrl", "title", "description"],
        ["fileUrl", "images[]", "tags", "metadados"]
      ),
    ],
  },
  {
    module: "depoimentos",
    label: "Depoimentos",
    placements: [
      place(
        "/acervo/entrevistas",
        "História oral (lista)",
        "grid de cards + filtros",
        ["coverImageUrl", "title", "description", "tags"],
        ["authorName", "authorRole", "testimonialText", "attachments[]"]
      ),
      place(
        "/acervo/entrevistas/[slug]",
        "Leitura (página do depoimento)",
        "página de leitura",
        ["coverImageUrl", "title", "description"],
        ["authorName", "testimonialText", "attachments[]"]
      ),
    ],
  },
  {
    module: "referencias",
    label: "Referência bibliográfica",
    placements: [
      place(
        "/producao-bibliografica",
        "Produção bibliográfica (lista)",
        "grid/lista + filtros",
        ["coverImageUrl", "title", "description", "authors[]", "year", "tags"],
        ["citation", "authors[]", "year", "externalUrl", "attachments[]"]
      ),
      place(
        "/acervo/[cidade]/referencia-bibliografica",
        "Acervo por cidade (lista)",
        "grid de cards",
        ["coverImageUrl", "title", "description"],
        ["citation/year"]
      ),
    ],
  },
  {
    module: "jornais",
    label: "Jornais de época",
    placements: [
      place(
        "/jornais-de-epoca",
        "Jornais (lista principal)",
        "grid de capas + filtros",
        ["coverImageUrl", "title", "description", "issueDate", "tags"],
        ["pages[]", "pdfUrl", "issueDate", "city"]
      ),
      place(
        "/jornais-de-epoca/[slug]",
        "Leitor (edição)",
        "leitor de páginas / zoom",
        ["coverImageUrl", "title"],
        ["pages[]", "pdfUrl", "issueDate"]
      ),
      place(
        "/acervo/boletins",
        "Boletins (acervo)",
        "grid de cards",
        ["coverImageUrl", "title", "description"],
        ["pdfUrl/pages[]"]
      ),
    ],
  },
  {
    module: "acervo-fotografico",
    label: "Acervo fotográfico",
    placements: [
      place(
        "/acervo/fotos",
        "Galeria (lista)",
        "grid de cards",
        ["coverImageUrl", "title", "description", "tags"],
        ["photos[]", "caption/date/location"]
      ),
      place(
        "/acervo/fotos/[slug]",
        "Álbum (leitura)",
        "galeria + lightbox",
        ["coverImageUrl", "title"],
        ["photos[]", "caption/date/location"]
      ),
    ],
  },
  {
    module: "acervos-pessoais",
    label: "Acervos pessoais",
    placements: [
      place(
        "/acervo-pessoal",
        "Lista de acervos pessoais",
        "grid de cards",
        ["coverImageUrl", "title", "description", "tags"],
        ["content.hero", "content.gallery"]
      ),
      place(
        "/acervo-pessoal/[slug]",
        "Acervo pessoal (pagina)",
        "pagina editorial",
        ["coverImageUrl", "title", "description"],
        ["content.* (hero, timeline, gallery, links)"]
      ),
    ],
  },
];

export function getModuleMap(module: AdminModule) {
  return MODULE_SITE_MAP.find((m) => m.module === module) || null;
}
