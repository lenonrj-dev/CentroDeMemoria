"use client";

import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";

export function SectionHeader({ title, subtitle }: { title: ReactNode; subtitle?: ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-medium text-gray-100">{title}</h3>
      {subtitle ? <p className="text-sm text-gray-400">{subtitle}</p> : null}
    </div>
  );
}

export function FormRow({ label, hint, children }: { label: ReactNode; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="grid items-start gap-3 sm:grid-cols-[220px_minmax(0,1fr)]">
      <div className="pt-2">
        <div className="text-sm text-gray-200">{label}</div>
        {hint ? <div className="text-xs text-gray-400">{hint}</div> : null}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-white/10 bg-[#0e141b] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500/40 ${props.className || ""}`}
    />
  );
}

export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-white/10 bg-[#0e141b] px-3 py-2 text-sm ${props.className || ""}`}
    >
      {children}
    </select>
  );
}

export function Switch({ checked, onChange }: { checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full border transition ${
        checked ? "bg-cyan-500/40 border-cyan-500/60" : "bg-white/5 border-white/10"
      }`}
      aria-pressed={checked}
    >
      <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

export function CodeBox({ value, masked = false }: { value: string; masked?: boolean }) {
  const [show, setShow] = useState(!masked);
  const [copied, setCopied] = useState(false);
  const txt = show ? value : "*".repeat(Math.min(24, value.length));

  return (
    <div className="flex items-center gap-2">
      <code className="inline-flex items-center break-all rounded-lg border border-white/10 bg-[#0b1117] px-3 py-2 text-xs text-gray-200">
        {txt}
      </code>
      {masked ? (
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="rounded border border-white/10 bg-white/5 p-2 hover:border-white/20"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="rounded border border-white/10 bg-white/5 p-2 hover:border-white/20"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "danger";
  children: ReactNode;
};

export function Button({ children, variant = "default", ...props }: ButtonProps) {
  const cls =
    variant === "danger"
      ? "border-rose-500/40 bg-rose-500/10 hover:border-rose-500/60"
      : variant === "outline"
      ? "border-white/10 bg-white/5 hover:border-white/20"
      : "border-white/10 bg-cyan-500/10 hover:border-cyan-500/40";

  return (
    <button
      {...props}
      className={`rounded-lg border px-3 py-2 text-sm ${cls} ${props.className || ""}`}
    >
      {children}
    </button>
  );
}
