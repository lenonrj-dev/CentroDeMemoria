"use client";

import type { ReactNode } from "react";

type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export default function Toggle({ checked, onChange, label, description, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition ${
        checked ? "border-cyan-500/40 bg-cyan-500/5" : "border-white/10 bg-white/5"
      } ${disabled ? "cursor-not-allowed opacity-60" : "hover:border-white/20"}`}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
    >
      <div className="text-left">
        <div className="text-sm font-medium text-gray-100">{label}</div>
        {description ? <p className="text-xs text-gray-400">{description}</p> : null}
      </div>
      <div
        className={`h-7 w-12 rounded-full border transition ${
          checked ? "bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-400/70" : "bg-white/10 border-white/15"
        }`}
      >
        <div
          className={`h-6 w-6 rounded-full bg-white shadow transition ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </div>
    </button>
  );
}
