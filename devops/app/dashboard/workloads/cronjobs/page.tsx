// file: app/dashboard/workloads/cronjobs/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Panel from "../../../../components/ui/Panel";
import CronJobsFilterBar from "../../../../components/cronjobs/CronJobsFilterBar";
import CronJobsTable from "../../../../components/cronjobs/CronJobsTable";
import CronJobDetails from "../../../../components/cronjobs/CronJobDetails";
import BulkActionsBar from "../../../../components/cronjobs/BulkActionsBar";
import usePagination from "../../../../components/pods/usePagination"; // reuso
import data from "../../../../lib/k8s/cronjobsData";

export default function CronJobsPage() {
  // Busca com debounce: usamos rawQuery para o input e query (debounced) no filtro
  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("todos"); // todos | Ativo | Suspenso
  const [namespace, setNamespace] = useState("todos");
  const [sortBy, setSortBy] = useState({ key: "next", dir: "asc" }); // name | namespace | next | last | suspend
  const [selectedIds, setSelectedIds] = useState([]);
  const [focusedId, setFocusedId] = useState(null);

  // Debounce de 300ms para busca
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setQuery(rawQuery);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [rawQuery]);

  const namespaces = useMemo(() => {
    const s = new Set(data.map((x) => x.namespace));
    return ["todos", ...Array.from(s).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((cj) => {
      const okQ = !q || [cj.name, cj.namespace].some((v) => String(v).toLowerCase().includes(q));
      const okS = status === "todos" || (status === "Ativo" ? !cj.suspend : cj.suspend);
      const okNs = namespace === "todos" || cj.namespace === namespace;
      return okQ && okS && okNs;
    });
  }, [query, status, namespace]);

  // limpar seleção ao trocar filtros/busca/namespace
  useEffect(() => {
    setSelectedIds([]);
    setFocusedId(null);
  }, [query, status, namespace]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const { key, dir } = sortBy;
      const get = (x) => {
        if (key === "next") return x.nextRunEpoch ?? Number.MAX_SAFE_INTEGER;
        if (key === "last") return x.lastScheduleEpoch ?? 0;
        if (key === "suspend") return x.suspend ? 1 : 0;
        return String(x[key]).toLowerCase();
      };
      const va = get(a),
        vb = get(b);
      const cmp = va > vb ? 1 : va < vb ? -1 : 0;
      return dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortBy]);

  const { page, totalPages, setPage, paged } = usePagination(sorted, 12);

  // Garantir que a página atual exista após mudanças de filtro/sort
  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), Math.max(1, totalPages)));
  }, [totalPages, setPage]);

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
      <Panel
        id="cronjobs-panel"
        title="CronJobs"
        subtitle={`${sorted.length} item(ns)`}
        loading={loading}
        empty={!loading && sorted.length === 0}
        emptyMessage="Nenhum resultado encontrado."
      >
        <CronJobsFilterBar
          query={rawQuery}
          onQuery={setRawQuery}
          status={status}
          onStatus={setStatus}
          namespace={namespace}
          onNamespace={setNamespace}
          namespaces={namespaces}
          sortBy={sortBy}
          onSortBy={setSortBy}
        />

        {/* Feedback de busca / resultados */}
        {(rawQuery || loading) && (
          <div className="mb-2 text-xs text-gray-400">
            {loading ? `Buscando por “${rawQuery}”…` : `${sorted.length} resultado(s) para “${query}”`}
          </div>
        )}

        {selectedIds.length > 0 && (
          <BulkActionsBar
            count={selectedIds.length}
            onClear={() => setSelectedIds([])}
            onRunNow={() => alert(`(mock) executar agora ${selectedIds.length} cronjob(s)`)}
            onSuspend={() => alert(`(mock) suspender ${selectedIds.length} cronjob(s)`)}
            onResume={() => alert(`(mock) retomar ${selectedIds.length} cronjob(s)`)}
            onUpdateSchedule={() => alert(`(mock) atualizar schedule em massa`)}
            onSetHistory={() => alert(`(mock) ajustar limites de histórico`)}
            onDelete={() => {
              if (confirm(`Excluir ${selectedIds.length} cronjob(s)? (mock)`)) setSelectedIds([]);
            }}
          />
        )}

        {/* Tabela (renderizada apenas quando há dados e não está carregando pelo próprio Panel) */}
        {!loading && sorted.length > 0 && (
          <CronJobsTable
            items={paged}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAllOnPage}
            onOpen={(id) => setFocusedId(id)}
            sortBy={sortBy}
            onSortBy={setSortBy}
          />
        )}

        {/* Paginação */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
              disabled={page === 1}
              aria-label="Página anterior"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
              disabled={page === totalPages}
              aria-label="Próxima página"
            >
              Próxima
            </button>
          </div>
        </div>
      </Panel>

      {/* DETALHES */}
      <Panel title="Detalhes do CronJob" subtitle={focusedId ? data.find((x) => x.id === focusedId)?.name : "—"}>
        <CronJobDetails cj={focusedId ? data.find((x) => x.id === focusedId) : null} onClose={() => setFocusedId(null)} />
      </Panel>
    </div>
  );
}
