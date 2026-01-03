"use client";

import { useState, type ReactNode, type FormEvent } from "react";
import { apiPost } from "../../lib/api-client";
import { formatErrorMessage, normalizeApiError, type NormalizedApiError } from "../../lib/api-errors";
import { useAuth } from "./AuthProvider";
import Panel from "../ui/Panel";
import InputField from "../ui/InputField";
import Button from "../ui/Button";

export function AuthGate({ children }: { children: ReactNode }) {
  const { token, ready, setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<NormalizedApiError | null>(null);

  if (!ready) {
    return <div className="min-h-screen grid place-items-center text-sm text-gray-300">Carregando...</div>;
  }

  if (token) return <>{children}</>;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiPost<{ token: string }>("/api/admin/auth/login", { email, password });
      if (res.data?.token) setToken(res.data.token);
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[#050910] px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md">
        <Panel title="Acesso DevOps" subtitle="Use o mesmo login do admin para visualizar metricas.">
          <div className="space-y-3">
            <InputField
              label="E-mail"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@exemplo.com"
            />
            <InputField
              label="Senha"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
            />
          </div>
          {error ? (
            <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {formatErrorMessage(error)}
            </div>
          ) : null}
          <div className="mt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </Panel>
      </form>
    </div>
  );
}
