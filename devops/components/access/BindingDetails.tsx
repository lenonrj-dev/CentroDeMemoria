// file: components/access/BindingDetails.tsx
"use client";

import KVTable from "../cluster/KVTable";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { Clipboard, ClipboardCheck, Download } from "lucide-react";

export default function BindingDetails({ binding }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!binding) {
    return (
      <div className="text-sm text-gray-400" role="status">
        Selecione uma vinculação…
      </div>
    );
  }

  const isCluster = !binding.namespace;

  const yaml = useMemo(() => toYAML(binding), [binding]);

  const handleCopy = async () => {
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
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      alert("Não foi possível copiar o YAML.");
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([yaml], { type: "text/yaml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${binding.name}.yaml`;
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
            <h4 className="text-sm font-medium">{binding.name}</h4>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded px-2 py-0.5 text-[11px] border ${
                  isCluster
                    ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-200"
                    : "bg-indigo-500/10 border-indigo-400/30 text-indigo-200"
                }`}
              >
                {isCluster ? "ClusterRoleBinding" : "RoleBinding"}
              </span>
              {!isCluster && (
                <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] border bg-white/5 border-white/10 text-gray-200">
                  ns: {binding.namespace}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:border-white/20"
              aria-label="Copiar YAML"
            >
              {copied ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
              {copied ? "Copiado" : "Copiar YAML"}
            </button>
            <button
              onClick={handleDownload}
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
            ["Tipo", isCluster ? "ClusterRoleBinding" : "RoleBinding"],
            ["Namespace", binding.namespace ?? "—"],
            ["Role", `${binding.roleRef?.kind}/${binding.roleRef?.name}`],
            ["Sujeitos", binding.subjects?.length ?? 0],
            ["Idade", binding.age],
          ]}
        />
      </section>

      {/* Lista de sujeitos com colapso/expandir */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium">Sujeitos</h4>
          {binding.subjects.length > 6 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs rounded border border-white/10 bg-white/5 px-2 py-1 hover:border-white/20"
              aria-expanded={expanded}
              aria-controls="subjects-list"
            >
              {expanded ? "Mostrar menos" : `Mostrar todos (${binding.subjects.length})`}
            </button>
          )}
        </div>

        <ul id="subjects-list" className="text-sm space-y-2">
          <AnimatePresence initial={false}>
            {(expanded ? binding.subjects : binding.subjects.slice(0, 6)).map((s, i) => (
              <motion.li
                key={`${s.kind}-${s.name}-${i}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="rounded border border-white/10 bg-white/5 p-3 flex items-center justify-between"
              >
                <div>
                  <span className="text-gray-300">{s.kind}</span>: <span className="text-gray-100">{s.name}</span>{" "}
                  {s.namespace ? <span className="text-gray-400">({s.namespace})</span> : null}
                </div>
                <div className="text-xs text-gray-400">{s.apiGroup || "—"}</div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </section>
    </div>
  );
}

// ===== Helpers =====
function toYAML(binding) {
  // Serializador simples para o shape de RoleBinding/ClusterRoleBinding usado aqui
  const kind = binding.namespace ? "RoleBinding" : "ClusterRoleBinding";
  const lines = [];
  lines.push("apiVersion: rbac.authorization.k8s.io/v1");
  lines.push(`kind: ${kind}`);
  lines.push("metadata:");
  lines.push(`  name: ${binding.name}`);
  if (binding.namespace) lines.push(`  namespace: ${binding.namespace}`);
  lines.push("roleRef:");
  lines.push(`  apiGroup: ${binding.roleRef?.apiGroup || "rbac.authorization.k8s.io"}`);
  lines.push(`  kind: ${binding.roleRef?.kind}`);
  lines.push(`  name: ${binding.roleRef?.name}`);
  lines.push("subjects:");
  (binding.subjects || []).forEach((s) => {
    lines.push("  - kind: " + s.kind);
    if (s.apiGroup) lines.push("    apiGroup: " + s.apiGroup);
    lines.push("    name: " + s.name);
    if (s.namespace) lines.push("    namespace: " + s.namespace);
  });
  return lines.join("\n");
}
