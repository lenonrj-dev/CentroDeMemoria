import SessionLanding from "../../_components/SessionLanding";
import { getCity, getSection } from "../../cityData";
import { Section, SectionTitle, DocumentCard, SearchBar, FilterSidebar, Pagination } from "../../_components/ui";
import { apiGet } from "@/lib/backend-client";
import type { JournalContent } from "@/lib/backend-types";

const city = getCity("barra-mansa");
const section = city && getSection(city, "jornais-de-epoca");

export const metadata = {
  title: "Jornais de época | Acervo Barra Mansa",
  description: "Recortes e edições históricas do acervo de Barra Mansa.",
  keywords: ["Barra Mansa", "jornais de época", "imprensa", "acervo histórico", "centro de memória"],
  alternates: { canonical: "/acervo/barra-mansa/jornais-de-epoca" },
  openGraph: {
    title: "Jornais de época | Acervo Barra Mansa",
    description: "Recortes e edições históricas do acervo de Barra Mansa.",
    url: "/acervo/barra-mansa/jornais-de-epoca",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jornais de época | Acervo Barra Mansa",
    description: "Recortes e edições históricas do acervo de Barra Mansa.",
  },
};

function journalDate(j: JournalContent) {
  const d = j.issueDate || j.publishedAt || j.createdAt || j.updatedAt;
  return d ? d.slice(0, 10) : "s/d";
}

export default async function Page() {
  if (!city || !section) return null;

  let loaded = false;
  let items: Array<{
    title: string;
    summary: string;
    date: string;
    location: string;
    tags: string[];
    href?: string;
  }> = [];

  try {
    const res = await apiGet<JournalContent[]>(
      `/api/jornais?tag=${encodeURIComponent(city.name)}&page=1&limit=60`
    );
    loaded = true;
    items = res.data.map((j) => ({
      title: j.title,
      summary: j.description,
      date: journalDate(j),
      location: j.city || city.name,
      tags: j.tags ?? [],
      href: `/jornais-de-epoca/${j.slug}`,
    }));
  } catch {
    // ignore, fallback below
  }

  const fallback = section.items.map((it) => ({
    title: it.title,
    summary: it.summary,
    date: it.date,
    location: city.name,
    tags: ["Jornal", city.name],
  }));

  const cards = items.length ? items : loaded ? [] : fallback;

  return (
    <SessionLanding
      city={city}
      section={section}
      breadcrumb={[
        { label: "Acervo", href: "/acervo" },
        { label: city.name, href: `/acervo/${city.slug}` },
        { label: "Jornais de época" },
      ]}
    >
      <Section className="pt-0">
        <SectionTitle
          eyebrow="Imprensa e circulação"
          title="Jornais e boletins"
          description="Capas, edições e recortes que ajudam a reconstruir contexto, narrativas e pautas do período."
        />
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-sm font-semibold text-white">Filtros</p>
            <FilterSidebar filters={{ label: "Tipos", options: ["Boletins", "Jornais", "Circulares"] }} title="Tipos" />
            <FilterSidebar
              filters={{ label: "Décadas", options: ["1930s", "1940s", "1950s", "1960s", "1970s", "1980s"] }}
              title="Período"
            />
          </div>
          <div className="space-y-4">
            <SearchBar placeholder="Buscar por título, tema ou palavra-chave..." ariaLabel="Buscar jornais" />
            <p className="text-sm text-white/70">
              Itens publicados aparecem automaticamente quando cadastrados e marcados com a tag {city.name}.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionTitle
          eyebrow="Edições"
          title="Jornais em destaque"
          description="Clique para abrir a visualização completa (páginas e/ou PDF)."
        />
        {cards.length ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((j) => (
                <DocumentCard key={`${j.title}-${j.date}`} {...j} />
              ))}
            </div>
            <div className="mt-6">
              <Pagination />
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70">
            Nenhum jornal publicado ainda para {city.name}.
          </div>
        )}
      </Section>
    </SessionLanding>
  );
}

