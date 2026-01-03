import "./globals.css";
import type { ReactNode } from "react";
import AppShell from "../components/shell/AppShell.tsx";

export const dynamic = "force-static";

export const metadata = {
  title: "Ateliux DevOps",
  description: "Painel de operacoes e confiabilidade da plataforma Ateliux.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#050910] text-gray-100 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
