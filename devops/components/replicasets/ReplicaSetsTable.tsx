// file: components/replicasets/ReplicaSetsTable.tsx
"use client";

import HealthPill from "./StatusPill";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function ReplicaSetsTable({
  items,
  selectedIds, onToggleSelect, onToggleSelectAll,
  onOpen,
  sortBy, onSortBy,
  loading = false,            // opcional: exibe skeletons de carregamento
  onClearFilters,             // opcional: CTA para limpar filtros no estado vazio
  emptyLabel = "Nenhum ReplicaSet encontrado com os filtros atuais.",
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

  const skeletons = useMemo(() => Array.from({ length: 8 }).map((_, i) => i), []);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      {/* Cabeçalho (apenas ≥ sm) */}
      <div
        className="hidden sm:grid grid-cols-[36px_minmax(220px,1.2fr)_1fr_1fr_1fr_130px] px-3 py-2 text-xs uppercase tracking-wide text-gray-400 bg-white/5"
        role="row"
      >
        <div className="flex items-center">
          <input
            type="checkbox"
            className="accent-cyan-500"
            checked={allOnPageSelected}
            onChange={onToggleSelectAll}
            aria-label="Selecionar todos os itens da página"
          />
        </div>
        <div aria-sort={sortBy.key === "name" ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>{headerBtn("Nome", "name")}</div>
        <div aria-sort={sortBy.key === "namespace" ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>{headerBtn("Namespace", "namespace")}</div>
        <div aria-sort={sortBy.key === "available" ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>{headerBtn("Disponíveis", "available")}</div>
        <div aria-sort={["ready","desired"].includes(sortBy.key) ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>{headerBtn("Prontos/Desejados", "ready")}</div>
        <div aria-sort={sortBy.key === "health" ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>{headerBtn("Saúde", "health")}</div>
      </div>

      {/* Estado: loading */}
      {loading && (
        <ul className="divide-y divide-white/5">
          {skeletons.map((i) => (
            <li
              key={`sk-${i}`}
              className="grid sm:grid-cols-[36px_minmax(220px,1.2fr)_1fr_1fr_1fr_130px] grid-cols-1 gap-2 items-center px-3 py-3"
            >
              <div className="hidden sm:block h-4 w-4 rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-48 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-16 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
              <div className="h-5 w-20 rounded bg-white/10 animate-pulse" />
            </li>
          ))}
        </ul>
      )}

      {/* Estado: vazio */}
      {!loading && items.length === 0 && (
        <div className="p-6 text-sm text-gray-300">
          <p className="mb-3">{emptyLabel}</p>
          {onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
              aria-label="Limpar filtros e voltar à lista completa"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Linhas */}
      {!loading && items.length > 0 && (
        <ul className="divide-y divide-white/5">
          {items.map((rs) => (
            <motion.li
              key={rs.id}
              className="grid sm:grid-cols-[36px_minmax(220px,1.2fr)_1fr_1fr_1fr_130px] grid-cols-1 gap-2 sm:gap-0 items-center px-3 py-2.5 hover:bg-white/5"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              transition={{ duration: 0.15 }}
            >
              <div>
                <input
                  type="checkbox"
                  className="accent-cyan-500"
                  checked={selectedIds.includes(rs.id)}
                  onChange={() => onToggleSelect(rs.id)}
                  aria-label={`Selecionar ReplicaSet ${rs.name}`}
                />
              </div>

              <button
                onClick={() => onOpen(rs.id)}
                className="flex flex-col text-left"
                aria-label={`Abrir detalhes do ReplicaSet ${rs.name}`}
              >
                <span className="text-sm font-medium text-gray-100">{rs.name}</span>
                <span className="text-[11px] text-gray-400">{rs.owner ? `Owner: ${rs.owner}` : rs.imageTag}</span>
              </button>

              <div className="text-sm text-gray-300">{rs.namespace}</div>

              <div className="text-sm text-gray-300">{rs.status.availableReplicas ?? 0}</div>

              <div className="text-sm text-gray-300">
                {(rs.status.readyReplicas ?? 0)}/{rs.spec.replicas}
              </div>

              <div className="text-sm">
                <HealthPill health={rs.health} />
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
