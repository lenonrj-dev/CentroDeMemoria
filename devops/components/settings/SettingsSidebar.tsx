// file: components/settings/SettingsSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// ⬇️ troquei `Kubernetes` por `ServerCog` (existe no lucide-react)
import { Cog, Palette, Bell, KeyRound, Boxes, ServerCog, Lock, ShieldCheck, User } from "lucide-react";

const items = [
  { href: "/dashboard/settings/general", icon: Cog, label: "Geral" },
  { href: "/dashboard/settings/appearance", icon: Palette, label: "Aparência" },
  { href: "/dashboard/settings/notifications", icon: Bell, label: "Notificações" },
  { href: "/dashboard/settings/access-tokens", icon: KeyRound, label: "Tokens de Acesso" },
  { href: "/dashboard/settings/integrations", icon: Boxes, label: "Integrações" },
  // ⬇️ aqui também: use o novo ícone
  { href: "/dashboard/settings/kubernetes", icon: ServerCog, label: "Kubernetes" },
  { href: "/dashboard/settings/secrets", icon: Lock, label: "Segredos" },
  { href: "/dashboard/settings/audit", icon: ShieldCheck, label: "Auditoria" },
  { href: "/dashboard/settings/profile", icon: User, label: "Perfil" },
];

export default function SettingsSidebar() {
  const pathname = usePathname();
  return (
    <nav className="rounded-xl border border-white/10 bg-white/5 p-2">
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm
              ${active ? "bg-cyan-500/10 border border-cyan-500/30" : "hover:bg-white/5 border border-transparent"}`}
          >
            <Icon className="h-4 w-4 text-gray-300" />
            <span className="text-gray-100">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
