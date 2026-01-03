// file: components/statefulsets/StatefulSetDetails.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { RotateCcw, Trash2, Settings2, SlidersHorizontal } from "lucide-react";
import KVTable from "../cluster/KVTable";
import { motion } from "framer-motion";

const TABS = ["Resumo", "Réplicas", "Atualizações", "VolumeClaims", "Condições", "Eventos", "Template/Selector"];

export default function StatefulSetDetails({ sset, onClose }) {
  const [tab, setTab] = useState(TABS[0]);
  const [desired, setDesired] = useState(sset?.spec?.replicas ?? 1);
  const [partition, setPartition] = useState(String(sset?.updateStrategy?.rollingUpdate?.partition ?? "0"));
  const [loading, setLoading] = useState(null); // 'restart' | 'replicas' | 'partition' | 'delete' | null

  if (!sset) {
    return <div className="text-sm text-gray-400">Selecione um statefulset para ver os detalhes.</div>;
  }

  const s = sset.status || {};
  const u = sset.updateStrategy || { type: "RollingUpdate", rollingUpdate: { partition: "0" } };
  const headless = sset.serviceName || "—";

  const run = useCallback(async (key, fn) => {
    setLoading(key);
    try {
      const maybe = fn?.();
      if (maybe?.then) await maybe;
    } finally {
      setLoading(null);
    }
  }, []);

  const applyReplicas = useCallback(() => {
    // Validação: inteiro >= 0
    const n = Number.isFinite(desired) ? desired : parseInt(String(desired), 10);
    if (Number.isNaN(n) || n < 0) {
      alert("Valor inválido para réplicas. Informe um número inteiro maior ou igual a 0.");
      return;
    }
    // (mock) chamada ao backend
    alert(`(mock) Aplicando ${n} réplicas em ${sset.name}`);
  }, [desired, sset?.name]);

  const applyPartition = useCallback(() => {
    const n = parseInt(String(partition).trim(), 10);
    if (Number.isNaN(n) || n < 0) {
      alert("Valor inválido para partição. Informe um número inteiro maior ou igual a 0.");
      return;
    }
    // validação opcional: partição não maior que réplicas desejadas
    const target = Number.isFinite(desired) ? desired : parseInt(String(desired), 10);
    if (!Number.isNaN(target) && n > target) {
      const ok = confirm(`A partição (${n}) é maior que o total de réplicas pretendido (${target}). Deseja continuar mesmo assim?`);
      if (!ok) return;
    }
    alert(`(mock) Atualizando RollingUpdate.partition para ${n} em ${sset.name}`);
  }, [partition, desired, sset?.name]);

  const doRestart = useCallback(() => {
    alert(`(mock) Rolling restart iniciado em ${sset.name}`);
  }, [sset?.name]);

  const doDelete = useCallback(() => {
    if (confirm(`Tem certeza que deseja excluir o StatefulSet "${sset.name}"? (mock)`)) {
      alert(`(mock) ${sset.name} excluído.`);
    }
  }, [sset?.name]);

  return (
    <div className="space-y-6">
      {/* Ações */}
      <div className="flex items-center gap-2">
        <button onClick={onClose} className="px-2 py-1 text-xs rounded border border-white/10 bg-white/5 hover:border-white/20">Fechar</button>
        <motion.button
          type="button"
          onClick={() => run("restart", doRestart)}
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading === "restart"}
          aria-busy={loading === "restart"}
        >
          {loading === "restart" ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80" aria-hidden="true" /> : <RotateCcw className="h-4 w-4" />}
          Rolling restart
        </motion.button>
        <motion.button
          type="button"
          onClick={() => run("replicas", applyReplicas)}
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading === "replicas"}
          aria-busy={loading === "replicas"}
        >
          {loading === "replicas" ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80" aria-hidden="true" /> : <SlidersHorizontal className="h-4 w-4" />}
          Aplicar réplicas
        </motion.button>
        <motion.button
          type="button"
          onClick={() => run("partition", applyPartition)}
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading === "partition"}
          aria-busy={loading === "partition"}
        >
          {loading === "partition" ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80" aria-hidden="true" /> : <Settings2 className="h-4 w-4" />}
          Atualizar partição
        </motion.button>
        <motion.button
          type="button"
          onClick={() => run("delete", doDelete)}
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading === "delete"}
          aria-busy={loading === "delete"}
        >
          {loading === "delete" ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-rose-300/40 border-t-rose-300/90" aria-hidden="true" /> : <Trash2 className="h-4 w-4" />}
          Excluir
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-sm rounded-lg border ${tab === t ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/5 border-white/10 hover:border-white/20"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Resumo" && <SummaryTab d={sset} headless={headless} />}
      {tab === "Réplicas" && <ReplicasTab d={sset} desired={desired} setDesired={setDesired} onApply={() => run("replicas", applyReplicas)} loading={loading === "replicas"} />}
      {tab === "Atualizações" && <UpdatesTab d={sset} partition={partition} setPartition={setPartition} onApply={() => run("partition", applyPartition)} loading={loading === "partition"} />}
      {tab === "VolumeClaims" && <PVCsTab d={sset} />}
      {tab === "Condições" && <ConditionsTab d={sset} />}
      {tab === "Eventos" && <EventsTab d={sset} />}
      {tab === "Template/Selector" && <TemplateTab d={sset} />}
    </div>
  );
}

/* ---------- TABS ---------- */

