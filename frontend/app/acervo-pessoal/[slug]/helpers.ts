import { apiGet } from "@/lib/backend-client";
import type {
  DocumentContent,
  JournalContent,
  PersonalArchiveRecord,
  PhotoArchiveContent,
  ReferenceContent,
  TestimonialContent,
} from "@/lib/backend-types";
import {
  heroImage as domHeroImage,
  documents as domDocuments,
  depoimentos as domDepoimentos,
  referencias as domReferencias,
  jornais as domJornais,
  fotos as domFotos,
} from "@/app/acervo/fundos/dom-waldyr/data";
import { personalArchives } from "@/lib/personal-archives";
import { siteContent } from "@/lib/get-site-content";
import type { PersonalArchiveContent } from "@/lib/content-types";

export type RelatedContent = {
  documents: DocumentContent[];
  journals: JournalContent[];
  testimonials: TestimonialContent[];
  photos: PhotoArchiveContent[];
  references: ReferenceContent[];
};

export async function fetchPersonalArchive(slug: string) {
  try {
    const res = await apiGet<PersonalArchiveRecord>(`/api/acervos-pessoais/${slug}`);
    return res.data || null;
  } catch {
    return null;
  }
}

export function buildFallbackContent(slug: string): PersonalArchiveContent {
  if (slug === "rubem-machado") {
    return siteContent.personal;
  }
  if (slug === "dom-waldyr") {
    return buildDomWaldyrContent();
  }

  const person = personalArchives.find((p) => p.slug === slug);
  const name = person?.name || slug.replace(/-/g, " ");
  const summary = person?.summary || "Acervo pessoal com documentos, fotos e registros do acervo.";
  const cover = person?.portrait || "/hero.png";
  const role = person?.role || person?.occupation || "Acervo pessoal";

  return {
    hero: {
      label: "Acervo Pessoal",
      name,
      roles: role ? [role] : [],
      summary,
      biography: summary,
      cover,
      portrait: cover,
      stats: [
        { label: "Colecao", value: "Acervo pessoal" },
        { label: "Status", value: "Em catalogacao" },
        { label: "Origem", value: "Banco de Memoria" },
      ],
      primaryCta: { label: "Explorar acervo", href: "/acervo" },
      secondaryCta: { label: "Acesso a Informacao", href: "/acesso-a-informacao" },
    },
    gallery: cover ? [{ src: cover, alt: `Retrato de ${name}` }] : [],
    documents: [],
    interviews: [],
    timeline: [],
    about: {
      heading: "Sobre o acervo",
      description: summary,
      links: [
        { label: "Acervo", href: "/acervo", icon: "book" },
        { label: "Jornais", href: "/jornais-de-epoca", icon: "newspaper" },
      ],
    },
    quote: { text: "", author: "", note: "" },
    downloads: [],
    navigation: {
      backLabel: "Voltar ao acervo",
      backHref: "/acervo",
      note: "Para solicitacoes de uso e reproducao, consulte ",
      noteLink: { label: "Acesso a Informacao", href: "/acesso-a-informacao" },
    },
    faq: [],
    steps: [],
  };
}

export function buildDomWaldyrContent(): PersonalArchiveContent {
  const summary =
    "Recortes documentais sobre acao pastoral, ditadura civil-militar e movimento operario. Cartas, depoimentos, jornais e imagens registram a atuacao de Dom Waldyr nas comunidades do Sul Fluminense.";
  const documents = domDocuments.map((doc) => ({
    title: doc.title,
    href: "/acervo/fundos/dom-waldyr#documentos",
    meta: `${doc.date} - ${doc.location}`,
  }));
  const interviews = domDepoimentos.map((dep) => ({
    title: `Depoimento de ${dep.author}`,
    href: "/acervo/fundos/dom-waldyr#depoimentos",
    meta: `${dep.role} - ${dep.date}`,
  }));
  const gallery = domFotos.map((foto) => ({ src: foto.src, alt: foto.alt }));
  const timeline = [
    ...domDocuments.map((doc) => ({ year: doc.date.slice(0, 4), text: doc.title })),
    ...domJornais.map((jor) => ({ year: jor.date.slice(0, 4), text: jor.title })),
  ].slice(0, 6);

  return {
    hero: {
      label: "Acervo Pessoal",
      name: "Dom Waldyr Calheiros",
      roles: ["Bispo", "Mediacao social", "Pastoral operaria"],
      summary,
      biography: summary,
      cover: domHeroImage,
      portrait: domHeroImage,
      stats: [
        { label: "Documentos", value: String(domDocuments.length) },
        { label: "Jornais", value: String(domJornais.length) },
        { label: "Fotos", value: String(domFotos.length) },
      ],
      primaryCta: { label: "Explorar fundo Dom Waldyr", href: "/acervo/fundos/dom-waldyr" },
      secondaryCta: { label: "Breve biografia", href: "/acervo/fundos/dom-waldyr/historias/breve-biografia" },
    },
    gallery,
    documents,
    interviews,
    timeline,
    about: {
      heading: "Sobre o acervo",
      description: summary,
      links: [
        { label: "Fundo Dom Waldyr", href: "/acervo/fundos/dom-waldyr", icon: "book" },
        { label: "Jornais de epoca", href: "/jornais-de-epoca", icon: "newspaper" },
      ],
    },
    quote: {
      text: domDepoimentos[0]?.excerpt || "",
      author: domDepoimentos[0]?.author || "",
      note: domDepoimentos[0]?.role || "",
    },
    downloads: [
      { label: "Breve biografia", href: "/acervo/fundos/dom-waldyr/historias/breve-biografia" },
    ],
    navigation: {
      backLabel: "Voltar ao fundo",
      backHref: "/acervo/fundos/dom-waldyr",
      note: "Para solicitacoes de uso e reproducao, consulte ",
      noteLink: { label: "Acesso a Informacao", href: "/acesso-a-informacao" },
    },
    faq: [
      {
        q: "Que tipo de documentos estao disponiveis?",
        a: "Cartas pastorais, relatorios de visitas, notas de mediacao e registros de direitos humanos.",
      },
      {
        q: "Como acessar os recortes completos?",
        a: "Use os atalhos para o fundo Dom Waldyr e navegue pelas secoes de documentos, jornais e fotografias.",
      },
    ],
    steps: [
      { icon: "search", title: "Explore", text: "Comece pelos recortes do fundo Dom Waldyr." },
      { icon: "check", title: "Aprofunde", text: "Leia documentos e relatos para entender o contexto." },
      { icon: "shield", title: "Solicite", text: "Peca acesso completo quando necessario." },
    ],
  };
}

