"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import StatusPill from "./StatusPill";

type SortBy = { key: string; dir: string };

type ReleasesTableProps = {
  items: any[];
  selectedIds: any[];
  onToggleSelect: (id: any) => void;
  onToggleSelectAll: () => void;
  onOpen: (id: any) => void;
  sortBy: SortBy;
  onSortBy: (value: SortBy) => void;
  loading?: boolean;
  onClearFilters?: () => void;
  emptyLabel?: string;
};

export default function ReleasesTable({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onOpen,
  sortBy,
  onSortBy,
  loading = false,
  onClearFilters,
  emptyLabel = "Nenhum release encontrado com os filtros atuais.",
}: ReleasesTableProps) {
  const allOnPageSelected = items.length > 0 && items.every((i) => selectedIds.includes(i.id));

  const headerBtn = (label: string, key: string) => (
    <button
      onClick={() => onSortBy({ key, dir: sortBy.key === key && sortBy.dir === "asc" ? "desc" : "asc" })}
      className="inline-flex items-center gap-2 rounded text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
      title={`Ordenar por ${label}`}
      aria-label={`Ordenar por ${label}`}
    >
      {label}
      {sortBy.key === key ? <span className="text-[11px] text-gray-400">{sortBy.dir === "asc" ? "ASC" : "DESC"}</span> : null}
    </button>
  );

  const skeletons = useMemo(() => Array.from({ length: 8 }).map((_, i) => i), []);

  const copyCommit = async (sha: string) => {
    try {
      await navigator.clipboard?.writeText?.(sha);
      alert("Commit copiado para a area de transferencia.");
    } catch {
      alert("Nao foi possivel copiar o commit.");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div
        className="hidden grid-cols-[36px_minmax(220px,1.3fr)_1fr_1fr_1fr_1fr_150px] bg-white/5 px-3 py-2 text-xs uppercase tracking-wide text-gray-400 sm:grid"
        role="row"
      >
        <div className="flex items-center">
          <input
            type="checkbox"
            className="accent-cyan-500"
            checked={allOnPageSelected}
            onChange={onToggleSelectAll}
            aria-label="Selecionar todos os itens da pagina"
          />
        </div>
        <div aria-sort={sortBy.key === "service" ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>
          {headerBtn("Servico / Versao", "service")}
        </div>
        <div aria-sort={sortBy.key === "env" ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>
          {headerBtn("Ambiente", "env")}
        </div>
        <div aria-sort={sortBy.key === "author" ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>
          {headerBtn("Autor", "author")}
        </div>
        <div aria-sort={sortBy.key === "commit" ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>
          {headerBtn("Commit", "commit")}
        </div>
        <div aria-sort={sortBy.key === "startedAtEpoch" ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>
          {headerBtn("Inicio", "startedAtEpoch")}
        </div>
        <div aria-sort={sortBy.key === "status" ? (sortBy.dir === "asc" ? "ascending" : "descending") : "none"}>
          {headerBtn("Status", "status")}
        </div>
      </div>

      {loading && (
        <ul className="divide-y divide-white/5">
          {skeletons.map((i) => (
            <li
              key={`sk-${i}`}
              className="grid grid-cols-1 items-center gap-2 px-3 py-3 sm:grid-cols-[36px_minmax(220px,1.3fr)_1fr_1fr_1fr_1fr_150px]"
            >
              <div className="hidden h-4 w-4 rounded bg-white/5 animate-pulse sm:block" />
              <div className="h-4 w-48 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-28 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-16 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-28 rounded bg-white/10 animate-pulse" />
              <div className="h-5 w-20 rounded bg-white/10 animate-pulse" />
            </li>
          ))}
        </ul>
      )}

      {!loading && items.length === 0 && (
        <div className="p-6 text-sm text-gray-300">
          <p className="mb-3">{emptyLabel}</p>
          {onClearFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded border border-white/10 bg-white/5 px-3 py-1.5 hover:border-white/20"
              aria-label="Limpar filtros e voltar a lista completa"
            >
              Limpar filtros
            </button>
          ) : null}
        </div>
      )}

      {!loading && items.length > 0 && (
        <ul className="divide-y divide-white/5">
          {items.map((r) => (
            <motion.li
              key={r.id}
              className="grid grid-cols-1 items-center gap-2 px-3 py-2.5 hover:bg-white/5 sm:grid-cols-[36px_minmax(220px,1.3fr)_1fr_1fr_1fr_1fr_150px] sm:gap-0"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              transition={{ duration: 0.15 }}
            >
              <div className="sm:row-auto">
                <input
                  type="checkbox"
                  className="accent-cyan-500"
                  checked={selectedIds.includes(r.id)}
                  onChange={() => onToggleSelect(r.id)}
                  aria-label={`Selecionar release do servico ${r.service} versao ${r.version}`}
                />
              </div>

              <button onClick={() => onOpen(r.id)} className="flex flex-col text-left">
                <span className="text-sm font-medium text-gray-100">{r.service}</span>
                <span className="text-[11px] text-gray-400">v{r.version}</span>
              </button>

              <div className="text-sm text-gray-300">{r.envLabel}</div>
              <div className="text-sm text-gray-300">{r.author}</div>

              <button
                type="button"
                onClick={() => copyCommit(r.commit)}
                className="text-left text-sm text-gray-300 underline decoration-dotted underline-offset-2 hover:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded"
                title="Copiar SHA completo"
                aria-label={`Copiar hash completo do commit ${r.commit.slice(0, 7)}`}
              >
                {r.commit.slice(0, 7)}
              </button>

              <div className="text-sm text-gray-300">{r.startedAt}</div>

              <div className="text-sm">
                <StatusPill status={r.status} />
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
