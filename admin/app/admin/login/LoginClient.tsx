"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "../../../lib/backend-client";
import type { NormalizedApiError } from "../../../lib/api-errors";
import { normalizeApiError } from "../../../lib/api-errors";
import { setFlashToast } from "../../../components/admin/ToastProvider";
import { FormErrorSummary } from "../../../components/admin/forms/FormErrorSummary";
import { Button, Field, Input, SectionCard } from "../../../components/admin/ui";
import { HELP } from "../../../components/admin/ui/help";

const STORAGE_KEY = "sintracon_admin_token";
const EXPIRES_KEY = "sintracon_admin_token_expires_at";
const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;

export default function LoginClient({ nextPath }: { nextPath: string }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<NormalizedApiError | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiPost<{ token: string }>("/api/admin/auth/login", { email, password });
      const token = res.data.token;
      const expiresAt = Date.now() + TOKEN_TTL_MS;
      localStorage.setItem(STORAGE_KEY, token);
      localStorage.setItem(EXPIRES_KEY, String(expiresAt));
      setFlashToast({ type: "success", title: "Login", message: "Acesso autorizado." });
      router.replace(nextPath);
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="w-full">
        <SectionCard
          title="Entrar no admin"
          description="Use suas credenciais para gerenciar o conteudo publicado."
        >
          <div className="space-y-4">
            <Field label="E-mail" htmlFor="admin-email" required help={HELP.email} hint="Use o e-mail autorizado no backend.">
              <Input
                id="admin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="admin@exemplo.com"
                required
              />
            </Field>
            <Field label="Senha" htmlFor="admin-password" required help={HELP.password} hint="Senha definida no backend.">
              <Input
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="********"
                required
              />
            </Field>
          </div>

          <div className="mt-4">
            <FormErrorSummary error={error} />
          </div>

          <Button type="submit" disabled={loading} className="mt-5 w-full">
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <p className="mt-4 text-xs text-slate-400">
            Backend: defina ADMIN_EMAIL e ADMIN_PASSWORD_HASH no backend/.env.
          </p>
        </SectionCard>
      </form>
    </div>
  );
}
