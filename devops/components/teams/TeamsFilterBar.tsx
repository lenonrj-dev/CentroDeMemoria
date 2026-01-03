// file: components/teams/TeamsFilterBar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Search, ArrowUpDown, ListFilter, Plus, UserPlus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const sortKeys = [
  { key: "name", label: "Nome" },
  { key: "org", label: "Organização" },
  { key: "members", label: "Membros" },
  { key: "projects", label: "Projetos" },
  { key: "updated", label: "Atualização" },
];

export default function TeamsFilterBar({
  query, onQuery,
  org, onOrg, orgs,
  role, onRole, roles,
  active, onActive, activeOpts,
  sortBy, onSortBy,
  onCreateTeam, onInvite,
}) {
  const toggleDir = () => onSortBy({ key: sortBy.key, dir: sortBy.dir === "asc" ? "desc" : "asc" });

  // estado local + debounce 300ms
  const [inputValue, setInputValue] = useState(query ?? "");
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setInputValue(query ?? "");
  }, [query]);

  useEffect(() => {
    setIsTyping(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onQuery(inputValue);
      setIsTyping(false);
    }, 300);
    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const handleImmediateSearch = () => {
    clearTimeout(timeoutRef.current);
    onQuery(inputValue.trim());
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleImmediateSearch(); }}
            aria-label="Buscar equipes"
            className="w-full bg-[#0e141b] border border-white/10 rounded-lg pl-10 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="Buscar por equipe, org, tag, projeto…"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {isTyping && (
            <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" aria-hidden="true" />
          )}
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateTeam}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 focus-visible:ring-2 focus-visible:ring-cyan-500/40 outline-none"
          aria-label="Criar nova equipe"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Nova equipe
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onInvite}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 focus-visible:ring-2 focus-visible:ring-cyan-500/40 outline-none"
          aria-label="Convidar membro"
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" /> Convidar
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={org}
          onChange={(e)=>onOrg(e.target.value)}
          aria-label="Filtrar por organização"
          className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
        >
          {orgs.map(o => <option key={o}>{o}</option>)}
        </select>

        <select
          value={role}
          onChange={(e)=>onRole(e.target.value)}
          aria-label="Filtrar por papel"
          className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
        >
          {roles.map(r => <option key={r}>{r}</option>)}
        </select>

        <select
          value={active}
          onChange={(e)=>onActive(e.target.value)}
          aria-label="Filtrar por status de atividade"
          className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
        >
          {activeOpts.map(a => <option key={a}>{a}</option>)}
        </select>

        <div className="flex items-center gap-2 ml-auto">
          <select
            value={sortBy.key}
            onChange={(e) => onSortBy({ key: e.target.value, dir: "asc" })}
            aria-label="Ordenar por"
            className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 text-sm"
          >
            {sortKeys.map(k => <option key={k.key} value={k.key}>{k.label}</option>)}
          </select>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleDir}
            className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 text-sm"
            title="Alternar ordem"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortBy.dir === "asc" ? "ASC" : "DESC"}
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 bg-[#0e141b] border border-white/10 rounded-lg px-3 py-2 hover:border-cyan-500/30 focus-visible:ring-2 focus-visible:ring-cyan-500/40 outline-none"
            aria-label="Abrir filtros avançados"
          >
            <ListFilter className="h-4 w-4" />
            Filtros
          </motion.button>
        </div>
      </div>
    </div>
  );
}
