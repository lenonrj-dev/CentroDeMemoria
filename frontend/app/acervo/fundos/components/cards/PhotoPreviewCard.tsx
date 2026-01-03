import Image from "next/image";
import type { PhotoItem } from "../../types";

export function PhotoPreviewCard({ photo }: { photo: PhotoItem }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow transition hover:border-slate-100/40 hover:shadow-xl hover:shadow-slate-950/60">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width:1024px) 400px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <div className="space-y-1 p-4">
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
          <span>{photo.year}</span>
          <span>ƒ?½</span>
          <span>{photo.location}</span>
        </div>
        <h4 className="text-sm font-semibold text-slate-50">{photo.caption}</h4>
        <p className="text-xs text-slate-400">{photo.description}</p>
        <span className="inline-flex rounded-full border border-amber-300/40 bg-amber-300/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-amber-100">
          Acervo fotografico
        </span>
      </div>
    </div>
  );
}
