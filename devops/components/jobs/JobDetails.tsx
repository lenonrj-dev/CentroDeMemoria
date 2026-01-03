// file: components/jobs/JobDetails.tsx
"use client";

import { useState } from "react";
import { PlayCircle, Square, Trash2, PlusCircle, CheckCircle2 } from "lucide-react";
import KVTable from "../cluster/KVTable";

const TABS = ["Resumo", "Execução", "Pods", "Condições", "Eventos", "Template"];

export default function JobDetails({ job, onClose }) {
  const [tab, setTab] = useState(TABS[0]);
  const [newBackoff, setNewBackoff] = useState(String(job?.backoffLimit ?? "6"));

  if (!job) {
    return <div className="text-sm text-gray-400">Selecione um job para ver os detalhes.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Ações */}
      <div className="flex flex-wrap items-center gap-2 gap-y-2">
        <button onClick={onClose} className="px-2 py-1 text-xs rounded border border-white/10 bg-white/5 hover:border-white/20">Fechar</button>
        <button className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20">
          <PlayCircle className="h-4 w-4" /> Reexecutar
        </button>
        <button className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20">
          <Square className="h-4 w-4" /> Parar
        </button>
        <button className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20">
          <PlusCircle className="h-4 w-4" /> Aumentar backoff
        </button>
        <button className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20">
          <CheckCircle2 className="h-4 w-4" /> Forçar conclusão
        </button>
        <button className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50">
          <Trash2 className="h-4 w-4" /> Excluir
        </button>
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

      {tab === "Resumo" && <SummaryTab d={job} />}
      {tab === "Execução" && <RunTab d={job} newBackoff={newBackoff} setNewBackoff={setNewBackoff} />}
      {tab === "Pods" && <PodsTab d={job} />}
      {tab === "Condições" && <ConditionsTab d={job} />}
      {tab === "Eventos" && <EventsTab d={job} />}
      {tab === "Template" && <TemplateTab d={job} />}
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
            ["Status", d.status],
            ["Dono", d.owner || "—"],
            ["Imagem", d.imageTag || "—"],
          ]}
        />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Contagens</h4>
        <KVTable
          rows={[
            ["Completions", `${d.succeeded ?? 0}/${d.completions ?? 1}`],
            ["Paralelismo", d.parallelism ?? 1],
            ["Ativos", d.active ?? 0],
            ["Falhas", d.failed ?? 0],
          ]}
        />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3 lg:col-span-2">
        <h4 className="text-sm font-medium">Tempo</h4>
        <KVTable
          rows={[
            ["Início", d.startedAt || "—"],
            ["Conclusão", d.completedAt || "—"],
            ["Duração (s)", d.durationSec ?? "—"],
          ]}
        />
      </section>
    </div>
  );
}

function RunTab({ d, newBackoff, setNewBackoff, error, onApply }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="text-sm font-medium mb-3">Execução</h4>
        <KVTable
          rows={[
            ["Backoff Limit", d.backoffLimit ?? 6],
            ["TTL após fim (s)", d.ttlSecondsAfterFinished ?? "—"],
            ["Reinício", d.restartPolicy || "OnFailure"],
            ["Completions", d.completions ?? 1],
            ["Paralelismo", d.parallelism ?? 1],
          ]}
        />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="text-sm font-medium mb-2">Ajustes rápidos</h4>
        <div className="space-y-2">
          <label htmlFor="input-backoff" className="text-sm text-gray-300">
            Novo Backoff Limit
          </label>
          <div className="flex items-center gap-2">
            <input
              id="input-backoff"
              value={newBackoff}
              onChange={(e) => setNewBackoff(e.target.value)}
              inputMode="numeric"
              aria-invalid={!!error}
              aria-describedby={error ? "backoff-error" : undefined}
              className={`bg-[#0e141b] border rounded-lg px-3 py-2 text-sm w-36 outline-none focus:ring-2 focus:ring-cyan-500/40 ${
                error ? "border-rose-500/60" : "border-white/10"
              }`}
              placeholder="ex: 6"
            />
            <motion.button
              type="button"
              onClick={onApply}
              className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Aplicar
            </motion.button>
          </div>
          {error && (
            <div id="backoff-error" className="text-xs text-rose-300">
              {error}
            </div>
          )}
          <div className="text-xs text-gray-400">
            *Backoff Limit* controla quantas falhas são permitidas antes do Job marcar *Failed*.
          </div>
        </div>
      </section>
    </div>
  );
}

function PodsTab({ d }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Pods</h4>
      <table className="w-full text-sm">
        <thead className="text-xs text-gray-400">
          <tr>
            <th className="text-left py-2">Pod</th>
            <th className="text-left py-2">Nó</th>
            <th className="text-left py-2">Fase</th>
            <th className="text-left py-2">Reinícios</th>
            <th className="text-left py-2">Idade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {d.pods.map((p) => (
            <tr key={p.name}>
              <td className="py-2">{p.name}</td>
              <td className="py-2">{p.node}</td>
              <td className="py-2">{p.phase}</td>
              <td className="py-2">{p.restarts ?? 0}</td>
              <td className="py-2">{p.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

/* ---------- UI ---------- */
function ActionBtn({ title, icon: Icon, onClick, disabled, variant = "default", pulse = false }) {
  const base =
    "inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed";
  const skin =
    variant === "danger"
      ? "border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50"
      : "border-white/10 bg-white/5 hover:border-white/20";
  return (
    <motion.button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${skin}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      animate={pulse && !disabled ? { opacity: [0.9, 1, 0.9] } : undefined}
      transition={pulse && !disabled ? { duration: 1.6, repeat: Infinity } : undefined}
    >
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      {title}
    </motion.button>
  );
}
