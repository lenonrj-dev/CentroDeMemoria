import type { ReactNode } from "react";
import "./tailwind.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">{children}</body>
    </html>
  );
}
