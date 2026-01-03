// file: app/dashboard/settings/kubernetes/page.tsx
"use client";

import Panel from "../../../../components/ui/Panel";
import { SectionHeader, FormRow, Input, Select, Button } from "../../../../components/settings/FormParts";
import { kube } from "../../../../lib/settings/mock";

export default function KubernetesSettings() {
  return (
    <Panel title="Kubernetes" subtitle="Clusters, autenticação e namespaces padrão">
      <div className="space-y-6">
        <SectionHeader title="Adicionar cluster" />
        <div className="space-y-4">
          <FormRow label="Nome do cluster"><Input placeholder="ex: prod-br" /></FormRow>
          <FormRow label="Contexto / API Server">
            <div className="grid sm:grid-cols-2 gap-2">
              <Input placeholder="ex: gke-prod-br (contexto)"/>
              <Input placeholder="https://api.prod.k8s.local (server)"/>
            </div>
          </FormRow>
          <FormRow label="Auth"><Select defaultValue="kubeconfig"><option>kubeconfig</option><option>OIDC</option><option>Token</option></Select></FormRow>
          <FormRow label="Namespace padrão"><Input placeholder="default"/></FormRow>
          <div className="flex justify-end"><Button onClick={()=>alert("(mock) adicionar cluster")}>Adicionar</Button></div>
        </div>

        <SectionHeader title="Clusters conectados" />
        <ul className="space-y-2">
          {kube.map(c => (
            <li key={c.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-100">{c.name} <span className="text-xs text-gray-400">({c.context})</span></div>
                  <div className="text-xs text-gray-400">{c.apiServer}</div>
                </div>
                <span className="text-[11px] px-1.5 py-0.5 rounded border text-emerald-300 bg-emerald-500/10 border-emerald-500/20">{c.status}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-400">NS padrão: {c.defaultNs} • Auth: {c.auth}</div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={()=>alert("(mock) testar conexão")}>Testar</Button>
                  <Button variant="outline" onClick={()=>alert("(mock) set default ns")}>Alterar NS</Button>
                  <Button variant="danger" onClick={()=>confirm("Remover cluster? (mock)")&&alert("Removido")}>Remover</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
