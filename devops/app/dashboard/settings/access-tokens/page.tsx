// file: app/dashboard/settings/access-tokens/page.tsx
"use client";

import Panel from "../../../../components/ui/Panel";
import { SectionHeader, FormRow, Input, Button, CodeBox } from "../../../../components/settings/FormParts";
import { tokens } from "../../../../lib/settings/mock";

export default function AccessTokens() {
  return (
    <Panel title="Tokens de Acesso" subtitle="Crie e gerencie PATs para CLI e CI/CD">
      <div className="space-y-6">
        <SectionHeader title="Criar novo token" />
        <div className="grid sm:grid-cols-[220px_minmax(0,1fr)_auto] gap-3 items-end">
          <div className="text-sm text-gray-200">Nome</div>
          <Input placeholder="ex: CI GitHub Actions" />
          <Button onClick={()=>alert("(mock) criar token")}>Criar</Button>
        </div>

        <SectionHeader title="Tokens ativos" />
        <ul className="space-y-2">
          {tokens.map(t => (
            <li key={t.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-100">{t.name}</div>
                  <div className="text-xs text-gray-400">criado {t.created} • último uso {t.lastUsed}</div>
                </div>
                <div className="text-xs text-gray-400">{t.prefix}</div>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <CodeBox value={t.secret} masked />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={()=>alert("(mock) escopos")}>Escopos</Button>
                  <Button variant="danger" onClick={()=>confirm("Revogar token? (mock)")&&alert("Revogado!")}>Revogar</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
