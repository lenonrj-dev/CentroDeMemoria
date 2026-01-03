"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "../../../lib/backend-client";

const STORAGE_KEY = "sintracon_admin_token";

export default function LoginClient({ nextPath }: { nextPath: string }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiPost<{ token: string }>("/api/admin/auth/login", { email, password });
      const token = res.data.token;
      localStorage.setItem(STORAGE_KEY, token);
      router.replace(nextPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="w-full rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold text-white">Admin</h1>
        <p className="mt-1 text-sm text-white/70">Acesse para gerenciar o conteúdo.</p>

        <div className="mt-5 space-y-3">
          <label className="block text-sm text-white/70">
            E-mail
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="admin@exemplo.com"
              required
            />
          </label>
          <label className="block text-sm text-white/70">
            Senha
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="••••••••"
              required
            />
          </label>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="mt-4 text-xs text-white/50">
          Backend: defina `ADMIN_EMAIL` e `ADMIN_PASSWORD_HASH` no `backend/.env`.
        </p>
      </form>
    </div>
  );
}

