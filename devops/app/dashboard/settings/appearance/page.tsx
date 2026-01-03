// file: app/dashboard/settings/appearance/page.tsx
"use client";

import Panel from "../../../../components/ui/Panel";
import { SectionHeader, FormRow, Select, Button } from "../../../../components/settings/FormParts";
import { uiPrefs } from "../../../../lib/settings/mock";

export default function AppearanceSettings() {
  return (
    <Panel title="Aparência" subtitle="Tema, densidade e idioma">
      <div className="space-y-6">
        <SectionHeader title="Tema e Layout" />
        <div className="space-y-4">
          <FormRow label="Tema">
            <Select defaultValue={uiPrefs.theme}>
              <option value="synth-dark">Synth (Escuro)</option>
              <option value="synth-light">Synth (Claro)</option>
              <option value="system">Sistema</option>
            </Select>
          </FormRow>
          <FormRow label="Densidade">
            <Select defaultValue={uiPrefs.density}>
              <option value="compact">Compacto</option>
              <option value="comfortable">Confortável</option>
            </Select>
          </FormRow>
          <FormRow label="Idioma">
            <Select defaultValue={uiPrefs.language}>
              <option>pt-BR</option>
              <option>en-US</option>
              <option>es-ES</option>
            </Select>
          </FormRow>
        </div>
        <div className="flex justify-end">
          <Button onClick={()=>alert("(mock) salvar aparência")}>Salvar preferências</Button>
        </div>
      </div>
    </Panel>
  );
}
