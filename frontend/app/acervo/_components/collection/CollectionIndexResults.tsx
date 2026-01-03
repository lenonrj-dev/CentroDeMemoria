import { motion } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import type { AcervoItem } from "../../api";
import type { ViewMode } from "./types";
import { CollectionCard } from "./CollectionCard";
import { CollectionListRow } from "./CollectionListRow";

export function CollectionIndexResults({
  filtered,
  view,
  onViewChange,
}: {
  filtered: AcervoItem[];
  view: ViewMode;
  onViewChange: (value: ViewMode) => void;
}) {
  return (
    <>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
        <span>{filtered.length ? `${filtered.length} itens encontrados` : "Nenhum resultado"}</span>
        <div className="inline-flex overflow-hidden rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => onViewChange("cards")}
            aria-pressed={view === "cards"}
            className={`cursor-pointer px-2.5 py-2 ${view === "cards" ? "bg-white/15 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange("list")}
            aria-pressed={view === "list"}
            className={`cursor-pointer px-2.5 py-2 ${view === "list" ? "bg-white/15 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/60"
          >
            Nenhum resultado. Ajuste filtros ou termos.
          </motion.div>
        ) : view === "list" ? (
          <div className="space-y-2">
            {filtered.map((it) => (
              <CollectionListRow key={it.id} item={it} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it) => (
              <CollectionCard key={it.id} item={it} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
