"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import clsx from "clsx";
import { youtubeEmbedUrl, youtubeThumbUrl } from "@/lib/youtube";

export function MediaRenderer({
  mediaType,
  youtubeId,
  imageUrl,
  title,
  aspectClass = "aspect-video",
  className,
}: {
  mediaType?: "youtube" | "image" | "text";
  youtubeId?: string;
  imageUrl?: string;
  title?: string;
  aspectClass?: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const resolved = mediaType || (youtubeId ? "youtube" : imageUrl ? "image" : "text");
  const thumb = youtubeId ? youtubeThumbUrl(youtubeId) : "";

  useEffect(() => {
    setActive(false);
  }, [youtubeId]);

  if (resolved === "youtube" && youtubeId) {
    return (
      <div className={clsx("relative overflow-hidden rounded-2xl border border-white/10 bg-black/40", aspectClass, className)}>
        {active ? (
          <iframe
            title={title ? `Video: ${title}` : "Video do YouTube"}
            src={youtubeEmbedUrl(youtubeId)}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="group relative flex h-full w-full items-center justify-center"
            aria-label="Reproduzir video do YouTube"
          >
            {thumb ? (
              <Image src={thumb} alt={title || "video"} fill className="object-cover" sizes="(min-width:1024px) 36vw, 90vw" />
            ) : (
              <div className="absolute inset-0 bg-black/60" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <span className="relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs text-white">
              <Play className="h-4 w-4" /> Reproduzir
            </span>
          </button>
        )}
      </div>
    );
  }

  if (resolved === "image" && imageUrl) {
    return (
      <div className={clsx("relative overflow-hidden rounded-2xl border border-white/10 bg-black/40", aspectClass, className)}>
        <Image src={imageUrl} alt={title || "imagem"} fill className="object-cover" sizes="(min-width:1024px) 36vw, 90vw" />
      </div>
    );
  }

  return (
    <div className={clsx("relative flex items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-xs text-white/60", aspectClass, className)}>
      Somente texto
    </div>
  );
}
