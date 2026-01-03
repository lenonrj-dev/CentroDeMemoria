"use client";

import Panel from "../../../components/ui/Panel";
import Badge from "../../../components/ui/Badge";
import { apiGet } from "../../../lib/api-client";
import type { DevopsConfig } from "../../../lib/api-types";
import { formatErrorMessage } from "../../../lib/api-errors";
import { usePolling } from "../../../lib/use-polling";
import { useAuth } from "../../../components/devops/AuthProvider";

export default function ConfigPage() {
  const { token } = useAuth();
  const config = usePolling(
    () => apiGet<DevopsConfig>("/api/devops/config", token || undefined).then((res) => res.data),
    [token],
    { intervalMs: 20000, enabled: !!token }
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Config</h1>
        <p className="text-sm text-gray-400">Informacoes de ambiente e build.</p>
      </div>

      <Panel
        title="Versao e build"
        subtitle="Metadados nao sensiveis"
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

      <Panel title="Status do ambiente" subtitle="Resumo rapido">
        <div className="flex flex-wrap gap-2">
          <Badge tone="info">Sem segredos expostos</Badge>
          <Badge tone="success">API protegida</Badge>
        </div>
      </Panel>
    </div>
  );
}
