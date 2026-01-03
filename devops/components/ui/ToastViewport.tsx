"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react";

const toneStyles = {
  success: "border-emerald-400/50 bg-emerald-500/10 text-emerald-50",
  danger: "border-rose-400/50 bg-rose-500/10 text-rose-50",
  warning: "border-amber-400/50 bg-amber-500/10 text-amber-50",
  info: "border-cyan-400/50 bg-cyan-500/10 text-cyan-50",
};

const toneIcon = {
  success: CheckCircle2,
  danger: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
};

export default function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-end p-5 sm:p-8">
      <div className="space-y-3 w-full max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = toneIcon[toast.tone] || Info;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className={`pointer-events-auto rounded-xl border px-4 py-3 shadow-2xl backdrop-blur ${toneStyles[toast.tone] || toneStyles.info}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold leading-tight truncate">{toast.title}</div>
                    {toast.description && <p className="text-xs text-gray-200/90 leading-snug">{toast.description}</p>}
                  </div>
                  <button
                    onClick={() => onDismiss(toast.id)}
                    className="rounded-lg p-1 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
                    aria-label="Fechar notificação"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
