"use client";

import { useState } from "react";
import Image from "next/image";
import type { PhotoItem } from "../../_components/ui";
import { PhotoLightbox } from "../../_components/ui";

export function GallerySection({ photos }: { photos: PhotoItem[] }) {
  const [photoOpen, setPhotoOpen] = useState<PhotoItem | null>(null);

  return (
    <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white sm:text-xl">Galeria</h2>
      <p className="mt-2 text-sm text-white/70">Clique em uma imagem para ampliar.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setPhotoOpen(p)}
            className="group relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50"
          >
            <div className="relative h-56 w-full">
              <Image src={p.src} alt={p.alt} fill className="object-cover transition duration-300 group-hover:scale-105" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3 text-left">
              <p className="text-xs text-white/70">{p.year} • {p.location}</p>
              <h3 className="text-sm font-semibold text-white">{p.alt}</h3>
              <p className="text-xs text-white/65 line-clamp-2">{p.description}</p>
            </div>
          </button>
        ))}
      </div>
      <PhotoLightbox photo={photoOpen} onClose={() => setPhotoOpen(null)} />
    </div>
  );
}
