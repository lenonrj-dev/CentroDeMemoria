import CityLanding from "../_components/CityLanding";
import { getCity } from "../cityData";
import { apiGet } from "@/lib/backend-client";
import type {
  DocumentContent,
  JournalContent,
  PhotoArchiveContent,
  ReferenceContent,
  TestimonialContent,
} from "@/lib/backend-types";

const city = getCity("volta-redonda");

export const metadata = {
  title: "Acervo Volta Redonda | Banco de Memória",
  description:
    "Pré-visualização do acervo de Volta Redonda: documentos, depoimentos, referência bibliográfica, jornais de época e acervo fotográfico.",
  keywords: [
    "Volta Redonda",
    "acervo",
    "documentos históricos",
    "história oral",
    "jornais de época",
    "fotografia",
    "centro de memória",
  ],
  alternates: { canonical: "/acervo/volta-redonda" },
  openGraph: {
    title: "Acervo Volta Redonda | Banco de Memória",
    description:
      "Navegue por documentos, depoimentos, referências e acervo fotográfico dedicados à memória de Volta Redonda.",
    url: "/acervo/volta-redonda",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acervo Volta Redonda | Banco de Memória",
    description:
      "Documentos, depoimentos, referências e acervo fotográfico de Volta Redonda.",
  },
};

export default async function Page() {
  if (!city) return null;

  try {
    const tag = city.name;
    const [docs, depo, refs, journals, photos] = await Promise.all([
      apiGet<DocumentContent[]>(`/api/documentos?tag=${encodeURIComponent(tag)}&page=1&limit=6`),
      apiGet<TestimonialContent[]>(`/api/depoimentos?tag=${encodeURIComponent(tag)}&page=1&limit=6`),
      apiGet<ReferenceContent[]>(`/api/referencias?tag=${encodeURIComponent(tag)}&page=1&limit=6`),
      apiGet<JournalContent[]>(`/api/jornais?tag=${encodeURIComponent(tag)}&page=1&limit=6`),
      apiGet<PhotoArchiveContent[]>(`/api/acervo-fotografico?tag=${encodeURIComponent(tag)}&page=1&limit=12`),
    ]);

    return (
      <CityLanding
        city={city}
        previews={{
          documents: docs.data,
          testimonials: depo.data,
          references: refs.data,
          journals: journals.data,
          photoArchives: photos.data,
        }}
      />
    );
  } catch {
    return <CityLanding city={city} />;
  }
}

