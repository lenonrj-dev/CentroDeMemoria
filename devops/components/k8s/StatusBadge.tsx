"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle, PlayCircle, HelpCircle } from "lucide-react";

/**
 * StatusBadge
 * - Mostra um selo de status com ícone, cores e animação suave.
 * - Acessibilidade: role="status", aria-label descritivo em pt-BR.
 * - Tradução automática do rótulo para pt-BR.
 *
 * Props:
 * - status: "Running" | "Pending" | "Failed" | "Succeeded" | "Unknown" | (suporta variações em pt-BR)
 * - size: "sm" | "md" (padrão "sm")
 * - className: classes Tailwind adicionais
 * - pulse: boolean (animação de pulso sutil quando ativo)
 */
function StatusBadge({ status = "Running", size = "sm", className = "", pulse = false }) {
  // Normaliza o status (aceita pt-BR e en-US)
  const normalized = useMemo(() => {
    const s = String(status).toLowerCase();
    if (["running", "em execução", "ativo"].includes(s)) return "Running";
    if (["pending", "pendente", "aguardando"].includes(s)) return "Pending";
    if (["failed", "falhou", "erro"].includes(s)) return "Failed";
    if (["succeeded", "sucesso", "concluído", "concluido"].includes(s)) return "Succeeded";
    return "Unknown";
  }, [status]);

  const styleMap = {
    Running: "text-emerald-700 bg-emerald-50 border-emerald-200",
    Pending: "text-amber-700 bg-amber-50 border-amber-200",
    Failed: "text-rose-700 bg-rose-50 border-rose-200",
    Succeeded: "text-cyan-700 bg-cyan-50 border-cyan-200",
    Unknown: "text-slate-600 bg-slate-50 border-slate-200",
  };

  const labelMap = {
    Running: "Em execução",
    Pending: "Pendente",
    Failed: "Falhou",
    Succeeded: "Concluído",
    Unknown: "Desconhecido",
  };

  const iconMap = {
    Running: PlayCircle,
    Pending: Clock,
    Failed: XCircle,
    Succeeded: CheckCircle2,
    Unknown: HelpCircle,
  };

  const Icon = iconMap[normalized] || HelpCircle;
  const label = labelMap[normalized] || "Desconhecido";

  const sizeMap = {
    sm: {
      text: "text-xs",
      px: "px-2",
      py: "py-0.5",
      icon: 14,
      gap: "gap-1.5",
    },
    md: {
      text: "text-sm",
      px: "px-2.5",
      py: "py-1",
      icon: 16,
      gap: "gap-2",
    },
  };
  const sz = sizeMap[size] || sizeMap.sm;

  return (
    <motion.span
      role="status"
      aria-label={`Status: ${label}`}
      title={label}
      className={[
        "inline-flex select-none items-center rounded border font-medium",
        "leading-none",
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
      {...(pulse
        ? {
            whileHover: { scale: 1.03 },
            animate: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.18, ease: "easeOut" },
            },
          }
        : { whileHover: { scale: 1.02 } })}
    >
      <Icon
        aria-hidden="true"
        className="shrink-0"
        size={sz.icon}
        strokeWidth={2}
      />
      <span>{label}</span>
    </motion.span>
  );
}

export default memo(StatusBadge);
