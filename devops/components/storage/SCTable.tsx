// file: components/storage/SCTable.tsx
"use client";

export default function SCTable({
  items,
  selectedIds, onToggleSelect, onToggleSelectAll,
  onOpen,
  sortBy, onSortBy,
  onClearFilters, // opcional: CTA no estado vazio
}) {
  const allOnPageSelected = items.length > 0 && items.every((it) => selectedIds.includes(it.id));
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
      <div className="grid grid-cols-[36px_minmax(220px,1.3fr)_1fr_1fr_1fr] px-3 py-2 text-xs uppercase tracking-wide text-gray-400 bg-white/5">
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
        <div>{headerBtn("Provisioner", "provisioner")}</div>
        <div>{headerBtn("Reclaim", "reclaimPolicy")}</div>
        <div>{headerBtn("Parâmetros", "parameters")}</div>
      </div>

      {items.length === 0 ? (
        <div className="p-6 text-sm text-gray-400 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <span>Nenhuma StorageClass encontrada para os filtros atuais.</span>
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
        <ul className="divide-y divide-white/5" role="list" aria-label="Lista de StorageClasses">
          {items.map((s) => {
            const paramKeys = Object.keys(s.parameters || {});
            const preview = paramKeys.slice(0, 2).map((k) => `${k}=${String(s.parameters[k]).slice(0, 40)}`);
            const extra = Math.max(0, paramKeys.length - 2);
            return (
              <li
                key={s.id}
                className="grid grid-cols-[36px_minmax(220px,1.3fr)_1fr_1fr_1fr] items-center px-3 py-2.5 hover:bg-white/5"
                role="listitem"
                aria-label={`StorageClass ${s.name}`}
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

                <button
                  onClick={() => onOpen(s.id)}
                  className="flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded"
                  aria-label={`Abrir detalhes de ${s.name}`}
                  title={`Abrir detalhes de ${s.name}`}
                >
                  <span className="text-sm font-medium text-gray-100">{s.name}</span>
                  <span className="text-[11px] text-gray-400">
                    {s.allowExpansion ? "Permite expansão" : "Sem expansão"}
                  </span>
                </button>

                <div className="text-sm text-gray-300">{s.provisioner}</div>
                <div className="text-sm text-gray-300">{s.reclaimPolicy}</div>
                <div className="text-sm text-gray-300 truncate">
                  {paramKeys.length ? (
                    <div className="flex flex-wrap items-center gap-1">
                      {preview.map((p, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[11px]"
                        >
                          {p}
                        </span>
                      ))}
                      {extra > 0 && <span className="text-[11px] text-gray-400">+{extra}</span>}
                    </div>
                  ) : (
                    "—"
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
