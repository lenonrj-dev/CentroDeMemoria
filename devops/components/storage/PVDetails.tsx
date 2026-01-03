// file: components/storage/PVDetails.tsx
"use client";

import KVTable from "../cluster/KVTable";
import Status from "./Status";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function PVDetails({ pv }) {
  if (!pv) return <div className="text-sm text-gray-400">Selecione um PV…</div>;

  // estados locais (mock de ações)
  const [releasing, setReleasing] = useState(false);
  const [policy, setPolicy] = useState(pv.reclaimPolicy || "Retain");

  // uso (mock): alguns datasets podem expor usedGi; se não, assume 0
  const usedGi = Number(pv?.usedGi ?? 0);
  const capGi = Number(pv?.capacityGi ?? 0);
  const percent = useMemo(() => {
    if (!capGi) return 0;
    const p = (usedGi / capGi) * 100;
    return Number.isFinite(p) ? Math.min(100, Math.max(0, p)) : 0;
  }, [usedGi, capGi]);

  const onCopyName = async () => {
    try {
      await navigator.clipboard.writeText(pv.name);
      alert("Nome do PV copiado (mock).");
    } catch {
      alert("Falha ao copiar automaticamente. Copie manualmente.");
    }
  };

  const onCopyClaim = async () => {
    if (!pv.claim) return;
    try {
      await navigator.clipboard.writeText(`${pv.claim.namespace}/${pv.claim.name}`);
      alert("Referência do Claim copiada (mock).");
    } catch {
      alert("Falha ao copiar automaticamente. Copie manualmente.");
    }
  };

  const onRelease = () => {
    if (!confirm(`Liberar PV ${pv.name}? (mock)`)) return;
    setReleasing(true);
    setTimeout(() => {
      setReleasing(false);
      alert(`(mock) Solicitação de liberação enviada para ${pv.name}.`);
    }, 900);
  };

  return (
    <div className="space-y-4">
      {/* Ações rápidas */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onCopyName}
          className="px-3 py-1.5 text-sm rounded-lg border border-white/10 bg-white/5 hover:border-white/20"
          aria-label="Copiar nome do PV"
          title="Copiar nome"
        >
          Copiar nome
        </button>
        <button
          onClick={onCopyClaim}
          disabled={!pv.claim}
          className="px-3 py-1.5 text-sm rounded-lg border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-60"
          aria-label="Copiar referência do Claim"
          title={pv.claim ? "Copiar Claim" : "Sem Claim associado"}
        >
          Copiar Claim
        </button>
        <button
          onClick={onRelease}
          disabled={releasing}
          className="px-3 py-1.5 text-sm rounded-lg border border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50 disabled:opacity-60"
          aria-label="Liberar PV"
          title="Liberar PV (mock)"
        >
          {releasing ? "Liberando…" : "Liberar PV"}
        </button>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="text-sm font-medium mb-2">{pv.name}</h4>
        <KVTable
          rows={[
            ["Fase", <Status key="st" value={pv.phase} />],
            ["StorageClass", pv.storageClass ?? "—"],
            ["Capacidade", `${pv.capacityGi} Gi`],
            ["Acesso", pv.accessModes.join(", ")],
            [
              "Reclaim Policy",
              (
                <span key="pol" className="inline-flex items-center gap-2">
                  <span className="text-gray-200">{policy}</span>
                  <select
                    value={policy}
                    onChange={(e) => setPolicy(e.target.value)}
                    className="bg-[#0e141b] border border-white/10 rounded px-2 py-1 text-xs"
                    aria-label="Alterar Reclaim Policy (mock)"
                    title="Alterar Reclaim Policy (mock)"
                  >
                    <option>Retain</option>
                    <option>Delete</option>
                    <option>Recycle</option>
                  </select>
                </span>
              ),
            ],
            ["Volume Mode", pv.volumeMode],
            ["Provisioner", pv.provisioner ?? "—"],
            ["Claim", pv.claim ? `${pv.claim.namespace}/${pv.claim.name}` : "—"],
            ["Idade", pv.age],
          ]}
        />

        {/* Barra de uso (mock) */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Uso do volume</span>
            <span>{percent.toFixed(0)}%</span>
          </div>
          <div
            className="h-2 rounded bg-white/10 overflow-hidden"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Uso do PV em porcentagem"
            title={`Uso: ${percent.toFixed(0)}%`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className={`h-full ${
                percent > 85 ? "bg-rose-500/70" : percent > 70 ? "bg-amber-500/70" : "bg-cyan-500/70"
              }`}
            />
          </div>
          <div className="mt-1 text-xs text-gray-400" aria-live="polite">
            {usedGi} Gi de {capGi} Gi
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="text-sm font-medium mb-2">Eventos</h4>
        {pv.events.length ? (
          <ul className="text-sm divide-y divide-white/10">
            {pv.events.map((e) => (
              <li key={e.id} className="py-2 flex items-start gap-3">
                <span
                  className={`mt-0.5 text-[11px] px-1.5 py-0.5 rounded border ${
                    e.type === "Warning"
                      ? "text-amber-300 bg-amber-500/10 border-amber-500/20"
                      : "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
                  }`}
                >
                  {e.type}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-200 truncate">{e.message}</div>
                  <div className="text-xs text-gray-400">
                    {e.reason} • {e.age}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-400">Sem eventos.</div>
        )}
      </section>
    </div>
  );
}
