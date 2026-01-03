// file: app/dashboard/nodes/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Cpu, HardDrive, MemoryStick, Server, Shield, Network, Settings2, Wrench } from "lucide-react";
import Panel from "../../../components/ui/Panel";
import MiniSpark from "../../../components/k8s/MiniSpark";
import StatusPill from "../../../components/nodes/StatusPill";
import KVTable from "../../../components/cluster/KVTable";
import ResourceMeter from "../../../components/cluster/ResourceMeter";
import NodeActions from "../../../components/nodes/NodeActions";
import nodes from "../../../lib/cluster/nodesData";

const TABS = ["Visão geral", "Recursos", "Pods", "Rótulos", "Taints", "Rede", "Versões", "Manutenção"];

export default function NodesPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(nodes[0]?.id || null);
  const [tab, setTab] = useState(TABS[0]);

  const filtered = useMemo(() => {
    if (!query) return nodes;
    const q = query.toLowerCase();
    return nodes.filter(n =>
      [n.name, n.role, n.osImage, n.internalIP, n.externalIP]
        .some(s => String(s).toLowerCase().includes(q))
    );
  }, [query]);

  const selected = useMemo(
    () => filtered.find(n => n.id === selectedId) || filtered[0],
    [filtered, selectedId]
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,500px)_1fr] gap-6">
      {/* Lista de nós */}
      <Panel title="Nós" subtitle={`${filtered.length} item(ns)`}>
        <div className="mb-3">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="Buscar por nome, IP, papel (worker/master)…"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10">
          <div className="grid grid-cols-[minmax(200px,1.4fr)_140px_140px_140px_100px] px-3 py-2 text-xs uppercase tracking-wide text-gray-400 bg-white/5">
            <div>Nome</div>
            <div className="flex items-center gap-2"><Cpu className="h-3 w-3" />CPU</div>
            <div className="flex items-center gap-2"><MemoryStick className="h-3 w-3" />Memória</div>
            <div className="flex items-center gap-2"><HardDrive className="h-3 w-3" />Disco</div>
            <div>Pods</div>
          </div>

          <ul className="divide-y divide-white/5">
            {filtered.map(n => (
              <li
                key={n.id}
                onClick={() => setSelectedId(n.id)}
                className={`grid grid-cols-[minmax(200px,1.4fr)_140px_140px_140px_100px] items-center px-3 py-2.5 hover:bg-white/5 cursor-pointer ${selected?.id === n.id ? "bg-cyan-500/5" : ""}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-7 w-7 grid place-items-center rounded-lg bg-white/5 border border-white/10">
                    <Server className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-100 truncate">{n.name}</span>
                      <StatusPill status={n.status} />
                    </div>
                    <div className="text-xs text-gray-400 truncate">{n.role} • {n.internalIP}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MiniSpark points={n.cpu.history} />
                  <span className="text-xs tabular-nums text-gray-300">{n.cpu.used.toFixed(1)}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <MiniSpark points={n.memory.history} />
                  <span className="text-xs tabular-nums text-gray-300">{n.memory.used.toFixed(1)}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <MiniSpark points={n.disk.history} />
                  <span className="text-xs tabular-nums text-gray-300">{n.disk.used.toFixed(1)}%</span>
                </div>

                <div className="text-sm text-gray-300">{n.pods.running}/{n.pods.capacity}</div>
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      {/* Detalhe do nó */}
      <Panel title="Detalhes do nó" subtitle={selected?.name || "—"}>
        {selected && (
          <div className="space-y-6">
            {/* Ações rápidas do nó */}
            <NodeActions node={selected} />

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 text-sm rounded-lg border ${tab === t ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/5 border-white/10 hover:border-white/20"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "Visão geral" && <OverviewTab n={selected} />}
            {tab === "Recursos" && <ResourcesTab n={selected} />}
            {tab === "Pods" && <PodsTab n={selected} />}
            {tab === "Rótulos" && <LabelsTab n={selected} />}
            {tab === "Taints" && <TaintsTab n={selected} />}
            {tab === "Rede" && <NetworkTab n={selected} />}
            {tab === "Versões" && <VersionsTab n={selected} />}
            {tab === "Manutenção" && <MaintenanceTab n={selected} />}
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ---------------------- TABS ---------------------- */

function OverviewTab({ n }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Resumo</h4>
        <KVTable rows={[
          ["Status", n.status],
          ["Papel", n.role],
          ["Pods (em execução)", `${n.pods.running}/${n.pods.capacity}`],
          ["Kubelet", n.versions.kubelet],
          ["Runtime", n.versions.containerRuntime],
          ["OS", `${n.osImage} (${n.kernelVersion})`],
        ]} />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Endereços</h4>
        <KVTable rows={[
          ["Hostname", n.hostname],
          ["IP interno", n.internalIP],
          ["IP externo", n.externalIP || "—"],
          ["CIDR", n.cidr || "—"],
        ]} />
      </section>
    </div>
  );
}

function ResourcesTab({ n }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <section className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h4 className="text-sm font-medium mb-3">Uso atual</h4>
          <div className="space-y-3">
            <ResourceMeter label="CPU" used={n.cpu.used} total={100} />
            <ResourceMeter label="Memória" used={n.memory.used} total={100} />
            <ResourceMeter label="Disco" used={n.disk.used} total={100} />
          </div>
        </section>
        <section className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h4 className="text-sm font-medium mb-3">Capacidades</h4>
          <KVTable rows={[
            ["CPU (allocatable)", `${n.cpu.allocatable} cores`],
            ["Memória (allocatable)", `${n.memory.allocatable} Gi`],
            ["Pods (allocatable)", n.pods.allocatable],
            ["Ephemeral storage", `${n.disk.capacity} Gi`],
          ]} />
        </section>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <PanelMini title="CPU (histórico)"><MiniSpark points={n.cpu.historyLong} height={120} strokeWidth={2} filled /></PanelMini>
        <PanelMini title="Memória (histórico)"><MiniSpark points={n.memory.historyLong} height={120} strokeWidth={2} filled /></PanelMini>
        <PanelMini title="Disco (histórico)"><MiniSpark points={n.disk.historyLong} height={120} strokeWidth={2} filled /></PanelMini>
      </div>
    </div>
  );
}

function PodsTab({ n }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Pods neste nó</h4>
      <ul className="text-sm divide-y divide-white/10">
        {n.pods.items.map(p => (
          <li key={p} className="py-2 flex items-center justify-between">
            <span className="text-gray-200">{p}</span>
            <span className="text-xs text-gray-400">Running</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LabelsTab({ n }) {
  const rows = Object.entries(n.labels).map(([k, v]) => [k, v]);
  return (
    <div className="space-y-3">
      <PanelMini title="Rótulos">
        <KVTable rows={rows} />
        <div className="mt-3 flex gap-2">
          <button className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Adicionar rótulo</button>
          <button className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Editar</button>
        </div>
      </PanelMini>
    </div>
  );
}

function TaintsTab({ n }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Taints</h4>
      {n.taints.length === 0 ? (
        <div className="text-sm text-gray-400">Sem taints.</div>
      ) : (
        <ul className="text-sm space-y-2">
          {n.taints.map((t, i) => (
            <li key={i} className="flex items-center justify-between rounded border border-white/10 bg-[#0e141b] px-3 py-2">
              <span>{t.key}={t.value}:{t.effect}</span>
              <button className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 hover:border-white/20">Remover</button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex gap-2">
        <button className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Adicionar taint</button>
      </div>
    </div>
  );
}

function NetworkTab({ n }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <PanelMini title="Interfaces / IPs">
        <KVTable rows={[
          ["Hostname", n.hostname],
          ["IP interno", n.internalIP],
          ["IP externo", n.externalIP || "—"],
          ["CIDR", n.cidr || "—"],
          ["Bridge", n.network.bridge || "—"],
        ]} />
      </PanelMini>
      <PanelMini title="Segurança">
        <KVTable rows={[
          ["CNI", n.network.cni],
          ["Firewall", n.network.firewall],
          ["Portas expostas", n.network.openPorts.join(", ") || "—"],
        ]} />
        <div className="mt-3 flex gap-2">
          <button className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Editar regras</button>
        </div>
      </PanelMini>
    </div>
  );
}

function VersionsTab({ n }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <PanelMini title="Kubernetes">
        <KVTable rows={[
          ["Kubelet", n.versions.kubelet],
          ["Kube-Proxy", n.versions.kubeProxy],
          ["Container Runtime", n.versions.containerRuntime],
        ]} />
      </PanelMini>
      <PanelMini title="Sistema Operacional">
        <KVTable rows={[
          ["OS", n.osImage],
          ["Kernel", n.kernelVersion],
          ["Arquitetura", n.arch],
        ]} />
      </PanelMini>
    </div>
  );
}

function MaintenanceTab({ n }) {
  return (
    <div className="space-y-4">
      <PanelMini title="Operações de manutenção">
        <div className="flex flex-wrap gap-2">
          <button className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Cordon</button>
          <button className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Uncordon</button>
          <button className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Drain (evacuar pods)</button>
          <button className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Reiniciar nó</button>
          <button className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Atualizar kubelet</button>
        </div>
      </PanelMini>

      <PanelMini title="Condições do nó">
        <ul className="text-sm grid sm:grid-cols-2 gap-2">
          {n.conditions.map(c => (
            <li key={c.type} className="rounded border border-white/10 bg-white/5 px-3 py-2 flex items-center justify-between">
              <span>{c.type}</span>
              <span className={`text-xs px-2 py-0.5 rounded border ${c.status === "True"
                  ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
                  : "text-rose-300 bg-rose-500/10 border-rose-500/20"}`}>
                {c.status}
              </span>
            </li>
          ))}
        </ul>
      </PanelMini>
    </div>
  );
}

/* util */
function PanelMini({ title, children }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">{title}</h4>
      {children}
    </section>
  );
}
