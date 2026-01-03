"use client";

const LOOKS = {
  neutral: "bg-white/5 text-gray-200 border-white/10",
  success: "bg-emerald-500/10 text-emerald-200 border-emerald-500/30",
  warning: "bg-amber-500/10 text-amber-100 border-amber-500/30",
  danger: "bg-rose-500/10 text-rose-100 border-rose-500/30",
  info: "bg-cyan-500/10 text-cyan-100 border-cyan-500/30",
};

export default function Badge({ tone = "neutral", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${LOOKS[tone] || LOOKS.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
