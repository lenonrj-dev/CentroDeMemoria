"use client";

import { useMemo, useRef, useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Users, Search, Filter, Calendar, GraduationCap, ShieldCheck, Cpu, Database,
  Workflow, Accessibility, MessageSquare, Globe, Github, Linkedin, Mail,
  ChevronLeft, ChevronRight, ChevronDown, LayoutGrid, List, ArrowRight,
  ClipboardList, ScanSearch, ImageDown, FileCog, CheckCircle2, Sparkles
} from "lucide-react";
import type { TeamContent, TeamMember, TeamAdvisor, TeamFaqItem } from "../../lib/content-types";

/* --------- animações --------- */
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.28 } } };
const stagger = { show: { transition: { staggerChildren: 0.06 } } };

/* --------- helpers --------- */
function classNames(...xs) { return xs.filter(Boolean).join(" "); }

type Member = TeamMember;
type GroupMap = Record<string, Member[]>;

type TeamLandingProps = {
  content: TeamContent;
};

const STAT_ICON_MAP = {
  GraduationCap,
  ShieldCheck,
  Cpu,
  Database,
  Accessibility,
  MessageSquare,
} as const;

const PROCESS_ICON_MAP = {
  ClipboardList,
  ScanSearch,
  ImageDown,
  Database,
  FileCog,
  CheckCircle2,
} as const;

/* ========= subcomponents ========= */
const ProfileCard = memo(function ProfileCard({ m }: { m: Member }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -3 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={m.avatar || "/hero.png"}
          alt={`Foto de ${m.name}`}
          fill
          sizes="(min-width:1024px) 25vw,(min-width:640px) 50vw,100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      </div>
      <div className="p-4 pb-16">
        <div className="mb-1 text-[11px] text-white/60">{m.area}</div>
        <h3 className="text-base font-semibold text-white/90">{m.name}</h3>
        <p className="text-sm text-white/70">{m.role}</p>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/70">{m.bio}</p>
      </div>
      {/* ações */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        {m.links?.github && (
          <a href={m.links.github} target="_blank" rel="noopener noreferrer"
             className="rounded-lg border border-white/10 bg-white/10 p-2 text-white hover:bg-white/15" aria-label="GitHub">
            <Github className="h-4 w-4" />
          </a>
        )}
        {m.links?.linkedin && (
          <a href={m.links.linkedin} target="_blank" rel="noopener noreferrer"
             className="rounded-lg border border-white/10 bg-white/10 p-2 text-white hover:bg-white/15" aria-label="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </a>
        )}
        {m.links?.email && (
          <a href={m.links.email}
             className="rounded-lg border border-white/10 bg-white/10 p-2 text-white hover:bg-white/15" aria-label="E-mail">
            <Mail className="h-4 w-4" />
          </a>
        )}
      </div>
    </motion.article>
  );
});

const ProfileRow = memo(function ProfileRow({ m }: { m: Member }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.22 }}
      className="grid grid-cols-[88px,1fr,auto] items-start gap-3 rounded-2xl border border-white/10 bg-zinc-950/60 p-3 sm:gap-4 sm:p-4"
    >
      <div className="relative h-[66px] w-[88px] overflow-hidden rounded-lg">
        <Image src={m.avatar || "/hero.png"} alt={m.name} fill className="object-cover" sizes="88px" />
      </div>
      <div className="min-w-0">
        <div className="mb-1 text-[11px] text-white/60">{m.area}</div>
        <h3 className="text-base font-semibold text-white/90">{m.name}</h3>
        <p className="text-sm text-white/70">{m.role}</p>
        <p className="mt-1 line-clamp-2 text-sm text-white/70">{m.bio}</p>
      </div>
      <div className="flex gap-2">
        {m.links?.github && (
          <a href={m.links.github} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/10 bg-white/10 p-2 text-white hover:bg-white/15">
            <Github className="h-4 w-4" />
          </a>
        )}
        {m.links?.linkedin && (
          <a href={m.links.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/10 bg-white/10 p-2 text-white hover:bg-white/15">
            <Linkedin className="h-4 w-4" />
          </a>
        )}
        {m.links?.email && (
          <a href={m.links.email} className="rounded-lg border border-white/10 bg-white/10 p-2 text-white hover:bg-white/15">
            <Mail className="h-4 w-4" />
          </a>
        )}
      </div>
    </motion.article>
  );
});

