"use client";

// components/navbar/DesktopMenu.jsx
// Mais respiro entre links, ideal para telas largas. Mantém micro-interações.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { scaleIn } from "../../lib/motion";
import { ChevronDown } from "lucide-react";
import type { GlobalContent } from "../../lib/content-types";
import { useLocale, useTranslations } from "next-intl";

type NavItem = GlobalContent["navbar"]["items"][number];
type NavSubItem = NonNullable<NavItem["items"]>[number];

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

type Props = { items: NavItem[] };

export default function DesktopMenu({ items }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const [subOpen, setSubOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const t = useTranslations("navbar");
  const locale = useLocale();

  const prefixHref = (href: string) => {
    if (!href.startsWith("/")) return href;
    const parts = href.split("/");
    const first = parts[1];
    if (["pt-BR", "pt-PT", "es", "en"].includes(first)) return href;
    return `/${locale}${href}`;
  };

  return (
    <nav
      className="hidden lg:flex items-center gap-x-2 sm:gap-x-3 lg:gap-x-6 xl:gap-x-8 2xl:gap-x-4"
      aria-label="Navegação principal"
    >
      {items.map((item: NavItem, idx) =>
        item.type === "dropdown" ? (
          <div
            key={idx}
            className="relative"
            onMouseEnter={() => {
              setOpen(item.label);
              setSubOpen(null);
            }}
            onMouseLeave={() => {
              setOpen(null);
              setSubOpen(null);
            }}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open === item.label}
              className="group relative flex items-center gap-1 px-3 py-2 text-sm text-slate-200/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 lg:px-4 xl:px-5"
            >
              <span className="truncate max-w-[22ch]">{t(item.label as any)}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70 transition group-hover:opacity-100" />
              <span className="absolute inset-x-3 -bottom-[2px] h-[2px] origin-left scale-x-0 bg-white/40 transition group-hover:scale-x-100" />
            </button>

            <AnimatePresence>
              {open === item.label && (
                <motion.div
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={scaleIn}
                  className="absolute left-0 top-full z-30 mt-2 min-w-[260px] rounded-xl border border-white/10 bg-zinc-900/90 p-2 backdrop-blur"
                  role="menu"
                  aria-label={t(item.label as any)}
                >
                  {item.items?.map((sub: NavSubItem, i) => {
                    const hasChildren = Boolean(sub.children?.length);
                    const subHref = prefixHref(sub.href);
                    const active = isActive(subHref, pathname);
                    return (
                      <div
                        key={`${sub.label}-${i}`}
                        className="relative"
                        onMouseEnter={() => hasChildren && setSubOpen(sub.label)}
                        onMouseLeave={() => hasChildren && setSubOpen(null)}
                      >
                        <Link
                          href={subHref}
                          className={`flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                            active ? "text-white" : "text-slate-200/90"
                          }`}
                        >
                          <span>{t(sub.label as any)}</span>
                          {hasChildren && <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg] opacity-70" />}
                        </Link>

                        {hasChildren && subOpen === sub.label && (
                          <div className="absolute left-full top-0 ml-1 min-w-[220px] rounded-xl border border-white/10 bg-zinc-900/95 p-2 shadow-xl">
                            {sub.children?.map((leaf) => (
                              <Link
                                key={leaf.href}
                                href={prefixHref(leaf.href)}
                                className={`block rounded-md px-3 py-2 text-sm hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                                  isActive(prefixHref(leaf.href), pathname)
                                    ? "text-white"
                                    : "text-slate-200/90"
                                }`}
                              >
                                {t(leaf.label as any)}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            key={idx}
            href={prefixHref(item.href || "/")}
            className={`relative flex items-center px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 lg:px-4 xl:px-5 ${
              isActive(item.href || "/", pathname) ? "text-white" : "text-slate-200/90"
            }`}
          >
            <span className="flex items-center">{t(item.label as any)}</span>
            <span
              className={`absolute inset-x-3 -bottom-[2px] h-[2px] origin-left bg-white/60 transition ${
                isActive(item.href || "/", pathname) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
        )
      )}
    </nav>
  );
}
