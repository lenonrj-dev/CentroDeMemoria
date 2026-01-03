"use client";

// components/navbar/MobileMenu.jsx
// Painel móvel com overlay, blur forte e busca global compacta.

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LanguageMenu from "./LanguageMenu";
import { useTranslations as useNavTranslations } from "next-intl";
import SearchBar from "./SearchBar";
import type { GlobalContent } from "../../lib/content-types";

const panel = {
  hidden: { x: "100%" },
  show: { x: 0, transition: { type: "tween" as const, duration: 0.24 } },
  exit: { x: "100%", transition: { type: "tween" as const, duration: 0.18 } },
};

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  items: GlobalContent["navbar"]["items"];
};

type NavSubItem = NonNullable<GlobalContent["navbar"]["items"][number]["items"]>[number];

export default function MobileMenu({ open, onClose, items }: MobileMenuProps) {
  const t = useTranslations("global");
  const tn = useNavTranslations("navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  useEffect(() => {
    if (open) document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (prevPathRef.current !== pathname) onClose();
    prevPathRef.current = pathname;
  }, [onClose, open, pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/65 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />

          <motion.aside
            id="mobile-menu"
            className="fixed inset-y-0 right-0 z-50 w-[86%] max-w-[360px] border-l border-white/10 bg-zinc-950/95 p-4 backdrop-blur"
            variants={panel}
            initial="hidden"
            animate="show"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label={t("menu")}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-semibold">{t("menu")}</span>
              <button className="rounded-lg px-3 py-1.5 text-xs text-white/70 hover:bg-white/5" onClick={onClose}>
                {t("close")}
              </button>
            </div>

            {/* Busca compacta */}
            <SearchBar compact className="mb-3" />

            {/* Navegação */}
            <div className="space-y-2">
              {items.map((item, idx) =>
                item.type === "dropdown" ? (
                  <div key={idx} className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
                    <div className="px-2 py-1 text-xs uppercase tracking-wide text-white/60">
                      {tn(item.label as any)}
                    </div>
                    <div className="mt-1 space-y-1">
                      {item.items?.map((sub: NavSubItem, i) => (
                        <div key={`${sub.label}-${i}`} className="space-y-1 rounded-md px-1 py-1">
                          <Link
                            href={
                              sub.href.startsWith("/")
                                ? `/${locale}${sub.href}`
                                : sub.href
                            }
                            className="block rounded-md px-2.5 py-2 text-sm text-white/90 hover:bg-white/5"
                            onClick={onClose}
                          >
                            {tn(sub.label as any)}
                          </Link>
                          {sub.children?.length ? (
                            <div className="ml-2 space-y-1 border-l border-white/10 pl-2">
                              {sub.children.map((leaf) => (
                                <Link
                              key={leaf.href}
                              href={
                                leaf.href.startsWith("/")
                                  ? `/${locale}${leaf.href}`
                                  : leaf.href
                              }
                                  className="block rounded-md px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/5"
                                  onClick={onClose}
                                >
                                  {tn(leaf.label as any)}
                                </Link>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                <Link
                  key={idx}
                  href={
                    item.href?.startsWith("/")
                      ? `/${locale}${item.href}`
                      : item.href || "/"
                  }
                  className="block rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                  onClick={onClose}
                >
                  {tn(item.label as any)}
                </Link>
              )
            )}
          </div>

            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="mb-2 text-xs uppercase tracking-wide text-white/60">Idioma</div>
              <LanguageMenu compact={true} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
