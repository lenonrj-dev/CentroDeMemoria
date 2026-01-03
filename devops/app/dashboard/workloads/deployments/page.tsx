// file: app/dashboard/workloads/deployments/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Panel from "../../../../components/ui/Panel";
import DeploymentsFilterBar from "../../../../components/deployments/DeploymentsFilterBar";
import DeploymentsTable from "../../../../components/deployments/DeploymentsTable";
import DeploymentDetails from "../../../../components/deployments/DeploymentDetails";
import BulkActionsBar from "../../../../components/deployments/BulkActionsBar";
import usePagination from "../../../../components/pods/usePagination"; // reuso
import data from "../../../../lib/k8s/deploymentsData";

export default function DeploymentsPage() {
  // Busca (debounce)
  const [query, setQuery] = useState("");
  const [rawQuery, setRawQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("todos");       // todos | Disponível | Progredindo | Degradado
  const [namespace, setNamespace] = useState("todos");
  const [sortBy, setSortBy] = useState({ key: "name", dir: "asc" });
  const [selectedIds, setSelectedIds] = useState([]);
  const [focusedId, setFocusedId] = useState(null);

  const namespaces = useMemo(() => {
    const s = new Set(data.map(d => d.namespace));
    return ["todos", ...Array.from(s).sort()];
  }, []);

  // Debounce 300ms para a busca
  useEffect(() => {
    setLoading(true);
    const h = setTimeout(() => {
      setQuery(rawQuery);
      setPage(1);
      setLoading(false);
    }, 300);
    return () => clearTimeout(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawQuery]);

  // Reset de página ao alterar filtros principais
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, namespace, sortBy.key, sortBy.dir]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter(d => {
      const okQ = !q || [d.name, d.namespace].some(v => String(v).toLowerCase().includes(q));
      const okS = status === "todos" || d.status === status;
      const okNs = namespace === "todos" || d.namespace === namespace;
      return okQ && okS && okNs;
    });
  }, [query, status, namespace]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const { key, dir } = sortBy;
      const get = (x) => {
        if (key === "available") return x.replicas.available ?? 0;
        if (key === "desired") return x.replicas.desired ?? 0;
        return String(x[key]).toLowerCase();
      };
      const va = get(a), vb = get(b);
      const cmp = va > vb ? 1 : va < vb ? -1 : 0;
      return dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortBy]);

  const { page, totalPages, setPage, paged } = usePagination(sorted, 12);

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
      <Panel title="Deployments" subtitle={`${sorted.length} item(ns)`}>
        <DeploymentsFilterBar
          query={rawQuery} onQuery={setRawQuery}
          status={status} onStatus={setStatus}
          namespace={namespace} onNamespace={setNamespace}
          namespaces={namespaces}
          sortBy={sortBy} onSortBy={setSortBy}
          loading={loading}
        />

        {selectedIds.length > 0 && (
          <BulkActionsBar
            count={selectedIds.length}
            onClear={() => setSelectedIds([])}
            onRestart={() => alert(`(mock) rollout restart em ${selectedIds.length} deployment(s)`)}
            onDelete={() => {
              if (confirm(`Remover ${selectedIds.length} deployment(s)? (mock)`)) setSelectedIds([]);
            }}
            onPause={() => alert(`(mock) pausar ${selectedIds.length} deployment(s)`)}
            onResume={() => alert(`(mock) retomar ${selectedIds.length} deployment(s)`)}
          />
        )}

        <DeploymentsTable
          items={paged}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAllOnPage}
          onOpen={(id) => setFocusedId(id)}
          sortBy={sortBy}
          onSortBy={setSortBy}
          loading={loading}
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
        title="Detalhes do Deployment"
        subtitle={focusedId ? data.find(d => d.id === focusedId)?.name : "—"}
      >
        <DeploymentDetails
          deployment={focusedId ? data.find((d) => d.id === focusedId) : null}
          onClose={() => setFocusedId(null)}
        />
      </Panel>
    </div>
  );
}
