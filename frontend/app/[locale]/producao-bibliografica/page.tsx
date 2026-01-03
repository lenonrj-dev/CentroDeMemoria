import SectionBibliografia from "../../producao-bibliografica/sections/Section";
import { getSiteContent } from "@/lib/get-site-content";
import { apiGet } from "@/lib/backend-client";
import type { ReferenceContent } from "@/lib/backend-types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nossa Produção Bibliográfica — Banco de Memória | Sintracon",
  description:
    "Artigos, livros, relatórios e capítulos ligados ao banco de memória. Busque por tema, filtre por década e acesse PDF e referências.",
  alternates: { canonical: "/producao-bibliografica" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Nossa Produção Bibliográfica — Banco de Memória",
    description: "Artigos, livros, relatórios e capítulos ligados ao banco de memória.",
    url: "/producao-bibliografica",
    siteName: "Sintracon",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nossa Produção Bibliográfica — Banco de Memória",
    description: "Artigos, livros, relatórios e capítulos ligados ao banco de memória.",
  },
};

export default async function Page() {
  const { production } = await getSiteContent();

  let references: ReferenceContent[] = [];
  try {
    const res = await apiGet<ReferenceContent[]>("/api/referencias?page=1&limit=200");
    references = res.data;
  } catch {
    // fallback: manter conteudo local
  }

  const items = references.map((r) => {
    const decade = r.year ? `${Math.floor(r.year / 10) * 10}s` : "s/d";
    const type =
      r.tags?.find((t) =>
        ["Artigo", "Livro", "Relatório", "Capítulo", "Inventário", "Tese"].some((x) => x.toLowerCase() === t.toLowerCase())
      ) || "Referência";
    const pdf = r.attachments?.find((a) => a.type === "pdf")?.url || "";
    const href = "/producao-bibliografica";

    return {
      id: r.slug || r._id,
      title: r.title,
      authors: r.authors ?? [],
      year: r.year,
      type,
      decade,
      tags: r.tags ?? [],
      abstract: r.description,
      cover: r.coverImageUrl,
      href,
      pdf,
    };
  });

  const content = items.length
    ? {
        ...production,
        items,
        filters: {
          types: Array.from(new Set(items.map((i) => i.type))).sort(),
          decades: Array.from(new Set(items.map((i) => i.decade))).filter((d) => d !== "s/d").sort().reverse(),
          tags: Array.from(new Set(items.flatMap((i) => i.tags))).sort(),
        },
      }
    : production;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: content.hero.title,
    description: content.hero.description,
    hasPart: content.items.map((item) => ({
      "@type": "CreativeWork",
      name: item.title,
      author: item.authors.map((author) => ({ "@type": "Person", name: author })),
      datePublished: item.year.toString(),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SectionBibliografia content={content} />
    </>
  );
}
