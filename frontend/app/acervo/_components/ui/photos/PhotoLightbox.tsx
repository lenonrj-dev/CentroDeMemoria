"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Calendar, MapPin, Tag, X } from "lucide-react";
import type { PhotoItem } from "../types";

export function PhotoLightbox({
  photo,
  onClose,
}: {
  photo: PhotoItem | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!photo) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "p")) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    setTimeout(() => closeRef.current?.focus(), 0);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev || "";
    };
  }, [photo, onClose]);

  if (!photo) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Visualizacao da foto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-black">
        <button
          ref={closeRef}
          type="button"
          className="absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-black/60 p-2 text-white hover:bg-black/80"
          onClick={onClose}
          aria-label="Fechar visualizacao"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="relative h-[70vh] w-full">
          <Image src={photo.src} alt={photo.alt} fill className="object-contain" sizes="90vw" />
        </div>
        <div className="border-t border-white/10 p-4 text-white/80">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Calendar className="h-4 w-4" />
            <span>{photo.year}</span>
            <span>-</span>
            <MapPin className="h-4 w-4" />
            <span>{photo.location}</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-white">{photo.alt}</p>
          <p className="text-sm text-white/75">{photo.description}</p>
          {photo.tags && (
            <div className="mt-3 flex flex-wrap gap-2">
              {photo.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] text-white/70"
                >
                  <Tag className="h-3.5 w-3.5" />
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
