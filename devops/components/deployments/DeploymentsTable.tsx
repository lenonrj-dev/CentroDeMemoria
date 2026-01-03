// file: app/components/deployments/DeploymentsTable.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import StatusPill from "./StatusPill";

export default function DeploymentsTable({
  items,
  selectedIds, onToggleSelect, onToggleSelectAll,
  onOpen,
  sortBy, onSortBy,
}) {
  const allOnPageSelected = items.length > 0 && items.every((d) => selectedIds.includes(d.id));
  const someOnPageSelected = items.length > 0 && !allOnPageSelected && items.some(d => selectedIds.includes(d.id));

  // checkbox "Selecionar todos" com estado indeterminate
  const selectAllRef = useRef(null);
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someOnPageSelected;
    }
  }, [someOnPageSelected, allOnPageSelected, items]);

  const ariaSortFor = (key) => {
    if (sortBy.key !== key) return "none";
    return sortBy.dir === "asc" ? "ascending" : "descending";
  };

  const headerBtn = (label, key) => (
    <button
      type="button"
      onClick={() => onSortBy({ key, dir: sortBy.key === key && sortBy.dir === "asc" ? "desc" : "asc" })}
      className="inline-flex items-center gap-2 text-left"
      title={`Ordenar por ${label}`}
      role="columnheader"
      aria-sort={ariaSortFor(key)}
    >
      {label}
      {sortBy.key === key && <span className="text-[11px] text-gray-400">{sortBy.dir === "asc" ? "↑" : "↓"}</span>}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-white/10" role="table" aria-label="Lista de Deployments">
      <div
        className="grid grid-cols-[36px_minmax(220px,1.2fr)_1fr_1fr_120px] px-3 py-2 text-xs uppercase tracking-wide text-gray-400 bg-white/5"
        role="row"
      >
        <div className="flex items-center" role="columnheader" aria-label="Selecionar todos">
          <input
            ref={selectAllRef}
            type="checkbox"
            className="accent-cyan-500"
            checked={allOnPageSelected}
            onChange={onToggleSelectAll}
            aria-checked={someOnPageSelected ? "mixed" : allOnPageSelected}
          />
        </div>
        <div>{headerBtn("Nome", "name")}</div>
        <div>{headerBtn("Namespace", "namespace")}</div>
        <div>{headerBtn("Réplicas (disp./desej.)", "available")}</div>
        <div>{headerBtn("Status", "status")}</div>
      </div>

      {items.length === 0 ? (
        <div className="px-4 py-10 text-sm text-gray-400">Nenhum deployment encontrado.</div>
      ) : (
        <ul className="divide-y divide-white/5" role="rowgroup">
          {items.map((d) => (
            <motion.li
              key={d.id}
              role="row"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-[36px_minmax(220px,1.2fr)_1fr_1fr_120px] items-center px-3 py-2.5 hover:bg-white/5 focus-within:bg-white/5"
            >
              <div role="cell">
                <input
                  type="checkbox"
                  className="accent-cyan-500"
                  checked={selectedIds.includes(d.id)}
                  onChange={() => onToggleSelect(d.id)}
                  aria-label={`Selecionar deployment ${d.name}`}
                />
              </div>

              <button
                type="button"
                onClick={() => onOpen(d.id)}
                onKeyDown={(e) => { if (e.key === "Enter") onOpen(d.id); }}
                className="flex flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded"
                aria-label={`Abrir detalhes de ${d.name}`}
                role="cell"
              >
                <span className="text-sm font-medium text-gray-100 truncate">{d.name}</span>
                <span className="text-[11px] text-gray-400 truncate">{d.imageTag}</span>
              </button>

              <div className="text-sm text-gray-300 truncate" role="cell">{d.namespace}</div>

              <div className="text-sm text-gray-300 tabular-nums" role="cell">
                {d.replicas.available}/{d.replicas.desired}
              </div>

              <div className="text-sm" role="cell">
                <StatusPill status={d.status} />
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
