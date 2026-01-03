// file: components/replicasets/ReplicaSetsFilterBar.tsx
"use client";

import { Search, ListFilter, ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const healthOpts = ["todos", "Saudável", "Parcial", "Degradado"];
const sortKeys = [
  { key: "name", label: "Nome" },
  { key: "namespace", label: "Namespace" },
  { key: "ready", label: "Prontos" },
  { key: "available", label: "Disponíveis" },
  { key: "desired", label: "Desejados" },
];

export default function ReplicaSetsFilterBar({
  query, onQuery,
  health, onHealth,
  namespace, onNamespace,
  namespaces,
  sortBy, onSortBy,
  debounce = false,     // opcional: aplica debounce de 300ms na busca
  onClear,              // opcional: callback ao limpar filtros
}) {
  const toggleDir = () => onSortBy({ key: sortBy.key, dir: sortBy.dir === "asc" ? "desc" : "asc" });

  // Estado local para suportar debounce sem quebrar controle externo
  const [localQuery, setLocalQuery] = useState(query || "");
  useEffect(() => { setLocalQuery(query || ""); }, [query]);
  useEffect(() => {
    if (!debounce) return;
    const t = setTimeout(() => {
      if (localQuery !== query) onQuery?.(localQuery);
    }, 300);
    return () => clearTimeout(t);
  }, [debounce, localQuery, query, onQuery]);

  const clearFilters = () => {
    onQuery?.("");
    setLocalQuery("");
    onHealth?.("todos");
    onNamespace?.("todos");
    onClear?.();
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalQuery(val);
    if (!debounce) onQuery?.(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (localQuery || health !== "todos" || namespace !== "todos") clearFilters();
    }
  };

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            value={localQuery}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#0e141b] border border-white/10 rounded-lg pl-10 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="Buscar por nome, namespace ou dono (Deployment)…"
            aria-label="Buscar ReplicaSets por nome, namespace ou dono"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
          {localQuery && (
            <button
              type="button"
              onClick={clearFilters}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-300/80 hover:text-gray-100 px-1 py-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
              aria-label="Limpar busca e filtros"
              title="Limpar busca e filtros"
            >
              ×
            </button>
          )}
        </div>

        <motion.button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-cyan-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
          aria-label="Limpar filtros"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ListFilter className="h-4 w-4" />
          Limpar filtros
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={health}
          onChange={(e) => onHealth(e.target.value)}
          className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
          aria-label="Filtrar por saúde"
        >
          {healthOpts.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={namespace}
          onChange={(e) => onNamespace(e.target.value)}
          className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
          aria-label="Filtrar por namespace"
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
            aria-label="Ordenar por"
          >
            {sortKeys.map((k) => (
              <option key={k.key} value={k.key}>{k.label}</option>
            ))}
          </select>
          <motion.button
            onClick={toggleDir}
            className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 text-sm"
            title="Alternar ordem"
            aria-label={`Alternar direção: ${sortBy.dir === "asc" ? "crescente" : "decrescente"}`}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortBy.dir === "asc" ? "ASC" : "DESC"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
