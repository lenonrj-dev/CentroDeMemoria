// app/acervo/boletins/page.jsx (SERVER)
export const metadata = {
  title: "Jornais de Época — Banco de Memória",
  description: "Edições históricas digitalizadas com contexto e busca.",
  alternates: { canonical: "/acervo/boletins" }
};

import CollectionIndexClient from "../_components/CollectionIndexClient";
import { apiGet } from "../../../lib/backend-client";
import type { JournalContent } from "../../../lib/backend-types";
import { getCollectionItems } from "../api";

export default async function Page() {
  try {
    const res = await apiGet<JournalContent[]>("/api/jornais?page=1&limit=200");
    const items = res.data.map((j) => ({
      id: `boletins/${j.slug}`,
      collection: "boletins",
      slug: j.slug,
      title: j.title,
      date: j.issueDate?.slice(0, 10) ?? "s/d",
      location: j.city || "Acervo",
      cover: j.coverImageUrl,
      tags: j.tags ?? [],
      summary: j.description,
      body: j.description ? [j.description] : [],
      files: [],
    }));
    return <CollectionIndexClient collectionKey="boletins" initialItems={items as any} />;
  } catch {
    const items = getCollectionItems("boletins");
    return <CollectionIndexClient collectionKey="boletins" initialItems={items} />;
  }
}
