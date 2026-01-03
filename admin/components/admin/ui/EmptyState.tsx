import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-700/70 bg-slate-950/50 p-10 text-center">
      <div className="text-base font-semibold text-slate-100">{title}</div>
      {description ? <div className="mt-2 text-sm text-slate-400">{description}</div> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
