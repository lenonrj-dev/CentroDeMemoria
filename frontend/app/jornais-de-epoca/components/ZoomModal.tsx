"use client";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";

type ZoomModalProps = {
  open: boolean;
  onClose: () => void;
  src: string;
  title?: string;
  caption?: string;
  allowZoom?: boolean;
  width?: number;
  height?: number;
};

export default function ZoomModal({
  open,
  onClose,
  src,
  title = "",
  caption = "",
  allowZoom = true,
  width = 1359,
  height = 2998,
}: ZoomModalProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const [magnifier, setMagnifier] = useState(false);
  const [magPos, setMagPos] = useState({ x: 0, y: 0, relX: 0, relY: 0 });

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => closeRef.current?.focus(), 0);
    return () => {
      document.documentElement.style.overflow = prev || "";
      setScale(1);
      setTx(0);
      setTy(0);
      setMagnifier(false);
    };
  }, [open]);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const setZoom = (next: number, cx: number, cy: number) => {
    if (!allowZoom) return;
    const dz = next - scale;
    const centerX = (dialogRef.current?.clientWidth || 0) / 2;
    const centerY = (dialogRef.current?.clientHeight || 0) / 2;
    const nx = tx - ((cx - centerX) * dz) / next;
    const ny = ty - ((cy - centerY) * dz) / next;
    setScale(next);
    setTx(nx);
    setTy(ny);
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!allowZoom) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    const next = clamp(scale + delta, 1, 5);
    const rect = dialogRef.current?.getBoundingClientRect();
    const cx = rect ? e.clientX - rect.left : 0;
    const cy = rect ? e.clientY - rect.top : 0;
    setZoom(next, cx, cy);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!allowZoom || scale <= 1 || e.button !== 0) return;
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!allowZoom || !dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setTx((v) => v + dx);
    setTy((v) => v + dy);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const onDblClick = (e: React.MouseEvent) => {
    if (!allowZoom) return;
    const rect = dialogRef.current?.getBoundingClientRect();
    const cx = rect ? e.clientX - rect.left : 0;
    const cy = rect ? e.clientY - rect.top : 0;
    const next = scale > 1 ? 1 : 2.5;
    setZoom(next, cx, cy);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "p")) {
      e.preventDefault();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (allowZoom && (e.key === "+" || e.key === "=")) {
      e.preventDefault();
      setZoom(clamp(scale + 0.2, 1, 5), (dialogRef.current?.clientWidth || 0) / 2, (dialogRef.current?.clientHeight || 0) / 2);
    } else if (allowZoom && e.key === "-") {
      e.preventDefault();
      setZoom(clamp(scale - 0.2, 1, 5), (dialogRef.current?.clientWidth || 0) / 2, (dialogRef.current?.clientHeight || 0) / 2);
    } else if (allowZoom && e.key === "0") {
      e.preventDefault();
      setScale(1);
      setTx(0);
      setTy(0);
    }
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!magnifier) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 100;
    const relY = ((e.clientY - rect.top) / rect.height) * 100;
    setMagPos({ x: e.clientX, y: e.clientY, relX, relY });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur px-4 py-6"
      aria-hidden={!open}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="zoommodal-title"
        aria-describedby="zoommodal-desc"
        className="relative mx-auto w-[min(1400px,98vw)] max-h-[calc(100vh-48px)] rounded-2xl border border-white/15 bg-zinc-950/90 shadow-2xl focus:outline-none"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/10 p-3 sm:p-4">
          <div className="min-w-0">
            <h2 id="zoommodal-title" className="truncate text-sm font-semibold text-white sm:text-base">
              {title || "Leitura em alta resolucao"}
            </h2>
            {caption && (
              <p id="zoommodal-desc" className="mt-0.5 line-clamp-1 text-xs text-white/60">
                {caption}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {allowZoom && (
              <>
                <button
                  onClick={() => setScale((s) => clamp(s - 0.2, 1, 5))}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-black"
                  aria-label="Diminuir zoom"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setScale((s) => clamp(s + 0.2, 1, 5))}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-black"
                  aria-label="Aumentar zoom"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setScale(1);
                    setTx(0);
                    setTy(0);
                  }}
                  className="hidden rounded-lg border border-white/10 bg-white/5 p-2 text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-black sm:inline-flex"
                  aria-label="Restaurar 100%"
                  title="Restaurar 100%"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              onClick={() => setMagnifier((m) => !m)}
              className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-black"
              aria-label="Alternar lupa"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            
            <button
              ref={closeRef}
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-black"
            >
              Fechar
            </button>
          </div>
        </div>

        <div
          className="relative flex h-[min(90vh,1100px)] w-full items-start justify-center overflow-auto bg-black"
          onWheel={allowZoom ? onWheel : undefined}
          onPointerDown={allowZoom ? onPointerDown : undefined}
          onPointerMove={allowZoom ? onPointerMove : undefined}
          onPointerUp={allowZoom ? onPointerUp : undefined}
          onPointerCancel={allowZoom ? onPointerUp : undefined}
          onDoubleClick={allowZoom ? onDblClick : undefined}
          onMouseMove={onMove}
          onContextMenu={(e) => e.preventDefault()}
          aria-label="Area da imagem"
        >
          <div
            className="will-change-transform"
            style={{
              transform: `translate(${allowZoom ? tx : 0}px, ${allowZoom ? ty : 0}px) scale(${allowZoom ? scale : 1})`,
            }}
          >
            <Image
              src={src}
              alt={title || "Edicao digitalizada"}
              width={width}
              height={height}
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="block max-h-[88vh] max-w-[96vw] select-none object-contain"
              priority
            />
          </div>
          {magnifier && (
            <div
              className="pointer-events-none fixed z-[120] hidden h-40 w-40 overflow-hidden rounded-full border border-white/20 bg-black/60 shadow-2xl sm:block"
              style={{ left: magPos.x + 16, top: magPos.y + 16 }}
            >
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "200% 200%",
                  backgroundPosition: `${magPos.relX}% ${magPos.relY}%`,
                }}
              />
            </div>
          )}
        </div>

        <p className="border-t border-white/10 p-3 text-center text-[11px] text-white/60">
          {allowZoom
            ? "Use a roda do mouse para aproximar/afastar, arraste para mover. Pressione Esc para fechar."
            : "Visualizacao ajustada ao modal. Pressione Esc para fechar."}
        </p>
      </div>
    </div>
  );
}
