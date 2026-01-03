"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Users, Mail, Linkedin, ArrowRight } from "lucide-react";

export type TeamContent = {
  eyebrow: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
  people: {
    name: string;
    role: string;
    bio: string;
    photo: string;
    tags: string[];
    href: string;
    email: string;
    linkedin: string;
  }[];
  ui?: {
    photoAltTemplate?: string;
    viewProfileLabel?: string;
    emailLabel?: string;
    linkedinLabel?: string;
  };
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
const stagger = { show: { transition: { staggerChildren: 0.06 } } };

type Props = { content: TeamContent };

export default function FifthSection({ content }: Props) {
  const ui = content.ui ?? {};
  const formatWithName = (template: string, name: string) =>
    template.includes("{name}") ? template.replace("{name}", name) : `${template} ${name}`;
  const photoAltTemplate = ui.photoAltTemplate ?? "Foto de {name}";
  const viewProfileLabel = ui.viewProfileLabel ?? "Ver perfil";
  const emailLabel = ui.emailLabel ?? "Enviar e-mail para {name}";
  const linkedinLabel = ui.linkedinLabel ?? "LinkedIn de {name}";
  const profileAriaTemplate = `${viewProfileLabel} de {name}`;

  return (
    <section className="relative w-full py-14 sm:py-20 lg:py-24">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
              <Users className="h-4 w-4" />
              {content.eyebrow}
            </div>
            <h3 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
              {content.title}
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              {content.description}
            </p>
          </div>

          <Link
            href={content.cta.href}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            {content.cta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grade de pessoas */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {content.people.map((p, i) => (
            <motion.article
              key={`${p.name}-${i}`}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 p-4"
            >
              {/* Foto */}
              <div className="relative overflow-hidden rounded-xl">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={p.photo}
                    alt={formatWithName(photoAltTemplate, p.name)}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(min-width:1024px) 25vw,(min-width:640px) 50vw,100vw"
                    priority={false}
                  />
                </div>
              </div>

              {/* Conteúdo */}
              <div className="pt-3">
                <h4 className="text-base font-semibold text-white/90">{p.name}</h4>
                <p className="mt-0.5 text-sm text-white/70">{p.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{p.bio}</p>

                {/* Tags de especialidade */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ações */}
              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={p.href}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  aria-label={formatWithName(profileAriaTemplate, p.name)}
                >
                  {viewProfileLabel} <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="ml-auto flex items-center gap-2">
                  <a
                    href={p.email}
                    aria-label={formatWithName(emailLabel, p.name)}
                    className="inline-flex rounded-lg border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                  <a
                    href={p.linkedin}
                    aria-label={formatWithName(linkedinLabel, p.name)}
                    className="inline-flex rounded-lg border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
