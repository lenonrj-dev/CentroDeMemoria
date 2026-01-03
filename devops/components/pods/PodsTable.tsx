// file: components/pods/PodsTable.tsx
"use client";

import { Cpu, MemoryStick } from "lucide-react";
import MiniSpark from "../k8s/MiniSpark";
import StatusBadge from "../k8s/StatusBadge";

export default function PodsTable({
  items,
  selectedIds, onToggleSelect, onToggleSelectAll,
  onOpen,
  sortBy, onSortBy,
}) {
  const allOnPageSelected = items.length > 0 && items.every((p) => selectedIds.includes(p.id));
  const headerBtn = (label, key, icon) => (
    <button
      onClick={() => onSortBy({ key, dir: sortBy.key === key && sortBy.dir === "asc" ? "desc" : "asc" })}
      className="inline-flex items-center gap-2 text-left"
      title={`Ordenar por ${label}`}
    >
      {icon} {label}
      {sortBy.key === key && <span className="text-[11px] text-gray-400">{sortBy.dir === "asc" ? "↑" : "↓"}</span>}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="grid grid-cols-[36px_minmax(220px,1.4fr)_160px_160px_1fr] px-3 py-2 text-xs uppercase tracking-wide text-gray-400 bg-white/5">
        <div className="flex items-center">
          <input type="checkbox" className="accent-cyan-500" checked={allOnPageSelected} onChange={onToggleSelectAll} />
        </div>
        <div>{headerBtn("Nome", "name")}</div>
        <div className="flex items-center gap-2">{headerBtn("CPU", "cpu", <Cpu className="h-3 w-3" />)}</div>
        <div className="flex items-center gap-2">{headerBtn("Memória", "memory", <MemoryStick className="h-3 w-3" />)}</div>
        <div>{headerBtn("Namespace", "namespace")}</div>
      </div>

      <ul className="divide-y divide-white/5">
        {items.map((p) => (
          <li
            key={p.id}
            className="grid grid-cols-[36px_minmax(220px,1.4fr)_160px_160px_1fr] items-center px-3 py-2.5 hover:bg-white/5"
          >
            <div>
              <input
                type="checkbox"
                className="accent-cyan-500"
                checked={selectedIds.includes(p.id)}
                onChange={() => onToggleSelect(p.id)}
              />
            </div>

            <button onClick={() => onOpen(p.id)} className="flex items-center gap-2 text-left">
              <span className="text-sm font-medium text-gray-100">{p.name}</span>
              <StatusBadge status={p.status} />
            </button>

            <div className="flex items-center gap-2">
              <MiniSpark points={p.cpuHistory} ariaLabel={`CPU de ${p.name}`} />
              <span className="text-xs tabular-nums text-gray-300">{p.cpu.toFixed(3)}</span>
            </div>

            <div className="flex items-center gap-2">
              <MiniSpark points={p.memHistory} ariaLabel={`Memória de ${p.name}`} />
              <span className="text-xs tabular-nums text-gray-300">{p.memory.toFixed(1)}%</span>
            </div>

            <div className="text-sm text-gray-300">{p.namespace}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
