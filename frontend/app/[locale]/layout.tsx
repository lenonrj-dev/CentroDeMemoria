import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { getSiteContent } from "@/lib/get-site-content";
import { setRequestLocale } from "../../i18n/request";
import type { GlobalContent } from "../../lib/content-types";

export const metadata: Metadata = {
  title: "CMODRM",
  description: "Site CMODRM",
};

const SUPPORTED_LOCALES = ["pt-BR", "pt-PT", "es", "en"] as const;
const DEFAULT_LOCALE = "pt-BR";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

async function getMessages(locale: string) {
  try {
    const base = (await import(`../../messages/${locale}.json`)).default;
    let merged = { ...base } as Record<string, unknown>;
    try {
      const acervo = (await import(`../../messages/acervo/${locale}.json`)).default;
      merged = { ...merged, acervo };
    } catch {
      // ok se não existir pacote adicional
    }
    return merged;
  } catch {
    return null;
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: requested } = await params;
  const locale = SUPPORTED_LOCALES.includes(requested as typeof SUPPORTED_LOCALES[number])
    ? (requested as string)
    : DEFAULT_LOCALE;

  setRequestLocale(locale);

  const messages =
    (await getMessages(locale)) ??
    (locale === DEFAULT_LOCALE ? null : await getMessages(DEFAULT_LOCALE));
  if (!messages) return notFound();

  const { global } = await getSiteContent();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar items={global.navbar.items} socials={global.navbar.socials} />
      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer content={global.footer as GlobalContent["footer"]} />
    </NextIntlClientProvider>
  );
}
