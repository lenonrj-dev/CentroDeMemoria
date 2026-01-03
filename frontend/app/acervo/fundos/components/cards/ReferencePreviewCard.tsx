import type { RefItem } from "../../types";

export function ReferencePreviewCard({ item }: { item: RefItem }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-4 transition hover:border-indigo-400/60 hover:shadow-lg hover:shadow-indigo-500/15">
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">{item.type}</span>
        <span>{item.year}</span>
      </div>
      <h4 className="mt-1 text-sm font-semibold text-slate-50">{item.title}</h4>
      <p className="text-xs text-slate-400">{item.authors}</p>
      <div className="text-[11px] text-amber-200 transition hover:text-amber-100">
        Clique para ver ficha completa / colecao
      </div>
    </div>
  );
}
