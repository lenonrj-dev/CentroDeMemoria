// file: components/cronjobs/CronJobDetails.tsx
"use client";

import { useMemo, useState } from "react";
import { PlayCircle, Pause, Play, Trash2, Settings, History, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import KVTable from "../cluster/KVTable";

const TABS = ["Resumo", "Agendamento", "Histórico", "Jobs Ativos", "Condições", "Eventos", "Template"];

export default function CronJobDetails({ cj, onClose }) {
  const [tab, setTab] = useState(TABS[0]);
  const [newSchedule, setNewSchedule] = useState(cj?.schedule ?? "*/5 * * * *");
  const [succHist, setSuccHist] = useState(String(cj?.history?.successful ?? "3"));
  const [failHist, setFailHist] = useState(String(cj?.history?.failed ?? "1"));

  // busy flags por ação
  const [busy, setBusy] = useState({
    run: false,
    toggle: false,
    applySchedule: false,
    applyHist: false,
    delete: false,
  });

  const cronError = useMemo(() => validateCron(newSchedule), [newSchedule]);
  const succError = useMemo(() => validateInt(succHist), [succHist]);
  const failError = useMemo(() => validateInt(failHist), [failHist]);

  if (!cj) {
    return <div className="text-sm text-gray-400">Selecione um cronjob para ver os detalhes.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Ações */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onClose}
          className="px-2 py-1 text-xs rounded border border-white/10 bg-white/5 hover:border-white/20"
        >
          Fechar
        </button>

        <ActionBtn
          icon={PlayCircle}
          label="Executar agora"
          loading={busy.run}
          onClick={async () => {
            if (!confirm(`Executar o CronJob "${cj.name}" agora?`)) return;
            setBusy((b) => ({ ...b, run: true }));
            await delay(900);
            setBusy((b) => ({ ...b, run: false }));
            alert("(mock) Execução disparada.");
          }}
        />

        {cj.suspend ? (
          <ActionBtn
            icon={Play}
            label="Retomar"
            loading={busy.toggle}
            onClick={async () => {
              if (!confirm(`Retomar o CronJob "${cj.name}"?`)) return;
              setBusy((b) => ({ ...b, toggle: true }));
              await delay(800);
              setBusy((b) => ({ ...b, toggle: false }));
              alert("(mock) CronJob retomado.");
            }}
          />
        ) : (
          <ActionBtn
            icon={Pause}
            label="Suspender"
            loading={busy.toggle}
            onClick={async () => {
              if (!confirm(`Suspender o CronJob "${cj.name}"?`)) return;
              setBusy((b) => ({ ...b, toggle: true }));
              await delay(800);
              setBusy((b) => ({ ...b, toggle: false }));
              alert("(mock) CronJob suspenso.");
            }}
          />
        )}

        <ActionBtn
          icon={Settings}
          label="Atualizar schedule"
          disabled={!!cronError}
          loading={busy.applySchedule}
          onClick={async () => {
            if (cronError) {
              alert(`Schedule inválido: ${cronError}`);
              return;
            }
            if (!confirm(`Aplicar novo schedule "${newSchedule}" para "${cj.name}"?`)) return;
            setBusy((b) => ({ ...b, applySchedule: true }));
            await delay(1000);
            setBusy((b) => ({ ...b, applySchedule: false }));
            alert("(mock) Schedule atualizado.");
          }}
        />

        <ActionBtn
          icon={History}
          label="Ajustar limites"
          disabled={!!succError || !!failError}
          loading={busy.applyHist}
          onClick={async () => {
            if (succError || failError) {
              alert(`Corrija os campos de histórico:\n- Sucesso: ${succError || "ok"}\n- Falhas: ${failError || "ok"}`);
              return;
            }
            if (!confirm(`Aplicar limites de histórico (${succHist}/${failHist}) para "${cj.name}"?`)) return;
            setBusy((b) => ({ ...b, applyHist: true }));
            await delay(900);
            setBusy((b) => ({ ...b, applyHist: false }));
            alert("(mock) Limites de histórico atualizados.");
          }}
        />

        <ActionBtn
          icon={Trash2}
          label="Excluir"
          danger
          loading={busy.delete}
          onClick={async () => {
            if (!confirm(`Tem certeza que deseja excluir o CronJob "${cj.name}"? Esta ação é irreversível.`)) return;
            setBusy((b) => ({ ...b, delete: true }));
            await delay(1100);
            setBusy((b) => ({ ...b, delete: false }));
            alert("(mock) CronJob excluído.");
            onClose?.();
          }}
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-sm rounded-lg border ${
              tab === t ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/5 border-white/10 hover:border-white/20"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Resumo" && <SummaryTab d={cj} />}
      {tab === "Agendamento" && (
        <ScheduleTab
          d={cj}
          newSchedule={newSchedule}
          setNewSchedule={setNewSchedule}
          succHist={succHist}
          setSuccHist={setSuccHist}
          failHist={failHist}
          setFailHist={setFailHist}
          cronError={cronError}
          succError={succError}
          failError={failError}
        />
      )}
      {tab === "Histórico" && <HistoryTab d={cj} />}
      {tab === "Jobs Ativos" && <ActiveJobsTab d={cj} />}
      {tab === "Condições" && <ConditionsTab d={cj} />}
      {tab === "Eventos" && <EventsTab d={cj} />}
      {tab === "Template" && <TemplateTab d={cj} />}
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
            ["Nome", d.name, { copyable: true }],
            ["Namespace", d.namespace, { copyable: true }],
            ["Suspenso", d.suspend ? "Sim" : "Não"],
            ["Política de concorrência", d.concurrencyPolicy],
          ]}
        />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Execuções</h4>
        <KVTable
          rows={[
            ["Schedule", d.schedule, { copyable: true, monospace: true, title: d.schedule }],
            ["Último agendamento", d.lastSchedule || "—"],
            ["Próxima execução", d.nextRun || "—"],
            ["Hist. sucesso/falha", `${d.history.successful}/${d.history.failed}`],
          ]}
        />
      </section>
    </div>
  );
}

