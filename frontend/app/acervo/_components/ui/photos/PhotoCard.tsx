import Image from "next/image";
import type { PhotoItem } from "../types";

export function PhotoCard({ photo, onClick }: { photo: PhotoItem; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50"
    >
      <div className="relative h-56 w-full">
        <Image src={photo.src} alt={photo.alt} fill className="object-cover transition duration-300 group-hover:scale-105" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 text-left">
        <p className="text-xs text-white/70">{photo.year} • {photo.location}</p>
        <h3 className="text-sm font-semibold text-white">{photo.alt}</h3>
        <p className="text-xs text-white/65 line-clamp-2">{photo.description}</p>
      </div>
    </button>
  );
}
