import type { Metadata } from "next";
import AcervoHero from "./sections/AcervoHero";
import CityShowcase from "./sections/CityShowcase";
import CollectionsMosaic from "./sections/CollectionsMosaic";
import { getSiteContent } from "@/lib/get-site-content";
import { getLocale, getTranslations } from "next-intl/server";
import type { AcervoContent } from "../../lib/content-types";

type Params = { params: Promise<{ locale?: string }> };

const typeKeyMap: Record<string, string> = {
  Todos: "all",
  Documento: "document",
  Depoimento: "interview",
  Bibliografia: "bibliography",
  Jornal: "newspaper",
  Foto: "photo",
};

const originKeyMap: Record<string, string> = {
  Todos: "all",
  "Volta Redonda": "vr",
  "Barra Mansa": "bm",
  Fundos: "funds",
};

const tagKeyMap: Record<string, string> = {
  Documentos: "documents",
  Atas: "atas",
  Greves: "strikes",
  Depoimentos: "testimonies",
  Oral: "oral",
  Lideranças: "leaders",
  Bibliografia: "bibliography",
  Clipping: "clipping",
  Jornais: "newspapers",
  Histórico: "history",
  Fotografia: "photo",
  Cotidiano: "daily",
  Mobilização: "mobilization",
  Fundos: "funds",
  "Const. Civil": "construction",
  Metalúrgico: "metal",
  "Mov. Populares": "movements",
  "Dom Waldyr": "domWaldyr",
};

const buildLabels = (
  list: string[],
  t: Awaited<ReturnType<typeof getTranslations>>,
  scope: "types" | "origins" | "tags",
  map: Record<string, string>
) =>
  Object.fromEntries(
    list.map((item) => {
      const key = `hero.filterOptions.${scope}.${map[item] ?? "fallback"}`;
      return [item, t.has(key) ? t(key) : item];
    })
  );

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: paramLocale } = await params;
  const locale = paramLocale || (await getLocale()) || "pt-BR";
  const t = await getTranslations({ locale, namespace: "acervo" });
  const title = t("metadata.title");
  const description = t("metadata.description");

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/acervo` },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `/${locale}/acervo`,
      siteName: "Sintracon",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function AcervoPage({ params }: Params) {
  const { locale: paramLocale } = await params;
  const locale = paramLocale || (await getLocale()) || "pt-BR";
  const t = await getTranslations({ locale, namespace: "acervo" });
  const { acervo } = await getSiteContent();

  const hero: AcervoContent["hero"] = {
    ...acervo.hero,
    searchLabel: t("hero.searchLabel"),
    searchPlaceholder: t("hero.searchPlaceholder"),
    emptyStateMessage: t("hero.empty"),
    filterLabels: {
      types: buildLabels(acervo.hero.filters.types, t, "types", typeKeyMap),
      origins: buildLabels(acervo.hero.filters.origins, t, "origins", originKeyMap),
      tags: buildLabels(acervo.hero.filters.tags, t, "tags", tagKeyMap),
    },
    labels: {
      viewItem: t("hero.actions.viewItem"),
      previous: t("hero.nav.previous"),
      next: t("hero.nav.next"),
      results: t("hero.nav.results"),
    },
  };

  const cityShowcase: AcervoContent["cityShowcase"] = {
    ...acervo.cityShowcase,
    eyebrow: t("cityShowcase.eyebrow"),
    title: t("cityShowcase.title"),
    description: t("cityShowcase.description"),
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("metadata.title"),
    mainEntity: {
      "@type": "Organization",
      name: "Sintracon",
      url: "https://example.com",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "/acervo?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <AcervoHero content={hero} />
      <CollectionsMosaic />
      <CityShowcase content={cityShowcase} />
    </>
  );
}
