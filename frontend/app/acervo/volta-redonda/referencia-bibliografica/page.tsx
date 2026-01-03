import SessionLanding from "../../_components/SessionLanding";
import { getCity, getSection } from "../../cityData";
import {
  Section,
  SectionTitle,
  ReferenciaCard,
  FilterSidebar,
  SearchBar,
  Pagination,
} from "../../_components/ui";
import { apiGet } from "@/lib/backend-client";
import type { ReferenceContent } from "@/lib/backend-types";

const city = getCity("volta-redonda");
const section = city && getSection(city, "referencia-bibliografica");

export const metadata = {
  title: "Referência Bibliográfica | Acervo Volta Redonda",
  description: "Livros, artigos e clippings sobre o acervo de Volta Redonda.",
  keywords: ["Volta Redonda", "referência bibliográfica", "livros", "artigos", "teses", "centro de memória"],
  alternates: { canonical: "/acervo/volta-redonda/referencia-bibliografica" },
  openGraph: {
    title: "Referência Bibliográfica | Acervo Volta Redonda",
    description: "Livros, artigos e clippings sobre o acervo de Volta Redonda.",
    url: "/acervo/volta-redonda/referencia-bibliografica",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Referência Bibliográfica | Acervo Volta Redonda",
    description: "Livros, artigos e clippings sobre o acervo de Volta Redonda.",
  },
};

function typeFromTags(tags: string[]): "Livro" | "Artigo" | "Tese" {
  const t = (tags || []).map((x) => x.toLowerCase());
  if (t.some((x) => x.includes("tese") || x.includes("disserta"))) return "Tese";
  if (t.some((x) => x.includes("artigo") || x.includes("revista"))) return "Artigo";
  return "Livro";
}

export default async function Page() {
  if (!city || !section) return null;

  let loaded = false;
  let refs: Array<{
    title: string;
    authors: string;
    year: string;
    type: "Livro" | "Artigo" | "Tese";
    source: string;
    citation: string;
  }> = [];

  try {
    const res = await apiGet<ReferenceContent[]>(
      `/api/referencias?tag=${encodeURIComponent(city.name)}&page=1&limit=60`
    );
    loaded = true;
    refs = res.data.map((r) => ({
      title: r.title,
      authors: (r.authors || []).join("; ") || "—",
      year: String(r.year || ""),
      type: typeFromTags(r.tags ?? []),
      source: r.publisher || r.externalUrl || "—",
      citation: r.citation,
    }));
  } catch {
    // ignore, fallback below
  }

  const fallback = [
    {
      title: "Memória operária no Vale do Paraíba",
      authors: "Equipe de Pesquisa do Centro de Memória",
      year: "1984",
      type: "Livro" as const,
      source: "Editora do Sindicato",
      citation: "EQUIPE CM. Memória operária no Vale do Paraíba. Editora do Sindicato, 1984.",
    },
    {
      title: "Greves e urbanização em Volta Redonda",
      authors: "J. Silva; M. Pereira",
      year: "1979",
      type: "Artigo" as const,
      source: "Revista Estudos do Trabalho",
      citation: "SILVA, J.; PEREIRA, M. Greves e urbanização em Volta Redonda. Estudos do Trabalho, 1979.",
    },
    {
      title: "História oral e cidadania",
      authors: "C. Rocha",
      year: "1988",
      type: "Tese" as const,
      source: "Universidade Federal do RJ",
      citation: "ROCHA, C. História oral e cidadania. Tese (Doutorado), UFRJ, 1988.",
    },
  ];

  const cards = refs.length ? refs : loaded ? [] : fallback;

  return (
    <SessionLanding
      city={city}
      section={section}
      breadcrumb={[
        { label: "Acervo", href: "/acervo" },
        { label: city.name, href: `/acervo/${city.slug}` },
        { label: "Referência Bibliográfica" },
      ]}
    >
      <Section className="pt-0">
        <SectionTitle
          eyebrow="Referências e citações"
          title="O que é, para que serve, como consultar"
          description="Referências bibliográficas asseguram rastreabilidade e rigor na pesquisa. Cada entrada traz autoria, ano e citação pronta para facilitar estudos."
        />
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <FilterSidebar filters={{ label: "Tipos", options: ["Livros", "Artigos", "Teses"] }} title="Classificação" />
          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-sm font-semibold text-white">Consulta rápida</p>
            <SearchBar placeholder="Buscar por título, autor ou palavra-chave..." ariaLabel="Buscar referências" />
            <p className="text-sm text-white/70">
              Itens publicados aparecem automaticamente quando cadastrados e marcados com a tag {city.name}.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionTitle
          eyebrow="Bibliografia selecionada"
          title="Referências"
          description="Copie a citação pronta e acesse anexos/links quando houver."
        />
        {cards.length ? (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {cards.map((ref) => (
                <ReferenciaCard key={ref.title} {...ref} />
              ))}
            </div>
            <div className="mt-6">
              <Pagination />
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70">
            Nenhuma referência publicada ainda para {city.name}.
          </div>
        )}
      </Section>
    </SessionLanding>
  );
}

