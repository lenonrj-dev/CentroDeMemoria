import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Centro de Memória Operária Digitalizada Rubem Machado",
  description: "Site Centro de Memória Operária Digitalizada Rubem Machado",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-black text-slate-200 antialiased">{children}</body>
    </html>
  );
}