function SummaryTab({ d, headless }) {
  const s = d.status;
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Status</h4>
        <KVTable rows={[
          ["Nome", d.name],
          ["Namespace", d.namespace],
          ["Imagem", d.imageTag],
          ["Saúde", d.health],
          ["Serviço headless", headless],
          ["Pod Policy", d.podManagementPolicy],
        ]} />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Réplicas</h4>
        <KVTable rows={[
          ["Desejadas", d.spec.replicas],
          ["Prontas", d.status.readyReplicas ?? 0],
          ["Atualizadas", d.status.updatedReplicas ?? 0],
          ["Correntes", d.status.currentReplicas ?? 0],
        ]} />
      </section>
    </div>
  );
}

function ReplicasTab({ d, desired, setDesired, onApply, loading }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Escalonamento</h4>
      <div className="flex items-center gap-3">
        <label className="sr-only" htmlFor="replicas-input">Número de réplicas</label>
        <input
          id="replicas-input"
          type="number"
          min={0}
          value={desired}
          onChange={(e) => setDesired(Number.isFinite(e.target.valueAsNumber) ? e.target.valueAsNumber : parseInt(e.target.value || "0", 10))}
          onKeyDown={(e) => { if (e.key === "Enter") onApply?.(); }}
          className="w-28 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
          aria-label="Número de réplicas"
        />
        <motion.button
          type="button"
          onClick={onApply}
          className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80 inline-block align-[-2px]" aria-hidden="true" /> : null}
          <span className="ml-2">{loading ? "Aplicando…" : "Aplicar"}</span>
        </motion.button>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <KVTable rows={[
          ["Desejadas", d.spec.replicas],
          ["Prontas", d.status.readyReplicas ?? 0],
          ["Atualizadas", d.status.updatedReplicas ?? 0],
          ["Correntes", d.status.currentReplicas ?? 0],
        ]} />
        <div className="text-sm text-gray-400">
          Dica: Em StatefulSets, a ordem e identidade dos Pods importam. Para atualizações seriais, mantenha <em>PodManagementPolicy</em> = <strong>OrderedReady</strong>.
        </div>
      </div>
    </section>
  );
}

function UpdatesTab({ d, partition, setPartition, onApply, loading }) {
  const u = d.updateStrategy;
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Estratégia</h4>
        <KVTable rows={[
          ["Tipo", u.type],
          ["Partição (atual)", String(u.rollingUpdate?.partition ?? "0")],
        ]} />
        <div className="mt-3">
          <label className="text-sm text-gray-300" htmlFor="partition-input">Nova partição</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              id="partition-input"
              value={partition}
              onChange={(e) => setPartition(e.target.value)}
              className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm w-40"
              placeholder="ex: 0, 1, 2…"
              onKeyDown={(e) => { if (e.key === "Enter") onApply?.(); }}
              aria-label="Valor da nova partição"
            />
            <motion.button
              type="button"
              onClick={onApply}
              className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80 inline-block align-[-2px]" aria-hidden="true" /> : null}
              <span className="ml-2">{loading ? "Aplicando…" : "Aplicar"}</span>
            </motion.button>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            <strong>RollingUpdate.partition</strong> controla quantos pods antigos permanecem enquanto atualiza.
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Pods (ordinais)</h4>
        <ul className="text-sm divide-y divide-white/10">
          {d.pods.map(p => (
            <li key={p.ordinal} className="py-2 flex items-center justify-between">
              <span className="text-gray-200">{p.name} • #{p.ordinal}</span>
              <span className="text-xs text-gray-400">{p.node} • {p.ready ? "Ready" : "NotReady"}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function PVCsTab({ d }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">VolumeClaims por Pod</h4>
      <table className="w-full text-sm">
        <thead className="text-xs text-gray-400">
          <tr>
            <th className="text-left py-2">PVC</th>
            <th className="text-left py-2">Tamanho</th>
            <th className="text-left py-2">Modo</th>
            <th className="text-left py-2">PVC Status</th>
            <th className="text-left py-2">PV</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {d.volumeClaims.map(v => (
            <tr key={v.pvc}>
              <td className="py-2">{v.pvc}</td>
              <td className="py-2">{v.size}</td>
              <td className="py-2">{v.mode}</td>
              <td className="py-2">{v.status}</td>
              <td className="py-2">{v.pv}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex gap-2">
        <button className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Criar snapshot</button>
        <button className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Expandir PVC</button>
      </div>
    </section>
  );
}

function ConditionsTab({ d }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
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
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Eventos recentes</h4>
      <ul className="text-sm divide-y divide-white/10">
        {d.events.map(ev => (
          <li key={ev.id} className="py-2 flex items-start gap-3">
            <span className={`mt-0.5 text-[11px] px-1.5 py-0.5 rounded border ${
              ev.type === "Warning" ? "text-amber-300 bg-amber-500/10 border-amber-500/20" : "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
            }`}>
              {ev.type}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-gray-200 truncate">{ev.message}</div>
              <div className="text-xs text-gray-400">{ev.reason} • {ev.object} • {ev.age}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TemplateTab({ d }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Selector</h4>
        <KVTable rows={Object.entries(d.selector).map(([k, v]) => [k, v])} />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Template (rótulos)</h4>
        {Object.entries(d.template.labels).length === 0
          ? <div className="text-sm text-gray-400">Sem rótulos.</div>
          : <KVTable rows={Object.entries(d.template.labels).map(([k, v]) => [k, v])} />
        }
        <div className="text-xs text-gray-400">
          Containers: {d.template.containers.map(c => `${c.name} (${c.image})`).join(", ")}
        </div>
      </section>
    </div>
  );
}
