"use client";

import { useMemo, useState } from "react";
import { Users2, Wrench, RefreshCcw, ArrowUp, ArrowDown, Info, Server } from "lucide-react";
import Panel from "../../../components/ui/Panel";
import InputField from "../../../components/ui/InputField";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import StatusBadge from "../../../components/devops/StatusBadge";
import Modal from "../../../components/ui/Modal";
import { useToast } from "../../../components/providers/ToastProvider";
import { servicesSeed } from "../../../lib/devops/services";

const STATUS_OPTIONS = ["todos", "UP", "DEGRADED", "DOWN"];
const ENV_OPTIONS = ["todos", "prod", "stage", "dev"];

export default function ServicesPage() {
  const [services, setServices] = useState(servicesSeed);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos");
  const [env, setEnv] = useState("todos");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState("");
  const pageSize = 6;
  const { pushToast } = useToast();

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return services.filter((svc) => {
      const okStatus = status === "todos" || svc.status === status;
      const okEnv = env === "todos" || svc.env === env;
      const okQuery =
        !term || [svc.name, svc.owner, svc.tags.join(" "), svc.env].some((txt) => String(txt).toLowerCase().includes(term));
      return okStatus && okEnv && okQuery;
    });
  }, [env, query, services, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const setService = (id, updater) => {
    setServices((prev) => prev.map((svc) => (svc.id === id ? updater(svc) : svc)));
  };

  const restart = (svc) => {
    setBusy(`restart-${svc.id}`);
    pushToast({ title: `Reiniciando ${svc.name}`, description: "Ação simulada, aguarde...", tone: "info" });
    setTimeout(() => {
      setService(svc.id, (current) => ({ ...current, status: "UP", latency: Math.max(90, current.latency - 20) }));
      setBusy("");
      pushToast({ title: `${svc.name} reiniciado`, description: "Status marcado como UP", tone: "success" });
    }, 900);
  };

  const scale = (svc, direction) => {
    setBusy(`scale-${svc.id}`);
    setTimeout(() => {
      setService(svc.id, (current) => ({
        ...current,
        replicas: Math.max(1, current.replicas + direction),
        status: direction > 0 ? current.status : current.status,
      }));
      setBusy("");
      pushToast({
        title: `${direction > 0 ? "Scale up" : "Scale down"} enviado`,
        description: `${svc.name} agora com ${Math.max(1, svc.replicas + direction)} réplicas`,
        tone: "info",
      });
    }, 650);
  };

  return (
    <div className="space-y-5">
      <Panel
        title="Serviços"
        subtitle="Health, deploys e ações rápidas"
        actions={
          <div className="flex items-center gap-2">
            <Badge tone="info">Produção</Badge>
            <Button size="sm" variant="secondary" onClick={() => setSelected(pageItems[0] || services[0])}>
              Ver detalhes
            </Button>
          </div>
        }
      >
        <div className="grid md:grid-cols-3 gap-3">
          <InputField label="Busca" placeholder="Buscar por nome, dono, tag..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <InputField
            label="Status"
            as="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </InputField>
          <InputField
            label="Ambiente"
            as="select"
            value={env}
            onChange={(e) => setEnv(e.target.value)}
          >
            {ENV_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </InputField>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-[220px_100px_120px_120px_120px_1fr_120px] px-4 py-2 text-[13px] uppercase tracking-wide text-gray-400 bg-white/5">
            <div>Serviço</div>
            <div>Ambiente</div>
            <div>Status</div>
            <div>Deploy</div>
            <div>Versão</div>
            <div>Tags</div>
            <div>Ações</div>
          </div>

          <ul className="divide-y divide-white/5">
            {pageItems.map((svc) => (
              <li key={svc.id} className="grid grid-cols-[220px_100px_120px_120px_120px_1fr_120px] items-center px-4 py-3 bg-white/[0.02] hover:bg-white/[0.05] transition">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-white/10 grid place-items-center">
                    <Server className="h-4 w-4 text-cyan-100" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{svc.name}</p>
                    <p className="text-xs text-gray-400 truncate">{svc.owner}</p>
                  </div>
                </div>
                <Badge tone={svc.env === "prod" ? "danger" : svc.env === "stage" ? "warning" : "info"}>{svc.env}</Badge>
                <StatusBadge value={svc.status} />
                <p className="text-sm text-gray-200">{svc.lastDeploy}</p>
                <p className="text-sm text-gray-200">{svc.version}</p>
                <div className="flex flex-wrap gap-1">
                  {svc.tags.map((t) => (
                    <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-200">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelected(svc)}
                    icon={Info}
                  >
                    Detalhes
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Anterior
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Próxima
            </Button>
          </div>
        </div>
      </Panel>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Detalhes · ${selected.name}` : "Detalhes"}
        subtitle={selected ? `${selected.owner} · ${selected.env}` : ""}
        actions={
          selected && (
            <>
              <Button size="sm" variant="secondary" icon={ArrowDown} loading={busy === `scale-${selected.id}`} onClick={() => scale(selected, -1)}>
                Scale down
              </Button>
              <Button size="sm" variant="secondary" icon={ArrowUp} loading={busy === `scale-${selected.id}`} onClick={() => scale(selected, 1)}>
                Scale up
              </Button>
              <Button size="sm" icon={RefreshCcw} loading={busy === `restart-${selected.id}`} onClick={() => restart(selected)}>
                Reiniciar
              </Button>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoRow label="Status">
                <StatusBadge value={selected.status} />
              </InfoRow>
              <InfoRow label="Ambiente">
                <Badge tone={selected.env === "prod" ? "danger" : "info"}>{selected.env}</Badge>
              </InfoRow>
              <InfoRow label="Uptime">{selected.uptime}</InfoRow>
              <InfoRow label="Latência média">{selected.latency} ms</InfoRow>
              <InfoRow label="Réplicas">{selected.replicas}</InfoRow>
              <InfoRow label="Último deploy">{selected.lastDeploy}</InfoRow>
              <InfoRow label="Versão">{selected.version}</InfoRow>
              <InfoRow label="Região">{selected.region}</InfoRow>
            </div>
            <InfoRow label="Tags">
              <div className="flex flex-wrap gap-1">
                {selected.tags.map((t) => (
                  <span key={t} className="px-2 py-1 rounded border border-white/10 bg-white/5 text-[11px] uppercase tracking-wide">
                    {t}
                  </span>
                ))}
              </div>
            </InfoRow>
            <div className="grid sm:grid-cols-2 gap-3">
              <ActionCard
                icon={Wrench}
                title="Simular manutenção"
                description="Força cordon/drain e reduz tráfego 50%"
                buttonLabel="Agendar"
                onClick={() =>
                  pushToast({ title: "Janela de manutenção registrada", description: `${selected.name} marcado para offload`, tone: "info" })
                }
              />
              <ActionCard
                icon={Users2}
                title="Escalar equipe"
                description="Notifica squad responsável e canal #sre"
                buttonLabel="Notificar"
                onClick={() => pushToast({ title: "Squad avisada", description: `${selected.owner} notificada no Slack`, tone: "success" })}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function InfoRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <p className="text-xs text-gray-400">{label}</p>
      <div className="text-sm font-medium text-gray-100">{children}</div>
    </div>
  );
}

function ActionCard({ icon: Icon, title, description, buttonLabel, onClick }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-cyan-200" />
        <p className="font-semibold text-sm">{title}</p>
      </div>
      <p className="text-xs text-gray-400">{description}</p>
      <Button size="sm" variant="secondary" onClick={onClick}>
        {buttonLabel}
      </Button>
    </div>
  );
}
