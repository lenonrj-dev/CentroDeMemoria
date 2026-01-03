import type { CityData } from "../../cityData";
import type {
  DocumentContent,
  JournalContent,
  PhotoArchiveContent,
  ReferenceContent,
  TestimonialContent,
} from "@/lib/backend-types";
import type {
  DepoimentoCardProps,
  DocumentCardProps,
  PhotoItem,
  ReferenciaCardProps,
} from "../ui/types";
import type { CityPreviews } from "./types";
import { youtubeThumbUrl } from "@/lib/youtube";

function isoDate(value?: string | null) {
  return typeof value === "string" && value.length >= 10 ? value.slice(0, 10) : "";
}

function yearFromIso(value?: string | null) {
  const y = Number((value || "").slice(0, 4));
  return Number.isFinite(y) && y > 0 ? y : 0;
}

function documentDate(d: DocumentContent) {
  if (d.year && d.year > 0) return `${d.year}-01-01`;
  const best = d.publishedAt || d.createdAt || d.updatedAt;
  return isoDate(best) || "s/d";
}

function journalDate(j: JournalContent) {
  return isoDate(j.issueDate) || isoDate(j.publishedAt) || isoDate(j.createdAt) || isoDate(j.updatedAt) || "s/d";
}

function pickTheme(tags: string[], cityName: string) {
  const clean = (tags || []).filter(Boolean);
  const found = clean.find((t) => t !== cityName);
  return found || clean[0] || "Memória e trabalho";
}

function refTypeFromTags(tags: string[]): "Livro" | "Artigo" | "Tese" {
  const t = (tags || []).map((x) => x.toLowerCase());
  if (t.some((x) => x.includes("tese") || x.includes("disserta"))) return "Tese";
  if (t.some((x) => x.includes("artigo") || x.includes("paper") || x.includes("revista"))) return "Artigo";
  return "Livro";
}

function photoItemFromArchive(a: PhotoArchiveContent, cityName: string): PhotoItem {
  const first = a.photos?.[0];
  const year =
    yearFromIso(first?.date) ||
    yearFromIso(a.publishedAt) ||
    yearFromIso(a.createdAt) ||
    yearFromIso(a.updatedAt) ||
    0;
  return {
    src: a.coverImageUrl,
    alt: a.title,
    year: year ? String(year) : "",
    location: a.collection || first?.location || cityName,
    description: a.description,
    tags: a.tags ?? [],
  };
}

export function buildCityContent(city: CityData, previews?: CityPreviews) {
  const mission =
    city.slug === "volta-redonda"
      ? "Acervo dedicado à memória do trabalho na Cidade do Aço, reunindo greves, organização por seção e a construção de direitos em diálogo com a comunidade."
      : "Coleção que acompanha a formação do tecido social de Barra Mansa, registrando redes de apoio, assembleias, cultura sindical e vida cotidiana do Vale do Paraíba.";

  const docFallback: DocumentCardProps[] =
    city.sections.find((s) => s.key === "documentos")?.items.slice(0, 3).map((i) => ({
      title: i.title,
      summary: i.summary,
      date: i.date,
      location: city.name,
      tags: ["Documento", city.name],
      href: i.href,
    })) || [];

  const depoFallback: DepoimentoCardProps[] =
    city.sections.find((s) => s.key === "depoimentos")?.items.slice(0, 3).map((i) => ({
      author: i.title,
      role: "História oral",
      excerpt: i.summary,
      date: i.date,
      theme: "Memória sindical",
      avatar: "/hero.png",
      href: i.href,
      mediaType: "image",
      imageUrl: "/hero.png",
    })) || [];

  const refFallback: ReferenciaCardProps[] =
    city.sections.find((s) => s.key === "referencia-bibliografica")?.items.slice(0, 3).map((i) => ({
      title: i.title,
      authors: "Equipe de pesquisa",
      year: i.date.slice(0, 4),
      type: "Livro" as const,
      source: "Centro de Memória",
      citation: `${i.title}. Centro de Memória ${city.name}, ${i.date.slice(0, 4)}.`,
    })) || [];

  const journalFallback: DocumentCardProps[] =
    city.sections.find((s) => s.key === "jornais-de-epoca")?.items.slice(0, 3).map((i) => ({
      title: i.title,
      summary: i.summary,
      date: i.date,
      location: city.name,
      tags: ["Jornal", city.name],
      href: i.href,
    })) || [];

  const docsRemote: DocumentCardProps[] = (previews?.documents || []).slice(0, 3).map((d) => ({
    title: d.title,
    summary: d.description,
    date: documentDate(d),
    location: d.collection || d.source || city.name,
    tags: d.tags?.length ? d.tags : ["Documento", city.name],
    href: `/acervo/documentos/${d.slug}`,
  }));

  const depoRemote: DepoimentoCardProps[] = (previews?.testimonials || []).slice(0, 3).map((t) => {
    const text = (t.testimonialText || t.description || "").trim();
    const excerpt = text.length > 190 ? `${text.slice(0, 187)}.` : text;
    const date = isoDate(t.date) || isoDate(t.publishedAt) || isoDate(t.createdAt) || isoDate(t.updatedAt) || "";
    const theme = pickTheme(t.tags ?? [], city.name);
    const imageUrl = t.imageUrl || t.coverImageUrl || "";
    const mediaType = t.mediaType || (t.youtubeId ? "youtube" : imageUrl ? "image" : "text");
    const avatar = imageUrl || (t.youtubeId ? youtubeThumbUrl(t.youtubeId) : "/hero.png");
    return {
      author: t.authorName || t.title,
      role: t.authorRole || t.location || "Depoimento",
      excerpt,
      date,
      theme,
      avatar,
      href: `/acervo/entrevistas/${t.slug}`,
      mediaType,
      youtubeId: t.youtubeId,
      imageUrl: imageUrl || undefined,
    };
  });

  const refsRemote: ReferenciaCardProps[] = (previews?.references || []).slice(0, 3).map((r) => ({
    title: r.title,
    authors: (r.authors || []).join("; ") || "-",
    year: String(r.year || ""),
    type: refTypeFromTags(r.tags ?? []),
    source: r.publisher || r.externalUrl || "-",
    citation: r.citation,
  }));

  const journalsRemote: DocumentCardProps[] = (previews?.journals || []).slice(0, 3).map((j) => ({
    title: j.title,
    summary: j.description,
    date: journalDate(j),
    location: j.city || city.name,
    tags: j.tags ?? [],
    href: `/jornais-de-epoca/${j.slug}`,
  }));

  const photosRemote: PhotoItem[] = (previews?.photoArchives || []).slice(0, 9).map((a) => photoItemFromArchive(a, city.name));

  const docCards = docsRemote.length ? docsRemote : docFallback;
  const depoCards = depoRemote.length ? depoRemote : depoFallback;
  const refCards = refsRemote.length ? refsRemote : refFallback;
  const journalCards = journalsRemote.length ? journalsRemote : journalFallback;
  const photoCards = photosRemote.length ? photosRemote : [];

  return {
    mission,
    docCards,
    depoCards,
    refCards,
    journalCards,
    photoCards,
  };
}
