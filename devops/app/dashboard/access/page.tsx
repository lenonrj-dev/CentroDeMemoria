// file: app/dashboard/access/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Panel from "../../../components/ui/Panel";
import AccessFilterBar from "../../../components/access/AccessFilterBar";
import RolesTable from "../../../components/access/RolesTable";
import RoleDetails from "../../../components/access/RoleDetails";
import BindingsTable from "../../../components/access/BindingsTable";
import BindingDetails from "../../../components/access/BindingDetails";
import ServiceAccountsTable from "../../../components/access/ServiceAccountsTable";
import ServiceAccountDetails from "../../../components/access/ServiceAccountDetails";
import usePagination from "../../../components/pods/usePagination";
import data from "../../../lib/k8s/accessData";

const TABS = ["Papéis", "Vinculações", "ServiceAccounts"];

export default function AccessPage() {
  const [tab, setTab] = useState(TABS[0]);

  // Busca + debounce/estados
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [namespace, setNamespace] = useState("todos");
  const [kindScope, setKindScope] = useState("todos"); // todos | Namespaced | Cluster
  const [subjectKind, setSubjectKind] = useState("todos"); // para vinculações: User | Group | ServiceAccount
  const [sortBy, setSortBy] = useState({ key: "name", dir: "asc" });

  const [selectedIds, setSelectedIds] = useState([]);
  const [focusedId, setFocusedId] = useState(null);

  // Debounce de 300ms: quando query ou filtros mudarem, exibimos loading brevemente
  useEffect(() => {
    setLoading(true);
    setError("");
    const t = setTimeout(() => {
      // Mock de erro opcional: se usuário digitar "erro:" no início, força estado de erro
      if (query.trim().toLowerCase().startsWith("erro:")) {
        setError("Falha ao buscar dados (mock). Tente novamente.");
        setDebouncedQuery(query);
        setLoading(false);
        return;
      }
      setDebouncedQuery(query);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query, namespace, kindScope, subjectKind, tab]);

  const namespaces = useMemo(() => {
    const s = new Set([
      ...data.roles.map((r) => r.namespace).filter(Boolean),
      ...data.bindings.map((b) => b.namespace).filter(Boolean),
      ...data.serviceAccounts.map((sa) => sa.namespace).filter(Boolean),
    ]);
    return ["todos", ...Array.from(s).sort()];
  }, []);

  const dataset = tab === "Papéis" ? data.roles : tab === "Vinculações" ? data.bindings : data.serviceAccounts;

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    if (tab === "Papéis") {
      return data.roles.filter((r) => {
        const okQ =
          !q ||
          [r.name, r.namespace || "cluster", (r.rules || []).map((rule) => rule.resources?.join(",")).join(",")].some((v) =>
            String(v).toLowerCase().includes(q),
          );
        const okNs = namespace === "todos" || r.namespace === namespace;
        const okScope = kindScope === "todos" || (kindScope === "Cluster" ? !r.namespace : !!r.namespace);
        return okQ && okNs && okScope;
      });
    }

    if (tab === "Vinculações") {
      return data.bindings.filter((b) => {
        const okQ =
          !q ||
          [b.name, b.roleRef.name, b.namespace || "cluster", b.subjects.map((s) => s.name).join(",")].some((v) =>
            String(v).toLowerCase().includes(q),
          );
        const okNs = namespace === "todos" || b.namespace === namespace;
        const okSub = subjectKind === "todos" || b.subjects.some((s) => s.kind === subjectKind);
        const okScope = kindScope === "todos" || (kindScope === "Cluster" ? !b.namespace : !!b.namespace);
        return okQ && okNs && okSub && okScope;
      });
    }

    // ServiceAccounts
    return data.serviceAccounts.filter((sa) => {
      const okQ = !q || [sa.name, sa.namespace].some((v) => String(v).toLowerCase().includes(q));
      const okNs = namespace === "todos" || sa.namespace === namespace;
      return okQ && okNs;
    });
  }, [tab, debouncedQuery, namespace, subjectKind, kindScope]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const { key, dir } = sortBy;
      const get = (x) => {
        if (key === "rules") return x.rules?.length ?? 0;
        if (key === "subjects") return x.subjects?.length ?? 0;
        if (key === "tokens") return x.tokens?.length ?? 0;
        if (key === "age") return x.ageSec ?? 0;
        return String(x[key] ?? "").toLowerCase();
      };
      const va = get(a),
        vb = get(b);
      const cmp = va > vb ? 1 : va < vb ? -1 : 0;
      return dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortBy]);

  const { page, totalPages, setPage, paged } = usePagination(sorted, 12);

  // Reset de paginação e seleção ao alterar filtros/aba
  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
    // Se item focado saiu do conjunto filtrado, limpa o foco
    if (focusedId && !sorted.some((x) => x.id === focusedId)) {
      setFocusedId(null);
    }
  }, [tab, debouncedQuery, namespace, subjectKind, kindScope, setPage]); // sorted não entra para evitar loop

  const toggleSelect = (id) => setSelectedIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const toggleSelectAllOnPage = () =>
    setSelectedIds((cur) => {
      const idsOnPage = paged.map((p) => p.id);
      const allSelected = idsOnPage.every((id) => cur.includes(id));
      return allSelected ? cur.filter((id) => !idsOnPage.includes(id)) : Array.from(new Set([...cur, ...idsOnPage]));
    });

  const clearSelection = () => setSelectedIds([]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_520px] gap-6">
      <Panel title="Acesso" subtitle={`${tab} • ${sorted.length} item(ns)`}>
        {/* Abas */}
        <div className="mb-3 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setFocusedId(null);
                clearSelection();
              }}
              className={`px-3 py-1.5 text-sm rounded-lg border ${tab === t ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/5 border-white/10 hover:border-white/20"}`}
              aria-pressed={tab === t}
              aria-label={`Selecionar aba ${t}`}
            >
              {t}
            </button>
          ))}
        </div>

        <AccessFilterBar
          tab={tab}
          query={query}
          onQuery={setQuery}
          namespace={namespace}
          onNamespace={setNamespace}
          namespaces={namespaces}
          subjectKind={subjectKind}
          onSubjectKind={setSubjectKind}
          kindScope={kindScope}
          onKindScope={setKindScope}
          sortBy={sortBy}
          onSortBy={setSortBy}
        />

        {/* Ações em massa (mock) */}
        {selectedIds.length > 0 && (
          <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
            <div className="text-gray-300">{selectedIds.length} selecionado(s)</div>
            <div className="flex gap-2">
              <button
                onClick={() => alert(`(mock) duplicar ${selectedIds.length} ${tab.toLowerCase()}`)}
                className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
              >
                Duplicar
              </button>
              <button
                onClick={() => alert(`(mock) exportar YAML de ${selectedIds.length}`)}
                className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
              >
                Exportar YAML
              </button>
              <button
                onClick={() => alert(`(mock) excluir ${selectedIds.length}`)}
                className="px-3 py-1.5 rounded border border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50"
              >
                Excluir
              </button>
              <button
                onClick={clearSelection}
                className="px-2 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
                title="Limpar seleção"
              >
                Limpar
              </button>
            </div>
          </div>
        )}

        {/* Estados: erro / loading / vazio / conteúdo */}
        <AnimatePresence initial={false} mode="wait">
          {error ? (
            <motion.div
              key="erro"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
              role="alert"
            >
              {error}
            </motion.div>
          ) : loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 space-y-2" aria-busy="true">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-white/5" />
              ))}
            </motion.div>
          ) : sorted.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-3 rounded-lg border border-white/10 bg-white/5 px-4 py-6 text-sm text-gray-300"
              role="status"
            >
              Nenhum resultado encontrado para os filtros atuais.
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1">
              {/* Tabelas */}
              {tab === "Papéis" && (
                <RolesTable
                  items={paged}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                  onToggleSelectAll={toggleSelectAllOnPage}
                  onOpen={setFocusedId}
                  sortBy={sortBy}
                  onSortBy={setSortBy}
                />
              )}

              {tab === "Vinculações" && (
                <BindingsTable
                  items={paged}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                  onToggleSelectAll={toggleSelectAllOnPage}
                  onOpen={setFocusedId}
                  sortBy={sortBy}
                  onSortBy={setSortBy}
                />
              )}

              {tab === "ServiceAccounts" && (
                <ServiceAccountsTable
                  items={paged}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                  onToggleSelectAll={toggleSelectAllOnPage}
                  onOpen={setFocusedId}
                  sortBy={sortBy}
                  onSortBy={setSortBy}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
              disabled={page === totalPages}
            >
              Próxima
            </button>
          </div>
        </div>
      </Panel>

      {/* Detalhes */}
      <Panel title="Detalhes" subtitle={focusedId ? dataset.find((x) => x.id === focusedId)?.name ?? "—" : "Selecione um item"}>
        {tab === "Papéis" && <RoleDetails role={focusedId ? data.roles.find((r) => r.id === focusedId) : null} />}
        {tab === "Vinculações" && <BindingDetails binding={focusedId ? data.bindings.find((b) => b.id === focusedId) : null} />}
        {tab === "ServiceAccounts" && <ServiceAccountDetails sa={focusedId ? data.serviceAccounts.find((s) => s.id === focusedId) : null} />}
      </Panel>
    </div>
  );
}
