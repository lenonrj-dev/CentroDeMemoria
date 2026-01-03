import type { ReactNode } from "react";

export function SectionTitle({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/50">
            <span>{eyebrow}</span>
          </div>
        )}
        <h2 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">{title}</h2>
        {description && <p className="max-w-3xl text-sm text-white/70 sm:text-base">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
