// file: app/dashboard/releases/page.tsx
"use client";

import { useMemo, useState } from "react";
import Panel from "../../../components/ui/Panel";
import ReleasesFilterBar from "../../../components/releases/ReleasesFilterBar";
import ReleasesTable from "../../../components/releases/ReleasesTable";
import ReleaseDetails from "../../../components/releases/ReleaseDetails";
import usePagination from "../../../components/pods/usePagination";
import data from "../../../lib/k8s/releasesData";

const TABS = ["Todos", "Produção", "Staging", "Desenvolvimento"];

export default function ReleasesPage() {
  const [tab, setTab] = useState(TABS[0]);
  const [query, setQuery] = useState("");
  const [env, setEnv] = useState("todos");      // prod | stg | dev
  const [status, setStatus] = useState("todos"); // Em progresso | Concluído | Falhou | Pausado
  const [sortBy, setSortBy] = useState({ key: "startedAtEpoch", dir: "desc" });

  const [selectedIds, setSelectedIds] = useState([]);
  const [focusedId, setFocusedId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const envFromTab =
      tab === "Produção" ? "prod" : tab === "Staging" ? "stg" : tab === "Desenvolvimento" ? "dev" : "todos";

    return data.filter(r => {
      const okQ =
        !q ||
        [r.name, r.version, r.commit, r.author, r.service].some(s =>
          String(s).toLowerCase().includes(q)
        );
      const okEnv =
        (env === "todos" ? true : r.env === env) &&
        (envFromTab === "todos" ? true : r.env === envFromTab);
      const okStatus = status === "todos" ? true : r.status === status;
      return okQ && okEnv && okStatus;
    });
  }, [query, env, status, tab]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const { key, dir } = sortBy;
      const get = (x) => {
        if (key === "startedAtEpoch") return x.startedAtEpoch ?? 0;
        if (key === "finishedAtEpoch") return x.finishedAtEpoch ?? 0;
        if (key === "version") return x.versionWeight ?? 0; // semver weight pré-calculado
        return String(x[key] ?? "").toLowerCase();
      };
      const va = get(a), vb = get(b);
      const cmp = va > vb ? 1 : va < vb ? -1 : 0;
      return dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortBy]);

  const { page, totalPages, setPage, paged } = usePagination(sorted, 12);

  const toggleSelect = (id) =>
    setSelectedIds(cur => (cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]));
  const toggleSelectAllOnPage = () =>
    setSelectedIds(cur => {
      const ids = paged.map(p => p.id);
      const all = ids.every(id => cur.includes(id));
      return all ? cur.filter(id => !ids.includes(id)) : Array.from(new Set([...cur, ...ids]));
    });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_520px] gap-6">
      {/* LISTA */}
      <Panel title="Lançamentos" subtitle={`${sorted.length} release(s)`}>
        {/* Abas por ambiente */}
        <div className="mb-3 flex flex-wrap gap-2">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setFocusedId(null); setSelectedIds([]); }}
              className={`px-3 py-1.5 text-sm rounded-lg border ${tab === t ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/5 border-white/10 hover:border-white/20"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <ReleasesFilterBar
          query={query} onQuery={setQuery}
          env={env} onEnv={setEnv}
          status={status} onStatus={setStatus}
          sortBy={sortBy} onSortBy={setSortBy}
        />

        {/* Ações em massa (mock) */}
        {selectedIds.length > 0 && (
          <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
            <div className="text-gray-300">{selectedIds.length} selecionado(s)</div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
                onClick={() => alert(`(mock) promover ${selectedIds.length} release(s)`)}
              >
                Promover
              </button>
              <button className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
                onClick={() => alert(`(mock) iniciar canário para ${selectedIds.length}`)}
              >
                Iniciar canário
              </button>
              <button className="px-3 py-1.5 rounded border border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50"
                onClick={() => alert(`(mock) rollback de ${selectedIds.length}`)}
              >
                Rollback
              </button>
              <button className="px-2 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20" onClick={() => setSelectedIds([])}>
                Limpar
              </button>
            </div>
          </div>
        )}

        <ReleasesTable
          items={paged}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAllOnPage}
          onOpen={setFocusedId}
          sortBy={sortBy} onSortBy={setSortBy}
        />

        {/* Paginação */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20" disabled={page===1}>
              Anterior
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20" disabled={page===totalPages}>
              Próxima
            </button>
          </div>
        </div>
      </Panel>

      {/* DETALHES */}
      <Panel
        title="Detalhes do Lançamento"
        subtitle={focusedId ? (data.find(x => x.id === focusedId)?.name ?? "—") : "Selecione um release"}
      >
        <ReleaseDetails
          rel={focusedId ? data.find(x => x.id === focusedId) : null}
          onClose={() => setFocusedId(null)}
        />
      </Panel>
    </div>
  );
}
