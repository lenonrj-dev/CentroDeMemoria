import EditionReader from "./reader/EditionReader";

import { apiGet } from "../../../lib/backend-client";
import type { JournalContent } from "../../../lib/backend-types";

type Edition = {
  title: string;
  date: string;
  number?: string;
  summary?: string;
  pdf?: string;
  pages: Array<{ index: number; image: string; caption: string }>;
};

const FALLBACK_IMG = "https://res.cloudinary.com/diwvlsgsw/image/upload/v1762965931/images_2_wysfnt.jpg";

async function getEdition(slug: string) {
  try {
    const res = await apiGet<JournalContent>(`/api/jornais/${slug}`);
    return res.data;
  } catch (error) {
    console.warn("Falha ao carregar edição de jornal, usando fallback.", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getEdition(slug);
  const title = data?.title ? `${data.title} - Leitura` : "Leitura - Jornal de epoca";
  const description = data?.description || "Leitura vertical de edicao historica digitalizada.";
  return {
    title,
    description,
    alternates: { canonical: `/jornais-de-epoca/${slug}` },
    openGraph: {
      title,
      description,
      url: `/jornais-de-epoca/${slug}`,
      images: data?.coverImageUrl ? [{ url: data.coverImageUrl }] : [{ url: FALLBACK_IMG }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getEdition(slug);

  const edition: Edition = data
    ? {
        title: data.title,
        date: data.issueDate?.slice(0, 10) ?? "s/d",
        number: data.edition || undefined,
        summary: data.description,
        pdf: data.pdfUrl || undefined,
        pages: data.pages?.length
          ? data.pages.map((p) => ({ index: p.pageNumber, image: p.imageUrl, caption: `Página ${p.pageNumber}` }))
          : [{ index: 1, image: data.coverImageUrl || FALLBACK_IMG, caption: "Página 1" }],
      }
    : {
        title: (slug || "Edicao")
          .replaceAll("-", " ")
          .replace(/\b\w/g, (m) => m.toUpperCase()),
        date: "s/d",
        number: "s/n",
        summary: "Leitura provisoria com imagem em alta resolucao.",
        pdf: "#",
        pages: [{ index: 1, image: FALLBACK_IMG, caption: "Pagina 1" }],
      };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: edition.title,
    datePublished: edition.date,
    isPartOf: { "@type": "Periodical", name: "Jornais de epoca - Banco de Memoria" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EditionReader edition={edition} />
    </>
  );
}
