// file: components/releases/ReleaseDetails.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Play, Pause, RotateCcw, ArrowUpRight, History, FileText, Activity, Package, GitCommit } from "lucide-react";
import KVTable from "../cluster/KVTable";
import StatusPill from "./StatusPill";
import MiniSpark from "../k8s/MiniSpark";

const TABS = ["Resumo", "Artefatos", "Changelog", "Commits", "Aprovações", "Deploys", "Métricas", "Eventos"];

export default function ReleaseDetails({ rel, onClose }) {
  const [tab, setTab] = useState(TABS[0]);
  const [loading, setLoading] = useState(null); // 'promote' | 'pause' | 'resume' | 'canary' | 'rollback' | null
  const tabsRef = useRef([]);

  // ids para aria-controls
  const tabIds = useMemo(() => TABS.map((t) => `tab-${t.toLowerCase()}`), []);
  const panelIds = useMemo(() => TABS.map((t) => `panel-${t.toLowerCase()}`), []);

  // Ações (mocks assíncronos)
  const mock = useCallback((ms = 800) => new Promise((r) => setTimeout(r, ms)), []);

  const handlePromote = useCallback(async () => {
    if (!confirm("Promover este release? (mock)")) return;
    setLoading("promote");
    try {
      await mock();
      alert("(mock) Release promovido com sucesso!");
    } catch {
      alert("Falha ao promover (mock).");
    } finally {
      setLoading(null);
    }
  }, [mock]);

  const handlePauseResume = useCallback(async () => {
    const isPaused = rel?.status === "Pausado";
    const actionKey = isPaused ? "resume" : "pause";
    if (!confirm(`${isPaused ? "Retomar" : "Pausar"} este release? (mock)`)) return;
    setLoading(actionKey);
    try {
      await mock();
      alert(`(mock) Release ${isPaused ? "retomado" : "pausado"} com sucesso!`);
    } catch {
      alert(`Falha ao ${isPaused ? "retomar" : "pausar"} (mock).`);
    } finally {
      setLoading(null);
    }
  }, [mock, rel?.status]);

  const handleCanary = useCallback(async () => {
    if (!confirm("Iniciar deploy canário? (mock)")) return;
    setLoading("canary");
    try {
      await mock(1000);
      alert("(mock) Canário iniciado!");
    } catch {
      alert("Falha ao iniciar canário (mock).");
    } finally {
      setLoading(null);
    }
  }, [mock]);

  const handleRollback = useCallback(async () => {
    if (!confirm("Confirmar rollback para a versão anterior? (mock)")) return;
    setLoading("rollback");
    try {
      await mock(1200);
      alert("(mock) Rollback solicitado.");
    } catch {
      alert("Falha ao efetuar rollback (mock).");
    } finally {
      setLoading(null);
    }
  }, [mock]);

  // Navegação por teclado nas tabs
  const onTabsKeyDown = useCallback(
    (e) => {
      const currentIndex = TABS.indexOf(tab);
      if (currentIndex === -1) return;
      const focusTab = (i) => {
        const idx = ((i % TABS.length) + TABS.length) % TABS.length;
        setTab(TABS[idx]);
        requestAnimationFrame(() => {
          tabsRef.current[idx]?.focus();
        });
      };
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          focusTab(currentIndex + 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          focusTab(currentIndex - 1);
          break;
        case "Home":
          e.preventDefault();
          focusTab(0);
          break;
        case "End":
          e.preventDefault();
          focusTab(TABS.length - 1);
          break;
        default:
          break;
      }
    },
    [tab]
  );

  if (!rel) return <div className="text-sm text-gray-400">Selecione um release…</div>;

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}>
      {/* Ações */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onClose}
          type="button"
          className="px-2 py-1 text-xs rounded border border-white/10 bg-white/5 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
          aria-label="Fechar detalhes do release"
        >
          Fechar
        </button>

        <ActionButton onClick={handlePromote} icon={Rocket} label="Promover" loading={loading === "promote"} />

        {rel.status === "Pausado" ? (
          <ActionButton onClick={handlePauseResume} icon={Play} label="Retomar" loading={loading === "resume"} />
        ) : (
          <ActionButton onClick={handlePauseResume} icon={Pause} label="Pausar" loading={loading === "pause"} />
        )}

        <ActionButton onClick={handleCanary} icon={History} label="Iniciar canário" loading={loading === "canary"} />
        <ActionButton
          onClick={handleRollback}
          icon={RotateCcw}
          label="Rollback"
          loading={loading === "rollback"}
          variant="danger"
        />

        <a
          href={rel.pipelineUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
          aria-label="Abrir pipeline em nova aba"
        >
          <ArrowUpRight className="h-4 w-4" /> Pipeline
        </a>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Abas de detalhes do release" className="flex flex-wrap gap-2" onKeyDown={onTabsKeyDown}>
        {TABS.map((t, idx) => {
          const isActive = tab === t;
          return (
            <button
              key={t}
              ref={(el) => (tabsRef.current[idx] = el)}
              role="tab"
              id={tabIds[idx]}
              aria-selected={isActive}
              aria-controls={panelIds[idx]}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 ${
                isActive ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <motion.div
        key={tab}
        role="tabpanel"
        id={panelIds[TABS.indexOf(tab)]}
        aria-labelledby={tabIds[TABS.indexOf(tab)]}
        className="focus:outline-none"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {tab === "Resumo" && <SummaryTab d={rel} />}
        {tab === "Artefatos" && <ArtifactsTab d={rel} />}
        {tab === "Changelog" && <ChangelogTab d={rel} />}
        {tab === "Commits" && <CommitsTab d={rel} />}
        {tab === "Aprovações" && <ApprovalsTab d={rel} />}
        {tab === "Deploys" && <DeploysTab d={rel} />}
        {tab === "Métricas" && <MetricsTab d={rel} />}
        {tab === "Eventos" && <EventsTab d={rel} />}
      </motion.div>
    </motion.div>
  );
}

/* --------- Abas --------- */

function SummaryTab({ d }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Informações</h4>
        <KVTable rows={[
          ["Serviço", d.service],
          ["Versão", `v${d.version}`],
          ["Ambiente", d.envLabel],
          ["Status", <StatusPill key="st" status={d.status}/>],
          ["Autor", d.author],
          ["Commit", d.commit],
          ["Início", d.startedAt],
          ["Fim", d.finishedAt || "—"],
          ["Pipeline", <a key="pl" className="text-cyan-300 underline" href={d.pipelineUrl} target="_blank" rel="noreferrer noopener">abrir</a>],
        ]}/>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Progresso</h4>
        <div className="text-xs text-gray-400 mb-1">Taxa de erro</div>
        <MiniSpark points={d.metrics.errorRate} ariaLabel="Taxa de erro" showDot />
        <div className="text-xs text-gray-400 mt-3 mb-1">Latência p95 (ms)</div>
        <MiniSpark points={d.metrics.latencyP95} ariaLabel="Latência p95" showDot />
      </section>
    </div>
  );
}

function ArtifactsTab({ d }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3"><Package className="inline h-4 w-4 mr-2" />Artefatos</h4>
      <ul className="text-sm space-y-2">
        {d.artifacts.map((a, i) => (
          <li key={i} className="rounded border border-white/10 bg-white/5 p-3 flex items-center justify-between">
            <div className="truncate">
              <div className="text-gray-100">{a.name}</div>
              <div className="text-xs text-gray-400">{a.image}</div>
            </div>
            <a className="text-xs text-cyan-300 underline" href={a.registryUrl} target="_blank" rel="noreferrer noopener">registrar</a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ChangelogTab({ d }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3"><FileText className="inline h-4 w-4 mr-2" />Changelog</h4>
      <ul className="text-sm list-disc pl-5 space-y-1">
        {d.changelog.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
    </section>
  );
}

function CommitsTab({ d }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3"><GitCommit className="inline h-4 w-4 mr-2" />Commits</h4>
      <ul className="text-sm divide-y divide-white/10">
        {d.commits.map((c, i) => (
          <li key={i} className="py-2 flex items-center justify-between">
            <div className="truncate">
              <div className="text-gray-100">{c.sha.slice(0,7)} — {c.message}</div>
              <div className="text-xs text-gray-400">por {c.author} • {c.time}</div>
            </div>
            <a className="text-xs text-cyan-300 underline" href={c.url} target="_blank" rel="noreferrer noopener">ver</a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ApprovalsTab({ d }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Aprovações</h4>
      <ul className="text-sm space-y-2">
        {d.approvals.map((a, i) => (
          <li key={i} className="rounded border border-white/10 bg-white/5 p-3 flex items-center justify-between">
            <span>{a.user}</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded border ${a.state==="Aprovado"?"text-emerald-300 bg-emerald-500/10 border-emerald-500/20":"text-amber-300 bg-amber-500/10 border-amber-500/20"}`}>{a.state}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DeploysTab({ d }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Histórico de deploy</h4>
      <ul className="text-sm divide-y divide-white/10">
        {d.deploys.map((x, i) => (
          <li key={i} className="py-2 flex items-center justify-between">
            <div className="text-gray-200">{x.envLabel} • {x.type} • {x.time}</div>
            <div className="text-xs text-gray-400">{x.duration}s</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MetricsTab({ d }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3"><Activity className="inline h-4 w-4 mr-2" />Métricas (mock)</h4>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded border border-white/10 bg-white/5 p-3">
          <div className="text-xs text-gray-400 mb-1">Erro (%)</div>
          <MiniSpark points={d.metrics.errorRate} ariaLabel="erro" showDot />
        </div>
        <div className="rounded border border-white/10 bg-white/5 p-3">
          <div className="text-xs text-gray-400 mb-1">Latência p95 (ms)</div>
          <MiniSpark points={d.metrics.latencyP95} ariaLabel="latência" showDot />
        </div>
      </div>
    </section>
  );
}

function EventsTab({ d }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Eventos</h4>
      <ul className="text-sm divide-y divide-white/10">
        {d.events.map((e, i) => (
          <li key={i} className="py-2 flex items-start gap-3">
            <span className={`mt-0.5 text-[11px] px-1.5 py-0.5 rounded border ${e.type==="Warning"?"text-amber-300 bg-amber-500/10 border-amber-500/20":"text-emerald-300 bg-emerald-500/10 border-emerald-500/20"}`}>{e.type}</span>
            <div className="flex-1 min-w-0">
              <div className="text-gray-200 truncate">{e.message}</div>
              <div className="text-xs text-gray-400">{e.source} • {e.age}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* --------- Componentes auxiliares --------- */
function ActionButton({ onClick, icon: Icon, label, loading = false, variant = "default" }) {
  const base =
    "inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    default: "border-white/10 bg-white/5 hover:border-white/20",
    danger: "border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50",
  };
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`${base} ${variants[variant]}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-busy={loading ? "true" : "false"}
      aria-label={label}
      title={label}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80" aria-hidden="true" />
          <span>Processando…</span>
        </>
      ) : (
        <>
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </>
      )}
    </motion.button>
  );
}
