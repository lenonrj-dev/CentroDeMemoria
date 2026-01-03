// file: components/replicasets/StatusPill.tsx
"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

/**
 * HealthPill (ReplicaSets)
 * - Exibe um selo de saúde com cor e ícone conforme o estado.
 *
 * Props:
 * - health: string ("Saudável" | "Parcial" | "Degradado" | outros)
 * - size?: "sm" | "md" (padrão "sm")
 * - className?: string
 */
function HealthPill({ health, size = "sm", className = "" }) {
  const normalized = useMemo(() => {
    const s = String(health || "").toLowerCase().trim();
    if (["saudável", "saudavel", "healthy", "ok", "good"].includes(s)) return "Saudável";
    if (["parcial", "partial", "warning"].includes(s)) return "Parcial";
    if (["degradado", "degraded", "critical", "critico", "crítico", "down"].includes(s)) return "Degradado";
    return "Desconhecido";
  }, [health]);

  const styleMap = {
    "Saudável": "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    "Parcial": "text-amber-300 bg-amber-500/10 border-amber-500/20",
    "Degradado": "text-rose-300 bg-rose-500/10 border-rose-500/20",
    "Desconhecido": "text-gray-300 bg-white/5 border-white/10",
  };
  const iconMap = {
    "Saudável": CheckCircle2,
    "Parcial": AlertTriangle,
    "Degradado": XCircle,
    "Desconhecido": HelpCircle,
  };
  const sizeMap = {
    sm: { text: "text-[11px]", px: "px-1.5", py: "py-0.5", gap: "gap-1.5", icon: 12 },
    md: { text: "text-xs", px: "px-2",   py: "py-1",   gap: "gap-1.5", icon: 14 },
  };
  const sz = sizeMap[size] || sizeMap.sm;
  const Icon = iconMap[normalized] || HelpCircle;
  const cls = styleMap[normalized] || styleMap["Desconhecido"];

  return (
    <motion.span
      role="status"
      aria-label={`Saúde: ${normalized}`}
      title={normalized}
      className={[
        "inline-flex items-center rounded border font-medium leading-none select-none",
        cls,
        sz.text,
        sz.px,
        sz.py,
        sz.gap,
        className,
      ].join(" ")}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <Icon size={sz.icon} className="shrink-0" aria-hidden="true" />
      <span>{normalized}</span>
    </motion.span>
  );
}

export default memo(HealthPill);
