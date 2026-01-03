// file: components/releases/StatusPill.tsx
"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, PauseCircle, XCircle, HelpCircle } from "lucide-react";

/**
 * StatusPill (Releases)
 * - Exibe selo com ícone e cores por status.
 * - Suporta tamanhos, pulso para "Em progresso" e mapeia valores em EN/PT.
 *
 * Props:
 * - status: string (ex.: "Em progresso" | "Concluído" | "Pausado" | "Falhou")
 * - size?: "sm" | "md" (padrão "sm")
 * - pulse?: boolean (padrão true) -> ativa animação sutil em "Em progresso"
 * - className?: string
 */
function StatusPill({ status, size = "sm", pulse = true, className = "" }) {
  const normalized = useMemo(() => {
    const s = String(status || "").toLowerCase().trim();
    if (["em progresso", "in progress", "running"].includes(s)) return "Em progresso";
    if (["concluído", "concluido", "success", "succeeded", "completed", "done"].includes(s)) return "Concluído";
    if (["pausado", "paused"].includes(s)) return "Pausado";
    if (["falhou", "failed", "error"].includes(s)) return "Falhou";
    return "Desconhecido";
  }, [status]);

  const styleMap = {
    "Em progresso": "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
    "Concluído": "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    "Pausado": "text-amber-300 bg-amber-500/10 border-amber-500/20",
    "Falhou": "text-rose-300 bg-rose-500/10 border-rose-500/20",
    "Desconhecido": "text-gray-300 bg-white/5 border-white/10",
  };

  const iconMap = {
    "Em progresso": Loader2,
    "Concluído": CheckCircle2,
    "Pausado": PauseCircle,
    "Falhou": XCircle,
    "Desconhecido": HelpCircle,
  };

  const sizeMap = {
    sm: { text: "text-[11px]", px: "px-1.5", py: "py-0.5", gap: "gap-1.5", icon: 12 },
    md: { text: "text-xs", px: "px-2", py: "py-1", gap: "gap-1.5", icon: 14 },
  };
  const sz = sizeMap[size] || sizeMap.sm;

  const Icon = iconMap[normalized] || HelpCircle;
  const cls = styleMap[normalized] || styleMap["Desconhecido"];
  const label = normalized;

  const showSpin = pulse && normalized === "Em progresso";

  return (
    <motion.span
      role="status"
      aria-label={`Status: ${label}`}
      title={label}
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
      <Icon size={sz.icon} className={showSpin ? "shrink-0 animate-spin" : "shrink-0"} aria-hidden="true" />
      <span>{label}</span>
    </motion.span>
  );
}

export default memo(StatusPill);
