import Image from "next/image";
import type { AcervoItem } from "../../api";
import { MediaRenderer } from "../../_components/ui";

export function CoverSection({ item }: { item: AcervoItem }) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60">
      {item.collection === "entrevistas" ? (
        <MediaRenderer
          mediaType={item.mediaType}
          youtubeId={item.youtubeId}
          imageUrl={item.imageUrl || item.cover}
          title={item.title}
          aspectClass="aspect-video"
        />
      ) : (
        <div className="relative h-[46vw] max-h-[520px] w-full">
          <Image src={item.cover} alt={item.title} fill sizes="(min-width:1024px) 90vw, 100vw" className="object-cover" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
    </div>
  );
}
