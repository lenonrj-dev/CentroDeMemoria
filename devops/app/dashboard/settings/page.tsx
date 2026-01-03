// file: app/dashboard/settings/page.tsx
"use client";

import { useState } from "react";
import Panel from "../../../components/ui/Panel";
import InputField from "../../../components/ui/InputField";
import Toggle from "../../../components/ui/Toggle";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { usePreferences } from "../../../components/providers/PreferencesProvider";
import { useToast } from "../../../components/providers/ToastProvider";
import Link from "next/link";

const links = [
  ["Geral", "/dashboard/settings/general"],
  ["Aparência", "/dashboard/settings/appearance"],
  ["Notificações", "/dashboard/settings/notifications"],
  ["Tokens de Acesso", "/dashboard/settings/access-tokens"],
  ["Integrações", "/dashboard/settings/integrations"],
  ["Kubernetes", "/dashboard/settings/kubernetes"],
  ["Segredos", "/dashboard/settings/secrets"],
  ["Auditoria", "/dashboard/settings/audit"],
  ["Perfil", "/dashboard/settings/profile"],
];

export default function SettingsHome() {
  const { preferences, updatePreferences, defaults } = usePreferences();
  const [form, setForm] = useState(preferences);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { pushToast } = useToast();

  const onSave = () => {
    const newErrors: Record<string, string> = {};
    if (form.alerts.refreshInterval < 5) newErrors.refreshInterval = "Minímo de 5 segundos";
    if (!["comfortable", "compact", "expanded"].includes(form.tableDensity)) {
      newErrors.tableDensity = "Seleção inválida";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      pushToast({ title: "Corrija os campos destacados", tone: "danger" });
      return;
    }
    updatePreferences(form);
    pushToast({ title: "Configurações salvas", description: "Preferências aplicadas para a sessão", tone: "success" });
  };

  const reset = () => {
    setForm(defaults);
    updatePreferences(defaults);
    pushToast({ title: "Preferências revertidas", tone: "info" });
  };

  return (
    <div className="space-y-4">
      <Panel
        title="Preferências de UI"
        subtitle="Controle densidade, cor secundária e exibição"
        actions={<Badge tone="info">Sessão atual</Badge>}
      >
        <div className="grid md:grid-cols-3 gap-3">
          <InputField
            as="select"
            label="Densidade da tabela"
            value={form.tableDensity}
            onChange={(e) => setForm((f) => ({ ...f, tableDensity: e.target.value }))}
            error={errors.tableDensity}
          >
            <option value="comfortable">Confortável</option>
            <option value="compact">Compacta</option>
            <option value="expanded">Expandida</option>
          </InputField>
          <InputField
            as="select"
            label="Cor secundária"
            value={form.secondaryColor}
            onChange={(e) => setForm((f) => ({ ...f, secondaryColor: e.target.value }))}
          >
            <option value="cyan">Ciano</option>
            <option value="blue">Azul</option>
            <option value="emerald">Verde</option>
            <option value="purple">Roxo</option>
          </InputField>
          <InputField
            label="Intervalo de atualização (s)"
            type="number"
            min={5}
            value={form.alerts.refreshInterval}
            onChange={(e) => setForm((f) => ({ ...f, alerts: { ...f.alerts, refreshInterval: Number(e.target.value) } }))}
            error={errors.refreshInterval}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <Toggle
            checked={form.showAvatars}
            onChange={(v) => setForm((f) => ({ ...f, showAvatars: v }))}
            label="Exibir avatares/listas"
            description="Mostra fotos e ícones em tabelas e cards"
          />
          <Toggle
            checked={form.showTags}
            onChange={(v) => setForm((f) => ({ ...f, showTags: v }))}
            label="Exibir tags"
            description="Mantém labels e badges visíveis"
          />
        </div>
      </Panel>

      <Panel
        title="Alertas e notificações"
        subtitle="Defina como incidentes críticos e avisos são exibidos"
      >
        <div className="grid md:grid-cols-2 gap-3">
          <Toggle
            checked={form.alerts.critical}
            onChange={(v) => setForm((f) => ({ ...f, alerts: { ...f.alerts, critical: v } }))}
            label="Alertas críticos"
            description="Sempre destacar incidentes Critical"
          />
          <Toggle
            checked={form.alerts.warnings}
            onChange={(v) => setForm((f) => ({ ...f, alerts: { ...f.alerts, warnings: v } }))}
            label="Alertas de aviso"
            description="Mostrar avisos Medium/High"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={reset}>
            Reverter
          </Button>
          <Button onClick={onSave}>Salvar configurações</Button>
        </div>
      </Panel>

      <Panel title="Outras configurações" subtitle="Mantemos as áreas avançadas acessíveis">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map(([label, href]) => (
            <li key={href}>
              <Link href={href} className="block rounded-lg border border-white/10 bg-white/5 hover:border-white/20 px-4 py-3">
                <div className="text-sm font-medium text-gray-100">{label}</div>
                <div className="text-xs text-gray-400">{href.replace("/dashboard", "")}</div>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
