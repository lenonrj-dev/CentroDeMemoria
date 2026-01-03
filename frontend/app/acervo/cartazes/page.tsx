// app/acervo/cartazes/page.jsx (SERVER)
export const metadata = {
  title: "Cartazes & Panfletos — Banco de Memória",
  description: "Materiais gráficos de campanha, mobilização e eventos.",
  alternates: { canonical: "/acervo/cartazes" }
};

import CollectionIndexClient from "../_components/CollectionIndexClient";
import { apiGet } from "../../../lib/backend-client";
import type { DocumentContent } from "../../../lib/backend-types";
import { getCollectionItems } from "../api";

export default async function Page() {
  try {
    const res = await apiGet<DocumentContent[]>("/api/documentos?page=1&limit=200&tag=Cartazes");
    const items = res.data.map((doc) => {
      const date = doc.year ? `${doc.year}-01-01` : (doc.publishedAt || doc.createdAt || "s/d").slice(0, 10);
      return {
        id: `cartazes/${doc.slug}`,
        collection: "cartazes",
        slug: doc.slug,
        title: doc.title,
        date,
        location: doc.collection || doc.source || "Acervo",
        cover: doc.coverImageUrl,
        tags: doc.tags ?? [],
        summary: doc.description,
        body: doc.description ? [doc.description] : [],
        files: [
          ...(doc.fileUrl ? [{ label: "Arquivo principal", url: doc.fileUrl }] : []),
          ...((doc.images ?? []).map((url, idx) => ({ label: `Imagem ${idx + 1}`, url }))),
        ],
      };
    });
    return <CollectionIndexClient collectionKey="cartazes" initialItems={items as any} />;
  } catch {
    const items = getCollectionItems("cartazes");
    return <CollectionIndexClient collectionKey="cartazes" initialItems={items} />;
  }
}
