// file: app/dashboard/settings/profile/page.tsx
"use client";

import Panel from "../../../../components/ui/Panel";
import { SectionHeader, FormRow, Input, Button, Switch } from "../../../../components/settings/FormParts";
import { currentUser } from "../../../../lib/settings/mock";

export default function ProfileSettings() {
  return (
    <Panel title="Perfil" subtitle="Dados pessoais e preferências de conta">
      <div className="space-y-6">
        <SectionHeader title="Dados" />
        <div className="space-y-4">
          <FormRow label="Nome"><Input defaultValue={currentUser.name} /></FormRow>
          <FormRow label="Email"><Input defaultValue={currentUser.email} /></FormRow>
          <FormRow label="Receber updates do produto?"><Switch checked={true} onChange={()=>alert("(mock) toggle updates")} /></FormRow>
        </div>
        <SectionHeader title="Senha" />
        <div className="grid sm:grid-cols-2 gap-3">
          <Input type="password" placeholder="Senha atual" />
          <div />
          <Input type="password" placeholder="Nova senha" />
          <Input type="password" placeholder="Confirmar nova senha" />
        </div>
        <div className="flex justify-between">
          <Button variant="danger" onClick={()=>confirm("Deseja sair de todas as sessões? (mock)")&&alert("Ok")}>Encerrar sessões</Button>
          <Button onClick={()=>alert("(mock) salvar perfil")}>Salvar alterações</Button>
        </div>
      </div>
    </Panel>
  );
}
