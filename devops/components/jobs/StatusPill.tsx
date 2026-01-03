// file: components/jobs/StatusPill.tsx
"use client";

export default function StatusPill({ status }) {
  // Estilos por status (mantém nomes em inglês pois são valores do K8s)
  const styleMap = {
    Succeeded: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    Active: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
    Failed: "text-rose-300 bg-rose-500/10 border-rose-500/20",
    Suspended: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  };

  // Label para exibição em pt-BR
  const labelMap = {
    Succeeded: "Concluído",
    Active: "Ativo",
    Failed: "Falhou",
    Suspended: "Suspenso",
  };

  const cls = styleMap[status] || "text-gray-300 bg-white/5 border-white/10";
  const label = labelMap[status] || status || "—";

  return (
    <span
      className={`inline-block text-[11px] px-1.5 py-0.5 rounded border ${cls}`}
      role="status"
      aria-label={`Status: ${label}`}
      title={label}
    >
      {label}
    </span>
  );
}
