// file: components/access/RolesTable.tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function RolesTable({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onOpen,
  sortBy,
  onSortBy,
  // opcional: exibe skeletons de carregamento
  loading = false,
}) {
  const allOnPageSelected = items.length > 0 && items.every((i) => selectedIds.includes(i.id));
  const someSelected = items.length > 0 && !allOnPageSelected && items.some((i) => selectedIds.includes(i.id));

  const masterRef = useRef(null);
  useEffect(() => {
    if (masterRef.current) masterRef.current.indeterminate = someSelected;
  }, [someSelected, allOnPageSelected, items.length]);

  const headerBtn = (label, key) => {
    const isActive = sortBy.key === key;
    const dir = isActive ? sortBy.dir : "asc";
    return (
      <button
        onClick={() => onSortBy({ key, dir: isActive && dir === "asc" ? "desc" : "asc" })}
        className="inline-flex items-center gap-1.5 text-left hover:underline underline-offset-4"
        aria-label={`Ordenar por ${label} (${isActive ? (dir === "asc" ? "ascendente" : "descendente") : "ascendente"})`}
      >
        <span>{label}</span>
        {isActive && (dir === "asc" ? <ChevronUp className="h-3.5 w-3.5 text-gray-400" /> : <ChevronDown className="h-3.5 w-3.5 text-gray-400" />)}
      </button>
    );
  };

  const empty = !loading && items.length === 0;
  const gridCols = "grid grid-cols-[36px_minmax(220px,1.3fr)_1fr_1fr_120px]";

  const onRowKey = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen?.(id);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      {/* Cabeçalho (desktop) */}
      <div className={`${gridCols} px-3 py-2 text-xs uppercase tracking-wide text-gray-400 bg-white/5 hidden sm:grid`} role="row">
        <div className="flex items-center" role="columnheader" aria-label="Selecionar página">
          <input
            ref={masterRef}
            type="checkbox"
            className="accent-cyan-500"
            checked={allOnPageSelected}
            onChange={onToggleSelectAll}
            aria-checked={someSelected ? "mixed" : allOnPageSelected}
          />
        </div>
        <div role="columnheader">{headerBtn("Nome", "name")}</div>
        <div role="columnheader">{headerBtn("Namespace", "namespace")}</div>
        <div role="columnheader">{headerBtn("Regras", "rules")}</div>
        <div role="columnheader">{headerBtn("Idade", "age")}</div>
      </div>

      {/* Lista / estados */}
      <ul className="divide-y divide-white/5">
        <AnimatePresence initial={false}>
          {loading &&
            [...Array(6)].map((_, i) => (
              <motion.li key={`sk-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-3 py-3">
                <div className="hidden sm:grid items-center gap-3 animate-pulse bg-white/[0.03] rounded-lg h-10" />
                <div className="sm:hidden space-y-2 animate-pulse">
                  <div className="h-4 bg-white/10 rounded" />
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                </div>
              </motion.li>
            ))}

          {!loading && empty && (
            <motion.li
              key="empty"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="px-4 py-6 text-sm text-gray-300"
              role="status"
            >
              Nenhum papel encontrado para os filtros atuais.
            </motion.li>
          )}

          {!loading &&
            items.map((r) => (
              <motion.li
                key={r.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="px-3 py-2.5 hover:bg-white/5 focus-within:bg-white/5"
              >
                {/* Linha (desktop) */}
                <div className={`${gridCols} items-center hidden sm:grid`}>
                  <div>
                    <input
                      type="checkbox"
                      className="accent-cyan-500"
                      checked={selectedIds.includes(r.id)}
                      onChange={() => onToggleSelect(r.id)}
                      aria-label={`Selecionar ${r.name}`}
                    />
                  </div>
                  <button
                    onClick={() => onOpen(r.id)}
                    onKeyDown={(e) => onRowKey(e, r.id)}
                    className="flex flex-col text-left focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded"
                    aria-label={`Abrir detalhes de ${r.name}`}
                  >
                    <span className="text-sm font-medium text-gray-100">{r.name}</span>
                    <span className="text-[11px] text-gray-400">{r.namespace ? "Role" : "ClusterRole"}</span>
                  </button>
                  <div className="text-sm text-gray-300">{r.namespace ?? "—"}</div>
                  <div className="text-sm text-gray-300">{r.rules?.length ?? 0}</div>
                  <div className="text-sm text-gray-300">{r.age}</div>
                </div>

                {/* Cartão (mobile) */}
                <div
                  className="sm:hidden flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3"
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpen(r.id)}
                  onKeyDown={(e) => onRowKey(e, r.id)}
                  aria-label={`Abrir detalhes de ${r.name}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-100">{r.name}</div>
                    <input
                      type="checkbox"
                      className="accent-cyan-500"
                      checked={selectedIds.includes(r.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        onToggleSelect(r.id);
                      }}
                      aria-label={`Selecionar ${r.name}`}
                    />
                  </div>
                  <div className="text-[11px] text-gray-400">{r.namespace ? "Role" : "ClusterRole"}</div>
                  <div className="text-sm text-gray-300">ns: {r.namespace ?? "—"}</div>
                  <div className="text-sm text-gray-300">regras: {r.rules?.length ?? 0}</div>
                  <div className="text-sm text-gray-300">idade: {r.age}</div>
                </div>
              </motion.li>
            ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
