"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ open, title, subtitle, onClose, children, actions }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center px-4 py-6 backdrop-blur-sm bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0c1118] shadow-2xl shadow-black/40"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-white/10">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold truncate">{title}</h3>
                {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 border border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
                aria-label="Fechar modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">{children}</div>

            {actions && <div className="px-5 py-4 border-t border-white/10 bg-white/[0.03] flex justify-end gap-2">{actions}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
