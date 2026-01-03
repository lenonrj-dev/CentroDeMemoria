// file: components/daemonsets/BulkActionsBar.tsx
"use client";

import { RotateCcw, Trash2, Settings2, X } from "lucide-react";
import { motion } from "framer-motion";

export default function BulkActionsBar({
  count,
  onClear,
  onRestart,
  onDelete,
  onUpdateStrategy,
  disabled = false,     // opcional
  loading = false,      // opcional
}) {
  const isBlocked = disabled || loading || count <= 0;

  const btnBase =
    "text-sm px-3 py-1.5 rounded border inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/40";
  const btnNeutral = "border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed";
  const btnDanger =
    "border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <div role="status" aria-live="polite" className="text-sm text-gray-300">
        {count} selecionado(s)
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          disabled={isBlocked}
          className={`${btnBase} ${btnNeutral}`}
          aria-label="Executar reinício gradual (rolling restart) nos itens selecionados"
          title="Reinício gradual (rolling restart)"
        >
          <RotateCcw className="h-4 w-4" /> Reinício gradual
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onUpdateStrategy}
          disabled={isBlocked}
          className={`${btnBase} ${btnNeutral}`}
          aria-label="Atualizar estratégia dos DaemonSets selecionados"
          title="Atualizar estratégia"
        >
          <Settings2 className="h-4 w-4" /> Atualizar estratégia
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDelete}
          disabled={isBlocked}
          className={`${btnBase} ${btnDanger}`}
          aria-label="Excluir itens selecionados"
          title="Excluir"
        >
          <Trash2 className="h-4 w-4" /> Excluir
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClear}
          disabled={loading}
          className={`p-2 rounded border ${btnNeutral}`}
          title="Limpar seleção"
          aria-label="Limpar seleção"
        >
          <X className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}
