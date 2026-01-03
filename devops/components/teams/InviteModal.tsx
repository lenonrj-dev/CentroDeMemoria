// file: components/teams/InviteModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InviteModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Dev");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef(null);

  if (!open) return null;

  // Foco inicial no campo de e-mail quando o modal abre
  useEffect(() => {
    if (open && emailRef.current) {
      emailRef.current.focus();
    }
  }, [open]);

  // Fecha com a tecla ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const validateEmail = (v) => {
    // Validação simples e robusta o suficiente para frontend
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test(String(v || "").trim());
  };

  const canSubmit = validateEmail(email) && !!role && !submitting;

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");
    if (!validateEmail(email)) {
      setError("Informe um e-mail válido.");
      return;
    }
    setSubmitting(true);
    try {
      // Mock de chamada assíncrona
      await new Promise((r) => setTimeout(r, 700));
      alert(`(mock) convite enviado para ${email} (${role})`);
      onClose?.();
      setEmail("");
      setRole("Dev");
    } catch (err) {
      setError("Não foi possível enviar o convite. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <AnimatePresence>
        <motion.div
          key="invite-modal"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="invite-title"
          aria-describedby="invite-desc"
          className="relative w-full max-w-md rounded-xl border border-white/10 bg-[#0b1117] p-4 shadow-xl"
        >
          <h4 id="invite-title" className="text-sm font-medium text-gray-100">
            Convidar membro
          </h4>
          <p id="invite-desc" className="mt-1 text-xs text-gray-400">
            Envie um convite por e-mail e defina o papel do novo membro.
          </p>

          <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs text-gray-400 mb-1 block" htmlFor="invite-email">
                E-mail
              </label>
              <input
                id="invite-email"
                ref={emailRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dev@empresa.com"
                inputMode="email"
                autoComplete="email"
                aria-invalid={!!error}
                aria-describedby={error ? "invite-error" : undefined}
                className="w-full bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
              {error && (
                <div id="invite-error" className="mt-1 text-xs text-rose-300">
                  {error}
                </div>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block" htmlFor="invite-role">
                Papel
              </label>
              <select
                id="invite-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
              >
                <option>Owner</option>
                <option>Admin</option>
                <option>Dev</option>
                <option>Viewer</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                aria-busy={submitting ? "true" : "false"}
                className="px-3 py-1.5 rounded border border-white/10 bg-cyan-500/10 hover:border-cyan-500/40 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                title={!canSubmit ? "Informe um e-mail válido para enviar" : "Enviar convite"}
              >
                {submitting ? "Enviando…" : "Enviar convite"}
              </button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
