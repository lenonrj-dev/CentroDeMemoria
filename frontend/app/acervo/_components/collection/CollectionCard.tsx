import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { COLLECTION_META } from "../../api";
import { MediaRenderer } from "../ui";
import type { CardProps } from "./types";

export function CollectionCard({ item }: CardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60"
    >
      <MediaRenderer
        mediaType={item.mediaType}
        youtubeId={item.youtubeId}
        imageUrl={item.imageUrl || item.cover}
        title={item.title}
        aspectClass="aspect-[4/3]"
      />
      <div className="p-4 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-3 text-[11px] text-white/70">
          <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5">
            {COLLECTION_META[item.collection]?.typeLabel || "Item"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {item.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {item.location}
          </span>
        </div>

        <h3 className="text-base font-semibold text-white sm:text-lg">{item.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/70">{item.summary}</p>

        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-white/60">
          {item.tags.map((t) => (
            <span key={t} className="rounded border border-white/10 bg-white/5 px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-3">
          <Link
            href={`/acervo/${item.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Ver item <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
