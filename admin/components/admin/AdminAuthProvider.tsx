"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type AdminAuthContextValue = {
  token: string | null;
  ready: boolean;
  setToken: (token: string) => void;
  clearToken: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const STORAGE_KEY = "sintracon_admin_token";
const EXPIRES_KEY = "sintracon_admin_token_expires_at";
const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  const clearStored = useCallback(() => {
    setTokenState(null);
    setExpiresAt(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EXPIRES_KEY);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const rawExpires = localStorage.getItem(EXPIRES_KEY);
      const parsedExpires = rawExpires ? Number(rawExpires) : null;
      if (saved && parsedExpires && parsedExpires > Date.now()) {
        setTokenState(saved);
        setExpiresAt(parsedExpires);
      } else if (saved || rawExpires) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(EXPIRES_KEY);
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!expiresAt) return;
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      clearStored();
      return;
    }
    const timer = window.setTimeout(() => {
      clearStored();
    }, remaining);
    return () => window.clearTimeout(timer);
  }, [clearStored, expiresAt]);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      token,
      ready,
      setToken: (t) => {
        const nextExpires = Date.now() + TOKEN_TTL_MS;
        setTokenState(t);
        setExpiresAt(nextExpires);
        try {
          localStorage.setItem(STORAGE_KEY, t);
          localStorage.setItem(EXPIRES_KEY, String(nextExpires));
        } catch {
          // ignore
        }
      },
      clearToken: clearStored,
    }),
    [clearStored, ready, token]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
