// file: components/storage/PVCDetails.tsx
"use client";

import KVTable from "../cluster/KVTable";
import Status from "./Status";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function PVCDetails({ pvc }) {
  if (!pvc) return <div className="text-sm text-gray-400">Selecione um PVC…</div>;

  const [expanding, setExpanding] = useState(false);
  const [newSizeGi, setNewSizeGi] = useState(String(pvc?.requestGi ?? ""));
  const [snapInProgress, setSnapInProgress] = useState(false);

  const usedGi = Number(pvc?.usedGi ?? 0);
  const reqGi = Number(pvc?.requestGi ?? 0);
  const percent = useMemo(() => {
    if (!reqGi) return 0;
    const p = (usedGi / reqGi) * 100;
    return Number.isFinite(p) ? Math.min(100, Math.max(0, p)) : 0;
  }, [usedGi, reqGi]);

  const selectorStr = useMemo(() => {
    const sel = pvc?.selector || {};
    return Object.keys(sel).length ? JSON.stringify(sel) : "—";
  }, [pvc]);

  const onCopyName = async () => {
    try {
      await navigator.clipboard.writeText(pvc.name);
      alert("Nome do PVC copiado para a área de transferência (mock).");
    } catch {
      alert("Não foi possível copiar automaticamente. Selecione e copie manualmente.");
    }
  };

  const onCreateSnapshot = async () => {
    setSnapInProgress(true);
    setTimeout(() => {
      setSnapInProgress(false);
      alert(`(mock) Snapshot criado para ${pvc.name}`);
    }, 800);
  };

  const onExpand = () => {
    const val = Number(newSizeGi);
    if (!Number.isFinite(val) || val <= reqGi) {
      alert("Informe um tamanho válido, maior que a requisição atual.");
      return;
    }
    setExpanding(true);
    setTimeout(() => {
      setExpanding(false);
      alert(`(mock) Solicitação de expansão enviada: ${reqGi} → ${val} Gi`);
    }, 900);
  };

  return (
    <div className="space-y-4">
      {/* Ações rápidas */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onCopyName}
          className="px-3 py-1.5 text-sm rounded-lg border border-white/10 bg-white/5 hover:border-white/20"
          aria-label="Copiar nome do PVC"
          title="Copiar nome"
        >
          Copiar nome
        </button>
        <button
          onClick={onCreateSnapshot}
          disabled={snapInProgress}
          className="px-3 py-1.5 text-sm rounded-lg border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-60"
          aria-label="Criar snapshot do PVC"
        >
          {snapInProgress ? "Criando snapshot…" : "Criar snapshot"}
        </button>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="text-sm font-medium mb-2">{pvc.name}</h4>
        <KVTable
          rows={[
            ["Fase", <Status key="st" value={pvc.phase} />],
            ["Namespace", pvc.namespace],
            ["StorageClass", pvc.storageClass ?? "—"],
            ["Requisição", `${pvc.requestGi} Gi`],
            ["Uso (mock)", `${usedGi} Gi`],
            ["Acesso", pvc.accessModes.join(", ")],
            ["Volume", pvc.volume ?? "—"],
            ["Selector", selectorStr],
            ["Idade", pvc.age],
          ]}
        />

        {/* Barra de uso */}
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
            aria-label="Uso do PVC em porcentagem"
            title={`Uso: ${percent.toFixed(0)}%`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className={`h-full ${percent > 85 ? "bg-rose-500/70" : percent > 70 ? "bg-amber-500/70" : "bg-cyan-500/70"}`}
            />
          </div>
          <div className="mt-1 text-xs text-gray-400" aria-live="polite">
            {usedGi} Gi de {reqGi} Gi
          </div>
        </div>

        {/* Expansão de capacidade (mock) */}
        <div className="mt-4 grid sm:grid-cols-[1fr_auto] gap-2 sm:gap-3">
          <label className="text-sm text-gray-300 flex items-center gap-2">
            Novo tamanho (Gi)
            <input
              value={newSizeGi}
              onChange={(e) => setNewSizeGi(e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              className="ml-auto sm:ml-0 w-32 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
              aria-label="Novo tamanho em GiB"
              placeholder={`${reqGi + 1}`}
            />
          </label>
          <button
            onClick={onExpand}
            disabled={expanding}
            className="justify-self-start sm:justify-self-auto px-3 py-2 text-sm rounded-lg border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-60"
            aria-label="Aplicar expansão de capacidade"
            title="Aplicar expansão"
          >
            {expanding ? "Aplicando…" : "Expandir PVC"}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="text-sm font-medium mb-2">Eventos</h4>
        {pvc.events.length ? (
          <ul className="text-sm divide-y divide-white/10">
            {pvc.events.map((e) => (
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
