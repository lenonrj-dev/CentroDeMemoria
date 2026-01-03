// file: components/storage/PVTable.tsx
"use client";

import Status from "./Status";
import { motion } from "framer-motion";

export default function PVTable({
  items,
  selectedIds, onToggleSelect, onToggleSelectAll,
  onOpen,
  sortBy, onSortBy,
  onClearFilters, // opcional: CTA no estado vazio
}) {
  const allOnPageSelected = items.length > 0 && items.every((it) => selectedIds.includes(it.id));
  const headerBtn = (label, key) => (
    <button
      onClick={() =>
        onSortBy({ key, dir: sortBy.key === key && sortBy.dir === "asc" ? "desc" : "asc" })
      }
      className="inline-flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded"
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
      <div className="grid grid-cols-[36px_minmax(220px,1.4fr)_1fr_1.2fr_1fr_130px] px-3 py-2 text-xs uppercase tracking-wide text-gray-400 bg-white/5">
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
        <div>{headerBtn("StorageClass", "storageClass")}</div>
        <div>{headerBtn("Uso/Cap.", "used")}</div>
        <div>{headerBtn("Reclaim", "reclaimPolicy")}</div>
        <div>{headerBtn("Fase", "phase")}</div>
      </div>

      {items.length === 0 ? (
        <div className="p-6 text-sm text-gray-400 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <span>Nenhum PV encontrado para os filtros atuais.</span>
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
        <ul className="divide-y divide-white/5" role="list" aria-label="Lista de PVs">
          {items.map((v) => {
            const used = Number(v.usedGi ?? 0);
            const cap = Number(v.capacityGi ?? 0);
            const pct = cap ? Math.min(100, Math.max(0, (used / cap) * 100)) : 0;
            return (
              <li
                key={v.id}
                className="grid grid-cols-[36px_minmax(220px,1.4fr)_1fr_1.2fr_1fr_130px] items-center px-3 py-2.5 hover:bg-white/5"
                role="listitem"
                aria-label={`PV ${v.name}`}
              >
                <div>
                  <input
                    type="checkbox"
                    className="accent-cyan-500"
                    checked={selectedIds.includes(v.id)}
                    onChange={() => onToggleSelect(v.id)}
                    aria-label={`Selecionar ${v.name}`}
                  />
                </div>

                <motion.button
                  onClick={() => onOpen(v.id)}
                  className="flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  aria-label={`Abrir detalhes de ${v.name}`}
                >
                  <span className="text-sm font-medium text-gray-100">{v.name}</span>
                  <span className="text-[11px] text-gray-400">
                    {v.claim
                      ? `Associado a ${v.claim.namespace}/${v.claim.name}`
                      : v.node
                      ? `Nó: ${v.node}`
                      : "—"}
                  </span>
                </motion.button>

                <div className="text-sm text-gray-300">{v.storageClass ?? "—"}</div>

                <div className="text-sm text-gray-300">
                  <div
                    className="mb-1 h-1.5 rounded bg-white/10 overflow-hidden"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Uso do PV ${v.name}`}
                    title={`Uso: ${pct.toFixed(0)}%`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                      className={`h-full ${
                        pct > 85 ? "bg-rose-500/70" : pct > 70 ? "bg-amber-500/70" : "bg-cyan-500/70"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {used}/{v.capacityGi} Gi
                  </span>
                </div>

                <div className="text-sm text-gray-300">{v.reclaimPolicy}</div>

                <div className="text-sm">
                  <Status value={v.phase} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
