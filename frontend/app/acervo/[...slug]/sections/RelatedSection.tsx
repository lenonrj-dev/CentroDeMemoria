import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { COLLECTION_META, type AcervoItem } from "../../api";

export function RelatedSection({ items }: { items: AcervoItem[] }) {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-base font-semibold text-white">Relacionados</h3>
      <ul className="mt-3 space-y-2">
        {items.length === 0 && <li className="text-sm text-white/60">Sem itens relacionados.</li>}
        {items.map((r) => (
          <li key={r.id}>
            <Link
              href={`/acervo/${r.id}`}
              className="group flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/50 px-3 py-2 hover:bg-black/70"
            >
              <div className="min-w-0">
                <div className="line-clamp-1 text-sm font-medium text-white">{r.title}</div>
                <div className="text-[11px] text-white/60">
                  {COLLECTION_META[r.collection]?.typeLabel} • {r.date}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-white/40 group-hover:text-white/70" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
