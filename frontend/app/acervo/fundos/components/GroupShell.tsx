import type { ReactNode } from "react";

export function GroupShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-white/0/10 bg-white/5/10 p-4 shadow-[0_0_0_1px_rgba(15,23,42,0.7)] backdrop-blur-sm lg:p-5">
      <div className="mb-4 border-b border-white/5 pb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</p>
      </div>
      {children}
    </div>
  );
}
