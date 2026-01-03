"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Menu, Instagram, Facebook, Youtube } from "lucide-react";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import LanguageMenu from "./LanguageMenu";
import SearchBar from "./SearchBar";
import type { GlobalContent } from "../../lib/content-types";
import { useLocale, useTranslations } from "next-intl";

type NavbarProps = {
  items: GlobalContent["navbar"]["items"];
  socials: GlobalContent["navbar"]["socials"];
};

type SocialPlatform = NavbarProps["socials"][number]["platform"];

const SOCIAL_ICONS: Record<SocialPlatform, ReactElement> = {
  instagram: <Instagram className="h-4.5 w-4.5" />,
  facebook: <Facebook className="h-4.5 w-4.5" />,
  youtube: <Youtube className="h-4.5 w-4.5" />,
};

export default function Navbar({ items, socials }: NavbarProps) {
  const t = useTranslations("global");
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Acessibilidade: pular para conteúdo */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-black focus:px-3 focus:py-2 focus:text-white"
      >
        {t("skipToContent")}
      </a>

      <header
        className={`sticky top-0 z-40 w-full border-b border-white/10 ${
          scrolled ? "bg-black/60 backdrop-blur" : "bg-black/30 backdrop-blur"
        }`}
      >
        {/* Contêiner mais largo para usar as bordas laterais em telas grandes */}
        <div className="mx-auto w-full max-w-[1760px] px-3 sm:px-6 2xl:max-w-[1880px]">
          {/* Grid em 3 colunas bem definidas */}
          <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-x-2 sm:gap-x-4 lg:gap-x-6 2xl:gap-x-10">
            {/* LOGO: colada mais à esquerda */}
            <Link
              href={`/${locale}`}
              aria-label={t("siteTitle")}
              className="group inline-flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
            <div className="leading-none">
              <span className="block text-[1.25rem] font-extrabold tracking-tight text-transparent drop-shadow-[0_1px_0_rgba(0,0,0,0.25)] bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text sm:text-[1.35rem]">
                {t("siteTitle")}
              </span>
              <span className="mt-[1px] block text-[10px] uppercase tracking-[0.20em] text-white/60">
                {t("siteSubtitle")}
              </span>
            </div>
          </Link>

            {/* MENU CENTRAL — centralizado e com mais respiro entre itens */}
            <div className="flex items-center justify-center">
              <DesktopMenu items={items} />
            </div>

            {/* AÇÕES À DIREITA: redes, busca e idioma */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 lg:gap-4 2xl:gap-5">
              {/* Redes sociais (desktop) */}
              <div className="hidden items-center gap-1.5 md:flex lg:gap-2">
                {socials.map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    {SOCIAL_ICONS[social.platform]}
                  </a>
                ))}
              </div>

              {/* Busca (desktop) */}
              <div className="hidden w-[360px] md:block lg:w-[520px] 2xl:w-[640px]">
                <SearchBar />
              </div>

              {/* Idioma */}
              <LanguageMenu />

              {/* Botão mobile */}
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-slate-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-controls="mobile-menu"
                aria-expanded={mobileOpen}
                aria-label="Abrir menu de navegação"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu móvel */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} items={items} />
    </>
  );
}
