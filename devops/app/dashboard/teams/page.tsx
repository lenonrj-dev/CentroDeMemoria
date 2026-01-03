// file: app/dashboard/teams/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Panel from "../../../components/ui/Panel";
import TeamsFilterBar from "../../../components/teams/TeamsFilterBar";
import TeamsTable from "../../../components/teams/TeamsTable";
import TeamDetails from "../../../components/teams/TeamDetails";
import InviteModal from "../../../components/teams/InviteModal";
import usePagination from "../../../components/pods/usePagination";
import data from "../../../lib/k8s/teamsData";

export default function TeamsPage() {
  const [query, setQuery] = useState("");
  const [org, setOrg] = useState("todas");        // filtro por organização
  const [role, setRole] = useState("todas");      // Owner | Admin | Dev | Viewer
  const [active, setActive] = useState("todas");  // Ativa | Arquivada
  const [sortBy, setSortBy] = useState({ key: "name", dir: "asc" });

  const [selectedIds, setSelectedIds] = useState([]);
  const [focusedId, setFocusedId] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.teams.filter(t => {
      const okQ = !q || [t.name, t.org, ...(t.tags||[]), ...(t.projects||[])]
        .some(s => String(s).toLowerCase().includes(q));
      const okOrg = org === "todas" || t.org === org;
      const okActive = active === "todas" || (active === "Ativa" ? !t.archived : t.archived);
      const okRole = role === "todas" || t.members.some(m => m.role === role);
      return okQ && okOrg && okActive && okRole;
    });
  }, [query, org, active, role]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a,b) => {
      const { key, dir } = sortBy;
      const get = (x) => {
        if (key === "members") return x.members.length;
        if (key === "projects") return x.projects.length;
        if (key === "updated") return x.updatedEpoch || 0;
        return String(x[key] ?? "").toLowerCase();
      };
      const va = get(a), vb = get(b);
      const cmp = va > vb ? 1 : va < vb ? -1 : 0;
      return dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortBy]);

  const { page, totalPages, setPage, paged } = usePagination(sorted, 12);

  // Reset de página ao alterar filtros de alto nível
  useEffect(() => {
    setPage(1);
  }, [query, org, role, active, setPage]);

  // Remove seleções que não existem mais no conjunto filtrado
  useEffect(() => {
    if (selectedIds.length === 0) return;
    const valid = new Set(sorted.map(t => t.id));
    setSelectedIds(cur => cur.filter(id => valid.has(id)));
  }, [sorted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Se o item focado sair do resultado (ou lista atual), fecha o painel de detalhes
  useEffect(() => {
    if (!focusedId) return;
    const stillVisible = sorted.some(t => t.id === focusedId);
    if (!stillVisible) setFocusedId(null);
  }, [sorted, focusedId]);

  const toggleSelect = (id) =>
    setSelectedIds(cur => cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]);

  const toggleSelectAllOnPage = () =>
    setSelectedIds(cur => {
      const ids = paged.map(p => p.id);
      const all = ids.every(id => cur.includes(id));
      return all ? cur.filter(id => !ids.includes(id)) : Array.from(new Set([...cur, ...ids]));
    });

  const clearSelection = () => setSelectedIds([]);

  const orgs = useMemo(() => ["todas", ...Array.from(new Set(data.teams.map(t=>t.org))).sort()], []);
  const roles = ["todas","Owner","Admin","Dev","Viewer"];
  const activeOpts = ["todas","Ativa","Arquivada"];

  const focused = focusedId ? data.teams.find(t => t.id === focusedId) : null;

  const clearFilters = () => {
    setQuery("");
    setOrg("todas");
    setRole("todas");
    setActive("todas");
    setSortBy({ key: "name", dir: "asc" });
    setPage(1);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_520px] gap-6">
      <Panel title="Equipes" subtitle={`${sorted.length} equipe(s)`}>
        <TeamsFilterBar
          query={query} onQuery={setQuery}
          org={org} onOrg={setOrg} orgs={orgs}
          role={role} onRole={setRole} roles={roles}
          active={active} onActive={setActive} activeOpts={activeOpts}
          sortBy={sortBy} onSortBy={setSortBy}
          onCreateTeam={() => alert("(mock) criar equipe")}
          onInvite={() => setInviteOpen(true)}
        />

        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
              role="region"
              aria-label="Ações em massa"
            >
              <div className="text-gray-300">{selectedIds.length} selecionada(s)</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
                  onClick={() => alert(`(mock) mover ${selectedIds.length} para outra org`)}
                  aria-label="Mover equipes selecionadas para outra organização"
                  title="Mover de org"
                >
                  Mover de org
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
                  onClick={() => alert(`(mock) exportar ${selectedIds.length}`)}
                  aria-label="Exportar equipes selecionadas"
                  title="Exportar seleção"
                >
                  Exportar
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded border border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50"
                  onClick={() => alert(`(mock) excluir ${selectedIds.length}`)}
                  aria-label="Excluir equipes selecionadas"
                  title="Excluir seleção"
                >
                  Excluir
                </button>
                <button
                  type="button"
                  className="px-2 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
                  onClick={clearSelection}
                  aria-label="Limpar seleção"
                  title="Limpar seleção"
                >
                  Limpar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {sorted.length === 0 && (
          <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
            <span className="text-gray-300">Nenhuma equipe encontrada para os filtros atuais.</span>
            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20"
              aria-label="Limpar filtros"
              title="Limpar filtros"
            >
              Limpar filtros
            </button>
          </div>
        )}

        <TeamsTable
          items={paged}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAllOnPage}
          onOpen={setFocusedId}
          sortBy={sortBy} onSortBy={setSortBy}
        />

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page===1}
              className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50">Anterior</button>
            <button type="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page===totalPages}
              className="px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 disabled:opacity-50">Próxima</button>
          </div>
        </div>
      </Panel>

      <Panel title="Detalhes da Equipe" subtitle={focused?.name ?? "Selecione uma equipe"}>
        <TeamDetails
          team={focused}
          onInvite={() => setInviteOpen(true)}
          onEdit={() => alert("(mock) editar equipe")}
          onArchive={() => alert("(mock) arquivar equipe")}
          onTransfer={() => alert("(mock) transferir ownership")}
        />
      </Panel>

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
