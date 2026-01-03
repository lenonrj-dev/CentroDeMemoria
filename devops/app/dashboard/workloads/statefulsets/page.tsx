// file: app/dashboard/workloads/statefulsets/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Panel from "../../../../components/ui/Panel";
import StatefulSetsFilterBar from "../../../../components/statefulsets/StatefulSetsFilterBar";
import StatefulSetsTable from "../../../../components/statefulsets/StatefulSetsTable";
import StatefulSetDetails from "../../../../components/statefulsets/StatefulSetDetails";
import BulkActionsBar from "../../../../components/statefulsets/BulkActionsBar";
import usePagination from "../../../../components/pods/usePagination"; // reuso
import data from "../../../../lib/k8s/statefulsetsData";

export default function StatefulSetsPage() {
  const [query, setQuery] = useState("");
  const [health, setHealth] = useState("todos");       // todos | Saudável | Parcial | Degradado
  const [namespace, setNamespace] = useState("todos");
  const [sortBy, setSortBy] = useState({ key: "name", dir: "asc" });
  const [selectedIds, setSelectedIds] = useState([]);
  const [focusedId, setFocusedId] = useState(null);

  const namespaces = useMemo(() => {
    const s = new Set(data.map(x => x.namespace));
    return ["todos", ...Array.from(s).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter(s => {
      const okQ = !q || [s.name, s.namespace].some(v => String(v).toLowerCase().includes(q));
      const okH = health === "todos" || s.health === health;
      const okNs = namespace === "todos" || s.namespace === namespace;
      return okQ && okH && okNs;
    });
  }, [query, health, namespace]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const { key, dir } = sortBy;
      const get = (x) => {
        if (key === "ready") return x.status.readyReplicas ?? 0;
        if (key === "desired") return x.spec.replicas ?? 0;
        return String(x[key]).toLowerCase();
      };
      const va = get(a), vb = get(b);
      const cmp = va > vb ? 1 : va < vb ? -1 : 0;
      return dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortBy]);

  const { page, totalPages, setPage, paged } = usePagination(sorted, 12);

  // Sempre que filtros ou busca mudarem: volta para página 1 e limpa seleção
  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [query, health, namespace, setPage]);

  const toggleSelect = (id) =>
    setSelectedIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const toggleSelectAllOnPage = () =>
    setSelectedIds((cur) => {
      const idsOnPage = paged.map((p) => p.id);
      const allSelected = idsOnPage.every((id) => cur.includes(id));
      return allSelected ? cur.filter((id) => !idsOnPage.includes(id)) : Array.from(new Set([...cur, ...idsOnPage]));
    });

  // Limpa seleção quando a paginação muda (evita seleção “fora da página”)
  useEffect(() => {
    setSelectedIds((cur) => cur.filter((id) => paged.some((p) => p.id === id)));
  }, [page, paged]);

  // Item focado memoizado
  const focusedItem = useMemo(() => (focusedId ? data.find((s) => s.id === focusedId) : null), [focusedId]);

  const handleClearFilters = () => {
    setQuery("");
    setHealth("todos");
    setNamespace("todos");
    setPage(1);
    setSelectedIds([]);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_480px] gap-6">
      {/* LISTA */}
      <Panel title="StatefulSets" subtitle={`${sorted.length} item(ns)`}>
        <StatefulSetsFilterBar
          query={query} onQuery={setQuery}
          health={health} onHealth={setHealth}
          namespace={namespace} onNamespace={setNamespace}
          namespaces={namespaces}
          sortBy={sortBy} onSortBy={setSortBy}
          // Props extras opcionais (componentes que não usam serão indiferentes)
          debounce
          onClear={handleClearFilters}
        />

        {selectedIds.length > 0 && (
          <BulkActionsBar
            count={selectedIds.length}
            onClear={() => setSelectedIds([])}
            onRestart={() => alert(`(mock) rolling restart em ${selectedIds.length} statefulset(s)`)}
            onDelete={() => { if (confirm(`Remover ${selectedIds.length} statefulset(s)? (mock)`)) setSelectedIds([]); }}
            onUpdateStrategy={() => alert("(mock) atualizar estratégia em massa")}
            onScale={() => alert("(mock) escalonar em massa")}
          />
        )}

        <StatefulSetsTable
          items={paged}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAllOnPage}
          onOpen={(id) => setFocusedId(id)}
          sortBy={sortBy}
          onSortBy={setSortBy}
          onClearFilters={handleClearFilters}
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
        title="Detalhes do StatefulSet"
        subtitle={focusedItem ? focusedItem.name : "—"}
      >
        <StatefulSetDetails
          sset={focusedItem}
          onClose={() => setFocusedId(null)}
        />
      </Panel>
    </div>
  );
}
