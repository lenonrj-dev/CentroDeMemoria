import Link from "next/link";
import type { DepItem } from "../../types";

export function DepoimentoPreviewCard({ item, href }: { item: DepItem; href: string }) {
  const initials = item.author
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-4 transition hover:border-amber-300/50 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70 focus-visible:ring-offset-black"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/15 text-sm font-semibold text-amber-200">
          {initials}
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-slate-50">{item.author}</p>
          <p className="text-[11px] text-slate-400">{item.role} ƒ?½ {item.date}</p>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-300">ƒ?o{item.excerpt.replace(/(^\"|\"$)/g, "")}ƒ??</p>
      <div className="mt-2 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-emerald-300">
        {item.theme}
      </div>
      <div className="mt-1 text-[11px] font-medium text-slate-200 underline-offset-4 transition hover:text-amber-300 group-hover:underline">
        Ler depoimento completo ƒÅ'
      </div>
    </Link>
  );
}
