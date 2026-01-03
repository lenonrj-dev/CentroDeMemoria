"use client";

// components/navbar/LanguageMenu.tsx
// UI de idioma (apenas visual) com micro-anima��ǜo.

import { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

type Lang = { code: string; labelKey: string; short: string };

const langs: Lang[] = [
  { code: "pt-BR", labelKey: "lang.pt-BR", short: "BR" },
  { code: "pt-PT", labelKey: "lang.pt-PT", short: "PT" },
  { code: "es", labelKey: "lang.es", short: "ES" },
  { code: "en", labelKey: "lang.en", short: "EN" },
];

const pop = {
  hidden: { opacity: 0, y: 6, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const } },
};

type LanguageMenuProps = {
  compact?: boolean;
};

export default function LanguageMenu({ compact = false }: LanguageMenuProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && e.target instanceof Node && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-slate-200 hover:bg-white/10"
      >
        <Globe className="h-4 w-4" />
        {!compact && <span className="hidden sm:inline">{locale?.toUpperCase() || "BR"}</span>}
        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={pop}
            className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-white/10 bg-zinc-900/90 p-1 backdrop-blur"
          >
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  const segments = pathname.split("/").filter(Boolean);
                  segments[0] = l.code;
                  router.push("/" + segments.join("/"));
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-200/90 hover:bg-white/5"
              >
                <span>{t(l.labelKey)}</span>
                {locale === l.code && <Check className="h-4 w-4 text-white/80" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
