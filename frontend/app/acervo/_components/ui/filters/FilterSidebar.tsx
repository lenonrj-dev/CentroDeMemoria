"use client";

import { useState } from "react";
import clsx from "clsx";

export function FilterSidebar({
  filters,
  title = "Filtros",
}: {
  filters: { label: string; options: string[] };
  title?: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="flex flex-wrap gap-2">
        {filters.options.map((opt) => (
          <button
            key={opt}
            onClick={() => setSelected(selected === opt ? null : opt)}
            className={clsx(
              "rounded-lg border px-2.5 py-1.5 text-xs transition",
              selected === opt ? "border-white/20 bg-white/15 text-white" : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
            )}
            aria-pressed={selected === opt}
          >
            {opt}
          </button>
        ))}
      </div>
    </aside>
  );
}
