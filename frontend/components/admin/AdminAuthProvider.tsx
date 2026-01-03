"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AdminAuthContextValue = {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const STORAGE_KEY = "cmodrm_admin_token";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTokenState(saved);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      token,
      setToken: (t) => {
        setTokenState(t);
        try {
          localStorage.setItem(STORAGE_KEY, t);
        } catch {
          // ignore
        }
      },
      clearToken: () => {
        setTokenState(null);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
      },
    }),
    [token]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

