"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
};

type ToastContextValue = {
  pushToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const FLASH_KEY = "sintracon_admin_flash_toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const pushToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((prev) => [...prev, { id, ...toast }]);
      window.setTimeout(() => remove(id), 4200);
    },
    [remove]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FLASH_KEY);
      if (!raw) return;
      localStorage.removeItem(FLASH_KEY);
      const parsed = JSON.parse(raw) as any;
      if (parsed && typeof parsed === "object" && typeof parsed.message === "string") {
        pushToast({
          type: (parsed.type as ToastType) || "info",
          title: typeof parsed.title === "string" ? parsed.title : undefined,
          message: parsed.message,
        });
      }
    } catch {
      // ignore
    }
  }, [pushToast]);

  const value = useMemo<ToastContextValue>(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] grid w-[min(420px,calc(100vw-2rem))] gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              "pointer-events-auto rounded-2xl border p-3 shadow-xl backdrop-blur " +
              (t.type === "success"
                ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-50"
                : t.type === "error"
                  ? "border-red-400/40 bg-red-500/15 text-red-50"
                  : "border-slate-700/80 bg-slate-950/90 text-slate-100")
            }
          >
            {t.title ? <div className="text-sm font-semibold">{t.title}</div> : null}
            <div className="text-sm opacity-90">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function setFlashToast(toast: Omit<Toast, "id">) {
  try {
    localStorage.setItem(FLASH_KEY, JSON.stringify(toast));
  } catch {
    // ignore
  }
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
