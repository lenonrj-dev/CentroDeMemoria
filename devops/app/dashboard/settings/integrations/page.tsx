// file: app/dashboard/settings/integrations/page.tsx
"use client";

import Panel from "../../../../components/ui/Panel";
import { SectionHeader, Button } from "../../../../components/settings/FormParts";
import { integrations } from "../../../../lib/settings/mock";

export default function Integrations() {
  return (
    <Panel title="Integrações" subtitle="Conecte provedores externos">
      <SectionHeader title="Conexões" />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {integrations.map(i => (
          <div key={i.key} className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-100">{i.name}</div>
              <span className={`text-[11px] px-1.5 py-0.5 rounded border ${i.connected ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" : "text-amber-300 bg-amber-500/10 border-amber-500/20"}`}>
                {i.connected ? "Conectado" : "Desconectado"}
              </span>
            </div>
            <div className="text-xs text-gray-400">Info: {i.info}</div>
            <div className="text-xs text-gray-400">Escopos: {i.scopes}</div>
            <div className="flex gap-2">
              {i.connected ? (
                <>
                  <Button variant="outline" onClick={()=>alert("(mock) configurar")}>Configurar</Button>
                  <Button variant="danger" onClick={()=>confirm("Desconectar? (mock)")&&alert("Ok")}>Desconectar</Button>
                </>
              ) : (
                <Button onClick={()=>alert("(mock) conectar "+i.name)}>Conectar</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
