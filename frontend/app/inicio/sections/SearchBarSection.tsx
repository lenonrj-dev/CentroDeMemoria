"use client";

import { useMemo, useState, type ElementType, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Facebook, Instagram, Youtube, Search, ChevronDown } from "lucide-react";
import { apiGet } from "../../../lib/backend-client";
import type {
  DocumentContent,
  JournalContent,
  PersonalArchiveRecord,
  PhotoArchiveContent,
  ReferenceContent,
  TestimonialContent,
} from "../../../lib/backend-types";

type SocialPlatform = "facebook" | "instagram" | "youtube";
export type SearchBarContent = {
  title: string;
  tagline: string;
  description?: string;
  placeholder: string;
  buttonLabel: string;
  categoryLabel: string;
  categories: { value: string; label: string }[];
  socials: { platform: SocialPlatform; href: string }[];
  logos?: { src: string; alt: string; className?: string }[];
};

type Props = {
  content: SearchBarContent;
};

export default function SearchBarSection({ content }: Props) {
  const router = useRouter();
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(content.categories[0]?.value || "all");
  const [loading, setLoading] = useState(false);

  const prefixHref = (href: string) => {
    if (!href.startsWith("/") || href.startsWith("//")) return href;
    const parts = href.split("/");
    const first = parts[1];
    if (["pt-BR", "pt-PT", "es", "en"].includes(first)) return href;
    return `/${locale}${href}`;
  };

  const listRoutes: Record<string, string> = {
    all: "/acervo",
    documentos: "/acervo/documentos",
    fotos: "/acervo/fotos",
    jornais: "/jornais-de-epoca",
    depoimentos: "/acervo/entrevistas",
    pessoas: "/acervo-pessoal",
    bibliografia: "/producao-bibliografica",
  };

  const goTo = (href: string) => {
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(prefixHref(href));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = query.trim();
    const params = new URLSearchParams();
    if (term) params.set("q", term);

    const base = listRoutes[category] || "/acervo";
    const fallbackUrl = params.toString() ? `${base}?${params.toString()}` : base;

    if (!term) {
      router.push(prefixHref(fallbackUrl));
      return;
    }

    const shouldSearch = (key: string) => category === "all" || category === key;

    setLoading(true);
    try {
      const [docsRes, fotosRes, jornaisRes, depoRes, refsRes, pessoasRes] = await Promise.all([
        shouldSearch("documentos")
          ? apiGet<DocumentContent[]>(`/api/documentos?page=1&limit=3&q=${encodeURIComponent(term)}`).catch(() => null)
          : Promise.resolve(null),
        shouldSearch("fotos")
          ? apiGet<PhotoArchiveContent[]>(`/api/acervo-fotografico?page=1&limit=3&q=${encodeURIComponent(term)}`).catch(
              () => null
            )
          : Promise.resolve(null),
        shouldSearch("jornais")
          ? apiGet<JournalContent[]>(`/api/jornais?page=1&limit=3&q=${encodeURIComponent(term)}`).catch(() => null)
          : Promise.resolve(null),
        shouldSearch("depoimentos")
          ? apiGet<TestimonialContent[]>(`/api/depoimentos?page=1&limit=3&q=${encodeURIComponent(term)}`).catch(() => null)
          : Promise.resolve(null),
        shouldSearch("bibliografia")
          ? apiGet<ReferenceContent[]>(`/api/referencias?page=1&limit=3&q=${encodeURIComponent(term)}`).catch(() => null)
          : Promise.resolve(null),
        shouldSearch("pessoas")
          ? apiGet<PersonalArchiveRecord[]>(`/api/acervos-pessoais?page=1&limit=3&q=${encodeURIComponent(term)}`).catch(
              () => null
            )
          : Promise.resolve(null),
      ]);

      const doc = docsRes?.data?.[0];
      if (doc) {
        const isCartaz = (doc.tags || []).includes("Cartazes");
        return goTo(`/acervo/${isCartaz ? "cartazes" : "documentos"}/${doc.slug}`);
      }

      const photo = fotosRes?.data?.[0];
      if (photo) return goTo(`/acervo/fotos/${photo.slug}`);

      const jornal = jornaisRes?.data?.[0];
      if (jornal) return goTo(`/jornais-de-epoca/${jornal.slug}`);

      const depo = depoRes?.data?.[0];
      if (depo) return goTo(`/acervo/entrevistas/${depo.slug}`);

      const ref = refsRes?.data?.[0];
      if (ref) {
        return goTo("/producao-bibliografica");
      }

      const pessoa = pessoasRes?.data?.[0];
      if (pessoa) return goTo(`/acervo-pessoal/${pessoa.slug}`);
    } finally {
      setLoading(false);
    }

    router.push(prefixHref(fallbackUrl));
  };

  const fadeUp = {
    hidden: { opacity: 0, y: reduce ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
  };

  const socials = useMemo(() => content.socials || [], [content.socials]);
  const categories = useMemo(() => content.categories || [], [content.categories]);
  const logos = useMemo(() => content.logos || [], [content.logos]);

  const socialIcons: Record<SocialPlatform, ElementType> = {
    facebook: Facebook,
    instagram: Instagram,
    youtube: Youtube,
  };

  return (
    // Sobrepõe levemente o rodapé do hero (FirstSection), ficando entre as seções
    <section
      aria-label="Busca do acervo"
      className="relative z-[5] -mt-16 mb-6 sm:-mt-24 sm:mb-10 lg:-mt-28"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={false}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, amount: 0.5 }}
          variants={reduce ? undefined : fadeUp}
          className="rounded-2xl border border-white/10 bg-black/75 p-5 shadow-2xl ring-1 ring-white/5 backdrop-saturate-150 sm:p-7"
        >
          {/* Logo + título */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2" aria-hidden>
              {(logos.length ? logos : [{ src: "/CUT.png", alt: "Logo CUT" }]).map((logo, idx) => (
                <div key={`${logo.src}-${idx}`} className="relative h-10 w-10 shrink-0 select-none">
                  <Image src={logo.src} alt={logo.alt} fill className={logo.className || "rounded"} />
                </div>
              ))}
            </div>
            <p className="text-center text-lg font-semibold text-white/90">{content.title}</p>
          </div>

          {/* Formulário de busca */}
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex w-full max-w-3xl items-center gap-3"
            role="search"
            aria-label="Pesquisar no acervo"
          >
            <label htmlFor="category" className="sr-only">
              {content.categoryLabel}
            </label>
            <div className="relative sm:min-w-[170px]">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-zinc-900/80 px-3 pr-9 text-sm text-white shadow-inner transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                aria-label="Filtrar por tipo de conteúdo"
              >
                {categories.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
            </div>

            <label htmlFor="query" className="sr-only">
              Termos de busca
            </label>
            <div className="flex min-w-0 flex-1 items-center overflow-hidden rounded-xl border border-white/10 bg-zinc-900/80 pl-3">
              <Search aria-hidden className="h-4 w-4 opacity-70" />
              <input
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={content.placeholder}
                className="h-11 w-full bg-transparent px-3 text-sm text-white placeholder-white/50 outline-none [&:-webkit-autofill]:shadow-[0_0_0_1000px_rgba(24,24,27,0.9)_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:caret-white"
                aria-label="Campo de pesquisa"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 cursor-pointer whitespace-nowrap rounded-xl border border-white/10 bg-white/10 px-4 text-sm font-semibold text-white shadow hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:opacity-90"
            >
              {loading ? "Buscando..." : content.buttonLabel}
            </button>
          </form>

          {/* Descrição + Quem somos + Redes */}
          <div className="mt-3 text-center">
            <p className="text-xs text-white/70">{content.tagline}</p>

            <div className="mt-3">
              <p className="text-[11px] font-semibold tracking-widest text-white/80">QUEM SOMOS</p>
              <div className="mt-2 flex items-center justify-center gap-4">
                {socials.map((social, idx) => {
                  const Icon = socialIcons[social.platform];
                  return (
                    <a
                      key={`${social.platform}-${idx}`}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.platform}
                      className="rounded-full p-2 text-white/80 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
