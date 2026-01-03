// file: app/components/deployments/DeploymentsFilterBar.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ListFilter, ArrowUpDown, X } from "lucide-react";
import { motion } from "framer-motion";

const statusOpts = ["todos", "Disponível", "Progredindo", "Degradado"];
const sortKeys = [
  { key: "name", label: "Nome" },
  { key: "namespace", label: "Namespace" },
  { key: "available", label: "Replicas Disponíveis" },
  { key: "desired", label: "Replicas Desejadas" },
];

export default function DeploymentsFilterBar({
  query, onQuery,
  status, onStatus,
  namespace, onNamespace,
  namespaces,
  sortBy, onSortBy,
}) {
  const toggleDir = () => onSortBy({ key: sortBy.key, dir: sortBy.dir === "asc" ? "desc" : "asc" });

  const [localQ, setLocalQ] = useState(query ?? "");
  const [typing, setTyping] = useState(false);

  // Debounce 300ms
  useEffect(() => {
    setTyping(true);
    const t = setTimeout(() => {
      onQuery?.(localQ);
      setTyping(false);
    }, 300);
    return () => clearTimeout(t);
  }, [localQ]);

  // Sincroniza se o pai alterar externamente
  useEffect(() => {
    setLocalQ(query ?? "");
  }, [query]);

  const sortDirLabel = useMemo(() => (sortBy.dir === "asc" ? "ASC" : "DESC"), [sortBy.dir]);

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onQuery?.(localQ);
              }
            }}
            aria-label="Buscar deployments por nome ou namespace"
            className="w-full bg-[#0e141b] border border-white/10 rounded-lg pl-10 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="Buscar por nome ou namespace..."
          />
          <Search aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {localQ && (
            <button
              type="button"
              aria-label="Limpar busca"
              onClick={() => { setLocalQ(""); onQuery?.(""); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/5"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <motion.span
            aria-live="polite"
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: typing ? 1 : 0 }}
          >
            buscando…
          </motion.span>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-cyan-500/30"
        >
          <ListFilter className="h-4 w-4" />
          Filtros
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
        >
          {statusOpts.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={namespace}
          onChange={(e) => onNamespace(e.target.value)}
          className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
        >
          {namespaces.map((ns) => (
            <option key={ns} value={ns}>{ns}</option>
          ))}
        </select>

        <div className="flex items-center gap-2 ml-auto">
          <select
            value={sortBy.key}
            onChange={(e) => onSortBy({ key: e.target.value, dir: "asc" })}
            className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
          >
            {sortKeys.map((k) => (
              <option key={k.key} value={k.key}>{k.label}</option>
            ))}
          </select>
          <motion.button
            type="button"
            onClick={toggleDir}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 text-sm"
            title="Alternar ordem"
            aria-label={`Alternar ordem para ${sortDirLabel === "ASC" ? "DESC" : "ASC"}`}
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortDirLabel}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
