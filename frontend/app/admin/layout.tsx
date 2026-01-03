import type { ReactNode } from "react";
import "../globals.css";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-black text-slate-200 antialiased">{children}</div>;
}

