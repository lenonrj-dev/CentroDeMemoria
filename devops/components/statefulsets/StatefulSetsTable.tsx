// file: components/statefulsets/StatefulSetsTable.tsx
"use client";

import StatusPill from "./StatusPill";
import { motion } from "framer-motion";

export default function StatefulSetsTable({
  items,
  selectedIds, onToggleSelect, onToggleSelectAll,
  onOpen,
  sortBy, onSortBy,
  onClearFilters, // opcional: CTA no estado vazio
}) {
  const allOnPageSelected = items.length > 0 && items.every((d) => selectedIds.includes(d.id));
  const headerBtn = (label, key) => (
    <button
      onClick={() => onSortBy({ key, dir: sortBy.key === key && sortBy.dir === "asc" ? "desc" : "asc" })}
      className="inline-flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded"
      title={`Ordenar por ${label}`}
      aria-label={`Ordenar por ${label}`}
    >
      {label}
      {sortBy.key === key && <span className="text-[11px] text-gray-400">{sortBy.dir === "asc" ? "↑" : "↓"}</span>}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="grid grid-cols-[36px_minmax(220px,1.2fr)_1fr_1fr_120px] px-3 py-2 text-xs uppercase tracking-wide text-gray-400 bg-white/5">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="accent-cyan-500"
            checked={allOnPageSelected}
            onChange={onToggleSelectAll}
            aria-label="Selecionar todos nesta página"
          />
        </div>
        <div>{headerBtn("Nome", "name")}</div>
        <div>{headerBtn("Namespace", "namespace")}</div>
        <div>{headerBtn("Prontos/Desejados", "ready")}</div>
        <div>{headerBtn("Saúde", "health")}</div>
      </div>

      {items.length === 0 ? (
        <div className="p-6 text-sm text-gray-400 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <span>Nenhum item encontrado para os filtros atuais.</span>
          {onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="self-start sm:self-auto text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-white/5" role="list" aria-label="Lista de StatefulSets">
          {items.map((s) => (
            <li
              key={s.id}
              className="grid grid-cols-[36px_minmax(220px,1.2fr)_1fr_1fr_120px] items-center px-3 py-2.5 hover:bg-white/5"
              role="listitem"
              aria-label={`StatefulSet ${s.name}`}
            >
              <div>
                <input
                  type="checkbox"
                  className="accent-cyan-500"
                  checked={selectedIds.includes(s.id)}
                  onChange={() => onToggleSelect(s.id)}
                  aria-label={`Selecionar ${s.name}`}
                />
              </div>

              <motion.button
                onClick={() => onOpen(s.id)}
                className="flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                aria-label={`Abrir detalhes de ${s.name}`}
              >
                <span className="text-sm font-medium text-gray-100">{s.name}</span>
                <span className="text-[11px] text-gray-400">{s.imageTag}</span>
              </motion.button>

              <div className="text-sm text-gray-300">{s.namespace}</div>

              <div className="text-sm text-gray-300">
                {s.status.readyReplicas ?? 0}/{s.spec.replicas}
              </div>

              <div className="text-sm">
                <StatusPill health={s.health} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
