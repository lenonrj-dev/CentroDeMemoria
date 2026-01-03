// file: components/storage/PVCTable.tsx
"use client";

import Status from "./Status";
import { motion } from "framer-motion";

export default function PVCTable({
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
      <div className="grid grid-cols-[36px_minmax(220px,1.2fr)_1fr_1fr_1fr_130px] px-3 py-2 text-xs uppercase tracking-wide text-gray-400 bg-white/5">
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
        <div>{headerBtn("StorageClass", "storageClass")}</div>
        <div>{headerBtn("Uso/Cap.", "used")}</div>
        <div>{headerBtn("Fase", "phase")}</div>
      </div>

      {items.length === 0 ? (
        <div className="p-6 text-sm text-gray-400 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <span>Nenhum PVC encontrado para os filtros atuais.</span>
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
        <ul className="divide-y divide-white/5" role="list" aria-label="Lista de PVCs">
          {items.map((v) => (
            <li
              key={v.id}
              className="grid grid-cols-[36px_minmax(220px,1.2fr)_1fr_1fr_1fr_130px] items-center px-3 py-2.5 hover:bg-white/5"
              role="listitem"
              aria-label={`PVC ${v.name}`}
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
                <span className="text-[11px] text-gray-400">{v.volume ? `PV: ${v.volume}` : "—"}</span>
              </motion.button>

              <div className="text-sm text-gray-300">{v.namespace}</div>
              <div className="text-sm text-gray-300">{v.storageClass ?? "—"}</div>
              <div className="text-sm text-gray-300">{v.usedGi ?? 0}/{v.requestGi} Gi</div>

              <div className="text-sm">
                <Status value={v.phase} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
