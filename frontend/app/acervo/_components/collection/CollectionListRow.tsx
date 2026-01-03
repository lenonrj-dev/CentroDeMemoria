import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { COLLECTION_META } from "../../api";
import { MediaRenderer } from "../ui";
import { youtubeThumbUrl } from "@/lib/youtube";
import type { CardProps } from "./types";

export function CollectionListRow({ item }: CardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-950/60 p-3 sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 items-start gap-3 sm:items-center">
        <div className="hidden sm:block">
          <MediaRenderer
            mediaType={item.mediaType}
            youtubeId={item.youtubeId}
            imageUrl={item.imageUrl || (item.youtubeId ? youtubeThumbUrl(item.youtubeId) : item.cover)}
            title={item.title}
            aspectClass="aspect-[4/3]"
            className="w-12"
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-white/90">{item.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-white/60">
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
          <p className="mt-1 line-clamp-1 text-xs text-white/60">{item.summary}</p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-white/50">
            {item.tags.slice(0, 4).map((t) => (
              <span key={t} className="rounded border border-white/10 bg-white/5 px-2 py-0.5">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="sm:ml-auto">
        <Link
          href={`/acervo/${item.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Ver item <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}
