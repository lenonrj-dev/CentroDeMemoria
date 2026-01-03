// file: components/teams/TeamDetails.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pencil, Trash2, KeyRound, Shield, Briefcase, CalendarClock, Mail, Settings } from "lucide-react";
import MemberCard from "./MemberCard";
import RoleSelector from "./RoleSelector";
import { AnimatePresence, motion } from "framer-motion";

const TABS = ["Resumo","Membros","Papéis","Projetos","On-call","Tokens","Atividades","Config"];

export default function TeamDetails({ team, onInvite, onEdit, onArchive, onTransfer }) {
  const [tab, setTab] = useState(TABS[0]);
  const currentIndex = useMemo(() => TABS.indexOf(tab), [tab]);
  const tabsRef = useRef([]);

  if (!team) return <div className="text-sm text-gray-400">Selecione uma equipe…</div>;

  // Navegação por teclado nas abas
  const onTabsKeyDown = useCallback((e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    let idx = currentIndex;
    if (e.key === "ArrowLeft") idx = (currentIndex - 1 + TABS.length) % TABS.length;
    if (e.key === "ArrowRight") idx = (currentIndex + 1) % TABS.length;
    if (e.key === "Home") idx = 0;
    if (e.key === "End") idx = TABS.length - 1;
    const next = TABS[idx];
    setTab(next);
    // Foco na aba selecionada
    queueMicrotask(() => tabsRef.current[idx]?.focus());
  }, [currentIndex]);

  return (
    <div className="space-y-6">
      {/* Ações rápidas */}
      <div className="flex flex-wrap items-center gap-2">
        <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onEdit} className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 text-sm inline-flex items-center gap-2" aria-label="Editar equipe">
          <Pencil className="h-4 w-4" aria-hidden="true" /> Editar
        </motion.button>
        <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onInvite} className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 text-sm inline-flex items-center gap-2" aria-label="Convidar membro">
          <Mail className="h-4 w-4" aria-hidden="true" /> Convidar
        </motion.button>
        <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onTransfer} className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 text-sm inline-flex items-center gap-2" aria-label="Transferir propriedade da equipe">
          <Shield className="h-4 w-4" aria-hidden="true" /> Transferir propriedade
        </motion.button>
        <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onArchive} className="px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 hover:border-rose-500/60 text-sm inline-flex items-center gap-2" aria-label="Arquivar equipe">
          <Trash2 className="h-4 w-4" aria-hidden="true" /> Arquivar
        </motion.button>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Detalhes da equipe" className="flex flex-wrap gap-2" onKeyDown={onTabsKeyDown}>
        {TABS.map((t, i) => {
          const selected = tab === t;
          return (
            <motion.button
              key={t}
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${t}`}
              id={`tab-${t}`}
              ref={(el) => (tabsRef.current[i] = el)}
              onClick={() => setTab(t)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-3 py-1.5 text-sm rounded-lg border focus-visible:ring-2 focus-visible:ring-cyan-500/40 outline-none ${
                selected ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              {t}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {tab === "Resumo" && (
          <motion.div key="Resumo" role="tabpanel" id="panel-Resumo" aria-labelledby="tab-Resumo"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
            <SummaryTab team={team} />
          </motion.div>
        )}
        {tab === "Membros" && (
          <motion.div key="Membros" role="tabpanel" id="panel-Membros" aria-labelledby="tab-Membros"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
            <MembersTab team={team} onInvite={onInvite} />
          </motion.div>
        )}
        {tab === "Papéis" && (
          <motion.div key="Papéis" role="tabpanel" id="panel-Papéis" aria-labelledby="tab-Papéis"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
            <RolesTab team={team} />
          </motion.div>
        )}
        {tab === "Projetos" && (
          <motion.div key="Projetos" role="tabpanel" id="panel-Projetos" aria-labelledby="tab-Projetos"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
            <ProjectsTab team={team} />
          </motion.div>
        )}
        {tab === "On-call" && (
          <motion.div key="On-call" role="tabpanel" id="panel-On-call" aria-labelledby="tab-On-call"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
            <OncallTab team={team} />
          </motion.div>
        )}
        {tab === "Tokens" && (
          <motion.div key="Tokens" role="tabpanel" id="panel-Tokens" aria-labelledby="tab-Tokens"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
            <TokensTab team={team} />
          </motion.div>
        )}
        {tab === "Atividades" && (
          <motion.div key="Atividades" role="tabpanel" id="panel-Atividades" aria-labelledby="tab-Atividades"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
            <ActivityTab team={team} />
          </motion.div>
        )}
        {tab === "Config" && (
          <motion.div key="Config" role="tabpanel" id="panel-Config" aria-labelledby="tab-Config"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
            <ConfigTab team={team} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Abas ---------- */

function SummaryTab({ team }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
      <div className="text-sm text-gray-200"><span className="text-gray-400">Organização:</span> {team.org}</div>
      <div className="text-sm text-gray-200"><span className="text-gray-400">Membros:</span> {team.members.length}</div>
      <div className="text-sm text-gray-200"><span className="text-gray-400">Projetos:</span> {team.projects.join(", ") || "—"}</div>
      <div className="text-sm text-gray-200"><span className="text-gray-400">Tags:</span> {team.tags.join(", ") || "—"}</div>
      <div className="text-sm text-gray-400">Atualizado {team.updated}</div>
    </section>
  );
}

function MembersTab({ team, onInvite }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Membros</h4>
        <button type="button" onClick={onInvite} className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Convidar</button>
      </div>
      <ul className="grid sm:grid-cols-2 gap-3">
        {team.members.map(m => <MemberCard key={m.id} member={m} />)}
      </ul>
    </section>
  );
}

function RolesTab({ team }) {
  return (
    <section className="space-y-2">
      <h4 className="text-sm font-medium">Papéis por membro</h4>
      <ul className="space-y-2">
        {team.members.map(m => (
          <li key={m.id} className="rounded border border-white/10 bg-white/5 p-3 flex items-center justify-between">
            <div className="text-sm text-gray-200">{m.name} <span className="text-xs text-gray-400">({m.email})</span></div>
            <RoleSelector value={m.role} onChange={(v)=>alert(`(mock) mudar papel de ${m.name} para ${v}`)} />
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded border border-white/10 bg-white/5 p-3">
        <h5 className="text-sm font-medium mb-2">Matriz de permissões (resumo)</h5>
        <ul className="text-sm text-gray-300 list-disc pl-5">
          <li><strong>Owner</strong>: todas permissões</li>
          <li><strong>Admin</strong>: gerenciar membros, tokens, projetos</li>
          <li><strong>Dev</strong>: deploys, logs, métricas</li>
          <li><strong>Viewer</strong>: somente leitura</li>
        </ul>
      </div>
    </section>
  );
}

function ProjectsTab({ team }) {
  return (
    <section className="space-y-2">
      <h4 className="text-sm font-medium"><Briefcase className="inline h-4 w-4 mr-2" />Projetos</h4>
      {team.projects.length ? (
        <ul className="grid sm:grid-cols-2 gap-2">
          {team.projects.map(p => (
            <li key={p} className="rounded border border-white/10 bg-white/5 p-3 text-sm text-gray-200 flex items-center justify-between">
              <span>{p}</span>
              <button type="button" onClick={()=>alert(`(mock) desvincular ${p}`)} className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 hover:border-white/20">Remover</button>
            </li>
          ))}
        </ul>
      ) : <div className="text-sm text-gray-400">Sem projetos vinculados.</div>}
      <div className="pt-2">
        <button type="button" onClick={()=>alert("(mock) vincular projeto")}
          className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Vincular projeto</button>
      </div>
    </section>
  );
}

function OncallTab({ team }) {
  return (
    <section className="space-y-2">
      <h4 className="text-sm font-medium"><CalendarClock className="inline h-4 w-4 mr-2" />Escala On-call</h4>
      <ul className="text-sm divide-y divide-white/10">
        {team.oncall.map((s, i) => (
          <li key={i} className="py-2 flex items-center justify-between">
            <div className="text-gray-200">{s.person} <span className="text-xs text-gray-400">({s.role})</span></div>
            <div className="text-xs text-gray-400">{s.window}</div>
          </li>
        ))}
      </ul>
      <button type="button" onClick={()=>alert("(mock) editar escala")} className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 mt-2">Editar escala</button>
    </section>
  );
}

function TokensTab({ team }) {
  return (
    <section className="space-y-2">
      <h4 className="text-sm font-medium"><KeyRound className="inline h-4 w-4 mr-2" />Tokens da equipe</h4>
      {team.tokens.length ? (
        <ul className="text-sm space-y-2">
          {team.tokens.map(t => (
            <li key={t.id} className="rounded border border-white/10 bg-white/5 p-3 flex items-center justify-between">
              <div>
                <div className="text-gray-100">{t.name}</div>
                <div className="text-xs text-gray-400">{t.prefix}… • criado {t.created}</div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={()=>alert("(mock) escopos")}
                  className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 hover:border-white/20">Escopos</button>
                <button type="button" onClick={()=>confirm("Revogar token? (mock)")&&alert("Revogado")}
                  className="text-xs px-2 py-1 rounded border border-rose-500/40 bg-rose-500/10 hover:border-rose-500/60">Revogar</button>
              </div>
            </li>
          ))}
        </ul>
      ) : <div className="text-sm text-gray-400">Sem tokens.</div>}
      <button type="button" onClick={()=>alert("(mock) criar token")}
        className="text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20 mt-2">Criar token</button>
    </section>
  );
}

function ActivityTab({ team }) {
  return (
    <section className="space-y-2">
      <h4 className="text-sm font-medium">Atividades recentes</h4>
      <ul className="text-sm divide-y divide-white/10">
        {team.activity.map((a, i) => (
          <li key={i} className="py-2 flex items-center justify-between">
            <div className="text-gray-200">{a.text}</div>
            <div className="text-xs text-gray-400">{a.when}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ConfigTab({ team }) {
  return (
    <section className="space-y-3">
      <h4 className="text-sm font-medium"><Settings className="inline h-4 w-4 mr-2" />Configurações</h4>
      <div className="rounded border border-white/10 bg-white/5 p-3 text-sm space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-gray-200" htmlFor="team-visibility">Visibilidade</label>
          <select id="team-visibility" defaultValue={team.visibility} className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-1.5 text-sm">
            <option>private</option>
            <option>internal</option>
            <option>public</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-200">Convites automáticos</span>
          <select aria-label="Política de convites automáticos" defaultValue={team.invitePolicy} className="bg-[#0e141b] border border-white/10 rounded-lg px-3 py-1.5 text-sm">
            <option>owner</option>
            <option>admin</option>
            <option>qualquer dev</option>
          </select>
        </div>
        <button type="button" onClick={()=>alert("(mock) salvar config")} className="mt-2 text-sm px-3 py-1.5 rounded border border-white/10 bg-white/5 hover:border-white/20">Salvar</button>
      </div>
    </section>
  );
}
