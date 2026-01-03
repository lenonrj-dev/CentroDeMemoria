"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Copy, Loader2 } from "lucide-react";

const accentMap = {
  emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  cyan: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
  rose: "text-rose-300 bg-rose-500/10 border-rose-500/20",
  amber: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  slate: "text-slate-300 bg-slate-500/10 border-slate-500/20",
} as const;

type Accent = keyof typeof accentMap;

type KpiCardProps = {
  icon?: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: Accent;
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  ariaLabel?: string;
  delta?: number | null;
  loading?: boolean;
  copyable?: boolean;
};

export default function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "slate",
  onClick,
  ariaLabel,
  delta = null,
  loading = false,
  copyable = false,
}: KpiCardProps) {
  const Wrapper = onClick ? motion.button : motion.div;
  const clickableClasses = onClick
    ? "transition shadow-sm hover:shadow rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/40 hover:border-white/20"
    : "rounded-xl";

  const deltaIsNumber = typeof delta === "number" && !Number.isNaN(delta);
  const deltaPositive = deltaIsNumber && delta > 0;
  const deltaNegative = deltaIsNumber && delta < 0;
  const deltaClass = deltaPositive
    ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
    : deltaNegative
    ? "text-rose-300 bg-rose-500/10 border-rose-500/20"
    : "text-slate-300 bg-slate-500/10 border-slate-500/20";

  const onKey = (e: React.KeyboardEvent) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(e);
    }
  };

  const handleCopy = async () => {
    try {
      const text = String(value ?? "");
      if (navigator?.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      alert("Valor copiado!");
    } catch {
      alert("Nao foi possivel copiar.");
    }
  };

  return (
    <Wrapper
      whileHover={onClick ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      onClick={onClick}
      onKeyDown={onKey}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel || (onClick ? `Abrir ${label}` : undefined)}
      className={`${clickableClasses} border border-white/10 bg-white/5 p-4 relative`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`inline-flex items-center gap-2 text-xs px-2 py-1 rounded border ${accentMap[accent]}`}>
          {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
          <span className="truncate">{label}</span>
        </div>

        {deltaIsNumber && (
          <div
            className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded border ${deltaClass}`}
            aria-label={`Variacao: ${delta > 0 ? "aumento" : delta < 0 ? "queda" : "estavel"} de ${Math.abs(delta)}`}
            title={`${delta > 0 ? "+" : ""}${delta}`}
          >
            {delta > 0 ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : delta < 0 ? (
              <ArrowDownRight className="h-3.5 w-3.5" />
            ) : null}
            <span>{delta > 0 ? "+" : ""}{delta}</span>
          </div>
        )}
      </div>

      <div className="mt-2 min-h-[1.75rem] flex items-center gap-2">
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-300" aria-hidden="true" />
            <span className="h-5 w-24 rounded bg-white/10 animate-pulse" />
          </span>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.span
                key={String(value)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="text-lg font-semibold"
                aria-live="polite"
              >
                {value}
              </motion.span>
            </AnimatePresence>
            {copyable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                className="p-1 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                aria-label={`Copiar valor de ${label}`}
                title="Copiar valor"
              >
                <Copy className="h-4 w-4 text-gray-300" />
              </button>
            )}
          </>
        )}
      </div>

      {hint ? <div className="mt-0.5 text-xs text-gray-400">{hint}</div> : null}
    </Wrapper>
  );
}
