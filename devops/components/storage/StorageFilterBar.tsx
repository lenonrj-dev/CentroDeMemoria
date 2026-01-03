// file: components/storage/StorageFilterBar.tsx
"use client";

import { Search, ArrowUpDown, ListFilter } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const statusOpts = ["todos", "Bound", "Available", "Released", "Failed", "Pending"];

const sortKeys = {
  PVs: [
    { key: "name", label: "Nome" },
    { key: "storageClass", label: "StorageClass" },
    { key: "capacity", label: "Capacidade (Gi)" },
    { key: "age", label: "Idade" },
    { key: "phase", label: "Fase" },
  ],
  PVCs: [
    { key: "name", label: "Nome" },
    { key: "namespace", label: "Namespace" },
    { key: "storageClass", label: "StorageClass" },
    { key: "used", label: "Uso (Gi)" },
    { key: "age", label: "Idade" },
    { key: "phase", label: "Fase" },
  ],
  StorageClasses: [
    { key: "name", label: "Nome" },
    { key: "provisioner", label: "Provisioner" },
    { key: "age", label: "Idade" },
  ],
};

export default function StorageFilterBar({
  tab,
  query, onQuery,
  namespace, onNamespace, namespaces,
  status, onStatus,
  provisioner, onProvisioner, provisioners,
  sortBy, onSortBy,
}) {
  // estado local para debounce do campo de busca
  const [text, setText] = useState(query ?? "");
  const [typing, setTyping] = useState(false);
  const timer = useRef(null);

  // sincroniza quando query externa muda (ex.: limpar filtros)
  useEffect(() => { setText(query ?? ""); }, [query]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    setTyping(true);
    timer.current = setTimeout(() => {
      onQuery?.(text);
      setTyping(false);
    }, 300);
    return () => { if (timer.current) clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const toggleDir = () =>
    onSortBy({ key: sortBy.key, dir: sortBy.dir === "asc" ? "desc" : "asc" });

  const sortList = sortKeys[tab];

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-[#0e141b] border border-white/10 rounded-lg pl-10 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder={`Buscar por ${tab === "PVs" ? "nome, storageclass, claim…" : tab === "PVCs" ? "nome, namespace, storageclass…" : "nome, provisioner…"}`}
            aria-label="Campo de busca"
            aria-busy={typing ? "true" : "false"}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {/* Indicador de digitação/busca (debounce) */}
          {typing && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
              aria-live="polite"
            >
              Buscando…
            </span>
          )}
        </div>
        <button
          className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-cyan-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
          aria-label="Abrir filtros avançados"
          title="Filtros avançados"
          type="button"
        >
          <ListFilter className="h-4 w-4" />
          Filtros
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {tab !== "StorageClasses" && (
          <select
            value={status}
            onChange={(e) => onStatus(e.target.value)}
            className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
            aria-label="Filtrar por status"
          >
            {statusOpts.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}

        {tab === "PVCs" && (
          <select
            value={namespace}
            onChange={(e) => onNamespace(e.target.value)}
            className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
            aria-label="Filtrar por namespace"
          >
            {namespaces.map((ns) => <option key={ns} value={ns}>{ns}</option>)}
          </select>
        )}

        {tab === "StorageClasses" && (
          <select
            value={provisioner}
            onChange={(e) => onProvisioner(e.target.value)}
            className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
            aria-label="Filtrar por provisioner"
          >
            {provisioners.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <select
            value={sortBy.key}
            onChange={(e) => onSortBy({ key: e.target.value, dir: "asc" })}
            className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
            aria-label="Ordenar por"
          >
            {sortList.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}
          </select>
          <button
            onClick={toggleDir}
            className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
            title="Alternar ordem"
            aria-label={`Alternar ordem (${sortBy.dir === "asc" ? "ASC" : "DESC"})`}
            type="button"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortBy.dir === "asc" ? "ASC" : "DESC"}
          </button>
        </div>
      </div>
    </div>
  );
}
