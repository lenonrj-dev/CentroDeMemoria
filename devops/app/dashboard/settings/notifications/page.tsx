// file: app/dashboard/settings/notifications/page.tsx
"use client";

import Panel from "../../../../components/ui/Panel";
import { SectionHeader, FormRow, Select, Button, Switch, Input } from "../../../../components/settings/FormParts";
import { notif } from "../../../../lib/settings/mock";

export default function NotificationSettings() {
  return (
    <Panel title="Notificações" subtitle="Canais e frequência">
      <div className="space-y-6">
        <SectionHeader title="Canais" />
        <div className="space-y-4">
          <FormRow label="Email">
            <Switch checked={notif.email} onChange={()=>alert("(mock) toggle email")} />
          </FormRow>
          <FormRow label="Slack" hint="Canal">
            <div className="flex gap-2">
              <Switch checked={notif.slack} onChange={()=>alert("(mock) toggle slack")} />
              <Input defaultValue="#alerts-devops" className="max-w-xs"/>
            </div>
          </FormRow>
          <FormRow label="Webhook">
            <div className="flex gap-2 w-full">
              <Switch checked={notif.webhook} onChange={()=>alert("(mock) toggle webhook")} />
              <Input placeholder="https://..." className="flex-1"/>
            </div>
          </FormRow>
        </div>

        <SectionHeader title="Frequência" />
        <FormRow label="Resumo">
          <Select defaultValue={notif.digest}>
            <option>instantâneo</option>
            <option>horário</option>
            <option>diário</option>
          </Select>
        </FormRow>

        <div className="flex justify-end">
          <Button onClick={()=>alert("(mock) salvar notificações")}>Salvar</Button>
        </div>
      </div>
    </Panel>
  );
}
