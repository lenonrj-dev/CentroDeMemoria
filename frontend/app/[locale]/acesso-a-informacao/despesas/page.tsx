import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

type Params = { params: Promise<{ locale?: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: paramLocale } = await params;
  const locale = paramLocale || (await getLocale()) || "pt-BR";
  const t = await getTranslations({ locale, namespace: "accessExpenses.metadata" });
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/acesso-a-informacao/despesas` },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: Params) {
  const { locale: paramLocale } = await params;
  const locale = paramLocale || (await getLocale()) || "pt-BR";
  const t = await getTranslations({ locale, namespace: "accessExpenses" });

  const DESPESAS = [
    {
      title: t("expenses.digital"),
      mes: t("months.oct2025"),
      valor: "R$ 12.800,00",
      categoria: t("categories.preservation"),
    },
    {
      title: t("expenses.hosting"),
      mes: t("months.oct2025"),
      valor: "R$ 6.200,00",
      categoria: t("categories.infrastructure"),
    },
    {
      title: t("expenses.editorial"),
      mes: t("months.sep2025"),
      valor: "R$ 4.150,00",
      categoria: t("categories.communication"),
    },
  ];

  const CATEGORIAS = [
    { label: t("categories.preservation"), perc: "42%" },
    { label: t("categories.infrastructure"), perc: "33%" },
    { label: t("categories.communication"), perc: "25%" },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: t("metadata.title"),
    url: `/${locale}/acesso-a-informacao/despesas`,
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
          {CATEGORIAS.map((c) => (
            <div key={c.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">{c.label}</div>
              <div className="text-lg font-semibold text-white">{c.perc}</div>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5">
          <div className="border-b border-white/10 px-4 py-3 sm:px-6">
            <div className="text-sm font-medium text-white">{t("recent.title")}</div>
            <div className="text-xs text-white/60">{t("recent.subtitle")}</div>
          </div>
          <ul className="divide-y divide-white/10">
            {DESPESAS.map((d) => (
              <li key={d.title} className="px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-white">{d.title}</h2>
                    <p className="text-sm text-white/70">
                      {d.categoria} • {d.mes}
                    </p>
                  </div>
                  <span className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-sm text-white">
                    {d.valor}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-white">{t("detail.title")}</h2>
          <p className="mt-2 text-sm text-white/70">
            {t("detail.text.part1")}{" "}
            <Link href={`/${locale}/acesso-a-informacao`} className="underline">
              {t("detail.access")}
            </Link>{" "}
            {t("detail.text.part2")}{" "}
            <Link href={`/${locale}/contato`} className="underline">
              {t("detail.contact")}
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
