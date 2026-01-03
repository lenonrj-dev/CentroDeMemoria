// file: components/replicasets/ReplicaSetDetails.tsx
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Trash2, SlidersHorizontal, Wrench } from "lucide-react";
import KVTable from "../cluster/KVTable";

const TABS = ["Resumo", "Réplicas/Pods", "Estratégia", "Condições", "Eventos", "Template/Selector"];

export default function ReplicaSetDetails({ rs, onClose }) {
  const [tab, setTab] = useState(TABS[0]);
  const [desired, setDesired] = useState(rs?.spec?.replicas ?? 1);
  const [loading, setLoading] = useState(null); // 'restart' | 'applyReplicas' | 'fixSelector' | 'delete' | null
  const tabsRef = useRef([]);
  const tabIds = useMemo(() => TABS.map((t) => `tab-rs-${t.toLowerCase().replace(/\W+/g, "-")}`), []);
  const panelIds = useMemo(() => TABS.map((t) => `panel-rs-${t.toLowerCase().replace(/\W+/g, "-")}`), []);

  const mock = useCallback((ms = 800) => new Promise((r) => setTimeout(r, ms)), []);

  const run = useCallback(async (key, fn) => {
    setLoading(key);
    try {
      await fn?.();
    } finally {
      setLoading(null);
    }
  }, []);

  if (!rs) {
    return <div className="text-sm text-gray-400">Selecione um replicaset para ver os detalhes.</div>;
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Ações */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onClose}
          type="button"
          className="px-2 py-1 text-xs rounded border border-white/10 bg-white/5 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
          aria-label="Fechar detalhes do ReplicaSet"
        >
          Fechar
        </button>

        <ActionButton
          onClick={() =>
            run("restart", async () => {
              if (!confirm("Executar rolling restart neste ReplicaSet? (mock)")) return;
              await mock();
              alert("(mock) Rolling restart solicitado.");
            })
          }
          loading={loading === "restart"}
          icon={RotateCcw}
          label="Rolling restart"
        />

        <ActionButton
          onClick={() =>
            run("applyReplicas", async () => {
              // validação simples
              if (!Number.isInteger(desired) || desired < 0) {
                alert("Valor inválido para réplicas. Use um inteiro ≥ 0.");
                return;
              }
              if (!confirm(`Aplicar ${desired} réplica(s)? (mock)`)) return;
              await mock(900);
              alert(`(mock) Réplicas definidas para ${desired}.`);
            })
          }
          loading={loading === "applyReplicas"}
          icon={SlidersHorizontal}
          label="Aplicar réplicas"
        />

        <ActionButton
          onClick={() =>
            run("fixSelector", async () => {
              if (!confirm("Ajustar selector para corresponder aos rótulos do template? (mock)")) return;
              await mock(900);
              alert("(mock) Selector ajustado.");
            })
          }
          loading={loading === "fixSelector"}
          icon={Wrench}
          label="Corrigir selector"
        />

        <ActionButton
          onClick={() =>
            run("delete", async () => {
              if (!confirm("Excluir este ReplicaSet? (mock)")) return;
              await mock(1000);
              alert("(mock) ReplicaSet excluído.");
            })
          }
          loading={loading === "delete"}
          icon={Trash2}
          label="Excluir"
          variant="danger"
        />
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Abas de detalhes do ReplicaSet"
        className="flex flex-wrap gap-2"
        onKeyDown={(e) => {
          const idx = TABS.indexOf(tab);
          const focusTab = (i) => {
            const n = ((i % TABS.length) + TABS.length) % TABS.length;
            setTab(TABS[n]);
            requestAnimationFrame(() => tabsRef.current[n]?.focus());
          };
          switch (e.key) {
            case "ArrowRight":
              e.preventDefault(); focusTab(idx + 1); break;
            case "ArrowLeft":
              e.preventDefault(); focusTab(idx - 1); break;
            case "Home":
              e.preventDefault(); focusTab(0); break;
            case "End":
              e.preventDefault(); focusTab(TABS.length - 1); break;
            default:
              break;
          }
        }}
      >
        {TABS.map((t, i) => {
          const isActive = tab === t;
          return (
            <button
              key={t}
              ref={(el) => (tabsRef.current[i] = el)}
              role="tab"
              id={tabIds[i]}
              aria-controls={panelIds[i]}
              aria-selected={isActive}
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
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {tab === "Resumo" && <SummaryTab d={rs} />}
        {tab === "Réplicas/Pods" && (
          <ReplicasTab
            d={rs}
            desired={desired}
            setDesired={setDesired}
            applyDisabled={loading === "applyReplicas"}
            onApply={() => {
              const btn = document.getElementById("apply-replicas-btn");
              btn?.click();
            }}
          />
        )}
        {tab === "Estratégia" && <StrategyTab d={rs} />}
        {tab === "Condições" && <ConditionsTab d={rs} />}
        {tab === "Eventos" && <EventsTab d={rs} />}
        {tab === "Template/Selector" && <TemplateTab d={rs} />}
      </motion.div>
    </motion.div>
  );
}

/* ---------- TABS ---------- */

function SummaryTab({ d }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <motion.section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
        <h4 className="text-sm font-medium">Status</h4>
        <KVTable rows={[
          ["Nome", d.name],
          ["Namespace", d.namespace],
          ["Imagem", d.imageTag],
          ["Saúde", d.health],
          ["Owner", d.owner || "—"],
        ]} />
      </motion.section>

      <motion.section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
        <h4 className="text-sm font-medium">Réplicas</h4>
        <KVTable rows={[
          ["Desejadas", d.spec.replicas],
          ["Prontas", d.status.readyReplicas ?? 0],
          ["Disponíveis", d.status.availableReplicas ?? 0],
          ["Total", d.status.replicas ?? 0],
          ["Fully Labeled", d.status.fullyLabeledReplicas ?? 0],
        ]} />
      </motion.section>
    </div>
  );
}

function ReplicasTab({ d, desired, setDesired, applyDisabled, onApply }) {
  const isInvalid = !Number.isInteger(desired) || desired < 0;
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Escalonamento</h4>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="number"
          min={0}
          value={desired}
          onChange={(e) => {
            const val = e.target.value;
            const n = Number(val);
            if (!Number.isFinite(n)) { setDesired(0); return; }
            setDesired(Math.floor(n));
          }}
          className={`w-28 bg-[#0e141b] border rounded-lg px-3 py-2 text-sm ${isInvalid ? "border-rose-500/50 focus:ring-rose-500/30" : "border-white/10 focus:ring-cyan-500/40"}`}
          aria-invalid={isInvalid ? "true" : "false"}
          aria-describedby="replicas-help"
        />
        <button
          id="apply-replicas-btn"
          className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onApply}
          disabled={isInvalid || applyDisabled}
          aria-disabled={isInvalid || applyDisabled ? "true" : "false"}
        >
          Aplicar
        </button>
        <span id="replicas-help" className="text-xs text-gray-400">
          Informe um inteiro ≥ 0. Atual: <span className="text-gray-300">{d.spec.replicas}</span>
        </span>
      </div>

      <div className="mt-4 grid lg:grid-cols-2 gap-4">
        <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
          <h4 className="text-sm font-medium">Pods</h4>
          <ul className="text-sm divide-y divide-white/10">
            {d.pods.map(p => (
              <li key={p.name} className="py-2 flex items-center justify-between">
                <span className="text-gray-200">{p.name}</span>
                <span className="text-xs text-gray-400">{p.node} • {p.ready ? "Ready" : "NotReady"}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
          <h4 className="text-sm font-medium">Seleção de rótulos do dono</h4>
          <KVTable rows={Object.entries(d.selector).map(([k, v]) => [k, v])} />
          <div className="text-xs text-gray-400">
            Dica: Se `fullyLabeledReplicas` &lt; `replicas`, verifique se os rótulos do template correspondem ao selector.
          </div>
        </section>
      </div>
    </section>
  );
}

function StrategyTab({ d }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="text-sm font-medium mb-3">Estratégia de Update</h4>
        <KVTable rows={[
          ["Min Ready Seconds", d.minReadySeconds ?? 0],
          ["Delete Policy", d.deletePolicy || "—"],
        ]} />
        <div className="mt-3 flex gap-2">
          <button className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Ajustar minReadySeconds</button>
          <button className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Forçar recreate</button>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="text-sm font-medium mb-3">Histórico (revisions)</h4>
        <ul className="text-sm space-y-2">
          {d.revisions.map(r => (
            <li key={r.rev} className="flex items-center justify-between rounded border border-white/10 bg-white/5 px-3 py-2">
              <span>rev {r.rev} • {r.image}</span>
              <button className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 hover:border-white/20">Reverter</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ConditionsTab({ d }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Condições</h4>
      <table className="w-full text-sm">
        <thead className="text-xs text-gray-400">
          <tr>
            <th className="text-left py-2">Tipo</th>
            <th className="text-left py-2">Status</th>
            <th className="text-left py-2">Últ. Atualização</th>
            <th className="text-left py-2">Transição</th>
            <th className="text-left py-2">Motivo</th>
            <th className="text-left py-2">Mensagem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {d.conditions.map((c, i) => (
            <tr key={i}>
              <td className="py-2">{c.type}</td>
              <td className="py-2">{c.status}</td>
              <td className="py-2">{c.lastUpdate}</td>
              <td className="py-2">{c.lastTransition}</td>
              <td className="py-2">{c.reason}</td>
              <td className="py-2">{c.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function EventsTab({ d }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-medium mb-3">Eventos recentes</h4>
      <ul className="text-sm divide-y divide-white/10">
        {d.events.map(ev => (
          <li key={ev.id} className="py-2 flex items-start gap-3">
            <span className={`mt-0.5 text-[11px] px-1.5 py-0.5 rounded border ${
              ev.type === "Warning" ? "text-amber-300 bg-amber-500/10 border-amber-500/20" : "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
            }`}>
              {ev.type}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-gray-200 truncate">{ev.message}</div>
              <div className="text-xs text-gray-400">{ev.reason} • {ev.object} • {ev.age}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TemplateTab({ d }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Selector</h4>
        <KVTable rows={Object.entries(d.selector).map(([k, v]) => [k, v])} />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-sm font-medium">Template (rótulos)</h4>
        {Object.entries(d.template.labels).length === 0
          ? <div className="text-sm text-gray-400">Sem rótulos.</div>
          : <KVTable rows={Object.entries(d.template.labels).map(([k, v]) => [k, v])} />
        }
        <div className="text-xs text-gray-400">
          Containers: {d.template.containers.map(c => `${c.name} (${c.image})`).join(", ")}
        </div>
      </section>
    </div>
  );
}

/* ------- Auxiliares ------- */
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
      className={`${base} ${variants[variant]}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-busy={loading ? "true" : "false"}
      aria-label={label}
      title={label}
      disabled={loading}
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
