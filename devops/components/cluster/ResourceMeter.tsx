"use client";

import { motion } from "framer-motion";

type ResourceMeterProps = {
  label: string;
  used?: number;
  total?: number;
  warnAt?: number;
  dangerAt?: number;
  size?: "sm" | "md" | "lg";
  striped?: boolean;
  loading?: boolean;
  title?: string;
  className?: string;
  showValue?: boolean;
};

export default function ResourceMeter({
  label,
  used = 0,
  total = 100,
  warnAt = 70,
  dangerAt = 90,
  size = "md",
  striped = false,
  loading = false,
  title,
  className = "",
  showValue = true,
}: ResourceMeterProps) {
  const pct = clamp(0, 100, total === 100 ? used : total > 0 ? (used / total) * 100 : 0);

  const sizeCls = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";
  const color =
    pct >= dangerAt ? "bg-rose-500/80" :
    pct >= warnAt ? "bg-amber-500/80" :
    "bg-cyan-500/70";

  const stripedCls = striped && pct >= warnAt
    ? "bg-[length:20px_20px] bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] animate-[meter-stripes_1.2s_linear_infinite]"
    : "";

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        {showValue && (
          loading ? (
            <span className="h-4 w-10 rounded bg-white/10 animate-pulse" aria-hidden="true" />
          ) : (
            <span className="tabular-nums text-gray-200">{pct.toFixed(1)}%</span>
          )
        )}
      </div>

      <div
        className={`${sizeCls} overflow-hidden rounded-full bg-white/10`}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Number.isFinite(pct) ? Math.round(pct) : 0}
        title={title ?? (Number.isFinite(pct) ? `${pct.toFixed(1)}%` : undefined)}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: loading ? "0%" : `${pct}%` }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.35 }}
          className={`h-full ${color} ${stripedCls}`}
        />
      </div>

      <style jsx>{`
        @keyframes meter-stripes {
          0% { background-position: 0 0; }
          100% { background-position: 20px 0; }
        }
      `}</style>
    </div>
  );
}

function clamp(min: number, max: number, value: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : 0));
}
