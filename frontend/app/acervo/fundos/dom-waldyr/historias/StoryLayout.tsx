import Link from "next/link";
import Image from "next/image";
import { Breadcrumb, ContentContainer, Section, SectionTitle } from "../../../_components/ui";

type Meta = {
  type: string;
  year: string;
  location: string;
};

type StoryLayoutProps = {
  title: string;
  subtitle: string;
  hero: string;
  meta: Meta;
  children: React.ReactNode;
  complements?: React.ReactNode;
};

export function StoryLayout({ title, subtitle, hero, meta, children, complements }: StoryLayoutProps) {
  return (
    <div className="bg-black text-white">
      <ContentContainer>
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Acervo", href: "/acervo" },
            { label: "Fundos", href: "/acervo#fundos" },
            { label: "Dom Waldyr", href: "/acervo/fundos/dom-waldyr" },
            { label: title },
          ]}
        />
      </ContentContainer>

      <Section className="bg-black pb-6 pt-2">
        <ContentContainer>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl">
            <div className="relative aspect-[16/6] w-full">
              <Image src={hero} alt={title} fill sizes="(min-width:1024px) 1200px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            </div>
            <div className="space-y-4 px-6 py-6 sm:px-8 sm:py-8">
              <p className="text-xs uppercase tracking-[0.22em] text-white/60">{meta.type}</p>
              <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
              <p className="text-base text-white/75 sm:text-lg">{subtitle}</p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/70">
                <span className="rounded-full border border-white/15 bg-black/40 px-2 py-1">Ano: {meta.year}</span>
                <span className="rounded-full border border-white/15 bg-black/40 px-2 py-1">Local: {meta.location}</span>
              </div>
              <Link
                href="/acervo/fundos/dom-waldyr"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
              >
                Voltar ao fundo Dom Waldyr
              </Link>
            </div>
          </div>
        </ContentContainer>
      </Section>

      <Section className="bg-black pt-0">
        <ContentContainer>
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <article className="space-y-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-6 shadow-lg sm:px-8 sm:py-8">
              {children}
            </article>
            <aside className="space-y-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-5 shadow-lg">
              <SectionTitle
                eyebrow="Consulta rápida"
                title="Metadados"
                description="Resumo para referenciação bibliográfica e arquivística."
              />
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <strong className="text-white/90">Tipo:</strong> {meta.type}
                </li>
                <li>
                  <strong className="text-white/90">Ano:</strong> {meta.year}
                </li>
                <li>
                  <strong className="text-white/90">Local:</strong> {meta.location}
                </li>
                <li>
                  <strong className="text-white/90">Acervo:</strong> Fundo Dom Waldyr
                </li>
              </ul>
              {complements && <div className="pt-2 space-y-3">{complements}</div>}
              <Link
                href="/acervo/documentos"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
              >
                Ir para documentos
              </Link>
            </aside>
          </div>
        </ContentContainer>
      </Section>
    </div>
  );
}
