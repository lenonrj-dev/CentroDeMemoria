"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type PreviewItem = {
  label: string;
  description?: string;
  href: string;
  previewSrc?: string;
  width?: number;
  height?: number;
};

export function InlinePreviewModal({ items, title }: { items: PreviewItem[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<PreviewItem | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [magnifier, setMagnifier] = useState(false);
  const [magPos, setMagPos] = useState({ x: 0, y: 0, relX: 0, relY: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const onOpen = (item: PreviewItem) => {
    setActive(item);
    setOpen(true);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const onClose = useCallback(() => {
    setOpen(false);
    setActive(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setMagnifier(false);
  }, []);

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

  const handleZoom = (value: number) => {
    const clamped = Math.min(3, Math.max(1, value));
    setZoom(clamped);
    if (clamped === 1) setOffset({ x: 0, y: 0 });
  };

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    handleZoom(zoom + delta);
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (zoom <= 1 || event.button !== 0) return;
    setDragging(true);
    setDragStart({ x: event.clientX - offset.x, y: event.clientY - offset.y });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!dragging || !dragStart || event.buttons !== 1) return;
    setOffset({ x: event.clientX - dragStart.x, y: event.clientY - dragStart.y });
  };

  const handlePreviewMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = ((event.clientX - rect.left) / rect.width) * 100;
    const relY = ((event.clientY - rect.top) / rect.height) * 100;
    setMagPos({ x: event.clientX, y: event.clientY, relX, relY });
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragStart(null);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.2em] text-white/60">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => onOpen(item)}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-left text-sm text-white/80 hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-black"
          >
            <div className="font-medium text-white">{item.label}</div>
            {item.description && <p className="text-xs text-white/60">{item.description}</p>}
          </button>
        ))}
      </div>

      {open && active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="relative w-full max-w-[min(1400px,96vw)] max-h-[calc(100vh-48px)] overflow-hidden rounded-3xl border border-white/10 bg-[#0b0c10] shadow-2xl">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 p-2 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-black"
              aria-label="Fechar visualizacao"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-5 sm:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Visualizacao</p>
              <h4 className="mt-1 text-lg font-semibold text-white">{active.label}</h4>
              {active.description && <p className="mt-1 text-sm text-white/70">{active.description}</p>}
            </div>
            <div
              className="relative flex h-[min(88vh,1000px)] w-full items-start justify-center overflow-auto bg-black/40"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMoveCapture={handlePreviewMove}
              onContextMenu={(e) => {
                e.preventDefault();
              }}
              aria-label="Area de visualizacao do documento"
            >
              {active.previewSrc ? (
                <div className="flex h-full w-full items-start justify-center">
                  <div
                    className={`relative flex h-full w-full items-start justify-center ${zoom > 1 ? "cursor-grab" : ""}`}
                    style={{
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                      transformOrigin: "center center",
                    }}
                  >
                    <Image
                      src={active.previewSrc}
                      alt={active.label}
                      width={active.width || 1359}
                      height={active.height || 2998}
                      sizes="(max-width: 1400px) 100vw, 1359px"
                      className="max-h-[88vh] max-w-[96vw] select-none object-contain"
                    />
                  </div>
                  {magnifier && active.previewSrc && (
                    <div
                      className="pointer-events-none fixed z-50 hidden h-40 w-40 overflow-hidden rounded-full border border-white/20 bg-black/60 shadow-2xl sm:block"
                      style={{ left: magPos.x + 16, top: magPos.y + 16 }}
                    >
                      <div
                        className="h-full w-full"
                        style={{
                          backgroundImage: `url(${active.previewSrc})`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "200% 200%",
                          backgroundPosition: `${magPos.relX}% ${magPos.relY}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <iframe title={active.label} src={active.href} className="h-full w-full border-0 bg-black/40 text-white" />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleZoom(zoom - 0.25)}
                  className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-sm text-white hover:bg-white/15"
                >
                  -
                </button>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.25"
                  value={zoom}
                  onChange={(e) => handleZoom(Number(e.target.value))}
                  className="h-1 w-28 accent-white/80"
                  aria-label="Zoom"
                />
                <button
                  onClick={() => handleZoom(zoom + 0.25)}
                  className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-sm text-white hover:bg-white/15"
                >
                  +
                </button>
                <button
                  onClick={() => handleZoom(1)}
                  className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/15"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMagnifier((m) => !m)}
                  className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/15"
                >
                  {magnifier ? "Lupa: on" : "Lupa: off"}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span>Para ler completo, acesse o acervo.</span>
                <Link
                  href={active.href}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15"
                >
                  Abrir no acervo
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
