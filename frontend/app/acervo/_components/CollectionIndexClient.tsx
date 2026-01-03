"use client";

// Componente reutilizavel para paginas de indice das colecoes.
// Inclui: busca, filtros (tags e decada) e alternancia entre lista e cards.

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { COLLECTION_META } from "../api";
import { CollectionIndexFilters } from "./collection/CollectionIndexFilters";
import { CollectionIndexHeader } from "./collection/CollectionIndexHeader";
import { CollectionIndexResults } from "./collection/CollectionIndexResults";
import { fadeUp, VIEW_KEY_PREFIX } from "./collection/constants";
import { filterItems, getAllDecades, getAllTags } from "./collection/utils";
import type { CollectionIndexProps, ViewMode } from "./collection/types";

export default function CollectionIndexClient({ collectionKey, initialItems }: CollectionIndexProps) {
  const meta = COLLECTION_META[collectionKey] || { label: "Acervo", typeLabel: "Item" };

  const [q, setQ] = useState("");
  const [deb, setDeb] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [decade, setDecade] = useState("Todas");
  const [view, setView] = useState<ViewMode>("cards");

  useEffect(() => {
    const t = setTimeout(() => setDeb(q.trim().toLowerCase()), 220);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${VIEW_KEY_PREFIX}:${collectionKey}`);
      if (stored === "cards" || stored === "list") setView(stored);
    } catch {
      // ignore
    }
  }, [collectionKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`${VIEW_KEY_PREFIX}:${collectionKey}`, view);
    } catch {
      // ignore
    }
  }, [collectionKey, view]);

  const allTags = useMemo(() => getAllTags(initialItems), [initialItems]);
  const allDecades = useMemo(() => getAllDecades(initialItems), [initialItems]);

  const filtered = useMemo(
    () => filterItems(initialItems, picked, decade, deb),
    [deb, picked, decade, initialItems]
  );

  const toggleTag = (t: string) =>
    setPicked((list) => (list.includes(t) ? list.filter((x) => x !== t) : [...list, t]));

  return (
    <section className="relative w-full py-10 sm:py-14 lg:py-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <CollectionIndexHeader label={meta.label} typeLabel={meta.typeLabel} />

        <CollectionIndexFilters
          query={q}
          onQueryChange={setQ}
          decade={decade}
          onDecadeChange={setDecade}
          allDecades={allDecades}
          allTags={allTags}
          picked={picked}
          onToggleTag={toggleTag}
        />

        <CollectionIndexResults filtered={filtered} view={view} onViewChange={setView} />
      </motion.div>
    </section>
  );
}
