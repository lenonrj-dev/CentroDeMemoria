// file: components/teams/MemberCard.tsx
"use client";

import { useMemo, useState } from "react";
import { Shield, Mail, Pencil } from "lucide-react";
import { motion } from "framer-motion";

export default function MemberCard({ member }) {
  const [imgError, setImgError] = useState(false);

  const roleClass = useMemo(() => {
    const map = {
      Owner: "text-purple-300 bg-purple-500/10 border-purple-500/20",
      Admin: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
      Dev: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
      Viewer: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    };
    return map[member.role] || "text-gray-300 bg-white/5 border-white/10";
  }, [member.role]);

  const initials = useMemo(() => {
    const parts = String(member.name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || "");
    return parts.join("") || "U";
  }, [member.name]);

  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="rounded-lg border border-white/10 bg-white/5 p-3"
    >
      <div className="flex items-center gap-3">
        {!imgError ? (
          <img
            src={member.avatar}
            alt={`Avatar de ${member.name}`}
            onError={() => setImgError(true)}
            className="h-10 w-10 rounded-lg border border-white/10 object-cover"
            loading="lazy"
          />
        ) : (
          <div
            aria-label={`Avatar de ${member.name}`}
            className="h-10 w-10 rounded-lg border border-white/10 bg-white/10 grid place-items-center text-xs font-medium text-gray-200"
          >
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-100 truncate" title={member.name}>
            {member.name}
          </div>
          <div className="text-xs text-gray-400 truncate flex items-center gap-1">
            <Mail className="h-3 w-3" aria-hidden="true" />
            <a
              href={`mailto:${member.email}`}
              className="underline decoration-transparent hover:decoration-cyan-400 focus:decoration-cyan-400 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded"
              title={`Enviar e-mail para ${member.email}`}
            >
              {member.email}
            </a>
          </div>
        </div>
        <span
          className={`text-[11px] px-1.5 py-0.5 rounded border ${roleClass} flex items-center gap-1`}
          title={`Papel: ${member.role}`}
        >
          <Shield className="h-3 w-3" aria-hidden="true" /> {member.role}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        <div title={`Entrou ${member.joined}`}>Entrou {member.joined}</div>
        <button
          type="button"
          onClick={() => alert(`(mock) editar ${member.name}`)}
          className="px-2 py-1 rounded border border-white/10 bg-white/5 hover:border-white/20 inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-cyan-500/40 outline-none"
          aria-label={`Editar membro ${member.name}`}
          title="Editar membro"
        >
          <Pencil className="h-3 w-3" aria-hidden="true" /> Editar
        </button>
      </div>
    </motion.li>
  );
}