function ScheduleTab({
  d,
  newSchedule,
  setNewSchedule,
  succHist,
  setSuccHist,
  failHist,
  setFailHist,
  cronError,
  succError,
  failError,
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="text-sm font-medium mb-3">Schedule</h4>
        <KVTable
          rows={[
            ["Expressão cron", d.schedule, { copyable: true, monospace: true, title: d.schedule }],
            ["Timezone", d.timezone || "Cluster default"],
            ["StartingDeadlineSeconds", d.startingDeadlineSeconds ?? "—"],
          ]}
        />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="text-sm font-medium mb-2">Ajustes rápidos</h4>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-300">Novo schedule (cron)</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                value={newSchedule}
                onChange={(e) => setNewSchedule(e.target.value)}
                className={`bg-[#0e141b] border ${cronError ? "border-rose-500/50" : "border-white/10"} rounded-lg px-3 py-2 text-sm w-56`}
                placeholder="ex: */5 * * * *"
              />
              <button
                className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-60"
                disabled={!!cronError}
                title={cronError || "Aplicar schedule"}
                onClick={() => alert("(mock) Novo schedule pronto para aplicar nas ações acima.")}
              >
                Aplicar
              </button>
            </div>
            {cronError ? (
              <p className="mt-1 text-xs text-rose-300">{cronError}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-400">Use 5 campos (min hora dia mês dia-da-semana). Aceita * , - /</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-300">Histórico de sucesso</label>
              <input
                value={succHist}
                onChange={(e) => setSuccHist(e.target.value)}
                className={`mt-1 bg-[#0e141b] border ${succError ? "border-rose-500/50" : "border-white/10"} rounded-lg px-3 py-2 text-sm w-full`}
                placeholder="ex: 3"
              />
              {succError ? <p className="mt-1 text-xs text-rose-300">{succError}</p> : null}
            </div>
            <div>
              <label className="text-sm text-gray-300">Histórico de falhas</label>
              <input
                value={failHist}
                onChange={(e) => setFailHist(e.target.value)}
                className={`mt-1 bg-[#0e141b] border ${failError ? "border-rose-500/50" : "border-white/10"} rounded-lg px-3 py-2 text-sm w-full`}
                placeholder="ex: 1"
              />
              {failError ? <p className="mt-1 text-xs text-rose-300">{failError}</p> : null}
            </div>
          </div>
          <div className="text-xs text-gray-400">
            *successfulJobsHistoryLimit* / *failedJobsHistoryLimit* controlam quantos Jobs antigos são mantidos.
          </div>
        </div>
      </section>
    </div>
  );
}

function HistoryTab({ d }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Últimas execuções</h4>
      <ul className="text-sm space-y-2">
        {d.recentRuns.map((r) => (
          <li key={r.id} className="flex items-center justify-between rounded border border-white/10 bg-white/5 px-3 py-2">
            <span>
              {r.time} • {r.status}
            </span>
            <span className="text-xs text-gray-400">{r.duration}s</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ActiveJobsTab({ d }) {
  if (!d.activeJobs.length) {
    return <div className="text-sm text-gray-400">Sem Jobs ativos.</div>;
  }
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Jobs ativos</h4>
      <table className="w-full text-sm">
        <thead className="text-xs text-gray-400">
          <tr>
            <th className="text-left py-2">Job</th>
            <th className="text-left py-2">Namespace</th>
            <th className="text-left py-2">Ativos</th>
            <th className="text-left py-2">Sucesso</th>
            <th className="text-left py-2">Falhas</th>
            <th className="text-left py-2">Idade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {d.activeJobs.map((j) => (
            <tr key={j.id}>
              <td className="py-2">{j.name}</td>
              <td className="py-2">{j.namespace}</td>
              <td className="py-2">{j.active}</td>
              <td className="py-2">{j.succeeded}</td>
              <td className="py-2">{j.failed}</td>
              <td className="py-2">{j.age}</td>
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
        <KVTable rows={Object.entries(d.selector).map(([k, v]) => [k, v, { copyable: true }])} />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Template (rótulos)</h4>
        {Object.entries(d.template.labels).length === 0 ? (
          <div className="text-sm text-gray-400">Sem rótulos.</div>
        ) : (
          <KVTable rows={Object.entries(d.template.labels).map(([k, v]) => [k, v, { copyable: true }])} />
        )}
        <div className="text-xs text-gray-400">
          Containers: {d.template.containers.map((c) => `${c.name} (${c.image})`).join(", ")}
        </div>
      </section>
    </div>
  );
}

/* ---------- Componentes auxiliares ---------- */

function ActionBtn({ icon: Icon, label, onClick, loading, disabled, danger }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      aria-busy={!!loading}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border
        ${danger ? "border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50" : "border-white/10 bg-white/5 hover:border-white/20"}
        disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-500/40`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {label}
    </motion.button>
  );
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Valida cron básica (5 campos). Aceita *, números, vírgulas, intervalos e barras.
function validateCron(expr) {
  if (!expr?.trim()) return "Informe uma expressão cron.";
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Use 5 campos (min hora dia mês dia-da-semana).";
  const re = /^[\d*/,-]+$/;
  const labels = ["min", "hora", "dia", "mês", "dia-semana"];
  for (let i = 0; i < parts.length; i++) {
    if (!re.test(parts[i])) return `Campo inválido (${labels[i]}): "${parts[i]}"`;
  }
  return null;
}

function validateInt(val) {
  if (!String(val).trim()) return "Informe um número inteiro.";
  const n = Number(val);
  if (!Number.isInteger(n) || n < 0) return "Deve ser um inteiro ≥ 0.";
  return null;
}
