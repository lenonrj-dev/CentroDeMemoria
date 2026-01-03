"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Plus, CheckCircle2 } from "lucide-react";
import Panel from "../../../components/ui/Panel";
import InputField from "../../../components/ui/InputField";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import StatusBadge from "../../../components/devops/StatusBadge";
import Modal from "../../../components/ui/Modal";
import Toggle from "../../../components/ui/Toggle";
import { useToast } from "../../../components/providers/ToastProvider";
import { incidentsSeed } from "../../../lib/devops/incidents";

const SEVERITIES = ["All", "Critical", "High", "Medium", "Low"];
const STATUSES = ["Todos", "Aberto", "Em andamento", "Resolvido"];

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState(incidentsSeed);
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("Todos");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", severity: "Critical", team: "SRE", service: "" });
  const [notifySquad, setNotifySquad] = useState(true);
  const { pushToast } = useToast();

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return incidents.filter((i) => {
      const okSeverity = severity === "All" || i.severity === severity;
      const okStatus = status === "Todos" || i.status.toLowerCase() === status.toLowerCase();
      const okQuery =
        !term || [i.title, i.id, i.team, i.service, i.owner].some((v) => String(v).toLowerCase().includes(term));
      return okSeverity && okStatus && okQuery;
    });
  }, [incidents, query, severity, status]);

  const criticalCount = incidents.filter((i) => i.severity === "Critical" && i.status !== "Resolvido").length;

  const updateStatus = (id, newStatus) => {
    setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
    pushToast({
      title: `${id} atualizado`,
      description: `Status agora em ${newStatus}`,
      tone: newStatus === "Resolvido" ? "success" : "info",
    });
  };

  const createIncident = () => {
    if (!form.title.trim()) {
      pushToast({ title: "Título é obrigatório", tone: "danger" });
      return;
    }
    const newIncident = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: form.title,
      severity: form.severity,
      status: "Aberto",
      team: form.team || "SRE",
      service: form.service || "desconhecido",
      owner: "you",
      updatedAt: "agora",
    };
    setIncidents((prev) => [newIncident, ...prev]);
    setModalOpen(false);
    setForm({ title: "", severity: "Critical", team: "SRE", service: "" });
    pushToast({
      title: `${newIncident.id} criado`,
      description: `Severidade ${newIncident.severity}`,
      tone: newIncident.severity === "Critical" ? "warning" : "success",
    });
    if (notifySquad) {
      pushToast({
        title: "Squad notificada",
        description: `${newIncident.team} recebeu alerta`,
        tone: "info",
      });
    }
  };

  return (
    <div className="space-y-5">
      <Panel
        title="Incidentes e alertas"
        subtitle="Crie, filtre e acompanhe incidentes em tempo real"
        actions={
          <Button size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
            Novo incidente
          </Button>
        }
      >
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge tone="warning">Críticos: {criticalCount}</Badge>
          <Badge tone="info">Total: {incidents.length}</Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <InputField label="Busca" placeholder="ID, título, serviço, equipe" value={query} onChange={(e) => setQuery(e.target.value)} />
          <InputField as="select" label="Severidade" value={severity} onChange={(e) => setSeverity(e.target.value)}>
            {SEVERITIES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </InputField>
          <InputField as="select" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </InputField>
        </div>

        <div className="mt-4">
          {criticalCount > 0 && (
            <div className="mb-3 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4" />
              {criticalCount} incidente(s) crítico(s) aguardando ação.
            </div>
          )}
          <div className="grid lg:grid-cols-2 gap-3">
            {filtered.map((inc) => (
              <div key={inc.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs text-gray-400">{inc.id}</p>
                    <p className="text-sm font-semibold text-gray-100">{inc.title}</p>
                    <p className="text-xs text-gray-400">
                      {inc.service} · {inc.team} · {inc.owner}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge tone={severityTone(inc.severity)}>{inc.severity}</Badge>
                    <StatusBadge value={inc.status} />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 text-xs text-gray-400">
                  <span>Atualizado: {inc.updatedAt}</span>
                  <select
                    value={inc.status}
                    onChange={(e) => updateStatus(inc.id, e.target.value)}
                    className="rounded-lg border border-white/10 bg-[#0c1118] px-2 py-1 text-xs text-gray-100"
                  >
                    <option>Aberto</option>
                    <option>Em andamento</option>
                    <option>Resolvido</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => updateStatus(inc.id, "Em andamento")}
                  >
                    Assumir
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => updateStatus(inc.id, "Resolvido")}
                    icon={CheckCircle2}
                  >
                    Resolver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo incidente"
        subtitle="Todos os campos são validados localmente"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={createIncident}>
              Criar
            </Button>
          </>
        }
      >
        <div className="grid md:grid-cols-2 gap-3">
          <InputField
            label="Título"
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Descreva o impacto / sintoma"
          />
          <InputField as="select" label="Severidade" value={form.severity} onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </InputField>
          <InputField label="Serviço" value={form.service} onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))} placeholder="ex.: checkout" />
          <InputField label="Equipe" value={form.team} onChange={(e) => setForm((f) => ({ ...f, team: e.target.value }))} placeholder="SRE, Platform..." />
        </div>
        <Toggle
          checked={notifySquad}
          onChange={setNotifySquad}
          label="Notificar squad responsável"
          description="Envia alertas simulados para Slack/e-mail"
        />
      </Modal>
    </div>
  );
}

function severityTone(sev) {
  switch (sev) {
    case "Critical":
      return "danger";
    case "High":
      return "warning";
    case "Medium":
      return "info";
    default:
      return "neutral";
  }
}
