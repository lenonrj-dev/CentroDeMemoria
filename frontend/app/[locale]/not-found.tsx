import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const locale = await getLocale();
  const prefix = (href: string) => (href.startsWith("/") ? `/${locale}${href}` : href);

  const status = [
    { label: t("status.navigation"), value: t("status.navigationValue"), note: t("status.navigationNote") },
    { label: t("status.interface"), value: t("status.interfaceValue"), note: t("status.interfaceNote") },
    { label: t("status.editorial"), value: t("status.editorialValue"), note: t("status.editorialNote") },
  ];

  const highlights = [
    { title: t("highlights.experience.title"), text: t("highlights.experience.text") },
    { title: t("highlights.early.title"), text: t("highlights.early.text") },
    { title: t("highlights.direct.title"), text: t("highlights.direct.text") },
  ];

  const shortcuts = [
    { href: "/politica-nacional", label: t("shortcuts.politics") },
    { href: "/transparencia", label: t("shortcuts.transparency") },
    { href: "/jornais-de-epoca", label: t("shortcuts.journals") },
    { href: "/acervo-pessoal/rubem-machado", label: t("shortcuts.personal") },
  ];

  return (
    <section className="relative w-full bg-black py-12 sm:py-16 lg:py-20">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">
            404
          </span>
          <div className="flex flex-col">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">{t("eyebrow")}</p>
            <p className="text-sm text-white/70">{t("lede")}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.8)]">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">{t("badge")}</p>
              <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">{t("title")}</h1>
              <p className="mt-4 max-w-2xl text-base text-white/70">{t("description")}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={prefix("/inicio")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/90 px-4 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white"
                >
                  {t("cta.home")}
                </Link>
                <Link
                  href={prefix("/acervo")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-black/50 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-black/60 hover:text-white"
                >
                  {t("cta.archive")}
                </Link>
                <Link
                  href={prefix("/contato")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  {t("cta.contact")}
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-white/5 bg-black/40 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">{t("status.title")}</p>
                    <p className="text-lg font-semibold text-white">{t("status.subtitle")}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    {t("status.online")}
                  </span>
                </div>

                <ul className="mt-4 space-y-3">
                  {status.map((item) => (
                    <li key={item.label} className="relative overflow-hidden rounded-xl border border-white/10 bg-black/30 p-3">
                      <div className="relative flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-white/80" />
                          <div>
                            <p className="text-sm font-semibold text-white">{item.label}</p>
                            <p className="text-xs text-white/60">{item.note}</p>
                          </div>
                        </div>
                        <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
                          {item.value}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">{t("shortcuts.title")}</p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {shortcuts.map((sc) => (
                    <Link
                      key={sc.href}
                      href={prefix(sc.href)}
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-black/40 hover:text-white"
                    >
                      {sc.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 bg-black/30 px-6 py-6 sm:px-8">
            <div className="grid gap-4 md:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/80 shadow-[0_10px_30px_-25px_rgba(0,0,0,0.7)]"
                >
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
