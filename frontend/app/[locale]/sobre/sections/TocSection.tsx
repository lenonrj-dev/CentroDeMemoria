import Link from "next/link";
import type { SiteContent } from "@/lib/content-types";
import { Section } from "../components/Section";

export function TocSection({ items }: { items: SiteContent["about"]["toc"] }) {
  return (
    <Section id="toc" title="Navegação rápida" subtitle="Sumário">
      <nav aria-label="Navegação por seções" className="overflow-x-auto">
        <ul className="flex flex-wrap gap-2">
          {items.map((it) => (
            <li key={it.href}>
              <Link
                href={it.href}
                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10"
              >
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Section>
  );
}
