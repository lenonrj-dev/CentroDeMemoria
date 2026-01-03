import SessionLanding from "../../_components/SessionLanding";
import { getCity, getSection } from "../../cityData";
import {
  SectionTitle,
  Section,
  DocumentTimeline,
  DocumentCard,
  SearchBar,
  FilterSidebar,
  Pagination,
} from "../../_components/ui";
import { apiGet } from "@/lib/backend-client";
import type { DocumentContent } from "@/lib/backend-types";

const city = getCity("volta-redonda");
const section = city && getSection(city, "documentos");

export const metadata = {
  title: "Documentos | Acervo Volta Redonda",
  description: "Atas, ofícios e relatórios digitalizados do acervo de Volta Redonda.",
  keywords: [
    "Volta Redonda",
    "documentos",
    "atas",
    "ofícios",
    "relatórios",
    "acervo histórico",
    "centro de memória",
  ],
  alternates: { canonical: "/acervo/volta-redonda/documentos" },
  openGraph: {
    title: "Documentos | Acervo Volta Redonda",
    description: "Atas, ofícios e relatórios digitalizados do acervo de Volta Redonda.",
    url: "/acervo/volta-redonda/documentos",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentos | Acervo Volta Redonda",
    description: "Atas, ofícios e relatórios digitalizados do acervo de Volta Redonda.",
  },
};

function docDate(d: DocumentContent) {
  if (d.year && d.year > 0) return `${d.year}-01-01`;
  const best = d.publishedAt || d.createdAt || d.updatedAt;
  return best ? best.slice(0, 10) : "s/d";
}

export default async function Page() {
  if (!city || !section) return null;

  const timeline = [
    {
      year: "1950",
      title: "Ata de assembleia inaugural",
      description: "Registro das primeiras deliberações e pauta salarial.",
    },
    {
      year: "1961",
      title: "Ata de Assembleia – setembro",
      description: "Indicação de greve e eleição de comissão de base.",
    },
    {
      year: "1965",
      title: "Relatório de Gestão",
      description: "Síntese das ações, finanças e participação em conselhos.",
    },
    {
      year: "1972",
      title: "Ofício ao Ministério do Trabalho",
      description: "Pedido de mediação em dissídio e abertura de mesa tripartite.",
    },
  ];

  let loaded = false;
  let docs: Array<{
    title: string;
    summary: string;
    date: string;
    location: string;
    tags: string[];
    href?: string;
  }> = [];

  try {
    const res = await apiGet<DocumentContent[]>(
      `/api/documentos?tag=${encodeURIComponent(city.name)}&page=1&limit=60`
    );
    loaded = true;
    docs = res.data.map((d) => ({
      title: d.title,
      summary: d.description,
      date: docDate(d),
      location: d.collection || d.source || city.name,
      tags: d.tags ?? [],
      href: `/acervo/documentos/${d.slug}`,
    }));
  } catch {
    // ignore, fallback below
  }

  const fallbackDocs = section.items.map((it) => ({
    title: it.title,
    summary: it.summary,
    date: it.date,
    location: city.name,
    tags: ["Documento", city.name],
  }));

  const cards = docs.length ? docs : loaded ? [] : fallbackDocs;

  return (
    <SessionLanding
      city={city}
      section={section}
      breadcrumb={[
        { label: "Acervo", href: "/acervo" },
        { label: city.name, href: `/acervo/${city.slug}` },
        { label: "Documentos" },
      ]}
    >
      <Section className="pt-0">
        <SectionTitle
          eyebrow="Documentação histórica"
          title="Descrição, preservação e contexto"
          description="As séries documentais de Volta Redonda revelam o desenho institucional do sindicato, seus processos decisórios e as camadas do cotidiano de fábrica. Cada peça passa por higienização, descrição arquivística e atribuição de metadados controlados."
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-sm font-semibold text-white">Linha do tempo documental</p>
            <p className="text-sm text-white/70">
              Marco temporal de documentos-chave: assembleias, relatórios e ofícios que estruturam a atuação sindical.
            </p>
            <div className="mt-4">
              <DocumentTimeline items={timeline} />
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-sm font-semibold text-white">Pesquisa e filtros</p>
            <SearchBar placeholder="Buscar por título, data ou palavra-chave..." ariaLabel="Buscar documentos" />
            <FilterSidebar
              filters={{ label: "Categorias", options: ["Atas", "Relatórios", "Ofícios", "Dossiês", "Correspondência"] }}
              title="Categorias"
            />
            <FilterSidebar
              filters={{ label: "Décadas", options: ["1950s", "1960s", "1970s", "1980s"] }}
              title="Período"
            />
          </div>
        </div>
      </Section>

      <Section>
        <SectionTitle
          eyebrow="Pré-visualizações"
          title="Documentos em destaque"
          description="Itens publicados no acervo digitalizado. Clique para abrir a leitura."
        />
        {cards.length ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((doc) => (
                <DocumentCard key={`${doc.title}-${doc.date}`} {...doc} />
              ))}
            </div>
            <div className="mt-6">
              <Pagination />
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70">
            Nenhum documento publicado ainda para {city.name}.
          </div>
        )}
      </Section>
    </SessionLanding>
  );
}

