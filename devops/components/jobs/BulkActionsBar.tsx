// file: components/jobs/BulkActionsBar.tsx
"use client";

import { PlayCircle, Square, Trash2, PlusCircle, CheckCircle2, X } from "lucide-react";
import { motion } from "framer-motion";

export default function BulkActionsBar({
  count,
  onClear,
  onRerun,
  onStop,
  onDelete,
  onIncreaseBackoff,
  onForceComplete,
}) {
  const disabled = count <= 0;
  const labelSelecionados = `${count} selecionado${count === 1 ? "" : "s"}`;

  const Btn = ({ children, onClick, className = "", title, danger = false, pulse = false }) => (
    <motion.button
      type="button"
      onClick={onClick}
      className={`text-sm px-3 py-1.5 rounded border inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed ${
        danger
          ? "border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50"
          : "border-white/10 bg-white/5 hover:border-white/20"
      } ${className}`}
      title={title}
      aria-label={title}
      aria-disabled={disabled}
      disabled={disabled}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      animate={pulse && !disabled ? { opacity: [0.9, 1, 0.9] } : undefined}
      transition={pulse && !disabled ? { duration: 1.6, repeat: Infinity } : undefined}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-sm text-gray-300" role="status" aria-live="polite">
        {labelSelecionados}
      </div>
      <div className="flex items-center gap-2">
        <Btn onClick={onRerun} title="Reexecutar seleção" pulse>
          <PlayCircle className="h-4 w-4" /> Reexecutar
        </Btn>
        <Btn onClick={onStop} title="Parar seleção">
          <Square className="h-4 w-4" /> Parar
        </Btn>
        <Btn onClick={onIncreaseBackoff} title="Aumentar backoff em massa">
          <PlusCircle className="h-4 w-4" /> Aumentar backoff
        </Btn>
        <Btn onClick={onForceComplete} title="Forçar marcação como concluído">
          <CheckCircle2 className="h-4 w-4" /> Forçar conclusão
        </Btn>
        <Btn onClick={onDelete} title="Excluir seleção" danger>
          <Trash2 className="h-4 w-4" /> Excluir
        </Btn>
        <motion.button
          type="button"
          onClick={onClear}
          className="p-2 rounded border border-white/10 bg-white/5 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          title="Limpar seleção"
          aria-label="Limpar seleção"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <X className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}
