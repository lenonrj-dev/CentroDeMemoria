// file: components/cronjobs/StatusPill.tsx
"use client";

import { memo } from "react";
import { motion } from "framer-motion";

// className é opcional e não quebra a API existente
function StatusPill({ suspend, className = "" }) {
  const label = suspend ? "Suspenso" : "Ativo";
  const cls = suspend
    ? "text-amber-300 bg-amber-500/10 border-amber-500/20"
    : "text-emerald-300 bg-emerald-500/10 border-emerald-500/20";

  return (
    <motion.span
      key={label} // força animação ao alternar "Ativo" <-> "Suspenso"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.18 }}
      whileHover={{ scale: 1.02 }}
      role="status"
      aria-label={`Status: ${label}`}
      title={label}
      className={`text-[11px] px-1.5 py-0.5 rounded border ${cls} ${className}`}
    >
      {label}
    </motion.span>
  );
}

export default memo(StatusPill);
