// file: app/dashboard/workloads/page.tsx
"use client";

import Panel from "../../../components/ui/Panel";
import MiniSpark from "../../../components/k8s/MiniSpark";
import KpiCard from "../../../components/cluster/KpiCard";
import KVTable from "../../../components/cluster/KVTable";
import ResourceMeter from "../../../components/cluster/ResourceMeter";
import data from "../../../lib/k8s/overviewData";

export default function WorkloadsOverviewPage() {
  const { summary, series, namespaces, recentEvents, lastDeployments } = data;

  const podsUsagePct = ((summary.pods.running / summary.pods.capacity) * 100) || 0;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <KpiCard label="Pods (running)" value={summary.pods.running} hint={`Capacidade: ${summary.pods.capacity}`} accent="emerald" />
        <KpiCard label="Pods (pendentes)" value={summary.pods.pending} accent="amber" />
        <KpiCard label="Pods (falhos)" value={summary.pods.failed} accent="rose" />
        <KpiCard label="Deployments" value={summary.deployments.total} hint={`${summary.deployments.available} disponíveis`} accent="cyan" />
        <KpiCard label="Jobs" value={summary.jobs.total} hint={`${summary.jobs.active} ativos`} />
        <KpiCard label="CronJobs" value={summary.cronjobs.total} hint={`${summary.cronjobs.scheduled} agendados`} />
      </div>

      {/* Saúde do cluster / Uso de recursos */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Uso de Recursos" subtitle="Últimos minutos">
          <div className="space-y-4">
            <div>
              <div className="text-sm mb-1">CPU</div>
              <div className="flex items-center gap-3">
                <MiniSpark points={series.cpu} height={80} strokeWidth={2} filled />
                <span className="text-sm tabular-nums text-gray-200">{summary.resources.cpu.toFixed(1)}%</span>
              </div>
            </div>
            <div>
              <div className="text-sm mb-1">Memória</div>
              <div className="flex items-center gap-3">
                <MiniSpark points={series.memory} height={80} strokeWidth={2} filled />
                <span className="text-sm tabular-nums text-gray-200">{summary.resources.memory.toFixed(1)}%</span>
              </div>
            </div>
            <div>
              <div className="text-sm mb-1">Uso de Pods</div>
              <ResourceMeter label="Capacidade de Pods" used={podsUsagePct} total={100} />
            </div>
          </div>
        </Panel>

        <Panel title="Distribuição por Namespace" subtitle="Top 8 por quantidade de pods">
          <ul className="space-y-2">
            {namespaces.slice(0, 8).map((ns) => (
              <li key={ns.name} className="flex items-center gap-3">
                <span className="w-36 shrink-0 truncate text-sm text-gray-300">{ns.name}</span>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-cyan-500/60" style={{ width: `${ns.pct}%` }} />
                </div>
                <span className="w-14 text-right text-sm tabular-nums text-gray-300">{ns.pods}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Resumo Rápido" subtitle="Objetos de workload">
          <KVTable
            rows={[
              ["ReplicaSets", summary.replicasets.total],
              ["StatefulSets", summary.statefulsets.total],
              ["DaemonSets", summary.daemonsets.total],
              ["HPA (autoscaling)", summary.hpa.total],
              ["Falhas (últ. 1h)", summary.lastHour.failures],
              ["Sucesso (últ. 1h)", summary.lastHour.successes],
            ]}
          />
        </Panel>
      </div>

      {/* Eventos recentes / Últimos deployments */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Eventos recentes" subtitle="Últimas ocorrências do cluster">
          <ul className="text-sm divide-y divide-white/10">
            {recentEvents.map((ev) => (
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
                  <div className="text-xs text-gray-400">{ev.reason} • {ev.object} • {ev.age}</div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Últimos Deployments" subtitle="Mudanças recentes">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-400">
              <tr>
                <th className="text-left py-2">Nome</th>
                <th className="text-left py-2">Namespace</th>
                <th className="text-left py-2">Versão</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Idade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {lastDeployments.map((d) => (
                <tr key={d.name}>
                  <td className="py-2">{d.name}</td>
                  <td className="py-2">{d.namespace}</td>
                  <td className="py-2">{d.version}</td>
                  <td className="py-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded border ${
                        d.status === "Disponível"
                          ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
                          : d.status === "Progredindo"
                          ? "text-cyan-300 bg-cyan-500/10 border-cyan-500/20"
                          : "text-rose-300 bg-rose-500/10 border-rose-500/20"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-2 text-gray-300">{d.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
