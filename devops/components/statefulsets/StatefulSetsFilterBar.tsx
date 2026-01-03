// file: components/statefulsets/StatefulSetsFilterBar.tsx
"use client";

import { Search, ListFilter, ArrowUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const healthOpts = ["todos", "Saudável", "Parcial", "Degradado"];
const sortKeys = [
  { key: "name", label: "Nome" },
  { key: "namespace", label: "Namespace" },
  { key: "ready", label: "Prontos" },
  { key: "desired", label: "Desejados" },
];

export default function StatefulSetsFilterBar({
  query, onQuery,
  health, onHealth,
  namespace, onNamespace,
  namespaces,
  sortBy, onSortBy,
  debounce = false,
  onClear, // opcional
}) {
  const toggleDir = () => onSortBy({ key: sortBy.key, dir: sortBy.dir === "asc" ? "desc" : "asc" });
  const [localQuery, setLocalQuery] = useState(query || "");
  const canClear = useMemo(() => (localQuery?.trim()?.length ?? 0) > 0 || health !== "todos" || namespace !== "todos", [localQuery, health, namespace]);

  // Sincroniza quando a query externa muda
  useEffect(() => {
    setLocalQuery(query || "");
  }, [query]);

  // Debounce opcional
  useEffect(() => {
    if (!debounce) return;
    const t = setTimeout(() => onQuery?.(localQuery), 300);
    return () => clearTimeout(t);
  }, [localQuery, debounce, onQuery]);

  return (
    <div className="flex flex-col gap-3 mb-4" role="search" aria-label="Barra de filtros de StatefulSets">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <label htmlFor="statefulsets-search" className="sr-only">Buscar</label>
          <input
            id="statefulsets-search"
            value={debounce ? localQuery : query}
            onChange={(e) => debounce ? setLocalQuery(e.target.value) : onQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (debounce) onQuery?.(localQuery);
              }
            }}
            className="w-full bg-[#0e141b] border border-white/10 rounded-lg pl-10 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="Buscar por nome ou namespace..."
            aria-label="Buscar por nome ou namespace"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
          {(debounce ? localQuery : query) ? (
            <button
              type="button"
              onClick={() => {
                if (debounce) setLocalQuery("");
                onQuery?.("");
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded border border-white/10 bg-white/5 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
              aria-label="Limpar busca"
              title="Limpar busca"
            >
              Limpar
            </button>
          ) : null}
        </div>

        <button className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-cyan-500/30">
          <ListFilter className="h-4 w-4" />
          Filtros
        </button>
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
            aria-label="Ordenar por coluna"
          >
            {sortKeys.map((k) => (
              <option key={k.key} value={k.key}>{k.label}</option>
            ))}
          </select>
          <button
            onClick={toggleDir}
            className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 text-sm"
            title="Alternar ordem"
            aria-label={`Alternar ordem para ${sortBy.dir === "asc" ? "descendente" : "ascendente"}`}
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortBy.dir === "asc" ? "ASC" : "DESC"}
          </button>
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 text-sm"
              disabled={!canClear}
              aria-disabled={!canClear}
              aria-live="polite"
              title="Limpar filtros"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
