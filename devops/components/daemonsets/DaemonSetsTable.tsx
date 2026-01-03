// file: components/daemonsets/DaemonSetsTable.tsx
"use client";

import StatusPill from "./StatusPill";
import { motion } from "framer-motion";

export default function DaemonSetsTable({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onOpen,
  sortBy,
  onSortBy,
  loading = false, // opcional
}) {
  const allOnPageSelected = items.length > 0 && items.every((d) => selectedIds.includes(d.id));

  const headerBtn = (label, key) => (
    <button
      onClick={() => onSortBy({ key, dir: sortBy.key === key && sortBy.dir === "asc" ? "desc" : "asc" })}
      className="inline-flex items-center gap-2 text-left"
      title={`Ordenar por ${label}`}
      aria-label={`Ordenar por ${label}`}
    >
      {label}
      {sortBy.key === key && (
        <span className="text-[11px] text-gray-400">{sortBy.dir === "asc" ? "↑" : "↓"}</span>
      )}
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
            aria-label="Selecionar todos desta página"
          />
        </div>
        <div>{headerBtn("Nome", "name")}</div>
        <div>{headerBtn("Namespace", "namespace")}</div>
        <div>{headerBtn("Prontos/Desejados", "ready")}</div>
        <div>{headerBtn("Saúde", "health")}</div>
      </div>

      {/* Loading (skeletons) */}
      {loading && items.length === 0 && (
        <ul className="divide-y divide-white/5" aria-busy="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <li
              key={i}
              className="grid grid-cols-[36px_minmax(220px,1.2fr)_1fr_1fr_120px] items-center px-3 py-2.5"
            >
              <div>
                <div className="h-4 w-4 rounded bg-white/10 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="h-3 w-40 rounded bg-white/10 animate-pulse" />
                <div className="h-2 w-24 rounded bg-white/10 animate-pulse" />
              </div>
              <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
              <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
              <div className="h-5 w-20 rounded bg-white/10 animate-pulse" />
            </li>
          ))}
        </ul>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="px-3 py-6 text-sm text-gray-400">
          Nenhum DaemonSet encontrado com os filtros atuais.
        </div>
      )}

      {/* Lista */}
      {!loading && items.length > 0 && (
        <ul className="divide-y divide-white/5">
          {items.map((d) => (
            <motion.li
              key={d.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-[36px_minmax(220px,1.2fr)_1fr_1fr_120px] items-center px-3 py-2.5 hover:bg-white/5"
            >
              <div>
                <input
                  type="checkbox"
                  className="accent-cyan-500"
                  checked={selectedIds.includes(d.id)}
                  onChange={() => onToggleSelect(d.id)}
                  aria-label={`Selecionar ${d.name}`}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onOpen(d.id)}
                className="flex flex-col text-left focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded"
                title={`Abrir detalhes de ${d.name}`}
                aria-label={`Abrir detalhes de ${d.name}`}
              >
                <span className="text-sm font-medium text-gray-100">{d.name}</span>
                <span className="text-[11px] text-gray-400">{d.imageTag}</span>
              </motion.button>

              <div className="text-sm text-gray-300">{d.namespace}</div>

              <div
                className="text-sm text-gray-300"
                aria-label={`Prontos ${d.status.numberReady} de ${d.status.desiredNumberScheduled}`}
              >
                {d.status.numberReady}/{d.status.desiredNumberScheduled}
              </div>

              <div className="text-sm">
                <StatusPill health={d.health} />
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
