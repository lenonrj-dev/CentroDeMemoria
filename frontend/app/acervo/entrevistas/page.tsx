// app/acervo/entrevistas/page.tsx (SERVER)
export const metadata = {
  title: "História oral – Banco de Memória",
  description: "Depoimentos e entrevistas com trabalhadores, lideranças e agentes do território.",
  alternates: { canonical: "/acervo/entrevistas" },
};

import CollectionIndexClient from "../_components/CollectionIndexClient";
import { apiGet } from "../../../lib/backend-client";
import type { TestimonialContent } from "../../../lib/backend-types";
import { getCollectionItems } from "../api";
import { youtubeThumbUrl } from "@/lib/youtube";

export default async function Page() {
  try {
    const res = await apiGet<TestimonialContent[]>("/api/depoimentos?page=1&limit=200");
    const items = res.data.map((t) => {
      const date = (t.date || t.publishedAt || t.createdAt || "s/d").slice(0, 10);
      const cover = t.coverImageUrl || t.imageUrl || (t.youtubeId ? youtubeThumbUrl(t.youtubeId) : "/hero.png");
      return {
        id: `entrevistas/${t.slug}`,
        collection: "entrevistas",
        slug: t.slug,
        title: t.title,
        date,
        location: t.location || t.authorRole || "Acervo",
        cover,
        mediaType: t.mediaType,
        youtubeId: t.youtubeId,
        imageUrl: t.imageUrl || t.coverImageUrl,
        tags: t.tags ?? [],
        summary: t.description,
        body: [t.testimonialText || t.description].filter(Boolean),
        files: (t.attachments ?? []).map((a) => ({
          label: a.label || a.type.toUpperCase(),
          url: a.url,
        })),
      };
    });
    return <CollectionIndexClient collectionKey="entrevistas" initialItems={items as any} />;
  } catch {
    const items = getCollectionItems("entrevistas");
    return <CollectionIndexClient collectionKey="entrevistas" initialItems={items} />;
  }
}