export function mergePersonalContent(
  fallback: PersonalArchiveContent,
  override?: Partial<PersonalArchiveContent> | null
): PersonalArchiveContent {
  if (!override) return fallback;
  return {
    hero: { ...fallback.hero, ...(override.hero || {}) },
    gallery: override.gallery ?? fallback.gallery,
    documents: override.documents ?? fallback.documents,
    interviews: override.interviews ?? fallback.interviews,
    timeline: override.timeline ?? fallback.timeline,
    about: override.about ?? fallback.about,
    quote: override.quote ?? fallback.quote,
    downloads: override.downloads ?? fallback.downloads,
    navigation: override.navigation ?? fallback.navigation,
    faq: override.faq ?? fallback.faq,
    steps: override.steps ?? fallback.steps,
  };
}

export function toDocumentPreview(items: DocumentContent[]) {
  return items.map((doc) => {
    const isCartaz = (doc.tags || []).includes("Cartazes");
    return {
      title: doc.title,
      href: `/acervo/${isCartaz ? "cartazes" : "documentos"}/${doc.slug}`,
      meta: doc.year ? `Ano ${doc.year}` : doc.collection || doc.source || "Documento",
    };
  });
}

export function toInterviewPreview(items: TestimonialContent[]) {
  return items.map((item) => ({
    title: item.title || item.authorName || "Depoimento",
    href: `/acervo/entrevistas/${item.slug}`,
    meta: item.authorRole || item.location || "Historia oral",
  }));
}

export function toJournalPreview(items: JournalContent[]) {
  return items.map((item) => ({
    title: item.title,
    href: `/jornais-de-epoca/${item.slug}`,
    meta: item.issueDate || item.publishedAt || item.createdAt || "Jornal",
    cover: item.coverImageUrl,
  }));
}

export function toFundJournalPreview() {
  return domJornais.map((item) => ({
    title: item.title,
    href: "/acervo/fundos/dom-waldyr#jornais",
    meta: `${item.date} - ${item.location}`,
    cover: domHeroImage,
  }));
}

export function toPhotoPreview(items: PhotoArchiveContent[]) {
  return items.map((item) => {
    const first = item.photos?.[0];
    const year = (first?.date || item.publishedAt || item.createdAt || item.updatedAt || "").slice(0, 4);
    return {
      src: item.coverImageUrl,
      alt: item.title,
      caption: first?.caption || item.title,
      year: year || "",
      location: first?.location || item.collection || "Acervo",
      description: item.description,
    };
  });
}

export function toFundPhotoPreview() {
  return domFotos.map((foto) => ({
    src: foto.src,
    alt: foto.alt,
    caption: foto.caption,
    year: foto.year,
    location: foto.location,
    description: foto.description,
  }));
}

export function toReferencePreview(items: ReferenceContent[]) {
  return items.map((item) => ({
    title: item.title,
    authors: (item.authors || []).join("; "),
    year: item.year ? String(item.year) : "",
    type: (item.tags || []).find((t) => t.toLowerCase().includes("tese") || t.toLowerCase().includes("artigo")) || "Livro",
    source: item.publisher || item.externalUrl || "",
    citation: item.citation,
  }));
}

export function toFundReferencePreview() {
  return domReferencias.map((item) => ({
    title: item.title,
    authors: item.authors,
    year: item.year,
    type: item.type,
    source: item.source,
    citation: item.citation,
  }));
}

export async function fetchRelated(slug: string, fundKey?: string, tag?: string): Promise<RelatedContent> {
  const params = new URLSearchParams();
  if (slug) params.set("personSlug", slug);
  if (fundKey) params.set("fundKey", fundKey);
  if (tag) params.set("tag", tag);
  params.set("page", "1");
  params.set("limit", "8");

  const qs = params.toString() ? `?${params.toString()}` : "";

  try {
    const [docsRes, journalsRes, depoRes, photosRes, refsRes] = await Promise.all([
      apiGet<DocumentContent[]>(`/api/documentos${qs}`),
      apiGet<JournalContent[]>(`/api/jornais${qs}`),
      apiGet<TestimonialContent[]>(`/api/depoimentos${qs}`),
      apiGet<PhotoArchiveContent[]>(`/api/acervo-fotografico${qs}`),
      apiGet<ReferenceContent[]>(`/api/referencias${qs}`),
    ]);
    return {
      documents: docsRes.data || [],
      journals: journalsRes.data || [],
      testimonials: depoRes.data || [],
      photos: photosRes.data || [],
      references: refsRes.data || [],
    };
  } catch {
    return { documents: [], journals: [], testimonials: [], photos: [], references: [] };
  }
}
