"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/backend-client";
import type { DocumentContent, JournalContent, PhotoArchiveContent, TestimonialContent } from "@/lib/backend-types";
import type { AcervoItem } from "../../api";
import { youtubeThumbUrl } from "@/lib/youtube";
import { FALLBACK_IMG } from "../data";

export function useAcervoSearch() {
  const [q, setQ] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [results, setResults] = useState<AcervoItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    const term = q.trim();
    if (!term) {
      setResults([]);
      return;
    }

    (async () => {
      setSearchLoading(true);
      try {
        const [docs, deps, jors, photos] = await Promise.all([
          apiGet<DocumentContent[]>(`/api/documentos?page=1&limit=4&q=${encodeURIComponent(term)}`).catch(() => null),
          apiGet<TestimonialContent[]>(`/api/depoimentos?page=1&limit=4&q=${encodeURIComponent(term)}`).catch(() => null),
          apiGet<JournalContent[]>(`/api/jornais?page=1&limit=4&q=${encodeURIComponent(term)}`).catch(() => null),
          apiGet<PhotoArchiveContent[]>(`/api/acervo-fotografico?page=1&limit=4&q=${encodeURIComponent(term)}`).catch(() => null),
        ]);

        const merged: AcervoItem[] = [
          ...(docs?.data.map((d) => ({
            id: `documentos/${d.slug}`,
            collection: "documentos",
            slug: d.slug,
            title: d.title,
            date: d.year ? `${d.year}-01-01` : (d.createdAt || "s/d").slice(0, 10),
            location: d.collection || d.source || "Acervo",
            cover: d.coverImageUrl,
            tags: d.tags ?? [],
            summary: d.description,
            body: d.description ? [d.description] : [],
            files: [],
          })) ?? []),
          ...(deps?.data.map((t) => ({
            id: `entrevistas/${t.slug}`,
            collection: "entrevistas",
            slug: t.slug,
            title: t.title,
            date: (t.date || t.createdAt || "s/d").slice(0, 10),
            location: t.location || t.authorRole || "Acervo",
            cover: t.coverImageUrl || t.imageUrl || (t.youtubeId ? youtubeThumbUrl(t.youtubeId) : FALLBACK_IMG),
            mediaType: t.mediaType,
            youtubeId: t.youtubeId,
            imageUrl: t.imageUrl || t.coverImageUrl,
            tags: t.tags ?? [],
            summary: t.description,
            body: [t.testimonialText || t.description].filter(Boolean),
            files: [],
          })) ?? []),
          ...(jors?.data.map((j) => ({
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
          })) ?? []),
          ...(photos?.data.map((a) => ({
            id: `fotos/${a.slug}`,
            collection: "fotos",
            slug: a.slug,
            title: a.title,
            date: (a.createdAt || "s/d").slice(0, 10),
            location: a.collection || a.photographer || "Acervo",
            cover: a.coverImageUrl,
            tags: a.tags ?? [],
            summary: a.description,
            body: a.description ? [a.description] : [],
            files: [],
          })) ?? []),
        ];

        if (!cancelled) setResults(merged.slice(0, 12));
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [q]);

  return { q, setQ, searchLoading, results };
}
