import SessionLanding from "../../_components/SessionLanding";
import { getCity, getSection } from "../../cityData";
import {
  Section,
  SectionTitle,
  DepoimentoCard,
  FilterSidebar,
  SearchBar,
  Pagination,
} from "../../_components/ui";
import { apiGet } from "@/lib/backend-client";
import type { TestimonialContent } from "@/lib/backend-types";
import { youtubeThumbUrl } from "@/lib/youtube";

const city = getCity("barra-mansa");
const section = city && getSection(city, "depoimentos");

export const metadata = {
  title: "Depoimentos | Acervo Barra Mansa",
  description: "História oral e relatos de trabalhadores de Barra Mansa.",
  keywords: ["Barra Mansa", "depoimentos", "história oral", "memória social", "centro de memória"],
  alternates: { canonical: "/acervo/barra-mansa/depoimentos" },
  openGraph: {
    title: "Depoimentos | Acervo Barra Mansa",
    description: "História oral e relatos de trabalhadores de Barra Mansa.",
    url: "/acervo/barra-mansa/depoimentos",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Depoimentos | Acervo Barra Mansa",
    description: "História oral e relatos de trabalhadores de Barra Mansa.",
  },
};

function isoDate(value?: string | null) {
  return typeof value === "string" && value.length >= 10 ? value.slice(0, 10) : "";
}

function excerptOf(text: string) {
  const t = (text || "").trim();
  if (!t) return "";
  return t.length > 220 ? `${t.slice(0, 217)}…` : t;
}

function themeOf(tags: string[], cityName: string) {
  const clean = (tags || []).filter(Boolean);
  const found = clean.find((t) => t !== cityName);
  return found || clean[0] || "Memória sindical";
}

export default async function Page() {
  if (!city || !section) return null;

  let loaded = false;
  let depoimentos: Array<{
    author: string;
    role: string;
    excerpt: string;
    date: string;
    theme: string;
    avatar: string;
    href?: string;
    mediaType?: "youtube" | "image" | "text";
    youtubeId?: string;
    imageUrl?: string;
  }> = [];

  try {
    const res = await apiGet<TestimonialContent[]>(
      `/api/depoimentos?tag=${encodeURIComponent(city.name)}&page=1&limit=60`
    );
    loaded = true;
    depoimentos = res.data.map((t) => {
      const imageUrl = t.imageUrl || t.coverImageUrl || "";
      const mediaType = t.mediaType || (t.youtubeId ? "youtube" : imageUrl ? "image" : "text");
      const avatar = imageUrl || (t.youtubeId ? youtubeThumbUrl(t.youtubeId) : "/hero.png");
      return {
        author: t.authorName || t.title,
        role: t.authorRole || t.location || "Depoimento",
        excerpt: excerptOf(t.testimonialText || t.description),
        date:
          isoDate(t.date) ||
          isoDate(t.publishedAt) ||
          isoDate(t.createdAt) ||
          isoDate(t.updatedAt) ||
          "",
        theme: themeOf(t.tags ?? [], city.name),
        avatar,
        href: `/acervo/entrevistas/${t.slug}`,
        mediaType,
        youtubeId: t.youtubeId,
        imageUrl: imageUrl || undefined,
      };
    });
  } catch {
    // ignore, fallback below
  }

  const fallback = section.items.map((it) => ({
    author: it.title,
    role: "História oral",
    excerpt: it.summary,
    date: it.date,
    theme: "Memória sindical",
    avatar: "/hero.png",
    mediaType: "image",
    imageUrl: "/hero.png",
  }));

  const cards = depoimentos.length ? depoimentos : loaded ? [] : fallback;

  return (
    <SessionLanding
      city={city}
      section={section}
      breadcrumb={[
        { label: "Acervo", href: "/acervo" },
        { label: city.name, href: `/acervo/${city.slug}` },
        { label: "Depoimentos" },
      ]}
    >
      <Section className="pt-0">
        <SectionTitle
          eyebrow="História oral"
          title="Metodologia e memória social"
          description="Os relatos de Barra Mansa documentam a tessitura social dos bairros, as assembleias em espaços comunitários e as redes de apoio que sustentaram o movimento. Cada depoimento recebe ficha técnica, contexto e encaminhamento ético."
        />
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-sm font-semibold text-white">Filtros temáticos</p>
            <FilterSidebar
              filters={{ label: "Temas", options: ["Indústria", "Urbanização", "Movimentos sociais", "Cultura", "Educação"] }}
              title="Temas"
            />
            <FilterSidebar
              filters={{ label: "Décadas", options: ["1930s", "1940s", "1950s", "1960s", "1970s"] }}
              title="Períodos"
            />
          </div>
          <div className="space-y-4">
            <SearchBar placeholder="Buscar por pessoa, tema ou palavra-chave..." ariaLabel="Buscar depoimentos" />
            <p className="text-sm text-white/70">
              Itens publicados destacam a dimensão humana, os desafios urbanos e a formação de redes solidárias no território.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionTitle
          eyebrow="Relatos"
          title="Depoimentos em destaque"
          description="Clique para acessar o depoimento completo (texto e anexos, quando houver)."
        />
        {cards.length ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((d) => (
                <DepoimentoCard key={`${d.author}-${d.date}`} {...d} />
              ))}
            </div>
            <div className="mt-6">
              <Pagination />
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70">
            Nenhum depoimento publicado ainda para {city.name}.
          </div>
        )}
      </Section>
    </SessionLanding>
  );
}
