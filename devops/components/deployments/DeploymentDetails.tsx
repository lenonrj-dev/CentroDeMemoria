// file: app/components/deployments/DeploymentDetails.tsx
"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Pause, Play, Trash2, History, RefreshCcw } from "lucide-react";
import MiniSpark from "../k8s/MiniSpark";
import KVTable from "../cluster/KVTable";
import { motion } from "framer-motion";

const TABS = ["Resumo", "Réplicas", "Estratégia", "Condições", "Eventos", "Template/Selector"];

export default function DeploymentDetails({ deployment, onClose }) {
  const [tab, setTab] = useState(TABS[0]);
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(!!deployment?.paused);

  const canAct = useMemo(() => !busy, [busy]);

  // Ações mockadas com feedback visual
  const withBusy = async (fn) => {
    if (busy) return;
    setBusy(true);
    try {
      await fn?.();
    } finally {
      setTimeout(() => setBusy(false), 600);
    }
  };

  const onRolloutRestart = () => withBusy(() => alert("(mock) Rollout restart acionado"));
  const onTogglePause = () => withBusy(() => setPaused((p) => !p));
  const onUndoRevision = () => withBusy(() => confirm("Desfazer para a revisão anterior? (mock)"));
  const onDelete = () => withBusy(() => confirm("Excluir este deployment? (mock)"));

  if (!deployment) {
    return <div className="text-sm text-gray-400">Selecione um deployment para ver os detalhes.</div>;
  }

  return (
    <div className="space-y-6" aria-busy={busy ? "true" : "false"}>
      {/* Ações */}
      <div className="flex items-center gap-2" role="toolbar" aria-label="Ações do Deployment">
        <motion.button
          type="button"
          onClick={onClose}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="px-2 py-1 text-xs rounded border border-white/10 bg-white/5 hover:border-white/20"
        >
          Fechar
        </motion.button>

        <motion.button
          type="button"
          onClick={onRolloutRestart}
          disabled={!canAct}
          whileHover={{ scale: canAct ? 1.02 : 1 }}
          whileTap={{ scale: canAct ? 0.98 : 1 }}
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="h-4 w-4" /> Rollout restart
        </motion.button>

        {paused ? (
          <motion.button
            type="button"
            onClick={onTogglePause}
            disabled={!canAct}
            whileHover={{ scale: canAct ? 1.02 : 1 }}
            whileTap={{ scale: canAct ? 0.98 : 1 }}
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-4 w-4" /> Retomar
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={onTogglePause}
            disabled={!canAct}
            whileHover={{ scale: canAct ? 1.02 : 1 }}
            whileTap={{ scale: canAct ? 0.98 : 1 }}
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Pause className="h-4 w-4" /> Pausar
          </motion.button>
        )}

        <motion.button
          type="button"
          onClick={onUndoRevision}
          disabled={!canAct}
          whileHover={{ scale: canAct ? 1.02 : 1 }}
          whileTap={{ scale: canAct ? 0.98 : 1 }}
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <History className="h-4 w-4" /> Desfazer (revision)
        </motion.button>

        <motion.button
          type="button"
          onClick={onDelete}
          disabled={!canAct}
          whileHover={{ scale: canAct ? 1.02 : 1 }}
          whileTap={{ scale: canAct ? 0.98 : 1 }}
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-4 w-4" /> Excluir
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Detalhes do Deployment">
        {TABS.map((t) => (
          <motion.button
            key={t}
            onClick={() => setTab(t)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-3 py-1.5 text-sm rounded-lg border ${
              tab === t ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/5 border-white/10 hover:border-white/20"
            }`}
            role="tab"
            aria-selected={tab === t ? "true" : "false"}
            aria-controls={`panel-${t}`}
          >
            {t}
          </motion.button>
        ))}
      </div>

      {tab === "Resumo" && <SummaryTab d={{ ...deployment, paused }} />}
      {tab === "Réplicas" && <ReplicasTab d={deployment} canAct={canAct} setBusy={setBusy} />}
      {tab === "Estratégia" && <StrategyTab d={deployment} />}
      {tab === "Condições" && <ConditionsTab d={deployment} />}
      {tab === "Eventos" && <EventsTab d={deployment} />}
      {tab === "Template/Selector" && <TemplateTab d={deployment} />}
    </div>
  );
}

/* ---------- TABS ---------- */

function SummaryTab({ d }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Status</h4>
        <KVTable
          rows={[
            ["Nome", d.name],
            ["Namespace", d.namespace],
            ["Imagem", d.imageTag],
            ["Status", d.status],
            ["Pausado", d.paused ? "Sim" : "Não"],
          ]}
        />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Réplicas</h4>
        <KVTable
          rows={[
            ["Desejadas", d.replicas.desired],
            ["Atualizadas", d.replicas.updated],
            ["Disponíveis", d.replicas.available],
            ["Indisponíveis", d.replicas.unavailable],
          ]}
        />
      </section>

      <section id="panel-Resumo" className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3 lg:col-span-2">
        <h4 className="text-sm font-medium">Progresso (últimos 10 passos)</h4>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <MiniSpark points={d.rolloutProgress} height={120} strokeWidth={2} filled ariaLabel="Progresso do rollout" />
        </motion.div>
      </section>
    </div>
  );
}

function ReplicasTab({ d, canAct, setBusy }) {
  const [desired, setDesired] = useState(d.replicas.desired);
  const disabled = !canAct || desired < 0 || Number.isNaN(desired);

  return (
    <section id="panel-Réplicas" className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Escalonamento</h4>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={0}
          value={desired}
          onChange={(e) => setDesired(parseInt(e.target.value || 0))}
          className="w-28 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
          aria-label="Número de réplicas desejadas"
        />
        <motion.button
          type="button"
          disabled={disabled}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          onClick={() => {
            setBusy?.(true);
            setTimeout(() => {
              alert(`(mock) Aplicado: ${desired} réplicas`);
              setBusy?.(false);
            }, 600);
          }}
          className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Aplicar
        </motion.button>
        <motion.button
          type="button"
          disabled={!canAct}
          whileHover={{ scale: canAct ? 1.02 : 1 }}
          whileTap={{ scale: canAct ? 0.98 : 1 }}
          className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Reiniciar pods do ReplicaSet atual (mock)"
        >
          <RefreshCcw className="h-4 w-4" /> Reiniciar pods
        </motion.button>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <KVTable
          rows={[
            ["Desejadas", d.replicas.desired],
            ["Atualizadas", d.replicas.updated],
            ["Disponíveis", d.replicas.available],
            ["Indisponíveis", d.replicas.unavailable],
          ]}
        />
        <div className="text-sm text-gray-400">
          Dica: para HPA, o número de réplicas pode ser alterado dinamicamente. Configure os alvos de CPU/Memória no HPA ligado a este deployment.
        </div>
      </div>
    </section>
  );
}

function StrategyTab({ d }) {
  const s = d.strategy;
  return (
    <div className="grid lg:grid-cols-2 gap-4" id="panel-Estratégia">
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="text-sm font-medium mb-3">RollingUpdate</h4>
        <KVTable rows={[["Max Surge", s.maxSurge], ["Max Unavailable", s.maxUnavailable]]} />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="text-sm font-medium mb-3">Revision</h4>
        <KVTable rows={[["Revision atual", d.revision.current], ["Última mudança", d.revision.lastChange]]} />
        <div className="mt-3">
          <button className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Desfazer para revision anterior</button>
        </div>
      </section>
    </div>
  );
}

function ConditionsTab({ d }) {
  return (
    <section id="panel-Condições" className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Condições</h4>
      <table className="w-full text-sm">
        <thead className="text-xs text-gray-400">
          <tr>
            <th className="text-left py-2">Tipo</th>
            <th className="text-left py-2">Status</th>
            <th className="text-left py-2">Últ. Atualização</th>
            <th className="text-left py-2">Transição</th>
            <th className="text-left py-2">Motivo</th>
            <th className="text-left py-2">Mensagem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {d.conditions.map((c, i) => (
            <tr key={i}>
              <td className="py-2">{c.type}</td>
              <td className="py-2">{c.status}</td>
              <td className="py-2">{c.lastUpdate}</td>
              <td className="py-2">{c.lastTransition}</td>
              <td className="py-2">{c.reason}</td>
              <td className="py-2">{c.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function EventsTab({ d }) {
  return (
    <section id="panel-Eventos" className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Eventos recentes</h4>
      <ul className="text-sm divide-y divide-white/10">
        {d.events.map((ev) => (
          <li key={ev.id} className="py-2 flex items-start gap-3">
            <span
              className={`mt-0.5 text-[11px] px-1.5 py-0.5 rounded border ${
                ev.type === "Warning"
                  ? "text-amber-300 bg-amber-500/10 border-amber-500/20"
                  : "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
              }`}
            >
              {ev.type}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-gray-200 truncate">{ev.message}</div>
              <div className="text-xs text-gray-400">
                {ev.reason} • {ev.object} • {ev.age}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TemplateTab({ d }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4" id="panel-Template/Selector">
      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Selector</h4>
        <KVTable rows={Object.entries(d.selector).map(([k, v]) => [k, v])} />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Template (rótulos)</h4>
        {Object.entries(d.template.labels).length === 0 ? (
          <div className="text-sm text-gray-400">Sem rótulos.</div>
        ) : (
          <KVTable rows={Object.entries(d.template.labels).map(([k, v]) => [k, v])} />
        )}
        <div className="mt-3 text-xs text-gray-400">
          Containers: {d.template.containers.map((c) => `${c.name} (${c.image})`).join(", ")}
        </div>
      </section>
    </div>
  );
}
