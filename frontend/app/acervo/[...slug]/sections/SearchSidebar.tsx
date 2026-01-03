import Link from "next/link";
import { Search } from "lucide-react";
import { COLLECTION_META, type AcervoItem } from "../../api";

export function SearchSidebar({
  query,
  onQueryChange,
  results,
  loading,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  results: AcervoItem[];
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <label htmlFor="acervo-q" className="text-xs font-medium text-white/70">
        Buscar no acervo
      </label>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
        <Search className="h-4 w-4 text-white/60" />
        <input
          id="acervo-q"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar por título, tag..."
          className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
      </div>

      {query && (
        <div className="mt-3 max-h-72 overflow-auto rounded-xl border border-white/10">
          <ul className="divide-y divide-white/10">
            {loading && <li className="px-3 py-2 text-xs text-white/60">Buscando...</li>}
            {!loading &&
              results.map((r) => (
                <li key={r.id} className="bg-black/40">
                  <Link href={`/acervo/${r.id}`} className="block px-3 py-2 text-sm text-white/80 hover:bg-white/5">
                    <div className="line-clamp-1 font-medium text-white">{r.title}</div>
                    <div className="text-[11px] text-white/60">
                      {COLLECTION_META[r.collection]?.typeLabel} • {r.date}
                    </div>
                  </Link>
                </li>
              ))}
            {!loading && results.length === 0 && (
              <li className="px-3 py-2 text-xs text-white/60">Nenhum resultado.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
