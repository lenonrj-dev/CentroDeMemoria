import Link from "next/link";
import type { BaseItem } from "../../types";

export function DocumentPreviewCard({ item, href }: { item: BaseItem; href: string }) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 transition-colors hover:border-slate-100/40 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70 focus-visible:ring-offset-black"
    >
      <div className="flex items-center gap-2 text-[10px] text-slate-400">
        <span className="rounded-full border border-white/5 bg-white/5 px-2 py-0.5">Doc</span>
        <span>{item.date}</span>
        {item.location && (
          <>
            <span>ƒ?½</span>
            <span>{item.location}</span>
          </>
        )}
      </div>
      <div className="mt-1 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-slate-50">{item.title}</h4>
          <p className="line-clamp-2 text-xs leading-snug text-slate-400">{item.summary}</p>
        </div>
        <span className="text-xs text-slate-300">ƒÅ'</span>
      </div>
      {item.tags?.length ? (
        <span className="mt-1 inline-flex items-center gap-1 self-start rounded-full border border-emerald-400/30 bg-emerald-400/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-emerald-300">
          {item.tags[0]}
        </span>
      ) : null}
    </Link>
  );
}
