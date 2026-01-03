"use client";

import { useState } from "react";
import type { PhotoItem } from "../types";
import { PhotoCard } from "./PhotoCard";
import { PhotoLightbox } from "./PhotoLightbox";

export function PhotoMasonryGrid({ photos }: { photos: PhotoItem[] }) {
  const [active, setActive] = useState<PhotoItem | null>(null);
  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((photo, idx) => (
          <div key={`${photo.src}-${idx}`} className="mb-4 break-inside-avoid">
            <PhotoCard photo={photo} onClick={() => setActive(photo)} />
          </div>
        ))}
      </div>
      <PhotoLightbox photo={active} onClose={() => setActive(null)} />
    </>
  );
}
