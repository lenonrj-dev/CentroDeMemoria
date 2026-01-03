// file: app/dashboard/settings/secrets/page.tsx
"use client";

import Panel from "../../../../components/ui/Panel";
import { SectionHeader, FormRow, Input, Select, Button, CodeBox } from "../../../../components/settings/FormParts";
import { secrets } from "../../../../lib/settings/mock";

export default function SecretsSettings() {
  return (
    <Panel title="Segredos" subtitle="Gerencie variáveis sensíveis e escopos">
      <div className="space-y-6">
        <SectionHeader title="Criar/Atualizar segredo" />
        <div className="space-y-4">
          <FormRow label="Chave"><Input placeholder="ex: MONGODB_URI"/></FormRow>
          <FormRow label="Valor">
            <Input placeholder="mongodb+srv://user:pass@cluster/db"/>
          </FormRow>
          <FormRow label="Escopo">
            <Select defaultValue="global"><option>global</option><option>ci</option><option>runtime</option></Select>
          </FormRow>
          <div className="flex justify-end"><Button onClick={()=>alert("(mock) salvar segredo")}>Salvar</Button></div>
        </div>

        <SectionHeader title="Segredos existentes" />
        <ul className="space-y-2">
          {secrets.map(s => (
            <li key={s.key} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-100">{s.key} <span className="text-xs text-gray-400">({s.scope})</span></div>
                <div className="text-xs text-gray-400">Atualizado {s.updated}</div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <CodeBox value="valor_mascarado" masked />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={()=>alert("(mock) editar")}>Editar</Button>
                  <Button variant="danger" onClick={()=>confirm("Excluir segredo? (mock)")&&alert("Excluído")}>Excluir</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
