// file: components/pods/PodsFilterBar.tsx
"use client";

import { Search, ListFilter, ArrowUpDown } from "lucide-react";

const statusOpts = ["todos", "Running", "Pending", "Failed", "Succeeded", "Unknown"];
const sortKeys = [
  { key: "name", label: "Nome" },
  { key: "namespace", label: "Namespace" },
  { key: "cpu", label: "CPU" },
  { key: "memory", label: "Memória" },
];

export default function PodsFilterBar({
  query, onQuery,
  status, onStatus,
  namespace, onNamespace,
  namespaces,
  sortBy, onSortBy,
}) {
  const toggleDir = () => onSortBy({ key: sortBy.key, dir: sortBy.dir === "asc" ? "desc" : "asc" });

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            className="w-full bg-[#0e141b] border border-white/10 rounded-lg pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="Buscar por nome, namespace ou nó..."
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <button className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-cyan-500/30">
          <ListFilter className="h-4 w-4" />
          Filtros
        </button>
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
          <button
            onClick={toggleDir}
            className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 text-sm"
            title="Alternar ordem"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortBy.dir === "asc" ? "ASC" : "DESC"}
          </button>
        </div>
      </div>
    </div>
  );
}
