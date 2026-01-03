import AccessLanding from "../../acesso-a-informacao/sections/AccessLanding";
import { getSiteContent } from "@/lib/get-site-content";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { AccessContent } from "../../../lib/content-types";

type Params = { params: Promise<{ locale?: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: paramLocale } = await params;
  const locale = paramLocale || (await getLocale()) || "pt-BR";
  const t = await getTranslations({ locale, namespace: "accessMain.metadata" });
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/acesso-a-informacao` },
    openGraph: {
      title,
      description,
      url: `/${locale}/acesso-a-informacao`,
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: Params) {
  const { locale: paramLocale } = await params;
  const locale = paramLocale || (await getLocale()) || "pt-BR";
  const t = await getTranslations({ locale, namespace: "accessMain" });
  const { access } = await getSiteContent();

  const filterDisplay = Object.fromEntries(
    access.hero.filters.map((f) => [f, t(`filters.${f.toLowerCase()}`, { defaultMessage: f })])
  );

  const content: AccessContent = {
    ...access,
    hero: {
      ...access.hero,
      label: t("hero.label"),
      title: t("hero.title"),
      description: t("hero.description"),
      searchPlaceholder: t("hero.searchPlaceholder"),
      filterLabel: t("hero.filterLabel"),
      filters: access.hero.filters,
      filterDisplay,
    },
    operations: {
      ...access.operations,
      howItWorksTitle: t("operations.howItWorksTitle"),
      howItWorksSteps: access.operations.howItWorksSteps.map((s, idx) => ({
        ...s,
        title: t(`operations.steps.${idx}.title`, { defaultMessage: s.title }),
        detail: t(`operations.steps.${idx}.detail`, { defaultMessage: s.detail }),
      })),
      cta: {
        ...access.operations.cta,
        label: t("operations.cta"),
        href: `/${locale}/contato`,
      },
    },
    rights: {
      ...access.rights,
      title: t("rights.title"),
      items: access.rights.items.map((item, idx) =>
        t(`rights.items.${idx}`, { defaultMessage: item })
      ),
      policyLink: {
        ...access.rights.policyLink,
        label: t("rights.policy"),
        href: `/${locale}/transparencia/politica`,
      },
    },
    transparency: {
      ...access.transparency,
      heading: t("transparency.heading"),
      reports: access.transparency.reports.map((r, idx) => ({
        ...r,
        title: t(`transparency.reports.${idx}.title`, { defaultMessage: r.title }),
        description: t(`transparency.reports.${idx}.description`, { defaultMessage: r.description }),
        href: r.href.startsWith("/") ? `/${locale}${r.href}` : r.href,
      })),
    },
    datasets: {
      ...access.datasets,
      heading: t("datasets.heading"),
      label: t("datasets.label"),
      items: access.datasets.items.map((d, idx) => ({
        ...d,
        title: t(`datasets.items.${idx}.title`, { defaultMessage: d.title }),
        type: t(`datasets.items.${idx}.type`, { defaultMessage: d.type }),
        href: d.href.startsWith("/") ? `/${locale}${d.href}` : d.href,
      })),
    },
    quickSteps: access.quickSteps.map((step, idx) => ({
      ...step,
      title: t(`quickSteps.${idx}.title`, { defaultMessage: step.title }),
      text: t(`quickSteps.${idx}.text`, { defaultMessage: step.text }),
    })),
    faq: {
      ...access.faq,
      heading: t("faq.heading"),
      items: access.faq.items.map((item, idx) => ({
        q: t(`faq.items.${idx}.q`, { defaultMessage: item.q }),
        a: t(`faq.items.${idx}.a`, { defaultMessage: item.a }),
      })),
    },
    contact: {
      ...access.contact,
      title: t("contact.title"),
      description: t("contact.description"),
      ctaLabel: t("contact.cta"),
      ctaHref: `/${locale}/contato`,
    },
    ui: {
      learnMore: t("ui.learnMore"),
      viewMore: t("ui.viewMore"),
      open: t("ui.open"),
      download: t("ui.open"),
    },
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("metadata.title"),
    description: t("metadata.description"),
    isPartOf: { "@type": "WebSite", name: "Sintracon" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <AccessLanding content={content} />
    </>
  );
}
