"use client";

import {
  ActivitySquare,
  FileText,
  Gauge,
  Settings2,
  ChevronLeft,
  Box,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const SECTIONS: Array<{ label: string; icon: LucideIcon; href: string }> = [
  { label: "Visao geral", icon: ActivitySquare, href: "/dashboard/overview" },
  { label: "Metricas", icon: Gauge, href: "/dashboard/metrics" },
  { label: "Logs", icon: FileText, href: "/dashboard/logs" },
  { label: "Config", icon: Settings2, href: "/dashboard/config" },
];

type SidebarProps = {
  open: boolean;
  onToggle: () => void;
};

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside
      className={`transition-[width] duration-300 bg-[#0e141b]/95 backdrop-blur border-r border-white/10 ${open ? "w-72" : "w-[88px]"}`}
      aria-label="Barra lateral de navegacao"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Image src="/logoAteliux.svg" alt="Ateliux" width={32} height={32} className="h-8 w-8" priority />
          {open && <div className="font-semibold tracking-wide">Ateliux Ops</div>}
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          aria-label={open ? "Recolher sidebar" : "Expandir sidebar"}
        >
          <ChevronLeft className={`h-5 w-5 transition-transform ${open ? "rotate-0" : "rotate-180"}`} />
        </button>
      </div>

      <nav className="p-3 space-y-1" role="navigation">
        {SECTIONS.map((s) => (
          <div key={s.href}>
            <Item icon={s.icon} label={s.label} href={s.href} open={open} active={isActive(s.href)} />
          </div>
        ))}
      </nav>
    </aside>
  );
}

type ItemProps = {
  icon: LucideIcon;
  label: string;
  href: string;
  open: boolean;
  active?: boolean;
};

function Item({ icon: Icon, label, href, open, active }: ItemProps) {
  const classActive = active
    ? "bg-white/[0.06] border-white/20 text-white"
    : "hover:bg-white/5 border-transparent hover:border-white/10";

  const inner = (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-[15px] ${classActive}`}
      aria-current={active ? "page" : undefined}
    >
      {Icon ? <Icon className={`h-4 w-4 ${active ? "text-white" : "text-gray-300"}`} /> : <Box className={`h-4 w-4 ${active ? "text-white" : "text-gray-300"}`} />}
      {open && <span className="truncate">{label}</span>}
    </motion.div>
  );

  return (
    <Link href={href} aria-label={label}>
      {inner}
    </Link>
  );
}
