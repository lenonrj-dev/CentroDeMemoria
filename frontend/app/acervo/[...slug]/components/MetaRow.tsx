import type { ReactNode } from "react";

export function MetaRow({ icon: Icon, children }: { icon: any; children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-white/70">
      <Icon className="h-4 w-4" /> {children}
    </div>
  );
}
