// file: components/daemonsets/DaemonSetsFilterBar.tsx
"use client";

import { Search, ListFilter, ArrowUpDown, Loader2, X } from "lucide-react";

const healthOpts = ["todos", "Saudável", "Parcial", "Degradado"];
const sortKeys = [
  { key: "name", label: "Nome" },
  { key: "namespace", label: "Namespace" },
  { key: "ready", label: "Prontos" },
  { key: "desired", label: "Desejados" },
];

export default function DaemonSetsFilterBar({
  query, onQuery,
  status, onStatus,
  namespace, onNamespace,
  namespaces,
  sortBy, onSortBy,
  loading = false,
}) {
  const toggleDir = () => onSortBy({ key: sortBy.key, dir: sortBy.dir === "asc" ? "desc" : "asc" });

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            className="w-full bg-[#0e141b] border border-white/10 rounded-lg pl-10 pr-20 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="Buscar por nome ou namespace…"
            aria-label="Campo de busca por nome ou namespace"
            aria-busy={loading ? "true" : "false"}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

          {/* Botão limpar */}
          {query?.length > 0 && (
            <button
              type="button"
              onClick={() => onQuery("")}
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              aria-label="Limpar busca"
              title="Limpar busca"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}

          {/* Spinner de loading */}
          {loading && (
            <Loader2
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400"
              aria-hidden="true"
            />
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
          aria-disabled={loading ? "true" : "false"}
          title="Abrir filtros adicionais"
        >
          <ListFilter className="h-4 w-4" />
          Filtros
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
          aria-label="Filtrar por saúde do DaemonSet"
        >
          {healthOpts.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={namespace}
          onChange={(e) => onNamespace(e.target.value)}
          className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
          aria-label="Filtrar por namespace"
        >
          {namespaces.map((ns) => (
            <option key={ns} value={ns}>
              {ns}
            </option>
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
              <option key={k.key} value={k.key}>
                {k.label}
              </option>
            ))}
          </select>
          <button
            onClick={toggleDir}
            className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 text-sm"
            title="Alternar ordem"
            type="button"
            aria-label={`Alternar ordem (${sortBy.dir === "asc" ? "ascendente" : "descendente"})`}
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortBy.dir === "asc" ? "ASC" : "DESC"}
          </button>
        </div>
      </div>
    </div>
  );
}
