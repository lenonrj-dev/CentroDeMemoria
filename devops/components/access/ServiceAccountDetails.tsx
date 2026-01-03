// file: components/access/ServiceAccountDetails.tsx
"use client";

import KVTable from "../cluster/KVTable";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clipboard, ClipboardCheck, Download } from "lucide-react";

export default function ServiceAccountDetails({ sa }) {
  const [copiedYaml, setCopiedYaml] = useState(false);
  const [expandedSecrets, setExpandedSecrets] = useState(false);
  const [expandedTokens, setExpandedTokens] = useState(false);

  if (!sa) return <div className="text-sm text-gray-400" role="status">Selecione uma ServiceAccount…</div>;

  const yaml = useMemo(() => toYAML(sa), [sa]);

  const handleCopyYaml = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(yaml);
      } else {
        const ta = document.createElement("textarea");
        ta.value = yaml;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedYaml(true);
      setTimeout(() => setCopiedYaml(false), 1200);
    } catch {
      alert("Não foi possível copiar o YAML.");
    }
  };

  const handleDownloadYaml = () => {
    try {
      const blob = new Blob([yaml], { type: "text/yaml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sa.name}.yaml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Não foi possível baixar o YAML.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho + ações */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-medium">{sa.name}</h4>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] border bg-white/5 border-white/10 text-gray-200">
                ns: {sa.namespace}
              </span>
              <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] border bg-white/5 border-white/10 text-gray-200">
                segredos: {sa.secrets?.length ?? 0}
              </span>
              <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] border bg-white/5 border-white/10 text-gray-200">
                tokens: {sa.tokens?.length ?? 0}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyYaml}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:border-white/20"
              aria-label="Copiar YAML"
            >
              {copiedYaml ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
              {copiedYaml ? "Copiado" : "Copiar YAML"}
            </button>
            <button
              onClick={handleDownloadYaml}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:border-white/20"
              aria-label="Baixar YAML"
            >
              <Download className="h-4 w-4" />
              Baixar
            </button>
          </div>
        </div>

        <KVTable
          rows={[
            ["Namespace", sa.namespace],
            ["Segredos", sa.secrets?.length ?? 0],
            ["Tokens", sa.tokens?.length ?? 0],
            ["Image Pull Secrets", sa.imagePullSecrets?.length ? sa.imagePullSecrets.join(", ") : "—"],
            ["Idade", sa.age],
          ]}
        />

        {sa.imagePullSecrets?.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {sa.imagePullSecrets.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="inline-flex items-center rounded px-2 py-0.5 text-[11px] border bg-white/5 border-white/10 text-gray-100"
                title={name}
              >
                {name}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      {/* Segredos (colapsável) */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium">Segredos</h4>
          {sa.secrets?.length > 6 && (
            <button
              onClick={() => setExpandedSecrets((v) => !v)}
              className="text-xs rounded border border-white/10 bg-white/5 px-2 py-1 hover:border-white/20"
              aria-expanded={expandedSecrets}
              aria-controls="sa-secrets-list"
            >
              {expandedSecrets ? "Mostrar menos" : `Mostrar todos (${sa.secrets.length})`}
            </button>
          )}
        </div>

        {sa.secrets?.length ? (
          <ul id="sa-secrets-list" className="text-sm space-y-2">
            <AnimatePresence initial={false}>
              {(expandedSecrets ? sa.secrets : sa.secrets.slice(0, 6)).map((s, i) => (
                <motion.li
                  key={`${s.name}-${i}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="rounded border border-white/10 bg-white/5 p-3 flex items-center justify-between"
                >
                  <span className="text-gray-100">{s.name}</span>
                  <span className="text-xs text-gray-400">{s.type}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="text-sm text-gray-400" role="status">
            Sem segredos.
          </div>
        )}
      </section>

      {/* Tokens (colapsável) */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium">Tokens (JWT)</h4>
          {sa.tokens?.length > 6 && (
            <button
              onClick={() => setExpandedTokens((v) => !v)}
              className="text-xs rounded border border-white/10 bg-white/5 px-2 py-1 hover:border-white/20"
              aria-expanded={expandedTokens}
              aria-controls="sa-tokens-list"
            >
              {expandedTokens ? "Mostrar menos" : `Mostrar todos (${sa.tokens.length})`}
            </button>
          )}
        </div>

        {sa.tokens?.length ? (
          <ul id="sa-tokens-list" className="text-sm space-y-2">
            <AnimatePresence initial={false}>
              {(expandedTokens ? sa.tokens : sa.tokens.slice(0, 6)).map((t, i) => (
                <TokenItem key={i} token={t} />
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="text-sm text-gray-400" role="status">
            Sem tokens.
          </div>
        )}
      </section>
    </div>
  );
}

// ====== Subcomponentes/Helpers ======
function TokenItem({ token }) {
  const [copied, setCopied] = useState(false);

  const copyMasked = async () => {
    try {
      const text = token.jwtMasked || "";
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      alert("Não foi possível copiar o token.");
    }
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      className="rounded border border-white/10 bg-white/5 p-3"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-gray-400">Audience: {token.aud || "-"}</div>
        <button
          onClick={copyMasked}
          className="inline-flex items-center gap-2 rounded border border-white/10 bg-white/5 px-2 py-1 text-[11px] hover:border-white/20"
          aria-label="Copiar token mascarado"
        >
          {copied ? <ClipboardCheck className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
          {copied ? "Copiado" : "Copiar token"}
        </button>
      </div>
      <code className="block text-xs mt-2 break-all text-gray-200">{token.jwtMasked}</code>
    </motion.li>
  );
}

function toYAML(sa) {
  const lines = [];
  lines.push("apiVersion: v1");
  lines.push("kind: ServiceAccount");
  lines.push("metadata:");
  lines.push(`  name: ${sa.name}`);
  lines.push(`  namespace: ${sa.namespace}`);
  if (sa.imagePullSecrets?.length) {
    lines.push("imagePullSecrets:");
    sa.imagePullSecrets.forEach((n) => lines.push(`  - name: ${n}`));
  } else {
    lines.push("imagePullSecrets: []");
  }
  // Observação: por segurança, **não** serializamos tokens/segredos diretamente no YAML.
  return lines.join("\n");
}
