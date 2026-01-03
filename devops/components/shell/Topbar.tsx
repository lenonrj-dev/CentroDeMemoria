"use client";

import { Menu, Search, LogOut } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../providers/ToastProvider";
import { useAuth } from "../devops/AuthProvider";

const NAV_ITEMS = [
  { label: "Visao geral", href: "/dashboard/overview" },
  { label: "Metricas", href: "/dashboard/metrics" },
  { label: "Logs", href: "/dashboard/logs" },
  { label: "Config", href: "/dashboard/config" },
];

type TopbarProps = {
  onToggleSidebar: () => void;
};

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<typeof NAV_ITEMS>([]);
  const [openList, setOpenList] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const { pushToast } = useToast();
  const { clearToken } = useAuth();

  const filtered = useMemo(() => {
    if (!q.trim()) return [];
    const k = q.trim().toLowerCase();
    return NAV_ITEMS.filter((r) => r.label.toLowerCase().includes(k)).slice(0, 6);
  }, [q]);

  useEffect(() => {
    if (!q) {
      setResults([]);
      setOpenList(false);
      setCursor(-1);
      return;
    }
    setResults(filtered);
    setOpenList(true);
  }, [filtered, q]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!listRef.current || !inputRef.current) return;
      if (listRef.current.contains(e.target as Node) || inputRef.current.contains(e.target as Node)) return;
      setOpenList(false);
      setCursor(-1);
    };
    window.addEventListener("click", onClickOutside);
    return () => window.removeEventListener("click", onClickOutside);
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!openList) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(results.length ? results.length - 1 : 0, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(-1, c - 1));
    } else if (e.key === "Enter") {
      if (cursor >= 0 && results[cursor]) {
        const href = results[cursor].href;
        if (href) window.location.href = href;
      }
    } else if (e.key === "Escape") {
      setOpenList(false);
      setCursor(-1);
    }
  };

  return (
    <header className="h-16 sticky top-0 z-20 bg-[#0b0f14]/90 backdrop-blur border-b border-white/10">
      <div className="h-full max-w-[1600px] mx-auto flex items-center gap-3 px-4 md:px-6 lg:px-8">
        <motion.button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          aria-label="Alternar sidebar"
          whileTap={{ scale: 0.96 }}
        >
          <Menu className="h-5 w-5" />
        </motion.button>

        <div className="relative flex-1 max-w-xl">
          <label className="sr-only" htmlFor="global-search">
            Buscar
          </label>
          <input
            id="global-search"
            ref={inputRef}
            className="w-full bg-[#0e141b] border border-white/10 rounded-lg pl-9 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="Buscar sections do painel"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => q && setOpenList(true)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={openList}
            aria-controls="search-results"
            aria-autocomplete="list"
            aria-activedescendant={cursor >= 0 ? `result-${cursor}` : undefined}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

          <AnimatePresence>
            {openList && (
              <motion.div
                ref={listRef}
                id="search-results"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute z-10 mt-2 w-full rounded-lg border border-white/10 bg-[#0e141b] shadow-xl"
                role="listbox"
              >
                {results.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-300">Nenhum resultado encontrado</div>
                ) : (
                  <ul>
                    {results.map((r, idx) => (
                      <li key={r.href}>
                        <Link
                          id={`result-${idx}`}
                          href={r.href}
                          className={`block px-3 py-2 text-sm ${idx === cursor ? "bg-white/5" : "hover:bg-white/5"}`}
                          role="option"
                          aria-selected={idx === cursor}
                          onClick={() => setOpenList(false)}
                        >
                          {r.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          className="ml-auto p-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          aria-label="Sair"
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            clearToken();
            pushToast({
              title: "Sessao encerrada",
              description: "Faça login novamente para acessar o painel.",
              tone: "info",
            });
          }}
        >
          <LogOut className="h-5 w-5" />
        </motion.button>
      </div>
    </header>
  );
}
