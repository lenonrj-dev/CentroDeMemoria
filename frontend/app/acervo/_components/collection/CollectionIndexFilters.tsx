import { Filter, Search, Tags } from "lucide-react";

export function CollectionIndexFilters({
  query,
  onQueryChange,
  decade,
  onDecadeChange,
  allDecades,
  allTags,
  picked,
  onToggleTag,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  decade: string;
  onDecadeChange: (value: string) => void;
  allDecades: string[];
  allTags: string[];
  picked: string[];
  onToggleTag: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
        <div className="md:col-span-5">
          <label htmlFor="col-search" className="sr-only">Buscar</label>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
            <Search className="h-4 w-4 text-white/60" />
            <input
              id="col-search"
              placeholder="Buscar por titulo, tag, periodo"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-white/60" />
            <select
              value={decade}
              onChange={(e) => onDecadeChange(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              {allDecades.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="flex items-center gap-2">
            <Tags className="h-4 w-4 text-white/60" />
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 6).map((t) => (
                <button
                  key={t}
                  onClick={() => onToggleTag(t)}
                  aria-pressed={picked.includes(t)}
                  className={
                    "rounded-lg border px-2.5 py-1.5 text-xs transition cursor-pointer " +
                    (picked.includes(t)
                      ? "border-white/20 bg-white/15 text-white"
                      : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10")
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
