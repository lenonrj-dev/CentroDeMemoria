"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Calendar, Tag } from "lucide-react";
import { apiGet } from "../../../lib/backend-client";
import type { PhotoArchiveContent } from "../../../lib/backend-types";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

type PhotoCardItem = {
  slug: string;
  title: string;
  year: number;
  location: string;
  tags: string[];
  src: string;
};

const FALLBACK_PHOTOS: PhotoCardItem[] = [
  {
    slug: "siderurgica-1950-equipe",
    title: "Funcionários da siderúrgica",
    year: 1950,
    location: "Volta Redonda – RJ",
    tags: ["Fábrica", "Retrato de grupo", "Década de 1950"],
    src: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
  },
];

function yearFromIso(value?: string | null) {
  const y = Number((value || "").slice(0, 4));
  return Number.isFinite(y) && y > 0 ? y : 0;
}

export default function PhotosGalleryClient() {
  const [remote, setRemote] = useState<PhotoCardItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [decade, setDecade] = useState("Todas");
  const [picked, setPicked] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiGet<PhotoArchiveContent[]>("/api/acervo-fotografico?page=1&limit=200");
        const items = res.data.map((a) => {
          const first = a.photos?.[0];
          const year =
            yearFromIso(first?.date) || yearFromIso(a.publishedAt) || yearFromIso(a.createdAt) || yearFromIso(a.updatedAt) || 0;
          return {
            slug: a.slug,
            title: a.title,
            year,
            location: a.collection || first?.location || "Acervo",
            tags: a.tags ?? [],
            src: a.coverImageUrl,
          } satisfies PhotoCardItem;
        });
        if (!cancelled) setRemote(items);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Falha ao carregar");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const photos = remote?.length ? remote : FALLBACK_PHOTOS;

  const decades = useMemo(() => {
    const ds = new Set<string>();
    photos.forEach((p) => {
      if (p.year) ds.add(String(Math.floor(p.year / 10) * 10));
    });
    return ["Todas", ...Array.from(ds).sort((a, b) => Number(a) - Number(b))];
  }, [photos]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return photos.filter((p) => {
      const matchesDecade = decade === "Todas" || (!!p.year && p.year >= Number(decade) && p.year < Number(decade) + 10);
      const matchesTags = picked.length ? picked.every((t) => p.tags.includes(t)) : true;
      const hay = (p.title + " " + p.location + " " + p.tags.join(" ")).toLowerCase();
      const matchesTerm = term ? hay.includes(term) : true;
      return matchesDecade && matchesTags && matchesTerm;
    });
  }, [q, decade, picked, photos]);

  const allTags = useMemo<string[]>(() => {
    const set = new Set<string>();
    photos.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [photos]);

  const toggleTag = (tag: string) =>
    setPicked((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));

  return (
    <section className="relative w-full py-10 sm:py-14 lg:py-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">Acervo fotográfico</h1>
          <p className="mt-2 text-sm text-white/70">
            Navegue por álbuns e séries fotográficas. Clique em um cartão para abrir a leitura.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
            <div className="md:col-span-6">
              <label htmlFor="photo-q" className="sr-only">
                Buscar fotos
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                <Search className="h-4 w-4 text-white/60" />
                <input
                  id="photo-q"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar por título, local ou tag…"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-white/60" />
                <select
                  value={decade}
                  onChange={(e) => setDecade(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  {decades.map((d) => (
                    <option key={d} value={d}>
                      {d === "Todas" ? "Todas" : `${d}s`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-white/60" />
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 6).map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      aria-pressed={picked.includes(t)}
                      className={
                        "rounded-lg border px-2.5 py-1.5 text-xs transition " +
                        (picked.includes(t)
                          ? "border-white/20 bg-white/15 text-white"
                          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10")
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.22 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={p.src}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    priority={false}
                  />
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="line-clamp-1 text-base font-semibold text-white">{p.title}</h3>
                  <p className="mt-1 text-sm text-white/80">
                    {p.location}
                    {p.year ? ` – ${p.year}` : ""}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-white/70">
                    {p.tags.slice(0, 3).map((t) => (
                      <span key={t} className="rounded border border-white/10 bg-white/5 px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/acervo/fotos/${p.slug}`}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    Abrir
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/60">
              Nenhum resultado. Ajuste a busca, década ou tags.
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

