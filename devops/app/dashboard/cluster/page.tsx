// file: app/dashboard/cluster/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Server, Power, RefreshCcw, HardDrive, Network, Shield, Database, Camera, Cog, Play, Pause } from "lucide-react";
import Panel from "../../../components/ui/Panel";
import MiniSpark from "../../../components/k8s/MiniSpark";
import ResourceMeter from "../../../components/cluster/ResourceMeter";
import KpiCard from "../../../components/cluster/KpiCard";
import ClusterActions from "../../../components/cluster/ClusterActions";
import KVTable from "../../../components/cluster/KVTable";
import clusters from "../../../lib/cluster/clusterData";
import { motion, AnimatePresence } from "framer-motion";

const TABS = ["Visão geral", "Recursos", "Armazenamento", "Rede", "Backups", "Logs", "Configurações"];

export default function ClusterPage() {
  const [selectedId, setSelectedId] = useState(clusters[0]?.id || null);
  const [tab, setTab] = useState(TABS[0]);
  const list = clusters;
  const selected = useMemo(() => list.find((c) => c.id === selectedId) || list[0], [list, selectedId]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,380px)_1fr] gap-6">
      {/* Lista de Clusters */}
      <Panel title="Clusters" subtitle={`${list.length} item(ns)`}>
        <ul className="divide-y divide-white/10">
          {list.map((c) => (
            <li
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`p-3 rounded-lg cursor-pointer hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 ${
                selected?.id === c.id ? "bg-cyan-500/5" : ""
              }`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelectedId(c.id);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 grid place-items-center rounded-lg bg-white/5 border border-white/10">
                  <Server className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{c.name}</p>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded border ${
                        c.status === "Running"
                          ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
                          : c.status === "Stopped"
                          ? "text-rose-300 bg-rose-500/10 border-rose-500/20"
                          : "text-amber-300 bg-amber-500/10 border-amber-500/20"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {c.provider} • {c.region} • {c.size}
                  </p>
                </div>
              </div>

              {/* Mini métricas */}
              <div className="mt-3 grid grid-cols-3 gap-3">
                <MiniStat label="CPU" value={`${c.cpu.used.toFixed(1)}%`} series={c.cpu.history} />
                <MiniStat label="Memória" value={`${c.memory.used.toFixed(1)}%`} series={c.memory.history} />
                <MiniStat label="Disco" value={`${c.disk.used.toFixed(1)}%`} series={c.disk.history} />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      {/* Detalhe do Cluster */}
      <Panel title="Detalhes do Cluster" subtitle={selected?.name || "—"}>
        {selected && (
          <div className="space-y-6">
            {/* Header com ações */}
            <ClusterActions cluster={selected} />

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  aria-pressed={tab === t}
                  className={`px-3 py-1.5 text-sm rounded-lg border ${
                    tab === t ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {tab === "Visão geral" && (
                <motion.div key="tab-overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <OverviewTab c={selected} />
                </motion.div>
              )}
              {tab === "Recursos" && (
                <motion.div key="tab-res" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <ResourcesTab c={selected} />
                </motion.div>
              )}
              {tab === "Armazenamento" && (
                <motion.div key="tab-sto" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <StorageTab c={selected} />
                </motion.div>
              )}
              {tab === "Rede" && (
                <motion.div key="tab-net" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <NetworkTab c={selected} />
                </motion.div>
              )}
              {tab === "Backups" && (
                <motion.div key="tab-bak" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <BackupsTab c={selected} />
                </motion.div>
              )}
              {tab === "Logs" && (
                <motion.div key="tab-logs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <LogsTab c={selected} />
                </motion.div>
              )}
              {tab === "Configurações" && (
                <motion.div key="tab-set" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <SettingsTab c={selected} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </Panel>
    </div>
  );
}

function MiniStat({ label, value, series }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-2 overflow-hidden">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="flex items-center justify-between gap-2">
        <MiniSpark points={series} width={110} />
        <span className="text-xs tabular-nums text-gray-200 shrink-0">{value}</span>
      </div>
    </div>
  );
}

/* ───────────────────────── TABS ───────────────────────── */

function OverviewTab({ c }) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          icon={Server}
          label="Status"
          value={c.status}
          accent={c.status === "Running" ? "emerald" : c.status === "Stopped" ? "rose" : "amber"}
        />
        <KpiCard icon={Database} label="MongoDB" value={c.mongodb.status} hint={c.mongodb.version} accent={c.mongodb.status === "Online" ? "emerald" : "rose"} />
        <KpiCard icon={Camera} label="Agente de Captura" value={c.captureAgent.running ? "Ativo" : "Pausado"} accent={c.captureAgent.running ? "cyan" : "slate"} />
        <KpiCard icon={Shield} label="Firewall" value={c.security.firewall} hint={`${c.security.openPorts.length} portas abertas`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h4 className="text-sm font-medium mb-3">Uso de Recursos</h4>
          <div className="space-y-3">
            <ResourceMeter label="CPU" used={c.cpu.used} total={100} />
            <ResourceMeter label="Memória" used={c.memory.used} total={100} />
            <ResourceMeter label="Disco" used={c.disk.used} total={100} />
            <ResourceMeter label="Rede" used={c.network.used} total={100} />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h4 className="text-sm font-medium mb-3">Conexões</h4>
          <KVTable
            rows={[
              ["IP público", c.network.publicIP],
              ["IP privado", c.network.privateIP],
              ["SSH", `ssh ${c.ssh.user}@${c.network.publicIP}`],
              ["Mongo URI", c.mongodb.uri],
            ]}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => copyText(c.network.publicIP, "IP público copiado!")}
              className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 hover:border-white/20"
              aria-label="Copiar IP público"
            >
              Copiar IP público
            </button>
            <button
              onClick={() => copyText(`ssh ${c.ssh.user}@${c.network.publicIP}`, "Comando SSH copiado!")}
              className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 hover:border-white/20"
              aria-label="Copiar comando SSH"
            >
              Copiar SSH
            </button>
            <button
              onClick={() => copyText(c.mongodb.uri, "Mongo URI copiada!")}
              className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 hover:border-white/20"
              aria-label="Copiar Mongo URI"
            >
              Copiar Mongo URI
            </button>
            <button
              onClick={() => alert("(mock) Teste de conexão OK")}
              className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 hover:border-white/20"
            >
              Testar conexão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourcesTab({ c }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Scaler title="vCPU" value={c.scaling.vcpu} min={1} max={16} step={1} unit="cores" />
        <Scaler title="Memória" value={c.scaling.memoryGb} min={1} max={64} step={1} unit="GB" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <PanelMini title="CPU (histórico)">
          <MiniSpark points={c.cpu.historyLong} height={120} strokeWidth={2} filled />
        </PanelMini>
        <PanelMini title="Memória (histórico)">
          <MiniSpark points={c.memory.historyLong} height={120} strokeWidth={2} filled />
        </PanelMini>
      </div>
    </div>
  );
}

function StorageTab({ c }) {
  const [vols, setVols] = useState(c.volumes || []);
  useEffect(() => {
    setVols(c.volumes || []);
  }, [c]);
  const [busyId, setBusyId] = useState(null);

  const desmontar = async (id) => {
    setBusyId(id);
    await delay(600);
    setVols((prev) => prev.map((v) => (v.id === id ? { ...v, mountPath: "-" } : v)));
    setBusyId(null);
    alert("(mock) Volume desmontado.");
  };
  const adicionar = async () => {
    const name = prompt("Nome do volume:");
    if (!name) return;
    const nv = { id: `vol-${Date.now()}`, name, type: "gp3", sizeGb: 10, usedGb: 0, mountPath: "/mnt/" + name };
    setVols((v) => [...v, nv]);
  };
  const snapshot = async () => {
    setBusyId("snap");
    await delay(800);
    setBusyId(null);
    alert("(mock) Snapshot criado.");
  };

  return (
    <div className="space-y-4">
      <PanelMini title="Volumes">
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-400">
            <tr>
              <th className="text-left py-2">Nome</th>
              <th className="text-left py-2">Tipo</th>
              <th className="text-left py-2">Tamanho</th>
              <th className="text-left py-2">Uso</th>
              <th className="text-left py-2">Montagem</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {vols.map((v) => (
              <tr key={v.id}>
                <td className="py-2">{v.name}</td>
                <td className="py-2">{v.type}</td>
                <td className="py-2">{v.sizeGb} GB</td>
                <td className="py-2">{v.usedGb} GB</td>
                <td className="py-2">{v.mountPath}</td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => desmontar(v.id)}
                    disabled={busyId === v.id}
                    className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-60"
                    aria-busy={busyId === v.id}
                  >
                    {busyId === v.id ? "Desmontando…" : "Desmontar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex gap-2">
          <button onClick={adicionar} className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">
            Adicionar volume
          </button>
          <button
            onClick={snapshot}
            disabled={busyId === "snap"}
            className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-60"
          >
            {busyId === "snap" ? "Criando snapshot…" : "Snapshot"}
          </button>
        </div>
      </PanelMini>
    </div>
  );
}

function NetworkTab({ c }) {
  const [rebooting, setRebooting] = useState(false);
  const [ports, setPorts] = useState(c.security.openPorts || []);
  useEffect(() => {
    setPorts(c.security.openPorts || []);
  }, [c]);

  const editar = () => alert("(mock) Editor de regras exibido.");
  const addPort = () => {
    const p = prompt("Adicionar porta (ex.: 443/tcp):");
    if (!p) return;
    setPorts((prev) => Array.from(new Set([...prev, p])));
  };
  const associarElastic = () => alert("(mock) IP elástico associado.");
  const reiniciar = async () => {
    setRebooting(true);
    await delay(900);
    setRebooting(false);
    alert("(mock) Rede reiniciada.");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <PanelMini title="Firewall">
        <KVTable rows={[["Status", c.security.firewall], ["Portas abertas", ports.join(", ") || "—"]]} />
        <div className="mt-3 flex gap-2">
          <button onClick={editar} className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">
            Editar regras
          </button>
          <button onClick={addPort} className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">
            Adicionar porta
          </button>
        </div>
      </PanelMini>

      <PanelMini title="IPs / Rede">
        <KVTable rows={[["IP público", c.network.publicIP], ["IP privado", c.network.privateIP], ["VPC/Subnet", c.network.vpc]]} />
        <div className="mt-3 flex gap-2">
          <button onClick={associarElastic} className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">
            Associar IP elástico
          </button>
          <button
            onClick={reiniciar}
            disabled={rebooting}
            className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-60"
            aria-busy={rebooting}
          >
            {rebooting ? "Reiniciando…" : "Reiniciar rede"}
          </button>
        </div>
      </PanelMini>
    </div>
  );
}

function BackupsTab({ c }) {
  const [recent, setRecent] = useState(c.backup.recent || []);
  useEffect(() => {
    setRecent(c.backup.recent || []);
  }, [c]);
  const [running, setRunning] = useState(false);

  const executar = async () => {
    setRunning(true);
    await delay(1000);
    setRunning(false);
    const entry = { id: "bk-" + Date.now(), date: new Date().toISOString(), sizeGb: Math.max(1, Math.round(Math.random() * 5)) };
    setRecent((prev) => [entry, ...prev].slice(0, 20));
    alert("(mock) Backup executado com sucesso.");
  };
  const restaurar = () => {
    const id = prompt("ID do backup para restaurar (veja lista abaixo):");
    if (!id) return;
    alert(`(mock) Backup ${id} restaurado.`);
  };
  const baixar = (id) => downloadText(`backup:${id}`, `backup-${id}.txt`);

  return (
    <div className="space-y-3">
      <PanelMini title="Política">
        <KVTable rows={[["Agendamento", c.backup.schedule], ["Retenção", c.backup.retention], ["Último backup", c.backup.lastRun]]} />
        <div className="mt-3 flex gap-2">
          <button
            onClick={executar}
            disabled={running}
            className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-60"
            aria-busy={running}
          >
            {running ? "Executando…" : "Executar agora"}
          </button>
          <button onClick={restaurar} className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">
            Restaurar…
          </button>
        </div>
      </PanelMini>

      <PanelMini title="Backups recentes">
        <ul className="text-sm space-y-1">
          {recent.map((b) => (
            <li key={b.id} className="flex items-center justify-between rounded border border-white/10 bg-white/5 px-3 py-2">
              <span>
                {b.date} • {b.sizeGb} GB
              </span>
              <div className="flex gap-2">
                <button onClick={() => baixar(b.id)} className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 hover:border-white/20">
                  Baixar
                </button>
                <button onClick={() => alert(`(mock) Restaurando ${b.id}`)} className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 hover:border-white/20">
                  Restaurar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </PanelMini>
    </div>
  );
}

function LogsTab({ c }) {
  const [logs, setLogs] = useState(c.logs || []);
  useEffect(() => {
    setLogs(c.logs || []);
  }, [c]);
  const baixar = () => downloadText(logs.join("\n"), `logs-${c.name}.txt`);
  const limpar = () => {
    if (confirm("Limpar logs exibidos?")) setLogs([]);
  };
  return (
    <div className="rounded-xl border border-white/10 bg-[#0e141b] p-4">
      <div className="text-xs text-gray-400 mb-2">Logs recentes</div>
      <pre className="text-xs leading-relaxed whitespace-pre-wrap text-gray-200 max-h-[420px] overflow-auto">
{logs.join("\n")}
      </pre>
      <div className="mt-3 flex gap-2">
        <button onClick={baixar} className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">
          Baixar logs
        </button>
        <button onClick={limpar} className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">
          Limpar
        </button>
      </div>
    </div>
  );
}

function SettingsTab({ c }) {
  const [agent, setAgent] = useState(c.captureAgent);
  const [mongoBusy, setMongoBusy] = useState(false);
  const [compactBusy, setCompactBusy] = useState(false);
  useEffect(() => {
    setAgent(c.captureAgent);
  }, [c]);

  const toggleAgent = async () => {
    setAgent((a) => ({ ...a, running: !a.running }));
    await delay(400);
    alert(`(mock) Agente ${!agent.running ? "iniciado" : "pausado"}.`);
  };
  const testar = () => alert("(mock) Teste de captura realizado com sucesso.");
  const reiniciarMongo = async () => {
    setMongoBusy(true);
    await delay(1000);
    setMongoBusy(false);
    alert("(mock) Mongo reiniciado.");
  };
  const compactar = async () => {
    setCompactBusy(true);
    await delay(1200);
    setCompactBusy(false);
    alert("(mock) Compactação concluída.");
  };

  return (
    <div className="space-y-4">
      <PanelMini title="Agente de Captura (imagens/vídeos)">
        <KVTable rows={[["Status", agent.running ? "Ativo" : "Pausado"], ["Intervalo", agent.interval], ["Destino", agent.targetBucket]]} />
        <div className="mt-3 flex gap-2">
          <button onClick={toggleAgent} className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">
            {agent.running ? (
              <>
                <Pause className="inline h-4 w-4 mr-1" /> Pausar
              </>
            ) : (
              <>
                <Play className="inline h-4 w-4 mr-1" /> Iniciar
              </>
            )}
          </button>
          <button onClick={testar} className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">
            Testar agora
          </button>
        </div>
      </PanelMini>

      <PanelMini title="MongoDB">
        <KVTable rows={[["Status", c.mongodb.status], ["Versão", c.mongodb.version], ["Banco", c.mongodb.database], ["URI", c.mongodb.uri]]} />
        <div className="mt-3 flex gap-2">
          <button
            onClick={reiniciarMongo}
            disabled={mongoBusy}
            className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-60"
            aria-busy={mongoBusy}
          >
            {mongoBusy ? "Reiniciando…" : "Reiniciar Mongo"}
          </button>
          <button
            onClick={compactar}
            disabled={compactBusy}
            className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-60"
            aria-busy={compactBusy}
          >
            {compactBusy ? "Compactando…" : "Rodar compactação"}
          </button>
        </div>
      </PanelMini>
    </div>
  );
}

/* Utilitário painel mini */
function PanelMini({ title, children }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">{title}</h4>
      {children}
    </section>
  );
}

function Scaler({ title, value, min, max, step, unit }) {
  const [v, setV] = useState(value);
  const [busy, setBusy] = useState(false);
  const aplicar = async () => {
    setBusy(true);
    await delay(900);
    setBusy(false);
    alert(`(mock) ${title} ajustado para ${v} ${unit}.`);
  };
  const recriar = async () => {
    if (!confirm("Tem certeza que deseja recriar a VPS?")) return;
    setBusy(true);
    await delay(1200);
    setBusy(false);
    alert("(mock) VPS recriada.");
  };
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">{title}</h4>
        <span className="text-sm tabular-nums text-gray-200">
          {v} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className="w-full accent-cyan-500"
      />
      <div className="text-xs text-gray-400 mt-1">
        Mín: {min} • Máx: {max}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={aplicar}
          disabled={busy}
          className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-60"
          aria-busy={busy}
        >
          {busy ? "Aplicando…" : "Aplicar dimensionamento"}
        </button>
        <button
          onClick={recriar}
          disabled={busy}
          className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-60"
        >
          {busy ? "Processando…" : "Recriar VPS"}
        </button>
      </div>
    </section>
  );
}

/* Helpers locais */
async function copyText(text, okMsg) {
  try {
    if (navigator?.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    alert(okMsg || "Copiado!");
  } catch {
    alert("Não foi possível copiar.");
  }
}
function downloadText(content, filename = "download.txt") {
  try {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    alert("Não foi possível baixar o arquivo.");
  }
}
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
