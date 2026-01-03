"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import DocCard from "../../../components/sections/DocCard";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
const stagger = {
  show: { transition: { staggerChildren: 0.06 } },
};

export type FeaturedCollectionContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  items: { title: string; description: string; href: string; cover: string; badge?: string }[];
  footnote: string;
};

type Props = { content: FeaturedCollectionContent };

export default function SecondSection({ content }: Props) {
  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-12">
      {/* Cabeçalho */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-3xl px-4 text-center sm:px-6"
      >
        <p className="mb-2 text-xs uppercase tracking-widest text-white/50">
          {content.eyebrow}
        </p>
        <h2 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
          {content.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
          {content.description}
        </p>

        {/* CTA principal */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href={content.primaryCta.href}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            {content.primaryCta.label}
          </Link>
          <Link
            href={content.secondaryCta.href}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            {content.secondaryCta.label}
          </Link>
        </div>
      </motion.div>

      {/* Grade de documentos */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-4 px-4 sm:mt-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4"
      >
        {content.items.map((it, idx) => (
          <motion.div key={`${it.title}-${idx}`} variants={fadeInUp} className="h-full">
            <DocCard
              title={it.title}
              description={it.description}
              href={it.href}
              cover={it.cover}
              alt={it.title}
              badge={it.badge}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Rodapé da seção */}
      <div className="mx-auto mt-8 max-w-3xl px-4 text-center text-xs text-white/50 sm:px-6">
        {content.footnote}
      </div>
    </section>
  );
}
