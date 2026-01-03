"use client";

import { useMemo, useState } from "react";
import { Play, GitBranch, Clock3, Users, Loader2 } from "lucide-react";
import Panel from "../../../components/ui/Panel";
import StatusBadge from "../../../components/devops/StatusBadge";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import MiniSpark from "../../../components/k8s/MiniSpark";
import { pipelinesSeed } from "../../../lib/devops/pipelines";
import { useToast } from "../../../components/providers/ToastProvider";

const STATUS_FILTER = ["todos", "SUCESSO", "FALHA", "EM EXECUÇÃO"];

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState(pipelinesSeed);
  const [filter, setFilter] = useState("todos");
  const [runningId, setRunningId] = useState("");
  const { pushToast } = useToast();

  const filtered = useMemo(() => {
    if (filter === "todos") return pipelines;
    return pipelines.filter((p) => p.status === filter);
  }, [filter, pipelines]);

  const runPipeline = (pipe) => {
    setRunningId(pipe.id);
    pushToast({ title: `Executando ${pipe.name}`, description: "Pipeline disparada com parâmetros padrão" });
    setPipelines((prev) =>
      prev.map((p) =>
        p.id === pipe.id ? { ...p, status: "EM EXECUÇÃO", lastRun: "agora", history: [{ id: `r-${Date.now()}`, status: "EM EXECUÇÃO", duration: "-", by: "you", time: "agora" }, ...p.history] } : p
      )
    );
    setTimeout(() => {
      const success = Math.random() > 0.25;
      setPipelines((prev) =>
        prev.map((p) =>
          p.id === pipe.id
            ? {
                ...p,
                status: success ? "SUCESSO" : "FALHA",
                duration: success ? "6m 01s" : "1m 12s",
                history: [{ id: `r-${Date.now()}`, status: success ? "SUCESSO" : "FALHA", duration: success ? "6m01s" : "1m12s", by: "you", time: "agora" }, ...p.history].slice(0, 6),
              }
            : p
        )
      );
      setRunningId("");
      pushToast({
        title: success ? "Pipeline concluída" : "Pipeline falhou",
        description: pipe.name,
        tone: success ? "success" : "danger",
      });
    }, 1200);
  };

  return (
    <div className="space-y-5">
      <Panel
        title="Pipelines"
        subtitle="Build, testes e promoção de deploys"
        actions={
          <div className="flex items-center gap-2">
            <Badge tone="info">CI/CD</Badge>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-white/10 bg-[#0c1118] px-3 py-2 text-sm"
            >
              {STATUS_FILTER.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <div className="grid lg:grid-cols-2 gap-3">
          {filtered.map((pipe) => (
            <div key={pipe.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-100">{pipe.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <GitBranch className="h-4 w-4" />
                    {pipe.branch}
                  </p>
                  <p className="text-xs text-gray-300 flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {pipe.author} · {pipe.lastRun}
                  </p>
                </div>
                <StatusBadge value={pipe.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
                  <p>Duração</p>
                  <p className="text-sm text-gray-100">{pipe.duration}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
                  <p>Último status</p>
                  <p className="text-sm text-gray-100">{pipe.status}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="w-40">
                  <MiniSpark points={[0.1, 0.2, 0.25, 0.3, 0.28, 0.32, 0.35]} height={40} />
                </div>
                <Button
                  size="sm"
                  icon={Play}
                  loading={runningId === pipe.id}
                  disabled={runningId && runningId !== pipe.id}
                  onClick={() => runPipeline(pipe)}
                >
                  Rodar pipeline
                </Button>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0b0f14] p-3">
                <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                  <Clock3 className="h-4 w-4" />
                  Histórico recente
                </div>
                <ul className="space-y-1">
                  {pipe.history.map((run) => (
                    <li key={run.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-200">{run.id}</span>
                      <div className="flex items-center gap-2">
                        <StatusBadge value={run.status} />
                        <span className="text-xs text-gray-400">{run.duration}</span>
                        <span className="text-xs text-gray-400">{run.time}</span>
                        <span className="text-xs text-gray-400">{run.by}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {runningId && (
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Executando {runningId}...
        </div>
      )}
    </div>
  );
}
