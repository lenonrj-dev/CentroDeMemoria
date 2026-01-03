import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { getSiteContent } from "@/lib/get-site-content";
import type { GlobalContent } from "@/lib/content-types";
import "../globals.css";

const DEFAULT_LOCALE = "pt-BR";

async function getMessages() {
  const base = (await import("../../messages/pt-BR.json")).default;
  let merged = { ...base } as Record<string, unknown>;
  try {
    const acervo = (await import("../../messages/acervo/pt-BR.json")).default;
    merged = { ...merged, acervo };
  } catch {
    // optional bundle
  }
  return merged;
}

export default async function AcervoLayout({ children }: { children: ReactNode }) {
  const messages = await getMessages();
  const { global } = await getSiteContent();

  return (
    <NextIntlClientProvider locale={DEFAULT_LOCALE} messages={messages}>
      <Navbar items={global.navbar.items} socials={global.navbar.socials} />
      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer content={global.footer as GlobalContent["footer"]} />
    </NextIntlClientProvider>
  );
}
