"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, Mail, MessageSquare, Building2, Newspaper } from "lucide-react";
import type { ContactChannelsContent, ContactChannelIcon } from "../../../lib/content-types";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const ICON_MAP: Record<ContactChannelIcon, typeof Phone | typeof Mail | typeof MessageSquare | typeof Newspaper | typeof Building2> = {
  phone: Phone,
  mail: Mail,
  message: MessageSquare,
  newspaper: Newspaper,
  building: Building2,
};

type ContactChannelsProps = {
  content: ContactChannelsContent;
};

export default function ContactChannels({ content }: ContactChannelsProps) {
  return (
    <section className="relative w-full py-8 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">{content.title}</h2>
          <p className="mt-2 text-sm text-white/70">{content.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.cards.map((card, i) => {
            const Icon = ICON_MAP[card.icon];
            return (
              <motion.a
                key={card.title + i}
                href={card.href}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -3 }}
                className="group rounded-2xl border border-white/10 bg-zinc-950/60 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                    <Icon className="h-5 w-5 text-white/80" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-white/90">{card.title}</h3>
                    <p className="text-sm text-white/60">{card.subtitle}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{card.description}</p>
                <div className="mt-3 text-sm text-white/80 underline-offset-2 group-hover:underline">
                  Acessar canal
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
