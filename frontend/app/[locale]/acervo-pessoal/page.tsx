import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { apiGet } from "@/lib/backend-client";
import type { PersonalArchiveRecord } from "@/lib/backend-types";
import { personalArchives } from "@/lib/personal-archives";

export const metadata: Metadata = {
  title: "Acervos pessoais - Banco de Memoria | Sintracon",
  description: "Conheca os acervos pessoais disponiveis e acesse documentos, fotos e registros historicos.",
  alternates: { canonical: "/acervo-pessoal" },
};

type PersonCard = {
  slug: string;
  name: string;
  summary: string;
  role?: string;
  portrait?: string;
  tags?: string[];
};

function toPersonCard(item: PersonalArchiveRecord): PersonCard {
  const hero = (item.content as any)?.hero || {};
  return {
    slug: item.slug,
    name: hero.name || item.title || item.slug,
    summary: hero.summary || item.description,
    role: hero.roles?.[0] || hero.label,
    portrait: hero.portrait || item.coverImageUrl,
    tags: item.tags || [],
  };
}

async function fetchPersonalArchives(): Promise<PersonCard[]> {
  try {
    const res = await apiGet<PersonalArchiveRecord[]>("/api/acervos-pessoais?page=1&limit=60");
    const items = (res.data || []).map(toPersonCard);
    if (items.length) return items;
  } catch {
    // fallback below
  }

  return personalArchives.map((person) => ({
    slug: person.slug,
    name: person.name,
    summary: person.summary,
    role: person.role || person.occupation,
    portrait: person.portrait,
    tags: person.tags || [],
  }));
}

export default async function Page() {
  const people = await fetchPersonalArchives();

  return (
    <section className="relative w-full py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-white/50">Acervo pessoal</p>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">Acervos pessoais</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
            Explore trajetorias individuais com documentos, imagens e registros do acervo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person) => (
            <Link
              key={person.slug}
              href={`/acervo-pessoal/${person.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 p-4 hover:border-white/30"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={person.portrait || "/hero.png"}
                  alt={`Retrato de ${person.name}`}
                  fill
                  sizes="(min-width:1024px) 33vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="pt-3">
                <h2 className="text-base font-semibold text-white">{person.name}</h2>
                {person.role && <p className="text-sm text-white/70">{person.role}</p>}
                <p className="mt-2 text-sm text-white/70 line-clamp-3">{person.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/70">
                  {(person.tags || []).slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
