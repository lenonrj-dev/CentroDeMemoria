"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { AdminAuthProvider, useAdminAuth } from "./AdminAuthProvider";
import { RequireAdmin } from "./RequireAdmin";
import { ToastProvider } from "./ToastProvider";
import { AdminOverviewProvider, useAdminOverview } from "./AdminOverviewProvider";
import type { AdminModule } from "../../lib/public-site";
import { buttonClasses } from "./ui";
import { AdminHelpLayer } from "./AdminHelpLayer";

type NavItem = { href: string; label: string; module?: AdminModule; icon: "home" | "doc" | "quote" | "book" | "news" | "photo" | "routes" };

const NAV: NavItem[] = [
  { href: "/admin", label: "Mapa do site", icon: "home" },
  { href: "/admin/rotas", label: "Conteudos do site", icon: "routes" },
  { href: "/admin/documentos", label: "Documentos", module: "documentos", icon: "doc" },
  { href: "/admin/depoimentos", label: "Depoimentos", module: "depoimentos", icon: "quote" },
  { href: "/admin/referencias", label: "Referencia bibliografica", module: "referencias", icon: "book" },
  { href: "/admin/jornais", label: "Jornais de epoca", module: "jornais", icon: "news" },
  { href: "/admin/acervo-fotografico", label: "Acervo fotografico", module: "acervo-fotografico", icon: "photo" },
  { href: "/admin/acervos-pessoais", label: "Acervos pessoais", module: "acervos-pessoais", icon: "photo" },
];

function Icon({ name }: { name: NavItem["icon"] }) {
  const common = "h-4 w-4";
  switch (name) {
    case "home":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "doc":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M14 3v4h4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "quote":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M10 11H6V8a4 4 0 0 1 4-4h1v3h-1a1 1 0 0 0-1 1v1h2v5Zm8 0h-4V8a4 4 0 0 1 4-4h1v3h-1a1 1 0 0 0-1 1v1h2v5Z"
            fill="currentColor"
            opacity="0.85"
          />
        </svg>
      );
    case "book":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17.5a2.5 2.5 0 0 1-2.5 2.5H7.5A2.5 2.5 0 0 1 5 19.5v-15Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M8 6h9M8 10h9" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "news":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 5a2 2 0 0 1 2-2h12v14a3 3 0 0 1-3 3H6a2 2 0 0 1-2-2V5Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M8 7h6M8 11h8M8 15h8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M18 8h2v9a3 3 0 0 1-3 3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "photo":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 6a2 2 0 0 1 2-2h3l1-1h4l1 1h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M8 14l2-2 2 2 2-2 4 4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9.5 9.5a1 1 0 1 0 0 .01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "routes":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 6h10M4 12h16M4 18h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="14" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
  }
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { clearToken } = useAdminAuth();
  const pathname = usePathname() || "/admin";
  const parts = pathname.split("?")[0].split("/").filter(Boolean);

  const seg2 = parts[1] || "";
  const seg3 = parts[2] || "";
  const moduleHref = seg2 ? `/admin/${seg2}` : "/admin";
  const moduleLabel = NAV.find((n) => n.href === moduleHref)?.label;

  const crumbs: Array<{ label: string; href?: string }> = [{ label: "Admin", href: "/admin" }];
  if (moduleLabel && moduleHref !== "/admin") crumbs.push({ label: moduleLabel, href: moduleHref });
  if (seg3) crumbs.push({ label: seg3 === "new" ? "Novo" : "Editar" });

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 text-slate-200 hover:bg-slate-900 md:hidden"
          aria-label="Abrir menu"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 6h16M4 12h16M4 18h12" strokeLinecap="round" />
          </svg>
        </button>
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Centro de Memoria Operaria</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-100">
            {crumbs.map((c, idx) => (
              <span key={`${c.label}-${idx}`} className="inline-flex items-center gap-2">
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span>{c.label}</span>
                )}
                {idx < crumbs.length - 1 ? <span className="text-slate-600">/</span> : null}
              </span>
            ))}
          </div>
        </div>
      </div>
      <button type="button" onClick={clearToken} className={buttonClasses("secondary", "sm")}>
        Sair
      </button>
    </div>
  );
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname() || "";
  const { data } = useAdminOverview();

  const countsByModule = useMemo(() => {
    const map = new Map<AdminModule, { published: number; drafts: number }>();
    data?.counts?.forEach((c) => map.set(c.module, { published: c.published, drafts: c.drafts }));
    return map;
  }, [data]);

  return (
    <>
      <div
        className={clsx("fixed inset-0 z-20 bg-black/60 transition md:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={clsx(
          "fixed left-0 top-0 z-30 h-full w-[78vw] max-w-[280px] border-r border-slate-800/80 bg-slate-950/95 p-4 shadow-2xl transition md:static md:h-auto md:w-72 md:translate-x-0 md:border-r md:bg-transparent",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="mb-4 flex items-center justify-between md:hidden">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Menu</div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/70 text-slate-200"
            aria-label="Fechar menu"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="grid gap-1">
          {NAV.slice(0, 1).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40",
                  active ? "bg-indigo-500/15 text-white" : "text-slate-400 hover:bg-slate-900/60 hover:text-white"
                )}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="my-3 h-px bg-slate-800/80" />

          {NAV.slice(1).map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const c = item.module ? countsByModule.get(item.module) : null;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40",
                  active ? "bg-indigo-500/15 text-white" : "text-slate-400 hover:bg-slate-900/60 hover:text-white"
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon name={item.icon} />
                  {item.label}
                </span>
                {c ? (
                  <span className="flex items-center gap-1 text-[11px]">
                    <span className="rounded-md border border-slate-700/80 bg-slate-900/70 px-2 py-0.5 text-slate-200">{c.published} P</span>
                    <span className="rounded-md border border-slate-700/80 bg-slate-900/70 px-2 py-0.5 text-slate-200">{c.drafts} R</span>
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <AdminAuthProvider>
      <RequireAdmin>
        <ToastProvider>
          <AdminOverviewProvider>
            <div className="min-h-[calc(100svh-0px)] bg-transparent">
              <Header onMenuClick={() => setSidebarOpen(true)} />
              <div className="flex flex-col md:flex-row">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="w-full px-4 py-5 sm:px-6 lg:px-8" onClick={() => setSidebarOpen(false)}>
                  {children}
                </main>
              </div>
              <AdminHelpLayer />
            </div>
          </AdminOverviewProvider>
        </ToastProvider>
      </RequireAdmin>
    </AdminAuthProvider>
  );
}
