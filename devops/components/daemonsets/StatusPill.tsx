// file: components/daemonsets/StatusPill.tsx
"use client";

import { motion } from "framer-motion";

export default function StatusPill({ health }) {
  const map = {
    Saudável: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    Parcial: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    Degradado: "text-rose-300 bg-rose-500/10 border-rose-500/20",
  };

  const label = health || "—";
  const cls = map[health] || "text-gray-300 bg-white/5 border-white/10";

  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      whileHover={{ scale: 1.02 }}
      className={`text-[11px] px-1.5 py-0.5 rounded border ${cls}`}
      role="status"
      aria-label={`Saúde: ${label}`}
      title={label}
    >
      {label}
    </motion.span>
  );
}
