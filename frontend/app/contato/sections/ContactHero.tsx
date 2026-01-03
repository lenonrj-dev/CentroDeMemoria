"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, Mail, ArrowRight } from "lucide-react";
import type { ContactHeroContent } from "../../../lib/content-types";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

type ContactHeroProps = {
  content: ContactHeroContent;
};

export default function ContactHero({ content }: ContactHeroProps) {
  const { eyebrow, title, description, primaryAction, phone, email } = content;

  return (
    <section className="relative w-full py-14 sm:py-20 lg:py-24">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <p className="text-xs uppercase tracking-widest text-white/50">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={primaryAction.href}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            {primaryAction.label} <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={phone.href}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/80 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            <Phone className="h-4 w-4" /> {phone.label}
          </a>
          <a
            href={email.href}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/80 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            <Mail className="h-4 w-4" /> {email.label}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
