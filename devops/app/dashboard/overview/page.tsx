"use client";

import { Activity, AlertTriangle, Clock, Database, Gauge, Layers } from "lucide-react";
import Link from "next/link";
import Panel from "../../../components/ui/Panel";
import StatCard from "../../../components/devops/StatCard";
import StatusBadge from "../../../components/devops/StatusBadge";
import Badge from "../../../components/ui/Badge";
import { apiGet } from "../../../lib/api-client";
import type { DevopsConfig, DevopsHealth, DevopsLog, DevopsMetrics } from "../../../lib/api-types";
import { formatErrorMessage } from "../../../lib/api-errors";
import { usePolling } from "../../../lib/use-polling";
import { useAuth } from "../../../components/devops/AuthProvider";

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function formatBytes(value: number) {
  if (!Number.isFinite(value)) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let size = value;
  let idx = 0;

  while (size >= 1024 && idx < units.length - 1) {
    size /= 1024;
    idx += 1;
  }

  return `${size.toFixed(size >= 100 ? 0 : 1)} ${units[idx]}`;
}

function badgeTone(status: string) {
  if (status === "OK") return "success";
  if (status === "DEGRADED") return "warning";
  if (status === "ERROR") return "danger";
  return "neutral";
}

export default function OverviewPage() {
  const { token } = useAuth();

  const health = usePolling(
    () => apiGet<DevopsHealth>("/api/devops/health", token || undefined).then((res) => res.data),
    [token],
    { intervalMs: 5000, enabled: !!token }
  );

  const metrics = usePolling(
    () => apiGet<DevopsMetrics>("/api/devops/metrics", token || undefined).then((res) => res.data),
    [token],
    { intervalMs: 4000, enabled: !!token }
  );

  const logs = usePolling(
    () => apiGet<DevopsLog[]>("/api/devops/logs?limit=8", token || undefined).then((res) => res.data),
    [token],
    { intervalMs: 5000, enabled: !!token }
  );

  const config = usePolling(
    () => apiGet<DevopsConfig>("/api/devops/config", token || undefined).then((res) => res.data),
    [token],
    { intervalMs: 20000, enabled: !!token }
  );

  const healthData = health.data;
  const metricsData = metrics.data;

  const status = healthData?.status || "DEGRADED";
  const uptime = healthData?.server?.uptimeSec != null
    ? formatUptime(healthData.server.uptimeSec)
    : "-";
  const reqPerMin = metricsData?.ratePerMin ?? 0;
  const errorCount = metricsData?.totals?.errors ?? 0;
  const latencyP95 = metricsData?.latency?.p95Ms ?? 0;
  const memoryRss = metricsData?.memory?.rss ?? 0;

  const statusTone = status === "OK" ? "healthy" : status === "DEGRADED" ? "warning" : "danger";
  const healthItems = [
    { label: "Servidor", value: `Uptime ${uptime}`, status: "OK" },
    { label: "MongoDB", value: healthData?.db?.status || "-", status: healthData?.db?.status || "DEGRADED" },
    { label: "Fila", value: "Nao configurado", status: "DEGRADED" },
    { label: "Storage", value: "Nao configurado", status: "DEGRADED" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Visao geral</h1>
          <p className="text-sm text-gray-400">Monitoramento em tempo real do backend.</p>
        </div>
        <StatusBadge value={status} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Activity}
          title="Req/min"
          value={reqPerMin.toLocaleString("pt-BR")}
          hint="Ultimo minuto"
          state={statusTone}
        />
        <StatCard
          icon={AlertTriangle}
          title="Erros"
          value={errorCount.toLocaleString("pt-BR")}
          hint="Resposta 4xx/5xx"
          state={errorCount > 0 ? "warning" : "healthy"}
        />
        <StatCard
          icon={Clock}
          title="P95 Latencia"
          value={`${latencyP95} ms`}
          hint="Amostra recente"
          state={latencyP95 > 1200 ? "danger" : latencyP95 > 600 ? "warning" : "healthy"}
        />
        <StatCard
          icon={Gauge}
          title="Memoria RSS"
          value={formatBytes(memoryRss)}
          hint="Processo Node"
          state="neutral"
        />
      </div>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-4">
        <Panel
          title="Health checks"
          subtitle="Servidor e banco"
          loading={health.loading}
          error={formatErrorMessage(health.error)}
        >
          <div className="grid gap-3">
            {healthItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 grid place-items-center">
                    <Layers className="h-4 w-4 text-cyan-100" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">{item.label}</div>
                    <div className="font-semibold text-white">{item.value}</div>
                  </div>
                </div>
                <Badge tone={badgeTone(item.status)}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Top endpoints"
          subtitle="Rotas com maior volume"
          loading={metrics.loading}
          error={formatErrorMessage(metrics.error)}
          empty={!metricsData?.topEndpoints?.length}
          emptyMessage="Sem chamadas registradas ainda."
        >
          <div className="space-y-2">
            {(metricsData?.topEndpoints || []).map((row) => (
              <div
                key={row.path}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 flex items-center justify-between"
              >
                <div className="text-sm text-gray-200 truncate">{row.path}</div>
                <Badge tone="info">{row.count}</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-4">
        <Panel
          title="Status codes"
          subtitle="Distribuicao HTTP"
          loading={metrics.loading}
          error={formatErrorMessage(metrics.error)}
          empty={!metricsData || Object.keys(metricsData.statusCounts || {}).length === 0}
        >
          <div className="flex flex-wrap gap-2">
            {Object.entries(metricsData?.statusCounts || {}).map(([code, count]) => (
              <Badge key={code} tone={code.startsWith("5") ? "danger" : code.startsWith("4") ? "warning" : "success"}>
                {code}: {count}
              </Badge>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(metricsData?.codeCounts || {}).map(([code, count]) => (
              <Badge key={code} tone="neutral">
                {code}: {count}
              </Badge>
            ))}
          </div>
        </Panel>

        <Panel
          title="Logs recentes"
          subtitle="Ultimas requisicoes"
          loading={logs.loading}
          error={formatErrorMessage(logs.error)}
          empty={!logs.data || logs.data.length === 0}
          actions={
            <Link href="/dashboard/logs" className="text-xs text-cyan-200 hover:text-cyan-100">
              Ver todos
            </Link>
          }
        >
          <div className="space-y-2 text-sm">
            {(logs.data || []).map((log) => (
              <div
                key={`${log.requestId}-${log.timestamp}`}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-300">
                    {log.method} {log.path}
                  </span>
                  <Badge tone={log.status >= 500 ? "danger" : log.status >= 400 ? "warning" : "success"}>
                    {log.status}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {log.requestId} - {log.durationMs} ms
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        title="Versao e build"
        subtitle="Informacoes do deploy"
        loading={config.loading}
        error={formatErrorMessage(config.error)}
        empty={!config.data}
      >
        {config.data ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <div className="text-xs text-gray-400">Ambiente</div>
              <div className="text-sm font-semibold text-white">{config.data.environment}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <div className="text-xs text-gray-400">Versao</div>
              <div className="text-sm font-semibold text-white">{config.data.version}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <div className="text-xs text-gray-400">Build time</div>
              <div className="text-sm font-semibold text-white">{config.data.buildTime || "-"}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <div className="text-xs text-gray-400">Node</div>
              <div className="text-sm font-semibold text-white">{config.data.node}</div>
            </div>
          </div>
        ) : null}
      </Panel>
    </div>
  );
}
