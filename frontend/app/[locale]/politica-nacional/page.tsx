import PoliticaLanding from "../../politica-nacional/sections/PoliticaLanding";
import { getSiteContent } from "@/lib/get-site-content";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

type Params = { params: Promise<{ locale?: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: paramLocale } = await params;
  const locale = paramLocale || (await getLocale()) || "pt-BR";
  const t = await getTranslations({ locale, namespace: "politicsPage.metadata" });
  const title = t("title");
  const description = t("description");
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/politica-nacional` },
    openGraph: { title, description, url: `/${locale}/politica-nacional`, type: "website" },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: Params) {
  const { locale: paramLocale } = await params;
  const locale = paramLocale || (await getLocale()) || "pt-BR";
  const t = await getTranslations({ locale, namespace: "politicsPage" });
  const { politics } = await getSiteContent();

  const localized = {
    ...politics,
    title: t("metadata.title"),
    description: t("metadata.description"),
    axes: politics.axes.map((ax, idx) => ({
      ...ax,
      label: t(`axes.${idx}.label`, { defaultMessage: ax.label }),
    })),
    events: politics.events.map((ev, idx) => ({
      ...ev,
      title: t(`events.${idx}.title`, { defaultMessage: ev.title }),
      summary: t(`events.${idx}.summary`, { defaultMessage: ev.summary }),
      href: ev.href.startsWith("/") ? `/${locale}${ev.href}` : ev.href,
    })),
    featured: {
      ...politics.featured,
      title: t("featured.title", { defaultMessage: politics.featured.title }),
      description: t("featured.description", { defaultMessage: politics.featured.description }),
      href: politics.featured.href.startsWith("/") ? `/${locale}${politics.featured.href}` : politics.featured.href,
    },
    axesLabel: t("stats.axes"),
  };

  return <PoliticaLanding content={localized} />;
}
