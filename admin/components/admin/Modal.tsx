"use client";

import { useEffect, useRef } from "react";

export function Modal({
  open,
  title,
  children,
  onClose,
  size = "lg",
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: "md" | "lg" | "xl";
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    setTimeout(() => closeRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev || "";
    };
  }, [onClose, open]);

  if (!open) return null;

  const maxW = size === "md" ? "max-w-2xl" : size === "xl" ? "max-w-6xl" : "max-w-4xl";

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`w-full ${maxW} overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950`}>
        <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/90 px-4 py-3">
          <div className="min-w-0">
            <div className="line-clamp-1 text-sm font-semibold text-slate-100">{title}</div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-white/5 px-3 py-1.5 text-xs text-slate-100 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
          >
            Fechar
          </button>
        </div>
        <div className="max-h-[80svh] overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
