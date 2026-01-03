// file: components/nodes/StatusPill.tsx
"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

/**
 * StatusPill
 * - Selo compacto de status de nó (Ready | NotReady | Unknown).
 * - Tradução automática para pt-BR + ícone por estado.
 * - Acessibilidade: role="status" e title/aria-label descritivos.
 *
 * Props:
 * - status: "Ready" | "NotReady" | "Unknown" | boolean (true => Ready, false => NotReady)
 * - size?: "sm" | "md" (padrão "sm")
 * - className?: string
 */
function StatusPill({ status, size = "sm", className = "" }) {
  // Suporta boolean -> mapeia para estados conhecidos
  const normalized = useMemo(() => {
    if (typeof status === "boolean") return status ? "Ready" : "NotReady";
    const s = String(status || "").toLowerCase();
    if (["ready", "pronto"].includes(s)) return "Ready";
    if (["notready", "não pronto", "nao pronto", "not ready"].includes(s)) return "NotReady";
    return "Unknown";
  }, [status]);

  // Tema claro (acessível)
  const styleMap = {
    Ready: "text-emerald-700 bg-emerald-50 border-emerald-200",
    NotReady: "text-amber-700 bg-amber-50 border-amber-200",
    Unknown: "text-slate-600 bg-slate-50 border-slate-200",
  };

  const labelMap = {
    Ready: "Pronto",
    NotReady: "Não pronto",
    Unknown: "Desconhecido",
  };

  const iconMap = {
    Ready: CheckCircle2,
    NotReady: AlertTriangle,
    Unknown: HelpCircle,
  };

  const sizeMap = {
    sm: { text: "text-[11px]", px: "px-1.5", py: "py-0.5", gap: "gap-1.5", icon: 12 },
    md: { text: "text-xs", px: "px-2", py: "py-1", gap: "gap-1.5", icon: 14 },
  };
  const sz = sizeMap[size] || sizeMap.sm;

  const Icon = iconMap[normalized] || HelpCircle;
  const label = labelMap[normalized] || "Desconhecido";

  return (
    <motion.span
      role="status"
      aria-label={`Status: ${label}`}
      title={label}
      className={[
        "inline-flex items-center rounded border font-medium leading-none select-none",
        styleMap[normalized],
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
      <span>{label}</span>
    </motion.span>
  );
}

export default memo(StatusPill);
