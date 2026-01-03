// file: components/cronjobs/CronJobsFilterBar.tsx
"use client";

import { useEffect, useRef } from "react";
import { Search, ListFilter, ArrowUpDown, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const statusOpts = ["todos", "Ativo", "Suspenso"];
const sortKeys = [
  { key: "name", label: "Nome" },
  { key: "namespace", label: "Namespace" },
  { key: "next", label: "Próxima execução" },
  { key: "last", label: "Último agendamento" },
  { key: "suspend", label: "Suspenso" },
];

export default function CronJobsFilterBar({
  query, onQuery,
  status, onStatus,
  namespace, onNamespace,
  namespaces,
  sortBy, onSortBy,
  loading = false, // opcional
}) {
  const toggleDir = () => onSortBy({ key: sortBy.key, dir: sortBy.dir === "asc" ? "desc" : "asc" });
  const inputRef = useRef(null);

  // Atalho "/" para focar a busca (evita quando outro input tem foco)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target;
        const tag = (t?.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea" || t?.isContentEditable) return;
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1" role="search">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            className="w-full bg-[#0e141b] border border-white/10 rounded-lg pl-10 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="Buscar por nome ou namespace... (atalho: /)"
            aria-label="Buscar CronJobs por nome ou namespace"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

          {/* Clear ou loading no canto direito do input */}
          {loading ? (
            <Loader2
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400"
              aria-hidden="true"
            />
          ) : query ? (
            <button
              type="button"
              onClick={() => onQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              aria-label="Limpar busca"
              title="Limpar"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          ) : null}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          aria-label="Abrir filtros"
        >
          <ListFilter className="h-4 w-4" /> Filtros
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="status-cj">Status</label>
        <select
          id="status-cj"
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
        >
          {statusOpts.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <label className="sr-only" htmlFor="ns-cj">Namespace</label>
        <select
          id="ns-cj"
          value={namespace}
          onChange={(e) => onNamespace(e.target.value)}
          className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
        >
          {namespaces.map((ns) => (
            <option key={ns} value={ns}>{ns}</option>
          ))}
        </select>

        <div className="flex items-center gap-2 ml-auto">
          <label className="sr-only" htmlFor="sort-cj">Ordenar por</label>
          <select
            id="sort-cj"
            value={sortBy.key}
            onChange={(e) => onSortBy({ key: e.target.value, dir: "asc" })}
            className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
          >
            {sortKeys.map((k) => (
              <option key={k.key} value={k.key}>{k.label}</option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleDir}
            className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            title="Alternar ordem"
            aria-label="Alternar ordem de ordenação"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortBy.dir === "asc" ? "ASC" : "DESC"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
