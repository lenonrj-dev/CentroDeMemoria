"use client";

const styles = {
  UP: "bg-emerald-500/10 text-emerald-100 border-emerald-500/30",
  DOWN: "bg-rose-500/10 text-rose-100 border-rose-500/30",
  DEGRADED: "bg-amber-500/10 text-amber-50 border-amber-500/30",
  "EM EXECUÃÃO": "bg-cyan-500/10 text-cyan-50 border-cyan-500/30",
  SUCESSO: "bg-emerald-500/10 text-emerald-50 border-emerald-500/30",
  FALHA: "bg-rose-500/10 text-rose-50 border-rose-500/30",
  ABERTO: "bg-amber-500/10 text-amber-100 border-amber-500/30",
  "EM ANDAMENTO": "bg-cyan-500/10 text-cyan-100 border-cyan-500/30",
  RESOLVIDO: "bg-emerald-500/10 text-emerald-100 border-emerald-500/30",
};

export default function StatusBadge({ value, className = "" }) {
  const key = value?.toUpperCase?.() || "";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${styles[key] || "bg-white/5 text-gray-200 border-white/10"} ${className}`}>
      {value}
    </span>
  );
}
