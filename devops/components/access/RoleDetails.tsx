// file: components/access/RoleDetails.tsx
"use client";

import KVTable from "../cluster/KVTable";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clipboard, ClipboardCheck, Download } from "lucide-react";

export default function RoleDetails({ role }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!role) {
    return <div className="text-sm text-gray-400" role="status">Selecione um papel…</div>;
  }

  const isCluster = !role.namespace;
  const rulesCount = role.rules?.length ?? 0;
  const yaml = useMemo(() => toYAML(role), [role]);

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
      a.download = `${role.name}.yaml`;
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
            <h4 className="text-sm font-medium">{role.name}</h4>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded px-2 py-0.5 text-[11px] border ${
                  isCluster
                    ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-200"
                    : "bg-indigo-500/10 border-indigo-400/30 text-indigo-200"
                }`}
              >
                {isCluster ? "ClusterRole" : "Role (namespaced)"}
              </span>
              {!isCluster && (
                <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] border bg-white/5 border-white/10 text-gray-200">
                  ns: {role.namespace}
                </span>
              )}
              <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] border bg-white/5 border-white/10 text-gray-200">
                regras: {rulesCount}
              </span>
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
            ["Tipo", isCluster ? "ClusterRole" : "Role (namespaced)"],
            ["Namespace", role.namespace ?? "—"],
            ["Regras", rulesCount],
            ["Idade", role.age],
          ]}
        />
      </section>

      {/* Regras */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium">Regras</h4>
          {rulesCount > 6 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs rounded border border-white/10 bg-white/5 px-2 py-1 hover:border-white/20"
              aria-expanded={expanded}
              aria-controls="rules-list"
            >
              {expanded ? "Mostrar menos" : `Mostrar todas (${rulesCount})`}
            </button>
          )}
        </div>

        <div id="rules-list" className="space-y-2 text-sm">
          <AnimatePresence initial={false}>
            {(expanded ? role.rules ?? [] : (role.rules ?? []).slice(0, 6)).map((ru, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="rounded border border-white/10 bg-white/5 p-3"
              >
                <Row label="APIGroups">
                  <Chips values={ru.apiGroups?.length ? ru.apiGroups : ["*"]} />
                </Row>
                <Row label="Resources">
                  <Chips values={ru.resources?.length ? ru.resources : ["*"]} />
                </Row>
                <Row label="Verbs">
                  <Chips values={ru.verbs?.length ? ru.verbs : ["*"]} />
                </Row>
                {ru.resourceNames?.length ? (
                  <Row label="Names">
                    <Chips values={ru.resourceNames} />
                  </Row>
                ) : null}
                {ru.nonResourceURLs?.length ? (
                  <Row label="URLs">
                    <Chips values={ru.nonResourceURLs} />
                  </Row>
                ) : null}
              </motion.div>
            ))}
            {!rulesCount && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-gray-400" role="status">
                Sem regras.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

// ==== UI helpers ====
function Row({ label, children }) {
  return (
    <div className="text-gray-200 flex items-start gap-2 py-0.5">
      <span className="text-xs text-gray-400 min-w-[92px]">{label}:</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chips({ values = [] }) {
  return values.map((v, idx) => (
    <span
      key={`${v}-${idx}`}
      className="inline-flex items-center rounded px-2 py-0.5 text-[11px] border bg-white/5 border-white/10 text-gray-100"
      title={v}
    >
      {v}
    </span>
  ));
}

// ==== YAML helper ====
function toYAML(role) {
  const kind = role.namespace ? "Role" : "ClusterRole";
  const lines = [];
  lines.push("apiVersion: rbac.authorization.k8s.io/v1");
  lines.push(`kind: ${kind}`);
  lines.push("metadata:");
  lines.push(`  name: ${role.name}`);
  if (role.namespace) lines.push(`  namespace: ${role.namespace}`);
  if (role.rules?.length) {
    lines.push("rules:");
    role.rules.forEach((r) => {
      lines.push("  - " + serializeKV("apiGroups", r.apiGroups));
      lines.push("    " + serializeKV("resources", r.resources));
      lines.push("    " + serializeKV("verbs", r.verbs));
      if (r.resourceNames?.length) lines.push("    " + serializeKV("resourceNames", r.resourceNames));
      if (r.nonResourceURLs?.length) lines.push("    " + serializeKV("nonResourceURLs", r.nonResourceURLs));
    });
  } else {
    lines.push("rules: []");
  }
  return lines.join("\n");
}

function serializeKV(key, arr) {
  if (!arr || arr.length === 0) return `${key}: ["*"]`;
  return `${key}: [${arr.map((x) => JSON.stringify(x)).join(", ")}]`;
}
