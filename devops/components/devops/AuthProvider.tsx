"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { clearStoredToken, getStoredSession, setStoredToken } from "../../lib/auth";

type AuthContextValue = {
  token: string | null;
  ready: boolean;
  setToken: (token: string) => void;
  clearToken: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = getStoredSession();
    if (saved) {
      setTokenState(saved.token);
      setExpiresAt(saved.expiresAt);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!expiresAt) return;
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      setTokenState(null);
      clearStoredToken();
      return;
    }
    const timer = window.setTimeout(() => {
      setTokenState(null);
      clearStoredToken();
    }, remaining);
    return () => window.clearTimeout(timer);
  }, [expiresAt]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      ready,
      setToken: (next) => {
        const nextExpires = Date.now() + TOKEN_TTL_MS;
        setTokenState(next);
        setExpiresAt(nextExpires);
        setStoredToken(next, nextExpires);
      },
      clearToken: () => {
        setTokenState(null);
        setExpiresAt(null);
        clearStoredToken();
      },
    }),
    [token, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
