import SessionLanding from "../../_components/SessionLanding";
import { getCity, getSection } from "../../cityData";
import { Section, SectionTitle, FilterSidebar, SearchBar, Pagination } from "../../_components/ui";
import Image from "next/image";
import Link from "next/link";
import { apiGet } from "@/lib/backend-client";
import type { PhotoArchiveContent } from "@/lib/backend-types";

const city = getCity("barra-mansa");
const section = city && getSection(city, "acervo-fotografico");

export const metadata = {
  title: "Acervo Fotográfico | Acervo Barra Mansa",
  description: "Álbuns e séries do acervo fotográfico de Barra Mansa.",
  keywords: [
    "Barra Mansa",
    "acervo fotográfico",
    "fotografia histórica",
    "mobilização",
    "cotidiano",
    "centro de memória",
  ],
  alternates: { canonical: "/acervo/barra-mansa/acervo-fotografico" },
  openGraph: {
    title: "Acervo Fotográfico | Acervo Barra Mansa",
    description: "Álbuns e séries do acervo fotográfico de Barra Mansa.",
    url: "/acervo/barra-mansa/acervo-fotografico",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acervo Fotográfico | Acervo Barra Mansa",
    description: "Álbuns e séries do acervo fotográfico de Barra Mansa.",
  },
};

export default async function Page() {
  if (!city || !section) return null;

  let loaded = false;
  let albums: PhotoArchiveContent[] = [];

  try {
    const res = await apiGet<PhotoArchiveContent[]>(
      `/api/acervo-fotografico?tag=${encodeURIComponent(city.name)}&page=1&limit=60`
    );
    loaded = true;
    albums = res.data;
  } catch {
    // ignore, fallback below
  }

  return (
    <SessionLanding
      city={city}
      section={section}
      breadcrumb={[
        { label: "Acervo", href: "/acervo" },
        { label: city.name, href: `/acervo/${city.slug}` },
        { label: "Acervo Fotográfico" },
      ]}
    >
      <Section className="pt-0">
        <SectionTitle
          eyebrow="Fotografia histórica"
          title="Visualização e contexto"
          description="Álbuns e séries que registram bairros, assembleias e cultura local. Metadados disponíveis para estudo e reprodução autorizada."
        />
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <FilterSidebar filters={{ label: "Décadas", options: ["1930s", "1940s", "1950s", "1960s", "1970s"] }} title="Período" />
          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-sm font-semibold text-white">Busca e temas</p>
            <SearchBar placeholder="Buscar por título, local ou tema..." ariaLabel="Buscar no acervo fotográfico" />
            <FilterSidebar filters={{ label: "Temas", options: ["Cotidiano", "Mobilização", "Imprensa", "Cultura"] }} title="Temas" />
          </div>
        </div>
      </Section>

      <Section>
        <SectionTitle
          eyebrow="Álbuns"
          title="Séries do acervo fotográfico"
          description="Clique para abrir o álbum completo."
        />

        {albums.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((a) => (
                <Link
                  key={a.slug}
                  href={`/acervo/fotos/${a.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60"
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={a.coverImageUrl}
                      alt={a.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-base font-semibold text-white">{a.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-white/80">{a.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-white/70">
                      {(a.tags || []).slice(0, 3).map((t) => (
                        <span key={t} className="rounded border border-white/10 bg-white/5 px-2 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Pagination />
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70">
            {loaded ? `Nenhum álbum publicado ainda para ${city.name}.` : "Não foi possível carregar os álbuns agora."}
          </div>
        )}
      </Section>
    </SessionLanding>
  );
}

