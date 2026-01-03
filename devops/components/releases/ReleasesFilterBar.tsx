"use client";

import { Search, ArrowUpDown, ListFilter } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type SortBy = { key: string; dir: string };

type ReleasesFilterBarProps = {
  query: string;
  onQuery: (value: string) => void;
  env: string;
  onEnv: (value: string) => void;
  status: string;
  onStatus: (value: string) => void;
  sortBy: SortBy;
  onSortBy: (value: SortBy) => void;
  debounce?: boolean;
  onClear?: () => void;
};

const sortKeys = [
  { key: "startedAtEpoch", label: "Inicio" },
  { key: "finishedAtEpoch", label: "Fim" },
  { key: "version", label: "Versao" },
  { key: "service", label: "Servico" },
  { key: "status", label: "Status" },
];

export default function ReleasesFilterBar({
  query,
  onQuery,
  env,
  onEnv,
  status,
  onStatus,
  sortBy,
  onSortBy,
  debounce = false,
  onClear,
}: ReleasesFilterBarProps) {
  const toggleDir = () => onSortBy({ key: sortBy.key, dir: sortBy.dir === "asc" ? "desc" : "asc" });

  const [localQuery, setLocalQuery] = useState(query || "");
  useEffect(() => {
    setLocalQuery(query || "");
  }, [query]);
  useEffect(() => {
    if (!debounce) return;
    const t = setTimeout(() => {
      if (localQuery !== query) onQuery(localQuery);
    }, 300);
    return () => clearTimeout(t);
  }, [debounce, localQuery, query, onQuery]);

  const clearFilters = () => {
    onQuery("");
    setLocalQuery("");
    onEnv("todos");
    onStatus("todos");
    onClear?.();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (debounce) {
      setLocalQuery(val);
    } else {
      setLocalQuery(val);
      onQuery(val);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (localQuery) {
        clearFilters();
      }
    }
  };

  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            value={localQuery}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="w-full rounded-lg border border-white/10 bg-[#0e141b] py-2.5 pl-10 pr-9 outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="Buscar por servico, versao, autor, commit"
            aria-label="Buscar releases por servico, versao, autor ou commit"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          {localQuery ? (
            <button
              type="button"
              onClick={clearFilters}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 py-0.5 text-xs text-gray-300/80 hover:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
              aria-label="Limpar busca e filtros"
              title="Limpar busca e filtros"
            >
              X
            </button>
          ) : null}
        </div>
        <motion.button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#0e141b] px-3 py-2 hover:border-cyan-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
          aria-label="Limpar filtros"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ListFilter className="h-4 w-4" />
          Limpar filtros
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={env}
          onChange={(e) => onEnv(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#0e141b] px-3 py-2 text-sm"
          aria-label="Filtrar por ambiente"
        >
          <option value="todos">Ambiente: todos</option>
          <option value="prod">Producao</option>
          <option value="stg">Staging</option>
          <option value="dev">Desenvolvimento</option>
        </select>

        <select
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#0e141b] px-3 py-2 text-sm"
          aria-label="Filtrar por status"
        >
          <option value="todos">Status: todos</option>
          <option>Em progresso</option>
          <option>Concluido</option>
          <option>Pausado</option>
          <option>Falhou</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          <select
            value={sortBy.key}
            onChange={(e) => onSortBy({ key: e.target.value, dir: "desc" })}
            className="rounded-lg border border-white/10 bg-[#0e141b] px-3 py-2 text-sm"
            aria-label="Ordenar por"
          >
            {sortKeys.map((k) => (
              <option key={k.key} value={k.key}>
                {k.label}
              </option>
            ))}
          </select>
          <motion.button
            onClick={toggleDir}
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#0e141b] px-3 py-2 text-sm hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
            aria-label={`Alternar direcao da ordenacao: ${sortBy.dir === "asc" ? "crescente" : "decrescente"}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortBy.dir === "asc" ? "ASC" : "DESC"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
