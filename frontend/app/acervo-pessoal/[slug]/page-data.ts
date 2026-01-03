import type { Metadata } from "next";
import type { PersonalArchiveContent } from "@/lib/content-types";
import type { PersonalArchiveRecord } from "@/lib/backend-types";
import {
  buildFallbackContent,
  fetchPersonalArchive,
  fetchRelated,
  mergePersonalContent,
  toDocumentPreview,
  toFundJournalPreview,
  toFundPhotoPreview,
  toFundReferencePreview,
  toInterviewPreview,
  toJournalPreview,
  toPhotoPreview,
  toReferencePreview,
} from "./helpers";

async function resolveBaseContent(slug: string) {
  const record = await fetchPersonalArchive(slug);
  const fallback = buildFallbackContent(slug);
  const rawOverride = record?.content as Partial<PersonalArchiveContent> | undefined;
  const override =
    slug === "dom-waldyr" && rawOverride?.hero?.name?.toLowerCase().includes("rubem") ? undefined : rawOverride;
  const content = mergePersonalContent(fallback, override);

  return { content, record };
}

export async function buildPersonalArchiveMetadata(slug: string): Promise<Metadata> {
  const { content } = await resolveBaseContent(slug);

  const title = `Acervo Pessoal - ${content.hero.name} | Banco de Memoria`;
  const description = content.hero.summary || "Acervo pessoal com documentos, fotos e registros do acervo.";

  return {
    title,
    description,
    alternates: { canonical: `/acervo-pessoal/${slug}` },
    openGraph: {
      title,
      description,
      url: `/acervo-pessoal/${slug}`,
      images: content.hero.cover || content.hero.portrait ? [{ url: content.hero.cover || content.hero.portrait }] : [],
    },
  };
}

export async function buildPersonalArchivePageData(slug: string) {
  const { content, record } = await resolveBaseContent(slug);

  const relatedFundKey = record?.relatedFundKey || "";
  const relatedTag =
    slug === "dom-waldyr" || relatedFundKey === "dom-waldyr" || record?.tags?.includes("Dom Waldyr")
      ? "Dom Waldyr"
      : "";
  const related = await fetchRelated(record?.relatedPersonSlug || slug, relatedFundKey, relatedTag);

  const mergedContent: PersonalArchiveContent = {
    ...content,
    documents: content.documents?.length ? content.documents : toDocumentPreview(related.documents),
    interviews: content.interviews?.length ? content.interviews : toInterviewPreview(related.testimonials),
  };
  const journalPreview = toJournalPreview(related.journals);
  const photoPreview = toPhotoPreview(related.photos);
  const referencePreview = toReferencePreview(related.references);
  const fallbackJournals = slug === "dom-waldyr" && !journalPreview.length ? toFundJournalPreview() : journalPreview;
  const fallbackPhotos = slug === "dom-waldyr" && !photoPreview.length ? toFundPhotoPreview() : photoPreview;
  const fallbackReferences = slug === "dom-waldyr" && !referencePreview.length ? toFundReferencePreview() : referencePreview;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: mergedContent.hero.name,
        image: mergedContent.hero.portrait || mergedContent.hero.cover || undefined,
        description: mergedContent.hero.summary,
      },
      {
        "@type": "CollectionPage",
        name: `Acervo Pessoal - ${mergedContent.hero.name}`,
        about: { "@type": "Person", name: mergedContent.hero.name },
      },
    ],
  };

  return {
    content: mergedContent,
    journals: fallbackJournals,
    photos: fallbackPhotos,
    references: fallbackReferences,
    jsonLd,
  };
}
