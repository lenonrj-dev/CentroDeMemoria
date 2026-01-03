// file: components/replicasets/BulkActionsBar.tsx
"use client";

import { RotateCcw, Trash2, SlidersHorizontal, Wrench, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function BulkActionsBar({ count, onClear, onRestart, onDelete, onScale, onFixSelector }) {
  const [loading, setLoading] = useState(null); // 'restart' | 'scale' | 'fix' | 'delete' | null
  const disabled = useMemo(() => count <= 0 || !!loading, [count, loading]);
  const labelCount = useMemo(() => `${count} ${count === 1 ? "selecionado" : "selecionados"}`, [count]);

  const run = useCallback(async (key, fn) => {
    if (!fn) return;
    setLoading(key);
    try {
      const maybePromise = fn();
      if (maybePromise?.then) await maybePromise;
    } finally {
      setLoading(null);
    }
  }, []);

  const Btn = ({ onClick, icon: Icon, children, variant = "default", loadingKey }) => {
    const base =
      "text-sm px-3 py-1.5 rounded border inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
      default: "border-white/10 bg-white/5 hover:border-white/20",
      danger: "border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50",
      ghost: "border-white/10 bg-white/5 hover:border-white/20 p-2 px-2 py-2",
    };
    const isLoading = loading === loadingKey;
    return (
      <motion.button
        type="button"
        onClick={onClick}
        className={`${base} ${variants[variant]}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={disabled}
        aria-busy={isLoading ? "true" : "false"}
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80" aria-hidden="true" />
            <span>Processando…</span>
          </>
        ) : (
          <>
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            <span>{children}</span>
          </>
        )}
      </motion.button>
    );
  };

  return (
    <div
      className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
      role="region"
      aria-label="Ações em massa de ReplicaSets"
    >
      <div className="text-sm text-gray-300" aria-live="polite">{labelCount}</div>
      <div className="flex flex-wrap items-center gap-2">
        <Btn
          onClick={() => run("restart", onRestart)}
          icon={RotateCcw}
          loadingKey="restart"
        >
          Rolling restart
        </Btn>
        <Btn
          onClick={() => run("scale", onScale)}
          icon={SlidersHorizontal}
          loadingKey="scale"
        >
          Escalonar
        </Btn>
        <Btn
          onClick={() => run("fix", onFixSelector)}
          icon={Wrench}
          loadingKey="fix"
        >
          Ajustar selector
        </Btn>
        <Btn
          onClick={() => run("delete", onDelete)}
          icon={Trash2}
          variant="danger"
          loadingKey="delete"
        >
          Excluir
        </Btn>
        <motion.button
          type="button"
          onClick={onClear}
          className="p-2 rounded border border-white/10 bg-white/5 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
          title="Limpar seleção"
          aria-label="Limpar seleção"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.98 }}
          disabled={count === 0}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      </div>
    </div>
  );
}
