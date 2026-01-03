"use client";

import { Activity, AlertTriangle, Clock, Gauge } from "lucide-react";
import Panel from "../../../components/ui/Panel";
import StatCard from "../../../components/devops/StatCard";
import Badge from "../../../components/ui/Badge";
import { apiGet } from "../../../lib/api-client";
import type { DevopsMetrics } from "../../../lib/api-types";
import { formatErrorMessage } from "../../../lib/api-errors";
import { usePolling } from "../../../lib/use-polling";
import { useAuth } from "../../../components/devops/AuthProvider";

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

export default function MetricsPage() {
  const { token } = useAuth();
  const metrics = usePolling(
    () => apiGet<DevopsMetrics>("/api/devops/metrics", token || undefined).then((res) => res.data),
    [token],
    { intervalMs: 4000, enabled: !!token }
  );

  const data = metrics.data;
  const totalReq = data?.totals?.requests ?? 0;
  const totalErr = data?.totals?.errors ?? 0;
  const ratePerMin = data?.ratePerMin ?? 0;
  const avgLatency = data?.latency?.avgMs ?? 0;
  const p95 = data?.latency?.p95Ms ?? 0;
  const rss = data?.memory?.rss ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Metricas</h1>
        <p className="text-sm text-gray-400">Indicadores principais do backend.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Activity} title="Req/min" value={ratePerMin.toLocaleString("pt-BR")} state="healthy" />
        <StatCard icon={AlertTriangle} title="Erros" value={totalErr.toLocaleString("pt-BR")} state={totalErr ? "warning" : "healthy"} />
        <StatCard icon={Clock} title="Media Latencia" value={`${avgLatency} ms`} state={avgLatency > 800 ? "warning" : "healthy"} />
        <StatCard icon={Clock} title="P95 Latencia" value={`${p95} ms`} state={p95 > 1200 ? "danger" : p95 > 600 ? "warning" : "healthy"} />
        <StatCard icon={Gauge} title="Memoria RSS" value={formatBytes(rss)} state="neutral" />
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4">
        <Panel
          title="Top endpoints"
          subtitle="Rotas mais acessadas"
          loading={metrics.loading}
          error={formatErrorMessage(metrics.error)}
          empty={!data?.topEndpoints?.length}
          emptyMessage="Sem chamadas registradas ainda."
        >
          <div className="space-y-2">
            {(data?.topEndpoints || []).map((row) => (
              <div key={row.path} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 flex items-center justify-between">
                <div className="text-sm text-gray-200 truncate">{row.path}</div>
                <Badge tone="info">{row.count}</Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Status codes"
          subtitle="Distribuicao HTTP"
          loading={metrics.loading}
          error={formatErrorMessage(metrics.error)}
          empty={!data || Object.keys(data.statusCounts || {}).length === 0}
        >
          <div className="flex flex-wrap gap-2">
            {Object.entries(data?.statusCounts || {}).map(([code, count]) => (
              <Badge key={code} tone={code.startsWith("5") ? "danger" : code.startsWith("4") ? "warning" : "success"}>
                {code}: {count}
              </Badge>
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        title="Error codes"
        subtitle="Ocorrencias por codigo"
        loading={metrics.loading}
        error={formatErrorMessage(metrics.error)}
        empty={!data || Object.keys(data.codeCounts || {}).length === 0}
      >
        <div className="flex flex-wrap gap-2">
          {Object.entries(data?.codeCounts || {}).map(([code, count]) => (
            <Badge key={code} tone="neutral">
              {code}: {count}
            </Badge>
          ))}
        </div>
      </Panel>

      <div className="text-xs text-gray-500">Total de requisicoes: {totalReq.toLocaleString("pt-BR")}</div>
    </div>
  );
}
