// file: components/jobs/JobsFilterBar.tsx
"use client";

import { useEffect, useRef } from "react";
import { Search, ListFilter, ArrowUpDown, X } from "lucide-react";

const statusOpts = ["todos", "Active", "Succeeded", "Failed", "Suspended"];
const sortKeys = [
  { key: "name", label: "Nome" },
  { key: "namespace", label: "Namespace" },
  { key: "completions", label: "Conclusão %" },
  { key: "started", label: "Início" },
  { key: "duration", label: "Duração (s)" },
];

export default function JobsFilterBar({
  query, onQuery,
  status, onStatus,
  namespace, onNamespace,
  namespaces,
  sortBy, onSortBy,
}) {
  const toggleDir = () => onSortBy({ key: sortBy.key, dir: sortBy.dir === "asc" ? "desc" : "asc" });
  const inputRef = useRef(null);

  // Atalho: "/" foca o campo de busca (quando não estiver digitando em outro input/textarea)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex flex-col gap-3 mb-4" role="search" aria-label="Filtros e ordenação de Jobs">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <label htmlFor="jobs-search" className="sr-only">Buscar por nome, namespace ou dono</label>
          <input
            id="jobs-search"
            ref={inputRef}
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            className="w-full bg-[#0e141b] border border-white/10 rounded-lg pl-10 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="Buscar por nome, namespace ou dono (CronJob/Controller)…"
            aria-label="Buscar Jobs"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {query && (
            <button
              type="button"
              onClick={() => onQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/5"
              title="Limpar busca"
              aria-label="Limpar busca"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-cyan-500/30"
          aria-haspopup="dialog"
          title="Abrir filtros avançados"
        >
          <ListFilter className="h-4 w-4" />
          Filtros
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="jobs-status">Status</label>
        <select
          id="jobs-status"
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
        >
          {statusOpts.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <label className="sr-only" htmlFor="jobs-namespace">Namespace</label>
        <select
          id="jobs-namespace"
          value={namespace}
          onChange={(e) => onNamespace(e.target.value)}
          className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
        >
          {namespaces.map((ns) => (
            <option key={ns} value={ns}>{ns}</option>
          ))}
        </select>

        <div className="flex items-center gap-2 ml-auto">
          <label className="sr-only" htmlFor="jobs-sortkey">Ordenar por</label>
          <select
            id="jobs-sortkey"
            value={sortBy.key}
            onChange={(e) => onSortBy({ key: e.target.value, dir: "asc" })}
            className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
          >
            {sortKeys.map((k) => (
              <option key={k.key} value={k.key}>{k.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={toggleDir}
            className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 text-sm"
            title="Alternar ordem"
            aria-label={`Alternar ordem. Ordem atual: ${sortBy.dir === "asc" ? "ascendente" : "descendente"}`}
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortBy.dir === "asc" ? "ASC" : "DESC"}
          </button>
        </div>
      </div>
    </div>
  );
}
