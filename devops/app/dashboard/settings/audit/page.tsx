// file: app/dashboard/settings/audit/page.tsx
"use client";

import Panel from "../../../../components/ui/Panel";
import { audits } from "../../../../lib/settings/mock";

export default function AuditSettings() {
  return (
    <Panel title="Auditoria" subtitle="Registro de ações e mudanças">
      <div className="overflow-hidden rounded-xl border border-white/10">
        <div className="grid grid-cols-[220px_1fr_1fr_1fr_1fr] px-3 py-2 text-xs uppercase tracking-wide text-gray-400 bg-white/5">
          <div>Data/Hora</div><div>Ator</div><div>Ação</div><div>Alvo</div><div>IP</div>
        </div>
        <ul className="divide-y divide-white/5">
          {audits.map(a => (
            <li key={a.id} className="grid grid-cols-[220px_1fr_1fr_1fr_1fr] items-center px-3 py-2.5">
              <div className="text-sm text-gray-300">{a.time}</div>
              <div className="text-sm text-gray-300">{a.actor}</div>
              <div className="text-sm text-gray-300">{a.action}</div>
              <div className="text-sm text-gray-300">{a.target}</div>
              <div className="text-sm text-gray-300">{a.ip}</div>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
