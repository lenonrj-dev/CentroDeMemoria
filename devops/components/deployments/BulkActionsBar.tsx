// file: app/components/deployments/BulkActionsBar.tsx
"use client";

import { RotateCcw, Trash2, Pause, Play, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function BulkActionsBar({
  count,
  onClear,
  onRestart,
  onDelete,
  onPause,
  onResume,
  busy = false, // opcional: desabilita ações e mostra spinner
}) {
  return (
    <div
      className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
      role="toolbar"
      aria-label="Ações em massa de Deployments"
      aria-busy={busy ? "true" : "false"}
    >
      <div className="text-sm text-gray-300 flex items-center gap-2">
        {busy && <Loader2 className="h-4 w-4 animate-spin text-gray-400" aria-hidden="true" />}
        <span>{count} selecionado(s)</span>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          onClick={onRestart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={busy || count === 0}
          aria-disabled={busy || count === 0 ? "true" : "false"}
          title="Executar rollout restart"
        >
          <RotateCcw className="h-4 w-4" /> Rollout restart
        </motion.button>

        <motion.button
          type="button"
          onClick={onPause}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={busy || count === 0}
          aria-disabled={busy || count === 0 ? "true" : "false"}
          title="Pausar Deployments selecionados"
        >
          <Pause className="h-4 w-4" /> Pausar
        </motion.button>

        <motion.button
          type="button"
          onClick={onResume}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={busy || count === 0}
          aria-disabled={busy || count === 0 ? "true" : "false"}
          title="Retomar Deployments selecionados"
        >
          <Play className="h-4 w-4" /> Retomar
        </motion.button>

        <motion.button
          type="button"
          onClick={onDelete}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-sm px-3 py-1.5 rounded border border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={busy || count === 0}
          aria-disabled={busy || count === 0 ? "true" : "false"}
          title="Excluir Deployments selecionados"
        >
          <Trash2 className="h-4 w-4" /> Excluir
        </motion.button>

        <motion.button
          type="button"
          onClick={onClear}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Limpar seleção"
          aria-label="Limpar seleção"
          disabled={busy || count === 0}
        >
          <X className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}
