// file: components/statefulsets/StatusPill.tsx
"use client";

export default function StatefulStatusPill({
  health,
  size = "sm", // "xs" | "sm" | "md"
  className = "",
}) {
  const variants = {
    "Saudável": "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    "Parcial": "text-amber-300 bg-amber-500/10 border-amber-500/20",
    "Degradado": "text-rose-300 bg-rose-500/10 border-rose-500/20",
    __default: "text-gray-300 bg-white/5 border-white/10",
  };

  const sizes = {
    xs: "text-[10px] px-1 py-0.5",
    sm: "text-[11px] px-1.5 py-0.5",
    md: "text-xs px-2 py-0.5",
  };

  const label = health ?? "—";
  const tone = variants[label] || variants.__default;
  const sz = sizes[size] || sizes.sm;

  return (
    <span
      role="status"
      aria-label={`Saúde do StatefulSet: ${label}`}
      title={`Saúde: ${label}`}
      data-health={label}
      className={`rounded border ${sz} ${tone} ${className}`}
    >
      {label}
    </span>
  );
}
