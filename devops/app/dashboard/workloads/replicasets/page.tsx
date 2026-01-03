// file: app/dashboard/workloads/replicasets/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Panel from "../../../../components/ui/Panel";
import ReplicaSetsFilterBar from "../../../../components/replicasets/ReplicaSetsFilterBar";
import ReplicaSetsTable from "../../../../components/replicasets/ReplicaSetsTable";
import ReplicaSetDetails from "../../../../components/replicasets/ReplicaSetDetails";
import BulkActionsBar from "../../../../components/replicasets/BulkActionsBar";
import usePagination from "../../../../components/pods/usePagination"; // reuso
import data from "../../../../lib/k8s/replicasetsData";

export default function ReplicaSetsPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [health, setHealth] = useState("todos");       // todos | Saudável | Parcial | Degradado
  const [namespace, setNamespace] = useState("todos");
  const [sortBy, setSortBy] = useState({ key: "name", dir: "asc" });
  const [selectedIds, setSelectedIds] = useState([]);
  const [focusedId, setFocusedId] = useState(null);

  // Debounce de 300ms para busca
  useEffect(() => {
    setIsSearching(true);
    const t = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const namespaces = useMemo(() => {
    const s = new Set(data.map(x => x.namespace));
    return ["todos", ...Array.from(s).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    return data.filter(rs => {
      const okQ = !q || [rs.name, rs.namespace, rs.owner].some(v => String(v).toLowerCase().includes(q));
      const okH = health === "todos" || rs.health === health;
      const okNs = namespace === "todos" || rs.namespace === namespace;
      return okQ && okH && okNs;
    });
  }, [debouncedQuery, health, namespace]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const { key, dir } = sortBy;
      const get = (x) => {
        if (key === "ready") return x.status.readyReplicas ?? 0;
        if (key === "desired") return x.spec.replicas ?? 0;
        if (key === "available") return x.status.availableReplicas ?? 0;
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

  // Se o foco não existir mais após filtros/paginação, limpar
  useEffect(() => {
    if (focusedId && !sorted.some(r => r.id === focusedId)) setFocusedId(null);
  }, [sorted, focusedId]);

  return (
    <motion.div
      className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_460px] gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* LISTA */}
      <Panel
        title="ReplicaSets"
        subtitle={isSearching ? "Buscando..." : `${sorted.length} ${sorted.length === 1 ? "item" : "itens"}`}
      >
        <ReplicaSetsFilterBar
          query={query} onQuery={setQuery}
          health={health} onHealth={setHealth}
          namespace={namespace} onNamespace={setNamespace}
          namespaces={namespaces}
          sortBy={sortBy} onSortBy={setSortBy}
        />

        {selectedIds.length > 0 && (
          <BulkActionsBar
            count={selectedIds.length}
            onClear={() => setSelectedIds([])}
            onRestart={() => alert(`(mock) rolling restart de ${selectedIds.length} replicaset(s)`)}
            onDelete={() => { if (confirm(`Remover ${selectedIds.length} replicaset(s)? (mock)`)) setSelectedIds([]); }}
            onScale={() => alert("(mock) escalonar em massa")}
            onFixSelector={() => alert("(mock) ajustar selector em massa")}
          />
        )}

        {/* Estado vazio */}
        {!isSearching && sorted.length === 0 && (
          <div
            className="mt-4 rounded border border-white/10 bg-white/5 p-6 text-sm text-gray-300"
            role="status"
            aria-live="polite"
          >
            <p className="mb-3">Nenhum ReplicaSet encontrado com os filtros atuais.</p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setHealth("todos");
                  setNamespace("todos");
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
                aria-label="Limpar filtros e voltar à lista completa"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}

        {/* Tabela */}
        <motion.div
          key={`${page}-${debouncedQuery}-${health}-${namespace}-${sortBy.key}-${sortBy.dir}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <ReplicaSetsTable
            items={paged}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAllOnPage}
            onOpen={(id) => setFocusedId(id)}
            sortBy={sortBy}
            onSortBy={setSortBy}
          />
        </motion.div>

        {/* Paginação */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
              disabled={page === 1}
              aria-label="Página anterior"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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
        title="Detalhes do ReplicaSet"
        subtitle={focusedId ? data.find(s => s.id === focusedId)?.name : "—"}
      >
        <motion.div
          key={focusedId || "no-selection"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <ReplicaSetDetails
            rs={focusedId ? data.find((s) => s.id === focusedId) : null}
            onClose={() => setFocusedId(null)}
          />
        </motion.div>
      </Panel>
    </motion.div>
  );
}
