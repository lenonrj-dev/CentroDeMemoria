import type { TimelineItem } from "../types";

export function DocumentTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative space-y-6">
      <div className="absolute left-4 top-0 h-full w-[2px] bg-gradient-to-b from-white/40 via-white/15 to-transparent" aria-hidden />
      {items.map((item, idx) => (
        <div key={`${item.year}-${idx}`} className="relative pl-10">
          <div className="absolute left-2 top-1 h-3 w-3 rounded-full bg-white" />
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/60">{item.year}</div>
            <h4 className="text-sm font-semibold text-white">{item.title}</h4>
            <p className="text-sm text-white/70">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
