import Link from "next/link";
import type { BreadcrumbItem } from "../types";

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-xs text-white/60">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1">
            {item.href ? (
              <Link href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ) : (
              <span className="text-white/75">{item.label}</span>
            )}
            {idx < items.length - 1 && <span className="text-white/40">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
