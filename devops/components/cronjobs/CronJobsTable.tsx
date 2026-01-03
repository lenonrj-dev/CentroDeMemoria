// file: components/cronjobs/CronJobsTable.tsx
"use client";

import StatusPill from "./StatusPill";
import { motion } from "framer-motion";

export default function CronJobsTable({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onOpen,
  sortBy,
  onSortBy,
}) {
  const allOnPageSelected = items.length > 0 && items.every((d) => selectedIds.includes(d.id));
  const headerBtn = (label, key) => {
    const isActive = sortBy.key === key;
    const ariaSort = isActive ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none";
    return (
      <button
        type="button"
        onClick={() => onSortBy({ key, dir: sortBy.key === key && sortBy.dir === "asc" ? "desc" : "asc" })}
        className="inline-flex items-center gap-2 text-left focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded"
        title={`Ordenar por ${label}`}
        aria-sort={ariaSort}
        aria-label={`Ordenar por ${label}. Ordem atual: ${isActive ? (sortBy.dir === "asc" ? "ascendente" : "descendente") : "nenhuma"}`}
      >
        {label}
        {isActive && <span className="text-[11px] text-gray-400">{sortBy.dir === "asc" ? "↑" : "↓"}</span>}
      </button>
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="grid grid-cols-[36px_minmax(220px,1.3fr)_1fr_1fr_1fr_140px] px-3 py-2 text-xs uppercase tracking-wide text-gray-400 bg-white/5">
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
        <div>{headerBtn("Schedule", "schedule")}</div>
        <div>{headerBtn("Próxima execução", "next")}</div>
        <div>{headerBtn("Status", "suspend")}</div>
      </div>

      <ul className="divide-y divide-white/5">
        {items.map((cj, idx) => (
          <motion.li
            key={cj.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, delay: idx * 0.02 }}
            className="grid grid-cols-[36px_minmax(220px,1.3fr)_1fr_1fr_1fr_140px] items-center px-3 py-2.5 hover:bg-white/5"
          >
            <div>
              <input
                type="checkbox"
                className="accent-cyan-500"
                checked={selectedIds.includes(cj.id)}
                onChange={() => onToggleSelect(cj.id)}
                aria-label={`Selecionar ${cj.name}`}
              />
            </div>

            <button
              onClick={() => onOpen(cj.id)}
              className="flex flex-col text-left focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded"
              title="Abrir detalhes"
            >
              <span className="text-sm font-medium text-gray-100">{cj.name}</span>
              <span className="text-[11px] text-gray-400">
                {cj.concurrencyPolicy} • history: {cj.history.successful}/{cj.history.failed}
              </span>
            </button>

            <div className="text-sm text-gray-300" title={cj.namespace}>
              {cj.namespace}
            </div>
            <div className="text-sm text-gray-300 font-mono" title={cj.schedule}>
              {cj.schedule}
            </div>
            <div className="text-sm text-gray-300" title={cj.nextRun || "—"}>
              {cj.nextRun || "—"}
            </div>

            <div className="text-sm">
              <StatusPill suspend={cj.suspend} />
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
