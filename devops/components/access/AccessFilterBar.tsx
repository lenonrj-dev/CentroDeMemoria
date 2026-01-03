// file: components/access/AccessFilterBar.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, ArrowUpDown, ListFilter, X, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const sortKeys = {
  Papéis: [
    { key: "name", label: "Nome" },
    { key: "namespace", label: "Namespace" },
    { key: "rules", label: "Nº Regras" },
    { key: "age", label: "Idade" },
  ],
  Vinculações: [
    { key: "name", label: "Nome" },
    { key: "namespace", label: "Namespace" },
    { key: "roleRef", label: "Role" },
    { key: "subjects", label: "Sujeitos" },
    { key: "age", label: "Idade" },
  ],
  ServiceAccounts: [
    { key: "name", label: "Nome" },
    { key: "namespace", label: "Namespace" },
    { key: "tokens", label: "Tokens" },
    { key: "age", label: "Idade" },
  ],
};

export default function AccessFilterBar({
  tab,
  query,
  onQuery,
  namespace,
  onNamespace,
  namespaces,
  subjectKind,
  onSubjectKind,
  kindScope,
  onKindScope,
  sortBy,
  onSortBy,
  // opcionais (para UX mais rica; compatível com o Page atual)
  loading = false,
}) {
  const [openFilters, setOpenFilters] = useState(true);
  const [localQ, setLocalQ] = useState(query || "");
  const inputRef = useRef(null);

  // Mantém localQ em sincronia se "query" vier alterada externamente
  useEffect(() => {
    setLocalQ(query || "");
  }, [query]);

  // Debounce 300ms para propagar onQuery
  useEffect(() => {
    const t = setTimeout(() => onQuery?.(localQ), 300);
    return () => clearTimeout(t);
  }, [localQ, onQuery]);

  const toggleDir = () => onSortBy({ key: sortBy.key, dir: sortBy.dir === "asc" ? "desc" : "asc" });

  const clearQuery = () => {
    setLocalQ("");
    onQuery?.("");
    inputRef.current?.focus();
  };

  const placeholder = useMemo(
    () =>
      `Buscar por ${
        tab === "Papéis" ? "nome, recurso, verbo…" : tab === "Vinculações" ? "nome, role, sujeito…" : "nome, namespace…"
      } `,
    [tab],
  );

  const onKeyDownInput = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      clearQuery();
    }
  };

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1" role="search">
          <input
            ref={inputRef}
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            onKeyDown={onKeyDownInput}
            aria-label="Buscar"
            className="w-full bg-[#0e141b] border border-white/10 rounded-lg pl-10 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder={placeholder}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {/* Ações do input: loading e limpar */}
          {loading ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-300" aria-hidden />
          ) : localQ ? (
            <button
              onClick={clearQuery}
              aria-label="Limpar busca"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/5"
            >
              <X className="h-4 w-4 text-gray-300" />
            </button>
          ) : null}
        </div>

        <button
          onClick={() => setOpenFilters((v) => !v)}
          aria-expanded={openFilters}
          aria-controls="access-extra-filters"
          className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
        >
          <ListFilter className="h-4 w-4" />
          {openFilters ? "Ocultar filtros" : "Filtros"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {openFilters && (
          <motion.div
            id="access-extra-filters"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.18 }}
            className="flex flex-wrap items-center gap-3"
          >
            <select
              value={kindScope}
              onChange={(e) => onKindScope(e.target.value)}
              aria-label="Escopo"
              className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
            >
              <option value="todos">Todos</option>
              <option value="Namespaced">Namespaced</option>
              <option value="Cluster">Cluster</option>
            </select>

            <select
              value={namespace}
              onChange={(e) => onNamespace(e.target.value)}
              aria-label="Namespace"
              className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
            >
              {namespaces.map((ns) => (
                <option key={ns} value={ns}>
                  {ns}
                </option>
              ))}
            </select>

            {tab === "Vinculações" && (
              <select
                value={subjectKind}
                onChange={(e) => onSubjectKind(e.target.value)}
                aria-label="Tipo de sujeito"
                className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
              >
                <option value="todos">Todos sujeitos</option>
                <option value="User">User</option>
                <option value="Group">Group</option>
                <option value="ServiceAccount">ServiceAccount</option>
              </select>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <select
                value={sortBy.key}
                onChange={(e) => onSortBy({ key: e.target.value, dir: "asc" })}
                aria-label="Ordenar por"
                className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
              >
                {sortKeys[tab].map((k) => (
                  <option key={k.key} value={k.key}>
                    {k.label}
                  </option>
                ))}
              </select>
              <button
                onClick={toggleDir}
                className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 text-sm"
                aria-label={`Alternar direção da ordenação (${sortBy.dir === "asc" ? "ascendente" : "descendente"})`}
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortBy.dir === "asc" ? "ASC" : "DESC"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
