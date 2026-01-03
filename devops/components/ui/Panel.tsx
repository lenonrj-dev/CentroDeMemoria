"use client";

import type { ReactNode } from "react";

export type PanelProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  className?: string;
  id?: string;
};

export default function Panel({
  title,
  subtitle,
  children,
  actions,
  footer,
  loading = false,
  error = null,
  empty = false,
  emptyMessage = "Sem dados para exibir.",
  onRetry,
  className = "",
  id,
}: PanelProps) {
  const headerId = id ? `${id}-title` : undefined;
  const subtitleId = subtitle ? (id ? `${id}-subtitle` : undefined) : undefined;

  return (
    <section
      role="region"
      aria-labelledby={headerId}
      aria-describedby={subtitle ? subtitleId : undefined}
      className={`rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.03] shadow-xl shadow-black/20 ${className}`}
    >
      <header className="flex items-end justify-between gap-2 border-b border-white/10 px-4 py-3 md:px-5">
        <div className="min-w-0">
          <h2 id={headerId} className="truncate text-lg font-semibold tracking-tight">
            {title}
          </h2>
          {subtitle ? (
            <p id={subtitleId} className="mt-0.5 truncate text-xs text-gray-400">
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0 flex items-center gap-2">{actions}</div> : null}
      </header>

      <div className="p-4 md:p-5" aria-busy={loading ? "true" : undefined}>
        {error && !loading && (
          <div
            className="mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
            role="alert"
          >
            <div className="flex items-start justify-between gap-3">
              <span>{error}</span>
              {onRetry ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs hover:border-white/20"
                  aria-label="Tentar novamente"
                >
                  Tentar novamente
                </button>
              ) : null}
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-full animate-pulse rounded bg-white/10" />
            <div className="h-3 w-11/12 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-10/12 animate-pulse rounded bg-white/10" />
          </div>
        )}

        {!loading && !error && empty && <div className="text-sm text-gray-400">{emptyMessage}</div>}

        {!loading && !error && !empty && children}
      </div>

      {footer ? <footer className="border-t border-white/10 px-4 py-3 md:px-5">{footer}</footer> : null}
    </section>
  );
}