/* ========= carrossel consultivo (sem scrollbar visível) ========= */
function AdvisorsCarousel({ advisors }: { advisors: TeamAdvisor[] }) {
  const CARD_W = 280, GAP = 16;
  const [idx, setIdx] = useState(0);
  const [perView, setPerView] = useState(1);
  const ref = useRef<HTMLDivElement | null>(null);

  const recalc = () => {
    const w = ref.current?.clientWidth || CARD_W;
    const pv = Math.max(1, Math.floor((w + GAP) / (CARD_W + GAP)));
    setPerView(pv);
    setIdx((i) => Math.max(0, Math.min(i, Math.max(0, advisors.length - pv))));
  };
  useEffect(() => {
    recalc();
    const onR = () => recalc();
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, [advisors.length]);

  const maxIndex = Math.max(0, advisors.length - perView);
  const offset = idx * (CARD_W + GAP);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black to-transparent" />
      <div className="absolute -left-2 top-1/2 z-10 -translate-y-1/2">
        <button onClick={() => setIdx((i) => Math.max(0, i - 1))}
                className="rounded-xl border border-white/20 bg-black/70 p-2 text-white hover:bg-black/90" aria-label="Anterior">
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="absolute -right-2 top-1/2 z-10 -translate-y-1/2">
        <button onClick={() => setIdx((i) => Math.min(maxIndex, i + 1))}
                className="rounded-xl border border-white/20 bg-black/70 p-2 text-white hover:bg-black/90" aria-label="Próximo">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div ref={ref} className="overflow-hidden">
        <div
          style={{
            display: "flex",
            gap: `${GAP}px`,
            transform: `translateX(-${offset}px)`,
            transition: "transform 420ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {advisors.map((a) => (
            <article key={a.name} className="w-[280px] shrink-0 rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10">
                  <Image src={a.avatar || "/hero.png"} alt={a.name} fill className="object-cover" sizes="48px" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{a.name}</div>
                  <div className="text-xs text-white/70">{a.title}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ========= organograma colapsável por área ========= */
function OrgAccordion({ groups }: { groups: GroupMap }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(["Coordena??o", "Desenvolvimento"]));
  const toggle = (k) => setOpen((s) => {
    const n = new Set(s);
    n.has(k) ? n.delete(k) : n.add(k);
    return n;
  });

  return (
    <div className="space-y-2">
      {Object.entries(groups).map(([area, items]) => (
        <div key={area} className="rounded-2xl border border-white/10 bg-zinc-950/60">
          <button
            onClick={() => toggle(area)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white/70" />
              <span className="font-medium text-white">{area}</span>
            </span>
            <span className="text-xs text-white/60">{items.length} pessoa(s)</span>
          </button>
          <AnimatePresence initial={false}>
            {open.has(area) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="px-4 pb-3"
              >
                <ul className="list-inside list-disc text-sm text-white/70">
                  {items.map((m) => (
                    <li key={m.id}>
                      <span className="font-medium text-white/85">{m.name}</span> — {m.role}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ========= componente principal ========= */
export default function TeamLanding({ content }: TeamLandingProps) {
  const { hero, stats, searchPlaceholder, filters, members, advisors, process, faq, cta } = content;
  const [q, setQ] = useState("");
  const [area, setArea] = useState(filters[0] ?? "Todos");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [limit, setLimit] = useState(9);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return members.filter((member) => {
      const matchesArea = area === "Todos" || member.area === area;
      const matchesTerm =
        term === "" ||
        `${member.name} ${member.role} ${member.area} ${member.bio}`.toLowerCase().includes(term);
      return matchesArea && matchesTerm;
    });
  }, [members, q, area]);

  const shown = filtered.slice(0, limit);
  const hasMore = filtered.length > shown.length;

  const groups = useMemo(() => {
    return members.reduce((acc, member) => {
      acc[member.area] = acc[member.area] || [];
      acc[member.area].push(member);
      return acc;
    }, {} as GroupMap);
  }, [members]);

  return (
    <section className="relative w-full py-14 sm:py-20 lg:py-24">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
            <Users className="h-4 w-4" />
            {hero.eyebrow}
          </div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            {hero.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            {hero.description}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat) => (
              <Stat key={stat.label} iconName={stat.icon} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
              <Search className="h-4 w-4 text-white/60" />
              <input
                placeholder={searchPlaceholder}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-white/60" />
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                {filters.map((filter) => (
                  <option key={filter}>{filter}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="inline-flex overflow-hidden rounded-lg border border-white/10">
              <button
                onClick={() => setView("grid")}
                aria-label="Visualizar em grade"
                className={classNames("px-2.5 py-2", view === "grid" ? "bg-white/15 text-white" : "bg-white/5 text-white/70 hover:bg-white/10")}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="Visualizar em lista"
                className={classNames("px-2.5 py-2", view === "list" ? "bg-white/15 text-white" : "bg-white/5 text-white/70 hover:bg-white/10")}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className={view === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map((member) =>
              view === "grid" ? <ProfileCard key={member.id} m={member} /> : <ProfileRow key={member.id} m={member} />
            )}
          </AnimatePresence>
        </motion.div>

        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setLimit((n) => n + 9)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
            >
              Carregar mais <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-12">
          <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
            <GraduationCap className="h-4 w-4" />
            Conselho consultivo & consultores
          </div>
          <AdvisorsCarousel advisors={advisors} />
        </div>

        <div className="mt-12">
          <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
            <Workflow className="h-4 w-4" />
            Organograma
          </div>
          <OrgAccordion groups={groups} />
        </div>

        <div className="mt-12">
          <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
            <ClipboardList className="h-4 w-4" />
            Processo de trabalho
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {process.map((step) => {
              const StepIcon = PROCESS_ICON_MAP[step.icon as keyof typeof PROCESS_ICON_MAP] ?? ClipboardList;
              return (
                <article key={step.title} className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                  <div className="inline-flex items-center gap-2 text-white/80">
                    <StepIcon className="h-5 w-5" />
                    <span className="font-medium">{step.title}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
            <QuestionDot />
            Perguntas frequentes
          </div>
          <div className="space-y-2">
            {faq.map((item) => (
              <FaqRow key={item.q} {...item} />
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-white/80">
                <Globe className="h-5 w-5" />
                <h3 className="text-lg font-semibold text-white">{cta.title}</h3>
              </div>
              <p className="mt-1 text-sm text-white/70">{cta.description}</p>
            </div>
            <Link
              href={cta.actionHref}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
            >
              {cta.actionLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

type StatProps = { iconName: string; label: string; value: string | number };
function Stat({ iconName, label, value }: StatProps) {
  const Icon = STAT_ICON_MAP[iconName] ?? ShieldCheck;
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-3">
      <div className="inline-flex items-center gap-2 text-white/80">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-1 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function QuestionDot() {
  return (
    <div className="relative h-4 w-4">
      <div className="absolute inset-0 rounded-full border border-white/30" />
      <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
    </div>
  );
}

function FaqRow({ q, a }: TeamFaqItem) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60">
      <button
        onClick={() => setOpen((opened) => !opened)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-medium text-white/90">{q}</span>
        <ChevronDown className={classNames("h-5 w-5 text-white/70 transition", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="px-4 pb-3 text-sm text-white/70"
          >
            {a}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
