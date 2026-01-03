// Página de Diretoria (versão com locale) – conteúdo completo
import Image from "next/image";
import type { Metadata } from "next";
import type { BoardLevel } from "@/lib/content-types";
import { getSiteContent } from "@/lib/get-site-content";

export const metadata: Metadata = {
  title: "Diretoria — Banco de Memória | Sintracon",
  description:
    "Estrutura diretiva apresentada em formato de pirâmide: Presidência, Vice/Secretaria, Diretoria Executiva e Conselho.",
  alternates: { canonical: "/diretoria" },
};

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-8 sm:mb-10">
      {subtitle && (
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/60">
          {subtitle}
        </p>
      )}
      <h1 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
        {title}
      </h1>
    </header>
  );
}

function PersonNode({ name, role, photo }: { name: string; role: string; photo: string }) {
  return (
    <div
      className="group relative flex w-full min-w-[200px] max-w-[260px] flex-col items-center rounded-2xl border border-white/10 bg-zinc-950/60 p-4 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]"
      role="listitem"
    >
      <span
        className="absolute -top-6 left-1/2 hidden h-6 w-px -translate-x-1/2 bg-white/12 md:block"
        aria-hidden
      />

      <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full ring-2 ring-white/10">
        <Image src={photo} alt={name} fill sizes="96px" className="object-cover" />
      </div>
      <div className="px-1">
        <div className="text-base font-semibold text-white">{name}</div>
        <div className="mt-0.5 text-xs text-white/70">{role}</div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20"
        style={{ background: "radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.12),transparent)" }}
      />
    </div>
  );
}

function Tier({ level }: { level: BoardLevel }) {
  const col = level.columns ?? Math.min(4, Math.max(1, level.members.length));
  return (
    <section className="relative mx-auto w-full max-w-6xl py-4">
      <div
        className="pointer-events-none absolute left-1/2 top-0 hidden h-px w-[72%] -translate-x-1/2 bg-white/10 md:block"
        aria-hidden
      />

      {level.label && (
        <div className="mb-2 text-center">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.20em] text-white/60">
            {level.label}
          </h2>
          {level.description && <p className="text-xs text-white/50">{level.description}</p>}
        </div>
      )}

      <ul
        role="list"
        className="mx-auto grid max-w-6xl place-items-center gap-3 sm:gap-4"
        style={{ gridTemplateColumns: `repeat(${col}, minmax(0, 1fr))` }}
      >
        {level.members.map((m, i) => (
          <li key={i} className="flex w-full justify-center">
            <PersonNode {...m} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function Page() {
  const { board } = await getSiteContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sintracon — Diretoria",
    department: board.levels.map((level) => ({
      "@type": "Organization",
      name: level.label,
      member: level.members.map((member) => ({ "@type": "Person", name: member.name, jobTitle: member.role })),
    })),
  };

  return (
    <main id="main" className="relative w-full py-10 sm:py-12 lg:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={board.title} subtitle={board.subtitle} />
        <p className="mb-6 max-w-3xl text-sm text-white/70">{board.introduction}</p>

        <div className="relative">
          <div
            className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-0 rounded-3xl border border-white/5 bg-black/30"
            style={{
              backgroundImage:
                "linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)",
              backgroundSize: "28px 28px,28px 28px",
              maskImage: "radial-gradient(120%_80%_at_50%_0%,black,transparent)",
            }}
            aria-hidden
          />

          {board.levels.map((level) => (
            <Tier key={level.key} level={level} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-white/50">{board.footerNote}</p>
      </div>
    </main>
  );
}
