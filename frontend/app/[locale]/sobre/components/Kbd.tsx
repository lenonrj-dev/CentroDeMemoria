import type { ReactNode } from "react";

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-md border border-white/15 bg-white/5 px-1.5 py-0.5 text-[11px] text-white/80">
      {children}
    </kbd>
  );
}
