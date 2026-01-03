import { COLLECTION_META } from "../api";
import type { AcervoItem, CollectionKey } from "../api";

export const FALLBACK_IMG =
  "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg";

export const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export const isCollectionKey = (value?: string | null): value is CollectionKey =>
  value === "boletins" || value === "documentos" || value === "entrevistas" || value === "cartazes" || value === "fotos";

export function emptyFallback(collection: CollectionKey, slug: string): AcervoItem {
  return {
    id: `${collection}/${slug}`,
    collection,
    slug,
    title: `${COLLECTION_META[collection]?.typeLabel || "Item"}: ${slug}`,
    date: "s/d",
    location: "Acervo",
    cover: FALLBACK_IMG,
    tags: ["Em preparo"],
    summary: "Conteúdo em preparo. Este item ainda está sendo digitalizado e descrito.",
    body: [
      "Estamos trabalhando para disponibilizar a versão digitalizada e a descrição completa deste item do acervo.",
    ],
    files: [],
  };
}
