// file: components/cronjobs/BulkActionsBar.tsx
"use client";

import { useState } from "react";
import { Play, Pause, PlayCircle, Trash2, Settings, History, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function BulkActionsBar({
  count,
  onClear,
  onRunNow,
  onSuspend,
  onResume,
  onUpdateSchedule,
  onSetHistory,
  onDelete,
}) {
  const [busy, setBusy] = useState(null); // "run" | "suspend" | "resume" | "schedule" | "history" | "delete" | null

  const runSafe = async (key, fn) => {
    if (!fn || busy) return;
    try {
      setBusy(key);
      await Promise.resolve(fn());
    } finally {
      setBusy(null);
    }
  };

  const Btn = ({ icon: Icon, children, onClick, busyKey, variant = "default", ariaLabel }) => {
    const loading = busy === busyKey;
    const base =
      "text-sm px-3 py-1.5 rounded border inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/40";
    const tone =
      variant === "danger"
        ? "border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50"
        : "border-white/10 bg-white/5 hover:border-white/20";
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={ariaLabel}
        aria-busy={loading}
        disabled={!!busy}
        onClick={onClick}
        className={`${base} ${tone} disabled:opacity-60`}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
        <span className="whitespace-nowrap">{children}</span>
      </motion.button>
    );
  };

  return (
    <div className="mb-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-300" aria-live="polite">
          {count} selecionado(s)
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1">
          <Btn
            icon={PlayCircle}
            busyKey="run"
            onClick={() => runSafe("run", onRunNow)}
            ariaLabel="Executar cronjobs selecionados agora"
          >
            Executar agora
          </Btn>
          <Btn
            icon={Pause}
            busyKey="suspend"
            onClick={() => runSafe("suspend", onSuspend)}
            ariaLabel="Suspender cronjobs selecionados"
          >
            Suspender
          </Btn>
          <Btn
            icon={Play}
            busyKey="resume"
            onClick={() => runSafe("resume", onResume)}
            ariaLabel="Retomar cronjobs selecionados"
          >
            Retomar
          </Btn>
          <Btn
            icon={Settings}
            busyKey="schedule"
            onClick={() => runSafe("schedule", onUpdateSchedule)}
            ariaLabel="Atualizar agendamento em massa"
          >
            Atualizar schedule
          </Btn>
          <Btn
            icon={History}
            busyKey="history"
            onClick={() => runSafe("history", onSetHistory)}
            ariaLabel="Ajustar limites de histórico"
          >
            Limites histórico
          </Btn>
          <Btn
            icon={Trash2}
            busyKey="delete"
            variant="danger"
            onClick={() => runSafe("delete", onDelete)}
            ariaLabel="Excluir cronjobs selecionados"
          >
            Excluir
          </Btn>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
            aria-label="Limpar seleção"
            className="p-2 rounded border border-white/10 bg-white/5 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            disabled={!!busy}
            title="Limpar seleção"
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
