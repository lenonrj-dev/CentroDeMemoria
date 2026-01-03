"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type TimelineContent = {
  eyebrow: string;
  title: string;
  description: string;
  items: { title: string; description: string; href: string; meta?: string }[];
  aside: { label: string; name: string; role: string; avatar: string; highlights: string[] };
  footnote: string;
};

type Props = { content: TimelineContent };

export default function ThirdSection({ content }: Props) {
  const hasItems = content.items.length > 0;

  return (
    <section className="relative w-full py-14 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Bloco de texto / navegacao (esquerda) */}
        <div className="lg:col-span-8">
          <div className="mb-4 text-xs uppercase tracking-widest text-white/50">{content.eyebrow}</div>
          <h3 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">{content.title}</h3>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{content.description}</p>

          {/* Lista de documentos */}
          <div
            aria-live="polite"
            role="region"
            aria-label="Documentos do fundo Dom Waldyr"
            className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6"
          >
            {hasItems ? (
              <ul className="space-y-3">
                {content.items.map((item, idx) => (
                  <li key={`${item.href}-${idx}`} className="rounded-xl border border-white/10 bg-zinc-950/60 p-4 sm:p-5">
                    {item.meta ? <div className="text-xs text-white/60">{item.meta}</div> : null}
                    <h4 className="mt-1 text-lg font-medium text-white sm:text-xl">{item.title}</h4>
                    <p className="mt-2 line-clamp-1 text-sm leading-relaxed text-white/70 sm:text-base">{item.description}</p>
                    <div className="pt-4">
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                      >
                        Ver documento <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4 text-sm text-white/70">
                Nenhum documento encontrado.
              </div>
            )}

            {content.footnote ? <p className="mt-6 text-center text-[11px] text-white/50">{content.footnote}</p> : null}
          </div>
        </div>

        {/* Retrato / cartao lateral (direita) */}
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-4"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl">
                <Image
                  src={content.aside.avatar}
                  alt={`Retrato de ${content.aside.name}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                  priority={false}
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50">{content.aside.label}</p>
                <h5 className="text-lg font-semibold text-white">{content.aside.name}</h5>
                <p className="mt-1 text-sm text-white/60">{content.aside.role}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-[11px] text-white/60">
              {content.aside.highlights.map((h) => (
                <div key={h} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                  {h}
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
