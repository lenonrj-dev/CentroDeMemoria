"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { AdminAuthProvider, useAdminAuth } from "./AdminAuthProvider";
import { RequireAdmin } from "./RequireAdmin";

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: "/admin/documentos", label: "Documentos" },
  { href: "/admin/depoimentos", label: "Depoimentos" },
  { href: "/admin/referencias", label: "Referência bibliográfica" },
  { href: "/admin/jornais", label: "Jornais de época" },
  { href: "/admin/acervo-fotografico", label: "Acervo fotográfico" },
];

function Header() {
  const { clearToken } = useAdminAuth();
  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-3">
      <div className="text-sm font-semibold text-white/90">Admin • Cmodrm</div>
      <button
        type="button"
        onClick={clearToken}
        className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
      >
        Sair
      </button>
    </div>
  );
}

function Sidebar() {
  const pathname = usePathname() || "";
  return (
    <aside className="w-full border-b border-white/10 bg-black/30 p-3 sm:w-64 sm:border-b-0 sm:border-r">
      <nav className="grid gap-1">
        <Link
          href="/admin"
          className={clsx(
            "rounded-xl px-3 py-2 text-sm transition",
            pathname === "/admin" ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
          )}
        >
          Conteúdo & Pendências
        </Link>
        <div className="my-2 h-px bg-white/10" />
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "rounded-xl px-3 py-2 text-sm transition",
                active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <RequireAdmin>
        <div className="min-h-[calc(100svh-0px)]">
          <Header />
          <div className="flex flex-col sm:flex-row">
            <Sidebar />
            <main className="w-full p-4 sm:p-6">{children}</main>
          </div>
        </div>
      </RequireAdmin>
    </AdminAuthProvider>
  );
}

