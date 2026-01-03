"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type LogoItem = {
  src: string;
  alt: string;
  wrapperClassName?: string;
  className?: string;
  offsetTop?: number;
};

type FirstSectionProps = {
  imageSrc: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  logos?: LogoItem[];
};

export default function FirstSection({
  imageSrc,
  alt = "Imagem de fundo",
  logos = [],
}: FirstSectionProps) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8">
      <div className="relative mt-10 mx-auto h-[min(57svh,585px)] min-h-[320px] max-w-6xl">
        <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl">
          {/* Fundo com zoom sutil */}
          <motion.div
            aria-hidden
            initial={false}
            animate={mounted && !reduce ? { scale: [1, 1.05, 1] } : undefined}
            transition={
              mounted && !reduce
                ? { duration: 18, ease: "linear", repeat: Infinity }
                : undefined
            }
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src={imageSrc}
              alt={alt}
              fill
              priority
              sizes="(min-width:1280px) 1200px, 100vw"
              className="object-cover will-change-transform"
            />
          </motion.div>

          {/* Grid overlay sutil */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-screen"
            aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "36px 36px, 36px 36px",
            }}
          />

          {/* Fade inferior */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Logotipos sobre o hero, posicionados fora do quadro da imagem */}
        {logos.length > 0 && (
          <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex items-start justify-center gap-6 px-3 sm:gap-10 sm:px-0 opacity-95">
            {/* Esquerda */}
            {logos[0] && (
              <div>
                <div
                  // Ajuste aqui o tamanho padrão da logo esquerda (classes h-*/w-*)
                  className={logos[0].wrapperClassName || "relative h-16 w-16 sm:h-20 sm:w-20"}
                  style={logos[0].offsetTop ? { marginTop: logos[0].offsetTop } : undefined}
                >
                  <Image
                    src={logos[0].src}
                    alt={logos[0].alt}
                    width={340}
                    height={350}
                    className={logos[0].className || "object-contain drop-shadow-lg"}
                  />
                </div>
              </div>
            )}

            {/* Central */}
            {logos[1] && (
              <div>
                <div
                  className={logos[1].wrapperClassName || "relative h-16 w-16 sm:h-20 sm:w-20"}
                  style={{ marginTop: logos[1].offsetTop ?? -100 }}
                >
                  <Image
                    src={logos[1].src}
                    alt={logos[1].alt}
                    width={340}
                    height={350}
                    className={logos[1].className || "object-contain drop-shadow-lg"}
                  />
                </div>
              </div>
            )}

            {/* Direita */}
            {logos[2] && (
              <div>
                <div
                  // Ajuste aqui o tamanho padrão da logo direita (classes h-*/w-*)
                  className={logos[2].wrapperClassName || "relative h-26 w-26 sm:h-38 sm:w-38"}
                  style={logos[2].offsetTop ? { marginTop: logos[2].offsetTop } : undefined}
                >
                  <Image
                    src={logos[2].src}
                    alt={logos[2].alt}
                    width={340}
                    height={350}
                    className={logos[2].className || "object-contain drop-shadow-lg"}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
