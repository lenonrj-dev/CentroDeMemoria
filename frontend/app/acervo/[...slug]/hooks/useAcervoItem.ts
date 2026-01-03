"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/backend-client";
import type { DocumentContent, JournalContent, PhotoArchiveContent, TestimonialContent } from "@/lib/backend-types";
import type { AcervoItem, CollectionKey } from "../../api";
import type { PhotoItem } from "../../_components/ui";
import { youtubeThumbUrl } from "@/lib/youtube";
import { FALLBACK_IMG } from "../data";

export function useAcervoItem(collection: CollectionKey, slug: string) {
  const [loading, setLoading] = useState(false);
  const [remoteItem, setRemoteItem] = useState<AcervoItem | null>(null);
  const [remotePhotos, setRemotePhotos] = useState<PhotoItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (collection === "boletins") {
          const res = await apiGet<JournalContent>(`/api/jornais/${slug}`);
          const j = res.data;
          const mapped: AcervoItem = {
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
            files: [
              ...(j.pdfUrl ? [{ label: "PDF", url: j.pdfUrl }] : []),
              ...((j.pages ?? []).map((p) => ({ label: `Página ${p.pageNumber}`, url: p.imageUrl }))),
            ],
          };
          if (!cancelled) {
            setRemoteItem(mapped);
            setRemotePhotos([]);
          }
          return;
        }

        if (collection === "documentos" || collection === "cartazes") {
          const res = await apiGet<DocumentContent>(`/api/documentos/${slug}`);
          const d = res.data;
          const date = d.year ? `${d.year}-01-01` : (d.publishedAt || d.createdAt || "s/d").slice(0, 10);
          const mapped: AcervoItem = {
            id: `${collection}/${d.slug}`,
            collection,
            slug: d.slug,
            title: d.title,
            date,
            location: d.collection || d.source || "Acervo",
            cover: d.coverImageUrl,
            tags: d.tags ?? [],
            summary: d.description,
            body: d.description ? [d.description] : [],
            files: [
              ...(d.fileUrl ? [{ label: "Arquivo principal", url: d.fileUrl }] : []),
              ...((d.images ?? []).map((url, idx) => ({ label: `Imagem ${idx + 1}`, url }))),
            ],
          };
          if (!cancelled) {
            setRemoteItem(mapped);
            setRemotePhotos([]);
          }
          return;
        }

        if (collection === "entrevistas") {
          const res = await apiGet<TestimonialContent>(`/api/depoimentos/${slug}`);
          const t = res.data;
          const date = (t.date || t.publishedAt || t.createdAt || "s/d").slice(0, 10);
          const cover = t.coverImageUrl || t.imageUrl || (t.youtubeId ? youtubeThumbUrl(t.youtubeId) : FALLBACK_IMG);
          const mapped: AcervoItem = {
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
            files: (t.attachments ?? []).map((a) => ({ label: a.label || a.type.toUpperCase(), url: a.url })),
          };
          if (!cancelled) {
            setRemoteItem(mapped);
            setRemotePhotos([]);
          }
          return;
        }

        if (collection === "fotos") {
          const res = await apiGet<PhotoArchiveContent>(`/api/acervo-fotografico/${slug}`);
          const a = res.data;
          const date =
            a.photos?.[0]?.date?.slice(0, 10) || (a.publishedAt || a.createdAt || a.updatedAt || "s/d").slice(0, 10);

          const photos: PhotoItem[] = (a.photos ?? []).map((p) => ({
            src: p.imageUrl,
            alt: p.caption || a.title,
            year: p.date ? p.date.slice(0, 4) : date.slice(0, 4),
            location: p.location || a.collection || "Acervo",
            description: p.caption || a.description,
            tags: a.tags ?? [],
          }));

          const mapped: AcervoItem = {
            id: `fotos/${a.slug}`,
            collection: "fotos",
            slug: a.slug,
            title: a.title,
            date,
            location: a.collection || a.photographer || "Acervo",
            cover: a.coverImageUrl,
            tags: a.tags ?? [],
            summary: a.description,
            body: a.description ? [a.description] : [],
            files: (a.photos ?? []).map((p, idx) => ({ label: `Foto ${idx + 1}`, url: p.imageUrl })),
          };

          if (!cancelled) {
            setRemoteItem(mapped);
            setRemotePhotos(photos);
          }
          return;
        }

        if (!cancelled) {
          setRemoteItem(null);
          setRemotePhotos([]);
        }
      } catch {
        if (!cancelled) {
          setRemoteItem(null);
          setRemotePhotos([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [collection, slug]);

  return { loading, remoteItem, remotePhotos };
}
