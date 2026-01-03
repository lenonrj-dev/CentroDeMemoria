import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import type { DepoimentoCardProps } from "../types";
import { MediaRenderer } from "../media/MediaRenderer";
import { youtubeThumbUrl } from "@/lib/youtube";

export function DepoimentoCard({
  author,
  role,
  excerpt,
  date,
  theme,
  avatar,
  href,
  mediaType,
  youtubeId,
  imageUrl,
}: DepoimentoCardProps) {
  const resolvedMedia = mediaType || (youtubeId ? "youtube" : imageUrl || avatar ? "image" : "text");
  const avatarSrc = avatar || imageUrl || (youtubeId ? youtubeThumbUrl(youtubeId) : "/hero.png");
  const content = (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-white/20">
      <div className="mb-3">
        <MediaRenderer
          mediaType={resolvedMedia}
          youtubeId={youtubeId}
          imageUrl={imageUrl || avatarSrc}
          title={author}
          aspectClass="aspect-video"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-black/40">
          <Image src={avatarSrc} alt={author} fill className="object-cover" sizes="48px" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{author}</p>
          {role ? <p className="text-xs text-white/60">{role}</p> : null}
          {date ? <p className="text-[11px] text-white/60">{date}</p> : null}
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 text-white/80">
        <Quote className="mt-1 h-4 w-4 text-white/40" />
        <p className="line-clamp-2 text-sm leading-relaxed">{excerpt}</p>
      </div>
      {theme ? (
        <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
          <span className="rounded-lg border border-white/10 bg-black/30 px-2 py-1">Tema: {theme}</span>
        </div>
      ) : null}
      <div className="mt-3">
        <span className="inline-flex items-center gap-2 text-sm text-white/80">
          <ArrowRight className="h-4 w-4" />
          Ler depoimento completo
        </span>
      </div>
    </article>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}
