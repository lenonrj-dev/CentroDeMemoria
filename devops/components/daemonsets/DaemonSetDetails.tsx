// file: components/daemonsets/DaemonSetDetails.tsx
"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Trash2, Settings2 } from "lucide-react";
import { motion } from "framer-motion";
import KVTable from "../cluster/KVTable";

const TABS = ["Resumo", "Pods Alvejados", "Estratégia", "Condições", "Eventos", "Template/Selector"];

export default function DaemonSetDetails({ ds, onClose }) {
  const [tab, setTab] = useState(TABS[0]);
  const [maxUnavailable, setMaxUnavailable] = useState(ds?.strategy?.rollingUpdate?.maxUnavailable || "25%");
  const [errorMU, setErrorMU] = useState("");

  const isValidMU = useMemo(() => {
    const v = String(maxUnavailable).trim();
    if (/^\d+%$/.test(v)) return true;
    if (/^\d+$/.test(v)) return Number(v) >= 0;
    return false;
  }, [maxUnavailable]);

  useMemo(() => {
    if (!maxUnavailable) return setErrorMU("Informe um valor (ex.: 25% ou 1).");
    setErrorMU(isValidMU ? "" : "Valor inválido. Use percentual (ex.: 25%) ou inteiro ≥ 0 (ex.: 1).");
  }, [maxUnavailable, isValidMU]);

  if (!ds) {
    return <div className="text-sm text-gray-400">Selecione um daemonset para ver os detalhes.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Ações */}
      <div className="flex items-center gap-2">
        <button
          onClick={onClose}
          type="button"
          className="px-2 py-1 text-xs rounded border border-white/10 bg-white/5 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
        >
          Fechar
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          aria-label="Executar reinício gradual (rolling restart)"
        >
          <RotateCcw className="h-4 w-4" /> Reinício gradual
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
        >
          <Settings2 className="h-4 w-4" /> Atualizar estratégia
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
        >
          <Trash2 className="h-4 w-4" /> Excluir
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/40 ${
              tab === t ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/5 border-white/10 hover:border-white/20"
            }`}
          >
            {t}
          </motion.button>
        ))}
      </div>

      {tab === "Resumo" && <SummaryTab d={ds} />}
      {tab === "Pods Alvejados" && <PodsTab d={ds} />}
      {tab === "Estratégia" && (
        <StrategyTab
          d={ds}
          maxUnavailable={maxUnavailable}
          setMaxUnavailable={setMaxUnavailable}
          isValidMU={isValidMU}
          errorMU={errorMU}
        />
      )}
      {tab === "Condições" && <ConditionsTab d={ds} />}
      {tab === "Eventos" && <EventsTab d={ds} />}
      {tab === "Template/Selector" && <TemplateTab d={ds} />}
    </div>
  );
}

/* ---------- TABS ---------- */

function SummaryTab({ d }) {
  const s = d.status;
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Status</h4>
        <KVTable
          rows={[
            ["Nome", d.name],
            ["Namespace", d.namespace],
            ["Imagem", d.imageTag],
            ["Saúde", d.health],
          ]}
        />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Réplicas por nó</h4>
        <KVTable
          rows={[
            ["Desejados (nós)", s.desiredNumberScheduled],
            ["Agendados", s.currentNumberScheduled],
            ["Atualizados", s.updatedNumberScheduled],
            ["Prontos", s.numberReady],
            ["Disponíveis", s.numberAvailable ?? "—"],
            ["Fora de nó (misscheduled)", s.numberMisscheduled],
          ]}
        />
      </section>
    </div>
  );
}

function PodsTab({ d }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Nós alvo e pods</h4>
      <ul className="text-sm divide-y divide-white/10">
        {d.targetedNodes.map((n) => (
          <li key={n.name} className="py-2 flex items-center justify-between">
            <span className="text-gray-200">{n.name}</span>
            <span className="text-xs text-gray-400">
              {n.podName} • {n.ready ? "Pronto" : "Não pronto"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StrategyTab({ d, maxUnavailable, setMaxUnavailable, isValidMU, errorMU }) {
  const ru = d.strategy?.rollingUpdate || { maxUnavailable: "25%" };
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">RollingUpdate</h4>
        <KVTable rows={[["Max Unavailable (atual)", ru.maxUnavailable], ["Tipo", d.strategy.type]]} />

        <div className="mt-3">
          <label className="text-sm text-gray-300">Novo Max Unavailable</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              value={maxUnavailable}
              onChange={(e) => setMaxUnavailable(e.target.value)}
              className={`bg-[#0e141b] border rounded-lg px-3 py-2 text-sm w-40 ${
                errorMU ? "border-rose-500/40 focus:ring-rose-500/30" : "border-white/10 focus:ring-cyan-500/40"
              } focus:outline-none focus:ring-2`}
              placeholder="ex: 25% ou 1"
              aria-invalid={!!errorMU}
              aria-describedby="mu-help mu-error"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              disabled={!isValidMU}
              className={`text-sm px-3 py-1.5 rounded border ${
                !isValidMU
                  ? "opacity-50 cursor-not-allowed border-white/10 bg-white/5"
                  : "border-white/10 bg-white/5 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              }`}
              onClick={() => alert(`(mock) Aplicar maxUnavailable=${maxUnavailable}`)}
              aria-label="Aplicar novo Max Unavailable"
            >
              Aplicar
            </motion.button>
          </div>
          <div id="mu-help" className="text-xs text-gray-400 mt-1">
            Aceita número absoluto (ex.: 1) ou porcentagem (ex.: 25%).
          </div>
          {errorMU && (
            <div id="mu-error" className="text-xs text-rose-300 mt-1">
              {errorMU}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Selecionador (nodeSelector / tolerations)</h4>
        {d.nodeSelector && Object.keys(d.nodeSelector).length > 0 ? (
          <KVTable rows={Object.entries(d.nodeSelector).map(([k, v]) => [k, v])} />
        ) : (
          <div className="text-sm text-gray-400">Sem nodeSelector.</div>
        )}
        <div className="text-xs text-gray-400">
          Tolerations:{" "}
          {d.tolerations?.length ? d.tolerations.map((t) => `${t.key}:${t.effect}`).join(", ") : "—"}
        </div>
      </section>
    </div>
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
    <div className="grid lg:grid-cols-2 gap-4">
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
        <div className="text-xs text-gray-400">
          Containers: {d.template.containers.map((c) => `${c.name} (${c.image})`).join(", ")}
        </div>
      </section>
    </div>
  );
}
