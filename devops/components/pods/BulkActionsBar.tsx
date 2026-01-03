// file: components/pods/BulkActionsBar.tsx
"use client";

import { RotateCcw, Trash2, X } from "lucide-react";

export default function BulkActionsBar({ count, onClear, onRestart, onDelete }) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-sm text-gray-300">{count} selecionado(s)</div>
      <div className="flex items-center gap-2">
        <button onClick={onRestart} className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 inline-flex items-center gap-2">
          <RotateCcw className="h-4 w-4" /> Reiniciar
        </button>
        <button onClick={onDelete} className="text-sm px-3 py-1.5 rounded border border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50 inline-flex items-center gap-2">
          <Trash2 className="h-4 w-4" /> Excluir
        </button>
        <button onClick={onClear} className="p-2 rounded border border-white/10 bg-white/5 hover:border-white/20" title="Limpar seleção">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
