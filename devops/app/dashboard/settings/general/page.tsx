// file: app/dashboard/settings/general/page.tsx
"use client";

import Panel from "../../../../components/ui/Panel";
import { SectionHeader, FormRow, Input, Select, Button, Switch } from "../../../../components/settings/FormParts";
import { currentUser } from "../../../../lib/settings/mock";

export default function GeneralSettings() {
  return (
    <Panel title="Geral" subtitle="Preferências básicas do workspace">
      <div className="space-y-6">
        <SectionHeader title="Identidade" subtitle="Dados do workspace ou projeto" />
        <div className="space-y-4">
          <FormRow label="Nome do workspace">
            <Input defaultValue="Synth K8S" />
          </FormRow>
          <FormRow label="URL base" hint="Usada para gerar links absolutos">
            <Input defaultValue="https://dashboard.synth.local" />
          </FormRow>
          <FormRow label="Timezone padrão">
            <Select defaultValue={currentUser.timezone}>
              <option>America/Sao_Paulo</option>
              <option>UTC</option>
              <option>America/New_York</option>
            </Select>
          </FormRow>
        </div>

        <SectionHeader title="Segurança" subtitle="Portas e limites globais" />
        <div className="space-y-4">
          <FormRow label="Sessão (expiração min)">
            <Input type="number" defaultValue={120} />
          </FormRow>
          <FormRow label="2FA obrigatório">
            <Switch checked={true} onChange={() => alert("(mock) alternar 2FA")} />
          </FormRow>
        </div>

        <div className="flex justify-end">
          <Button onClick={()=>alert("(mock) salvar geral")}>Salvar alterações</Button>
        </div>
      </div>
    </Panel>
  );
}
