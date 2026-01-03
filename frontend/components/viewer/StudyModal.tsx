"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { isPdfUrl, toViewerUrl } from "@/lib/viewer";

type StudyModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  src: string;
  description?: string;
};

function withPdfParams(url: string, original: string) {
  if (!url) return url;
  const isPdf = isPdfUrl(url) || isPdfUrl(original);
  if (!isPdf || url.includes("#")) return url;
  return `${url}#toolbar=0&navpanes=0&scrollbar=0`;
}

export default function StudyModal({ open, onClose, title, src, description }: StudyModalProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  if (!open) return null;

  const resolved = toViewerUrl(src);
  const iframeSrc = withPdfParams(resolved, src);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black">
        <button
          ref={closeRef}
          type="button"
          className="absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-black/70 p-2 text-white hover:bg-black/90"
          onClick={onClose}
          aria-label="Fechar visualizacao"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="border-b border-white/10 px-4 py-3 text-sm font-medium text-white/90">{title}</div>
        <div
          className="relative h-[70vh] w-full"
          onContextMenu={(e) => {
            e.preventDefault();
          }}
        >
          {iframeSrc ? (
            <iframe
              title={title}
              src={iframeSrc}
              className="h-full w-full"
              loading="lazy"
              allow="fullscreen"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/70">
              Arquivo indisponivel para consulta.
            </div>
          )}
        </div>
        {description ? (
          <div className="border-t border-white/10 px-4 py-3 text-xs text-white/60">{description}</div>
        ) : null}
      </div>
    </div>
  );
}
