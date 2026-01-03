import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getSiteContent } from "@/lib/get-site-content";

type Params = { params: Promise<{ locale?: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: paramLocale } = await params;
  const locale = paramLocale || (await getLocale()) || "pt-BR";
  const t = await getTranslations({ locale, namespace: "accessContracts.metadata" });
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/acesso-a-informacao/contratos` },
    robots: { index: true, follow: true },
  };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-white/60">{label}</div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

export default async function Page({ params }: Params) {
  const { locale: paramLocale } = await params;
  const locale = paramLocale || (await getLocale()) || "pt-BR";
  const t = await getTranslations({ locale, namespace: "accessContracts" });
  const { access } = await getSiteContent();

  const CONTRACTS = [
    {
      title: t("contracts.contract1.title"),
      partner: t("contracts.contract1.partner"),
      term: t("contracts.contract1.term"),
      value: t("contracts.contract1.value"),
      status: t("contracts.contract1.status"),
      link: "#",
    },
    {
      title: t("contracts.contract2.title"),
      partner: t("contracts.contract2.partner"),
      term: t("contracts.contract2.term"),
      value: t("contracts.contract2.value"),
      status: t("contracts.contract2.status"),
      link: "#",
    },
    {
      title: t("contracts.contract3.title"),
      partner: t("contracts.contract3.partner"),
      term: t("contracts.contract3.term"),
      value: t("contracts.contract3.value"),
      status: t("contracts.contract3.status"),
      link: "#",
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: t("metadata.title"),
    url: `/${locale}/acesso-a-informacao/contratos`,
    license: "CC-BY 4.0",
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
            {t("eyebrow")}
          </p>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-3xl text-white/70">{t("lead")}</p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat label={t("stats.active")} value={t("stats.activeValue")} />
          <Stat label={t("stats.cooperation")} value={t("stats.cooperationValue")} />
          <Stat label={t("stats.updated")} value={t("stats.updatedValue")} />
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5">
          <div className="border-b border-white/10 px-4 py-3 sm:px-6">
            <div className="text-sm font-medium text-white">{t("listing.title")}</div>
            <div className="text-xs text-white/60">{t("listing.subtitle")}</div>
          </div>

          <ul className="divide-y divide-white/10">
            {CONTRACTS.map((c) => (
              <li key={c.title} className="px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-white">{c.title}</h2>
                    <p className="text-sm text-white/70">{c.partner}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-white/60">
                      <span className="rounded border border-white/15 bg-white/5 px-2 py-1">
                        {c.term}
                      </span>
                      <span className="rounded border border-white/15 bg-white/5 px-2 py-1">
                        {c.value}
                      </span>
                      <span className="rounded border border-white/15 bg-white/5 px-2 py-1">
                        {c.status}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={c.link || "#"}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15"
                  >
                    {t("cta")}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-white">{t("request.title")}</h2>
          <p className="mt-2 text-sm text-white/70">
            {t("request.text.part1")}{" "}
            <Link href={`/${locale}/contato`} className="underline underline-offset-2">
              {t("request.contact")}
            </Link>{" "}
            {t("request.text.part2")}{" "}
            <Link href={`/${locale}/acesso-a-informacao`} className="underline underline-offset-2">
              {t("request.access")}
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
