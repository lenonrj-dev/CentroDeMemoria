// file: app/dashboard/workloads/daemonsets/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Panel from "../../../../components/ui/Panel";
import DaemonSetsFilterBar from "../../../../components/daemonsets/DaemonSetsFilterBar";
import DaemonSetsTable from "../../../../components/daemonsets/DaemonSetsTable";
import DaemonSetDetails from "../../../../components/daemonsets/DaemonSetDetails";
import BulkActionsBar from "../../../../components/daemonsets/BulkActionsBar";
import usePagination from "../../../../components/pods/usePagination"; // reuso
import data from "../../../../lib/k8s/daemonsetsData";

export default function DaemonSetsPage() {
  // Busca com debounce
  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("todos"); // todos | Saudável | Parcial | Degradado
  const [namespace, setNamespace] = useState("todos");
  const [sortBy, setSortBy] = useState({ key: "name", dir: "asc" });

  const [selectedIds, setSelectedIds] = useState([]);
  const [focusedId, setFocusedId] = useState(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setQuery(rawQuery);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [rawQuery]);

  const namespaces = useMemo(() => {
    const s = new Set(data.map((d) => d.namespace));
    return ["todos", ...Array.from(s).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((d) => {
      const okQ = !q || [d.name, d.namespace].some((v) => String(v).toLowerCase().includes(q));
      const okS = status === "todos" || d.health === status; // Saudável | Parcial | Degradado
      const okNs = namespace === "todos" || d.namespace === namespace;
      return okQ && okS && okNs;
    });
  }, [query, status, namespace]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const { key, dir } = sortBy;
      const get = (x) => {
        if (key === "ready") return x.status.numberReady ?? 0;
        if (key === "desired") return x.status.desiredNumberScheduled ?? 0;
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

  // Reset de página quando filtros ou ordenação mudam
  useEffect(() => {
    setPage(1);
  }, [query, status, namespace, sortBy.key, sortBy.dir, setPage]);

  // Limpar seleção/foco ao trocar filtros/busca/namespace
  useEffect(() => {
    setSelectedIds([]);
    setFocusedId(null);
  }, [query, status, namespace]);

  // Garantir que a página atual exista após mudanças de totalPages
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
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_460px] gap-6">
      {/* LISTA */}
      <Panel
        title="DaemonSets"
        subtitle={`${sorted.length} item(ns)`}
        loading={loading}
        empty={!loading && sorted.length === 0}
        emptyMessage="Nenhum DaemonSet encontrado para os filtros aplicados."
      >
        <DaemonSetsFilterBar
          query={rawQuery}
          onQuery={setRawQuery}
          status={status}
          onStatus={setStatus}
          namespace={namespace}
          onNamespace={setNamespace}
          namespaces={namespaces}
          sortBy={sortBy}
          onSortBy={setSortBy}
          loading={loading}
        />

        {/* Feedback de busca / resultados */}
        {(rawQuery || loading) && (
          <div className="mb-2 text-xs text-gray-400">
            {loading ? `Buscando por “${rawQuery}”…` : `${sorted.length} resultado(s) para “${query}”`}
          </div>
        )}

        {/* Tabela - renderiza apenas quando há dados e não está carregando (o Panel já lida com loading/empty) */}
        {!loading && sorted.length > 0 && (
          <DaemonSetsTable
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
      <Panel
        title="Detalhes do DaemonSet"
        subtitle={focusedId ? data.find((d) => d.id === focusedId)?.name : "—"}
      >
        <DaemonSetDetails ds={focusedId ? data.find((d) => d.id === focusedId) : null} onClose={() => setFocusedId(null)} />
      </Panel>
    </div>
  );
}
