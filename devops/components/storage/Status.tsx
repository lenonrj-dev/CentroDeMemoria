// file: components/storage/Status.tsx
"use client";

export default function Status({ value }) {
  const clsMap = {
    Bound: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    Available: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
    Released: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    Failed: "text-rose-300 bg-rose-500/10 border-rose-500/20",
    Pending: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  };

  // Tradução de rótulos para pt-BR (mantém valores desconhecidos como vierem)
  const labelMap = {
    Bound: "Associado",
    Available: "Disponível",
    Released: "Liberado",
    Failed: "Falhou",
    Pending: "Pendente",
  };

  const safeValue = value ?? "—";
  const cls = clsMap[safeValue] || "text-gray-300 bg-white/5 border-white/10";
  const label = labelMap[safeValue] || safeValue;

  return (
    <span
      role="status"
      aria-label={`Status: ${label}`}
      title={`Status: ${label}`}
      className={`text-[11px] px-1.5 py-0.5 rounded border ${cls}`}
    >
      {label}
    </span>
  );
}
