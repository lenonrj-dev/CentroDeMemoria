// file: components/teams/TeamsTable.tsx
"use client";

import { Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeamsTable({
  items,
  selectedIds, onToggleSelect, onToggleSelectAll,
  onOpen,
  sortBy, onSortBy,
  loading = false, // opcional: quando true, renderiza skeletons
}) {
  const allOnPageSelected = items.length > 0 && items.every(i => selectedIds.includes(i.id));

  const headerBtn = (label, key) => (
    <button
      onClick={() => onSortBy({ key, dir: sortBy.key === key && sortBy.dir === "asc" ? "desc" : "asc" })}
      className="inline-flex items-center gap-2 text-left focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded"
      title={`Ordenar por ${label}`}
      type="button"
      aria-label={`Ordenar por ${label} (${sortBy.key === key ? (sortBy.dir === "asc" ? "ascendente" : "descendente") : "ascendente"})`}
    >
      {label}
      {sortBy.key === key && <span className="text-[11px] text-gray-400">{sortBy.dir === "asc" ? "↑" : "↓"}</span>}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="grid grid-cols-[36px_minmax(220px,1.2fr)_1fr_1fr_1fr_140px] px-3 py-2 text-xs uppercase tracking-wide text-gray-400 bg-white/5">
        <div className="flex items-center" role="columnheader" aria-label="Selecionar todos">
          <input
            type="checkbox"
            className="accent-cyan-500"
            checked={allOnPageSelected}
            onChange={onToggleSelectAll}
            aria-label="Selecionar todos na página"
          />
        </div>
        <div role="columnheader" aria-sort={sortBy.key === "name" ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>{headerBtn("Equipe", "name")}</div>
        <div role="columnheader" aria-sort={sortBy.key === "org" ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>{headerBtn("Organização", "org")}</div>
        <div role="columnheader" aria-sort={sortBy.key === "members" ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>{headerBtn("Membros", "members")}</div>
        <div role="columnheader" aria-sort={sortBy.key === "projects" ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>{headerBtn("Projetos", "projects")}</div>
        <div role="columnheader" aria-sort={sortBy.key === "updated" ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>{headerBtn("Atualização", "updated")}</div>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <ul className="divide-y divide-white/5">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={`s-${i}`} className="grid grid-cols-[36px_minmax(220px,1.2fr)_1fr_1fr_1fr_140px] items-center px-3 py-2.5">
              <div>
                <div className="h-4 w-4 rounded bg-white/10 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded bg-white/10 border border-white/10" />
                <div className="flex flex-col gap-1 w-40">
                  <div className="h-3 rounded bg-white/10 animate-pulse" />
                  <div className="h-2 rounded bg-white/10 animate-pulse w-24" />
                </div>
              </div>
              <div className="h-3 rounded bg-white/10 animate-pulse w-24" />
              <div className="h-3 rounded bg-white/10 animate-pulse w-12" />
              <div className="h-3 rounded bg-white/10 animate-pulse w-12" />
              <div className="h-3 rounded bg-white/10 animate-pulse w-24" />
            </li>
          ))}
        </ul>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="p-6 text-sm text-gray-400">
          Nenhuma equipe encontrada para os filtros/busca aplicados.
        </div>
      )}

      {/* Rows */}
      {!loading && items.length > 0 && (
        <ul className="divide-y divide-white/5">
          <AnimatePresence initial={false}>
            {items.map(t => (
              <motion.li
                key={t.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: "tween", duration: 0.18 }}
                className="grid grid-cols-[36px_minmax(220px,1.2fr)_1fr_1fr_1fr_140px] items-center px-3 py-2.5 hover:bg-white/5"
                role="row"
              >
                <div>
                  <input
                    type="checkbox"
                    className="accent-cyan-500 cursor-pointer"
                    checked={selectedIds.includes(t.id)}
                    onChange={() => onToggleSelect(t.id)}
                    aria-label={`Selecionar equipe ${t.name}`}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onOpen(t.id)}
                  className="flex items-center gap-2 text-left focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded"
                  type="button"
                  aria-label={`Abrir detalhes da equipe ${t.name}`}
                >
                  <div className="h-7 w-7 rounded bg-white/10 flex items-center justify-center border border-white/10">
                    <Users className="h-4 w-4 text-gray-300" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-100">{t.name}</span>
                    <span className="text-[11px] text-gray-400">{t.tags?.join(" • ") || "—"}</span>
                  </div>
                </motion.button>

                <div className="text-sm text-gray-300">{t.org}</div>
                <div className="text-sm text-gray-300">{t.members.length}</div>
                <div className="text-sm text-gray-300">{t.projects.length}</div>
                <div className="text-sm text-gray-300">{t.updated}</div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
