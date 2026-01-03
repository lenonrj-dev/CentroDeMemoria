"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { COLLECTION_META, getItem, relatedFor, type CollectionKey } from "../../api";
import { useAcervoItem } from "../hooks/useAcervoItem";
import { useAcervoSearch } from "../hooks/useAcervoSearch";
import { emptyFallback, fadeUp } from "../data";
import { ReaderHeader } from "../sections/ReaderHeader";
import { CoverSection } from "../sections/CoverSection";
import { GallerySection } from "../sections/GallerySection";
import { MainContentSection } from "../sections/MainContentSection";
import { SearchSidebar } from "../sections/SearchSidebar";
import { RelatedSection } from "../sections/RelatedSection";
import { BackLink } from "../sections/BackLink";

export function AcervoReaderClient({
  collection,
  slug,
}: {
  collection: CollectionKey;
  slug: string;
}) {
  const { loading, remoteItem, remotePhotos } = useAcervoItem(collection, slug);
  const { q, setQ, results, searchLoading } = useAcervoSearch();

  const item = remoteItem || getItem(collection, slug) || emptyFallback(collection, slug);
  const rel = useMemo(() => relatedFor(item, 6), [item]);
  const colMeta = COLLECTION_META[item.collection] || { label: "Acervo", typeLabel: "Item" };

  return (
    <section className="relative w-full py-10 sm:py-14 lg:py-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <ReaderHeader item={item} collectionLabel={colMeta.label} typeLabel={colMeta.typeLabel} />
        <CoverSection item={item} />

        {loading ? <div className="mb-6 text-sm text-white/60">Carregando do banco...</div> : null}

        {remotePhotos.length > 0 && <GallerySection photos={remotePhotos} />}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <MainContentSection item={item} />

          <aside className="lg:col-span-4">
            <SearchSidebar query={q} onQueryChange={setQ} results={results} loading={searchLoading} />
            <RelatedSection items={rel} />
            <BackLink href={`/acervo/${item.collection}`} label={colMeta.label} />
          </aside>
        </div>
      </motion.div>
    </section>
  );
}
