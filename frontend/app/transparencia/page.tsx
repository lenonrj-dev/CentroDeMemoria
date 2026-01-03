import Link from "next/link";
import { getSiteContent } from "@/lib/get-site-content";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

type Params = { params?: { locale?: string } | Promise<{ locale?: string }> };

async function resolveLocale(params?: Params["params"]) {
  if (!params) return (await getLocale()) || "pt-BR";
  const resolved = await Promise.resolve(params);
  return resolved.locale || (await getLocale()) || "pt-BR";
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "transparencyPage.metadata" });
  const title = t("title");
  const description = t("description");
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/transparencia` },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: Params) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "transparencyPage" });
  const { transparency } = await getSiteContent();

  const portalLinks = transparency.portalLinks.map((link, idx) => ({
    ...link,
    title: t(`links.${idx}.title`, { defaultMessage: link.title }),
    description: t(`links.${idx}.description`, { defaultMessage: link.description }),
    actionLabel: t(`links.${idx}.action`, { defaultMessage: link.actionLabel ?? t("ui.open") }),
    href: link.href.startsWith("/") ? `/${locale}${link.href}` : link.href,
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("hero.title"),
    url: `/${locale}/transparencia`,
  };

  return (
    <main className="relative w-full py-10 sm:py-14 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/60">
            {t("hero.eyebrow")}
          </p>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            {t("hero.title")}
          </h1>
          <p className="mt-2 max-w-3xl text-white/70">{t("hero.description")}</p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portalLinks.map((link, idx) => (
            <article
              key={`${link.href}-${idx}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <h2 className="text-lg font-semibold text-white">{link.title}</h2>
              <p className="mt-1 text-sm text-white/70">{link.description}</p>
              <Link
                href={link.href}
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15"
              >
                {link.actionLabel ?? t("ui.open")}
              </Link>
            </article>
          ))}
        </section>

        <p className="mt-6 text-sm text-white/60">{t("footerNote")}</p>
      </div>
    </main>
  );
}
