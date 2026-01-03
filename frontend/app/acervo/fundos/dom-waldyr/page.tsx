import { Breadcrumb, ContentContainer } from "../../_components/ui";
import { apiGet } from "@/lib/backend-client";
import type {
  DocumentContent,
  JournalContent,
  PhotoArchiveContent,
  ReferenceContent,
  TestimonialContent,
} from "@/lib/backend-types";
import { youtubeThumbUrl } from "@/lib/youtube";
import {
  depoimentos as fallbackDepoimentos,
  documents as fallbackDocuments,
  fotos as fallbackFotos,
  heroImage,
  jornais as fallbackJornais,
  referencias as fallbackReferencias,
} from "./data";
import {
  DomWaldyrCTA,
  DomWaldyrDepoimentos,
  DomWaldyrDocuments,
  DomWaldyrFotos,
  DomWaldyrHero,
  DomWaldyrIntro,
  DomWaldyrJornais,
  DomWaldyrHistorias,
  DomWaldyrReferencias,
} from "./sections";

export const metadata = {
  title: "Acervo | Fundos Dom Waldyr",
  description:
    "Coleção dedicada à atuação pastoral e mediação social de Dom Waldyr, com documentos, depoimentos, referências, jornais e acervo fotográfico.",
  keywords: [
    "Dom Waldyr",
    "Fundos",
    "Pastoral Operária",
    "Jornais de Época",
    "Documentos históricos",
    "Volta Redonda",
    "Barra Mansa",
  ],
};

function isoDate(value?: string | null) {
  return typeof value === "string" && value.length >= 10 ? value.slice(0, 10) : "s/d";
}

function yearFromIso(value?: string | null) {
  const y = Number((value || "").slice(0, 4));
  return Number.isFinite(y) && y > 0 ? y : 0;
}

function excerptOf(text: string) {
  const t = (text || "").trim();
  if (!t) return "";
  return t.length > 240 ? `${t.slice(0, 237)}.` : t;
}

function typeFromTags(tags: string[]): "Livro" | "Artigo" | "Tese" {
  const t = (tags || []).map((x) => x.toLowerCase());
  if (t.some((x) => x.includes("tese") || x.includes("disserta"))) return "Tese";
  if (t.some((x) => x.includes("artigo") || x.includes("revista"))) return "Artigo";
  return "Livro";
}

export default async function DomWaldyrFundPage() {
  const tag = "Dom Waldyr";
  const fundKey = "dom-waldyr";

  try {
    const params = `tag=${encodeURIComponent(tag)}&fundKey=${encodeURIComponent(fundKey)}&page=1&limit=12`;
    const [docsRes, depoRes, refsRes, journalsRes, photosRes] = await Promise.all([
      apiGet<DocumentContent[]>(`/api/documentos?${params}`),
      apiGet<TestimonialContent[]>(`/api/depoimentos?${params}`),
      apiGet<ReferenceContent[]>(`/api/referencias?${params}`),
      apiGet<JournalContent[]>(`/api/jornais?${params}`),
      apiGet<PhotoArchiveContent[]>(`/api/acervo-fotografico?${params}`),
    ]);

    const documents = docsRes.data.map((d) => ({
      title: d.title,
      summary: d.description,
      date: isoDate(d.year ? `${d.year}-01-01` : d.publishedAt || d.createdAt || d.updatedAt),
      location: d.collection || d.source || "Acervo",
      tags: d.tags ?? [],
    }));

    const depoimentos = depoRes.data.map((t) => {
      const theme = (t.tags || []).find((x) => x && x !== tag) || tag;
      const imageUrl = t.imageUrl || t.coverImageUrl || "";
      const mediaType = t.mediaType || (t.youtubeId ? "youtube" : imageUrl ? "image" : "text");
      const avatar = imageUrl || (t.youtubeId ? youtubeThumbUrl(t.youtubeId) : "/hero.png");
      return {
        author: t.authorName || t.title,
        role: t.authorRole || t.location || "Depoimento",
        excerpt: excerptOf(t.testimonialText || t.description),
        date: isoDate(t.date || t.publishedAt || t.createdAt || t.updatedAt),
        theme,
        avatar,
        mediaType,
        youtubeId: t.youtubeId,
        imageUrl: imageUrl || undefined,
      };
    });

    const referencias = refsRes.data.map((r) => ({
      title: r.title,
      authors: (r.authors || []).join("; ") || "-",
      year: String(r.year || ""),
      type: typeFromTags(r.tags ?? []),
      source: r.publisher || r.externalUrl || "-",
      citation: r.citation,
    }));

    const jornais = journalsRes.data.map((j) => ({
      title: j.title,
      summary: j.description,
      date: isoDate(j.issueDate || j.publishedAt || j.createdAt || j.updatedAt),
      location: j.city || "Acervo",
      tags: j.tags ?? [],
    }));

    const fotos = photosRes.data.map((a) => {
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
        caption: first?.caption || "",
        year: year ? String(year) : "",
        location: a.collection || first?.location || "Acervo",
        description: a.description,
      };
    });

    return (
      <div className="bg-black text-white">
        <ContentContainer>
          <Breadcrumb
            items={[
              { label: "Início", href: "/" },
              { label: "Acervo", href: "/acervo" },
              { label: "Fundos", href: "/acervo#fundos" },
              { label: "Dom Waldyr" },
            ]}
          />
        </ContentContainer>

        <DomWaldyrHero image={heroImage} />
        <DomWaldyrIntro />
        <DomWaldyrDocuments documents={documents} />
        <DomWaldyrDepoimentos depoimentos={depoimentos} />
        <DomWaldyrReferencias referencias={referencias} />
        <DomWaldyrJornais jornais={jornais} />
        <DomWaldyrFotos fotos={fotos} />
        <DomWaldyrHistorias />
        <DomWaldyrCTA />
      </div>
    );
  } catch {
    return (
      <div className="bg-black text-white">
        <ContentContainer>
          <Breadcrumb
            items={[
              { label: "Início", href: "/" },
              { label: "Acervo", href: "/acervo" },
              { label: "Fundos", href: "/acervo#fundos" },
              { label: "Dom Waldyr" },
            ]}
          />
        </ContentContainer>

        <DomWaldyrHero image={heroImage} />
        <DomWaldyrIntro />
        <DomWaldyrDocuments documents={fallbackDocuments} />
        <DomWaldyrDepoimentos depoimentos={fallbackDepoimentos} />
        <DomWaldyrReferencias referencias={fallbackReferencias} />
        <DomWaldyrJornais jornais={fallbackJornais} />
        <DomWaldyrFotos fotos={fallbackFotos} />
        <DomWaldyrHistorias />
        <DomWaldyrCTA />
      </div>
    );
  }
}
