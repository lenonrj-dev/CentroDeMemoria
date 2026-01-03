// file: app/components/deployments/StatusPill.tsx
"use client";

import { motion } from "framer-motion";

export default function StatusPill({ status }) {
  const map = {
    "Disponível": "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    "Progredindo": "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
    "Degradado": "text-rose-300 bg-rose-500/10 border-rose-500/20",
  };

  const cls = map[status] || "text-gray-300 bg-white/5 border-white/10";
  const animated = status === "Progredindo";

  return (
    <motion.span
      role="status"
      aria-live="polite"
      data-state={status?.toLowerCase?.() || "desconhecido"}
      title={status || "Desconhecido"}
      className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded border ${cls}`}
      initial={animated ? { opacity: 0.85 } : false}
      animate={animated ? { opacity: [0.85, 1, 0.85] } : undefined}
      transition={animated ? { duration: 1.6, repeat: Infinity } : undefined}
    >
      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      <span className="truncate">{status || "—"}</span>
    </motion.span>
  );
}
