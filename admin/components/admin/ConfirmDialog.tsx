"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "default",
  onConfirm,
  onClose,
}: Props) {
  const confirmRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    setTimeout(() => confirmRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev || "";
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-950 p-5 shadow-xl">
        <div className="text-base font-semibold text-slate-100">{title}</div>
        {description ? <div className="mt-2 text-sm text-slate-400">{description}</div> : null}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="rounded-xl border border-slate-800 bg-transparent px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className={
              "rounded-xl border px-4 py-2 text-sm font-medium text-white " +
              (tone === "danger"
                ? "border-red-500/40 bg-red-500/20 hover:bg-red-500/25"
                : "border-indigo-400/40 bg-indigo-500/20 hover:bg-indigo-500/30")
            }
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
