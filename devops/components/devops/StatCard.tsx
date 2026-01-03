"use client";

import type { ReactNode } from "react";
import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import MiniSpark from "../k8s/MiniSpark";
import Badge from "../ui/Badge";

const palette = {
  healthy: { border: "border-emerald-400/40", glow: "from-emerald-500/20 to-cyan-500/10" },
  warning: { border: "border-amber-400/40", glow: "from-amber-500/20 to-orange-500/10" },
  danger: { border: "border-rose-400/40", glow: "from-rose-500/25 to-orange-500/10" },
  neutral: { border: "border-white/10", glow: "from-white/10 to-white/5" },
} as const;

type StatState = keyof typeof palette;

type StatCardProps = {
  icon?: LucideIcon;
  title: string;
  value: ReactNode;
  delta?: ReactNode;
  hint?: string;
  state?: StatState;
  series?: number[];
};

function StatCard({ icon: Icon, title, value, delta, hint, state = "neutral", series = [] }: StatCardProps) {
  const colors = palette[state] || palette.neutral;
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.glow} px-4 py-4 shadow-lg shadow-black/30`}
    >
      <div className="space-y-1 pr-14">
        <p className="text-xs uppercase tracking-wide text-gray-400 leading-tight">{title}</p>
        <div className="text-2xl font-semibold tracking-tight leading-tight">{value}</div>
        <div className="flex items-center gap-2 flex-wrap text-sm leading-tight">
          {delta ? (
            <Badge tone={state === "danger" ? "danger" : state === "warning" ? "warning" : "success"}>{delta}</Badge>
          ) : null}
          {hint ? <span className="text-xs text-gray-400 truncate">{hint}</span> : null}
        </div>
      </div>
      <div className="mt-3">
        <MiniSpark points={series} height={42} width={180} ariaLabel={`${title} sparkline`} />
      </div>
      <div className="absolute top-3 right-3 h-10 w-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
        {Icon ? <Icon className="h-5 w-5 text-cyan-100" /> : null}
      </div>
    </motion.div>
  );
}

export default memo(StatCard);
