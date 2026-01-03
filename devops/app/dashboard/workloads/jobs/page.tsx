// file: app/dashboard/workloads/jobs/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Panel from "../../../../components/ui/Panel";
import JobsFilterBar from "../../../../components/jobs/JobsFilterBar";
import JobsTable from "../../../../components/jobs/JobsTable";
import JobDetails from "../../../../components/jobs/JobDetails";
import BulkActionsBar from "../../../../components/jobs/BulkActionsBar";
import usePagination from "../../../../components/pods/usePagination"; // reuso
import data from "../../../../lib/k8s/jobsData";

export default function JobsPage() {
  // busca com debounce: inputQuery é controlado pela UI, query é o valor efetivo (após 300ms)
  const [inputQuery, setInputQuery] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos"); // todos | Succeeded | Failed | Active | Suspended
  const [namespace, setNamespace] = useState("todos");
  const [sortBy, setSortBy] = useState({ key: "started", dir: "desc" }); // name | namespace | completions | started | duration
  const [selectedIds, setSelectedIds] = useState([]);
  const [focusedId, setFocusedId] = useState(null);

  // aplica debounce de 300ms para a busca
  useEffect(() => {
    const t = setTimeout(() => setQuery(inputQuery), 300);
    return () => clearTimeout(t);
  }, [inputQuery]);

  const namespaces = useMemo(() => {
    const s = new Set(data.map(j => j.namespace));
    return ["todos", ...Array.from(s).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter(j => {
      const okQ = !q || [j.name, j.namespace, j.owner].some(v => String(v).toLowerCase().includes(q));
      const okS = status === "todos" || j.status === status;
      const okNs = namespace === "todos" || j.namespace === namespace;
      return okQ && okS && okNs;
    });
  }, [query, status, namespace]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const { key, dir } = sortBy;
      const get = (x) => {
        if (key === "completions") return (x.succeeded ?? 0) / Math.max(1, x.completions ?? 1);
        if (key === "started") return x.startedAtEpoch ?? 0;
        if (key === "duration") return x.durationSec ?? 0;
        return String(x[key]).toLowerCase();
      };
      const va = get(a), vb = get(b);
      const cmp = va > vb ? 1 : va < vb ? -1 : 0;
      return dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortBy]);

  const { page, totalPages, setPage, paged } = usePagination(sorted, 12);

  // ao mudar filtros/ordem, volta para a primeira página
  useEffect(() => {
    setPage(1);
  }, [query, status, namespace, sortBy.key, sortBy.dir, setPage]);

  // se o item focado sair do dataset (após filtros/ordenar), limpa o foco
  useEffect(() => {
    if (!focusedId) return;
    const stillExists = sorted.some(j => j.id === focusedId);
    if (!stillExists) {
      setFocusedId(null);
    }
  }, [sorted, focusedId]);

  const toggleSelect = (id) =>
    setSelectedIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const toggleSelectAllOnPage = () =>
    setSelectedIds((cur) => {
      const idsOnPage = paged.map((p) => p.id);
      const allSelected = idsOnPage.every((id) => cur.includes(id));
      return allSelected ? cur.filter((id) => !idsOnPage.includes(id)) : Array.from(new Set([...cur, ...idsOnPage]));
    });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_480px] gap-6">
      {/* LISTA */}
      <Panel title="Jobs" subtitle={`${sorted.length} item(ns)`}>
        <JobsFilterBar
          query={inputQuery} onQuery={setInputQuery}
          status={status} onStatus={setStatus}
          namespace={namespace} onNamespace={setNamespace}
          namespaces={namespaces}
          sortBy={sortBy} onSortBy={setSortBy}
        />

        {selectedIds.length > 0 && (
          <BulkActionsBar
            count={selectedIds.length}
            onClear={() => setSelectedIds([])}
            onRerun={() => alert(`(mock) reexecutar ${selectedIds.length} job(s)`)}
            onStop={() => alert(`(mock) parar ${selectedIds.length} job(s)`)}
            onDelete={() => { if (confirm(`Remover ${selectedIds.length} job(s)? (mock)`)) setSelectedIds([]); }}
            onIncreaseBackoff={() => alert(`(mock) aumentar backoff em massa`)}
            onForceComplete={() => alert(`(mock) marcar como completo`)}
          />
        )}

        <JobsTable
          items={paged}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAllOnPage}
          onOpen={(id) => setFocusedId(id)}
          sortBy={sortBy}
          onSortBy={setSortBy}
        />

        {/* Paginação */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
              disabled={page === 1}
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
              disabled={page === totalPages}
            >
              Próxima
            </button>
          </div>
        </div>
      </Panel>

      {/* DETALHES */}
      <Panel
        title="Detalhes do Job"
        subtitle={focusedId ? data.find(j => j.id === focusedId)?.name : "—"}
      >
        <JobDetails
          job={focusedId ? data.find((j) => j.id === focusedId) : null}
          onClose={() => setFocusedId(null)}
        />
      </Panel>
    </div>
  );
}
