// file: app/dashboard/workloads/pods/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Panel from "../../../../components/ui/Panel";
import PodsFilterBar from "../../../../components/pods/PodsFilterBar";
import PodsTable from "../../../../components/pods/PodsTable";
import PodDetails from "../../../../components/pods/PodDetails";
import BulkActionsBar from "../../../../components/pods/BulkActionsBar";
import usePagination from "../../../../components/pods/usePagination";
import data from "../../../../lib/k8s/podsData";

export default function PodsPage() {
  // Busca (controlada) + debounce para filtro eficaz
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [status, setStatus] = useState("todos");       // todos | Running | Pending | Failed | Succeeded | Unknown
  const [namespace, setNamespace] = useState("todos"); // 'todos' ou nome do ns
  const [sortBy, setSortBy] = useState({ key: "name", dir: "asc" });
  const [selectedIds, setSelectedIds] = useState([]);
  const [focusedId, setFocusedId] = useState(null);

  // Debounce de 300ms para a busca
  useEffect(() => {
    setIsSearching(true);
    const t = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const namespaces = useMemo(() => {
    const s = new Set(data.map(p => p.namespace));
    return ["todos", ...Array.from(s).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    return data.filter(p => {
      const okQ = !q || [p.name, p.namespace, p.node].some(v => String(v).toLowerCase().includes(q));
      const okS = status === "todos" || p.status === status;
      const okNs = namespace === "todos" || p.namespace === namespace;
      return okQ && okS && okNs;
    });
  }, [debouncedQuery, status, namespace]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const { key, dir } = sortBy;
      const va = key === "cpu" ? a.cpu : key === "memory" ? a.memory : String(a[key]).toLowerCase();
      const vb = key === "cpu" ? b.cpu : key === "memory" ? b.memory : String(b[key]).toLowerCase();
      const cmp = va > vb ? 1 : va < vb ? -1 : 0;
      return dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortBy]);

  const { page, pageSize, totalPages, setPage, paged } = usePagination(sorted, 12);

  const toggleSelect = (id) =>
    setSelectedIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const toggleSelectAllOnPage = () =>
    setSelectedIds((cur) => {
      const idsOnPage = paged.map((p) => p.id);
      const allSelected = idsOnPage.every((id) => cur.includes(id));
      return allSelected ? cur.filter((id) => !idsOnPage.includes(id)) : Array.from(new Set([...cur, ...idsOnPage]));
    });

  // Se o pod focado não estiver mais no resultado filtrado, limpar foco
  useEffect(() => {
    if (focusedId && !sorted.some(p => p.id === focusedId)) {
      setFocusedId(null);
    }
  }, [sorted, focusedId]);

  return (
    <motion.div
      className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* LISTA */}
      <Panel
        title="Pods"
        subtitle={
          isSearching
            ? "Buscando..."
            : `${sorted.length} ${sorted.length === 1 ? "item" : "itens"}`
        }
      >
        <PodsFilterBar
          query={query} onQuery={setQuery}
          status={status} onStatus={setStatus}
          namespace={namespace} onNamespace={setNamespace}
          namespaces={namespaces}
          sortBy={sortBy} onSortBy={setSortBy}
        />

        {selectedIds.length > 0 && (
          <BulkActionsBar
            count={selectedIds.length}
            onClear={() => setSelectedIds([])}
            onRestart={() => alert(`(mock) Reiniciar ${selectedIds.length} pod(s)`)}
            onDelete={() => {
              if (confirm(`Remover ${selectedIds.length} pod(s)? (mock)`)) setSelectedIds([]);
            }}
          />
        )}

        {/* Estado vazio */}
        {!isSearching && sorted.length === 0 && (
          <div
            className="mt-4 rounded border border-white/10 bg-white/5 p-6 text-sm text-gray-300"
            role="status"
            aria-live="polite"
          >
            <p className="mb-3">Nenhum pod encontrado com os filtros atuais.</p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setStatus("todos");
                  setNamespace("todos");
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
                aria-label="Limpar filtros e voltar para a lista completa"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}

        {/* Tabela */}
        <motion.div
          key={`${page}-${debouncedQuery}-${status}-${namespace}-${sortBy.key}-${sortBy.dir}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <PodsTable
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
      <Panel title="Detalhes do Pod" subtitle={focusedId ? data.find(p => p.id === focusedId)?.name : "—"}>
        <motion.div
          key={focusedId || "no-selection"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <PodDetails
            pod={focusedId ? data.find((p) => p.id === focusedId) : null}
            onClose={() => setFocusedId(null)}
          />
        </motion.div>
      </Panel>
    </motion.div>
  );
}
