// file: components/jobs/JobsTable.tsx
"use client";

import { useEffect, useRef } from "react";
import StatusPill from "./StatusPill";

export default function JobsTable({
  items,
  selectedIds, onToggleSelect, onToggleSelectAll,
  onOpen,
  sortBy, onSortBy,
}) {
  const allOnPageSelected = items.length > 0 && items.every((j) => selectedIds.includes(j.id));
  const anyOnPageSelected = items.some((j) => selectedIds.includes(j.id));
  const selectAllRef = useRef(null);

  // Checkbox "Selecionar tudo" em estado parcial
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = anyOnPageSelected && !allOnPageSelected;
    }
  }, [anyOnPageSelected, allOnPageSelected]);

  const headerBtn = (label, key) => (
    <button
      onClick={() => onSortBy({ key, dir: sortBy.key === key && sortBy.dir === "asc" ? "desc" : "asc" })}
      className="inline-flex items-center gap-2 text-left focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded"
      title={`Ordenar por ${label}`}
      aria-label={`Ordenar por ${label}`}
    >
      {label}
      {sortBy.key === key && <span className="text-[11px] text-gray-400">{sortBy.dir === "asc" ? "↑" : "↓"}</span>}
    </button>
  );

  const ariaSortFor = (key) => {
    if (sortBy.key !== key) return "none";
    return sortBy.dir === "asc" ? "ascending" : "descending";
  };

  const empty = items.length === 0;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10" role="table" aria-label="Tabela de Jobs">
      <div className="grid grid-cols-[36px_minmax(220px,1.3fr)_1fr_1fr_1fr_140px] px-3 py-2 text-xs uppercase tracking-wide text-gray-400 bg-white/5" role="rowgroup">
        <div className="flex items-center" role="columnheader" aria-label="Selecionar todos">
          <input
            ref={selectAllRef}
            type="checkbox"
            className="accent-cyan-500 cursor-pointer"
            checked={allOnPageSelected}
            onChange={onToggleSelectAll}
            aria-checked={allOnPageSelected ? "true" : anyOnPageSelected ? "mixed" : "false"}
            title="Selecionar todos nesta página"
          />
        </div>
        <div role="columnheader" aria-sort={ariaSortFor("name")}>{headerBtn("Nome", "name")}</div>
        <div role="columnheader" aria-sort={ariaSortFor("namespace")}>{headerBtn("Namespace", "namespace")}</div>
        <div role="columnheader" aria-sort={ariaSortFor("completions")}>{headerBtn("Conclusão", "completions")}</div>
        <div role="columnheader" aria-sort={ariaSortFor("started")}>{headerBtn("Início", "started")}</div>
        <div role="columnheader" aria-sort={ariaSortFor("status")}>{headerBtn("Status", "status")}</div>
      </div>

      {empty ? (
        <div className="p-6 text-sm text-gray-400" role="rowgroup">
          Nenhum job encontrado para os filtros aplicados.
        </div>
      ) : (
        <ul className="divide-y divide-white/5" role="rowgroup">
          {items.map((j) => (
            <li
              key={j.id}
              className="grid grid-cols-[36px_minmax(220px,1.3fr)_1fr_1fr_1fr_140px] items-center px-3 py-2.5 hover:bg-white/5 focus-within:bg-white/5"
              role="row"
            >
              <div role="cell">
                <input
                  type="checkbox"
                  className="accent-cyan-500 cursor-pointer"
                  checked={selectedIds.includes(j.id)}
                  onChange={() => onToggleSelect(j.id)}
                  aria-label={`Selecionar job ${j.name}`}
                />
              </div>

              <button
                onClick={() => onOpen(j.id)}
                className="flex flex-col text-left focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded"
                aria-label={`Abrir detalhes do job ${j.name}`}
              >
                <span className="text-sm font-medium text-gray-100">{j.name}</span>
                <span className="text-[11px] text-gray-400">{j.owner ? `Owner: ${j.owner}` : j.imageTag}</span>
              </button>

              <div className="text-sm text-gray-300" role="cell">{j.namespace}</div>

              <div className="text-sm text-gray-300" role="cell">
                {j.succeeded ?? 0}/{j.completions ?? 1}{j.parallelism ? ` • paralelismo ${j.parallelism}` : ""}
              </div>

              <div className="text-sm text-gray-300" role="cell">{j.age}</div>

              <div className="text-sm" role="cell">
                <StatusPill status={j.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
