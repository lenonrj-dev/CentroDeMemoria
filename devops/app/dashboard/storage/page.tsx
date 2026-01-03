// file: app/dashboard/storage/page.tsx
"use client";

import { useMemo, useState } from "react";
import Panel from "../../../components/ui/Panel";
import StorageFilterBar from "../../../components/storage/StorageFilterBar";
import PVTable from "../../../components/storage/PVTable";
import PVDetails from "../../../components/storage/PVDetails";
import PVCTable from "../../../components/storage/PVCTable";
import PVCDetails from "../../../components/storage/PVCDetails";
import SCTable from "../../../components/storage/SCTable";
import usePagination from "../../../components/pods/usePagination"; // reuso
import { pvs, pvcs, scs } from "../../../lib/k8s/storageData";

const TABS = ["PVs", "PVCs", "StorageClasses"];

export default function StoragePage() {
  const [tab, setTab] = useState(TABS[0]);

  // filtros comuns
  const [query, setQuery] = useState("");
  const [namespace, setNamespace] = useState("todos");
  const [status, setStatus] = useState("todos"); // para PV/PVC
  const [provisioner, setProvisioner] = useState("todos"); // para SC
  const [sortBy, setSortBy] = useState({ key: "name", dir: "asc" });

  // seleção + foco
  const [selectedIds, setSelectedIds] = useState([]);
  const [focusedId, setFocusedId] = useState(null);

  // namespaces e provisioners para selects
  const namespaces = useMemo(() => {
    const s = new Set(pvcs.map(x => x.namespace));
    return ["todos", ...Array.from(s).sort()];
  }, []);
  const provisioners = useMemo(() => {
    const s = new Set(scs.map(x => x.provisioner));
    return ["todos", ...Array.from(s).sort()];
  }, []);

  // dataset por aba
  const dataset = tab === "PVs" ? pvs : tab === "PVCs" ? pvcs : scs;

  // helper: limpar filtros conforme aba atual
  const handleClearFilters = () => {
    setQuery("");
    setSortBy({ key: "name", dir: "asc" });
    if (tab === "PVs" || tab === "PVCs") {
      setStatus("todos");
    }
    if (tab === "PVCs") {
      setNamespace("todos");
    }
    if (tab === "StorageClasses") {
      setProvisioner("todos");
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (tab === "PVs") {
      return pvs.filter(v => {
        const okQ = !q || [v.name, v.storageClass, v.node ?? "", v.claim?.name ?? ""]
          .some(s => String(s).toLowerCase().includes(q));
        const okS = status === "todos" || v.phase === status;
        return okQ && okS;
      });
    }

    if (tab === "PVCs") {
      return pvcs.filter(v => {
        const okQ = !q || [v.name, v.namespace, v.storageClass, v.volume ?? ""]
          .some(s => String(s).toLowerCase().includes(q));
        const okNs = namespace === "todos" || v.namespace === namespace;
        const okS = status === "todos" || v.phase === status;
        return okQ && okNs && okS;
      });
    }

    // SC
    return scs.filter(s => {
      const okQ = !q || [s.name, s.provisioner].some(x => String(x).toLowerCase().includes(q));
      const okP = provisioner === "todos" || s.provisioner === provisioner;
      return okQ && okP;
    });
  }, [tab, query, namespace, status, provisioner]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const { key, dir } = sortBy;
      const get = (x) => {
        if (key === "capacity") return x.capacityGi ?? 0;
        if (key === "used") return x.usedGi ?? 0;
        if (key === "age") return x.ageSec ?? 0;
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
    setSelectedIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const toggleSelectAllOnPage = () =>
    setSelectedIds((cur) => {
      const idsOnPage = paged.map((p) => p.id);
      const allSelected = idsOnPage.every((id) => cur.includes(id));
      return allSelected ? cur.filter((id) => !idsOnPage.includes(id)) : Array.from(new Set([...cur, ...idsOnPage]));
    });

  const clearSelection = () => setSelectedIds([]);
  const onOpen = (id) => setFocusedId(id);

  // volta para a primeira página quando filtros/aba mudam
  useMemo(() => {
    setPage(1);
  }, [tab, query, namespace, status, provisioner, sortBy.key, sortBy.dir, setPage]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_520px] gap-6">
      <Panel
        title="Armazenamento"
        subtitle={`${tab} • ${sorted.length} item(ns)`}
      >
        {/* Abas */}
        <div className="mb-3 flex flex-wrap gap-2">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setFocusedId(null); clearSelection(); handleClearFilters(); }}
              className={`px-3 py-1.5 text-sm rounded-lg border ${tab === t ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/5 border-white/10 hover:border-white/20"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <StorageFilterBar
          tab={tab}
          query={query} onQuery={setQuery}
          namespace={namespace} onNamespace={setNamespace} namespaces={namespaces}
          status={status} onStatus={setStatus}
          provisioner={provisioner} onProvisioner={setProvisioner} provisioners={provisioners}
          sortBy={sortBy} onSortBy={setSortBy}
          debounce
          onClear={handleClearFilters}
        />

        {/* Ações em massa (mock simples) */}
        {selectedIds.length > 0 && (
          <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm" role="region" aria-label="Ações em massa de armazenamento">
            <div className="text-gray-300" aria-live="polite">{selectedIds.length} selecionado(s)</div>
            <div className="flex gap-2">
              {tab !== "StorageClasses" && (
                <button
                  onClick={() => alert(`(mock) expandir capacidade de ${selectedIds.length} ${tab}`)}
                  className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
                  aria-label="Ajustar capacidade"
                >
                  Ajustar capacidade
                </button>
              )}
              <button
                onClick={() => alert(`(mock) excluir ${selectedIds.length} ${tab}`)}
                className="px-3 py-1.5 rounded border border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50"
                aria-label="Excluir itens selecionados"
              >
                Excluir
              </button>
              <button
                onClick={clearSelection}
                className="px-2 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
                title="Limpar seleção"
                aria-label="Limpar seleção"
              >
                Limpar
              </button>
            </div>
          </div>
        )}

        {/* TABELAS */}
        {tab === "PVs" && (
          <PVTable
            items={paged}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAllOnPage}
            onOpen={onOpen}
            sortBy={sortBy}
            onSortBy={setSortBy}
            onClearFilters={handleClearFilters}
          />
        )}
        {tab === "PVCs" && (
          <PVCTable
            items={paged}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAllOnPage}
            onOpen={onOpen}
            sortBy={sortBy}
            onSortBy={setSortBy}
            onClearFilters={handleClearFilters}
          />
        )}
        {tab === "StorageClasses" && (
          <SCTable
            items={paged}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAllOnPage}
            onOpen={onOpen}
            sortBy={sortBy}
            onSortBy={setSortBy}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* Paginação */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50"
              aria-label="Página anterior"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50"
              aria-label="Próxima página"
            >
              Próxima
            </button>
          </div>
        </div>
      </Panel>

      {/* DETALHES */}
      <Panel
        title="Detalhes"
        subtitle={
          focusedId
            ? (dataset.find(x => x.id === focusedId)?.name ?? "—")
            : "Selecione um item"
        }
      >
        {tab === "PVs" && <PVDetails pv={focusedId ? pvs.find(x => x.id === focusedId) : null} />}
        {tab === "PVCs" && <PVCDetails pvc={focusedId ? pvcs.find(x => x.id === focusedId) : null} />}
        {tab === "StorageClasses" && (
          <div className="text-sm text-gray-400">
            Selecione uma StorageClass para ver especificações. (Você pode expandir para detalhes similares aos PVs.)
          </div>
        )}
      </Panel>
    </div>
  );
}
