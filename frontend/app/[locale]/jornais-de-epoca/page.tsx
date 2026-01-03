import JornaisLanding from "../../jornais-de-epoca/[slug]/sections/Landing";
import { getSiteContent } from "@/lib/get-site-content";
import { apiGet } from "@/lib/backend-client";
import type { JournalContent } from "@/lib/backend-types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jornais de Época - Banco de Memória | Sintracon",
  description:
    "Edições históricas digitalizadas com leitura vertical confortável. Busque por década e acesse a leitura completa.",
  alternates: { canonical: "/jornais-de-epoca" },
};

export default async function Page() {
  const { journals } = await getSiteContent();

  try {
    const res = await apiGet<JournalContent[]>("/api/jornais?page=1&limit=200");
    const editions = res.data.map((j) => {
      const year = Number(j.issueDate?.slice(0, 4));
      const decade = year ? `${Math.floor(year / 10) * 10}s` : "s/d";
      const full = j.pages?.[0]?.imageUrl || j.coverImageUrl;
      return {
        slug: j.slug,
        title: j.title,
        date: j.issueDate?.slice(0, 10) ?? "s/d",
        decade,
        summary: j.description,
        cover: j.coverImageUrl,
        full: full || j.coverImageUrl,
        width: 1359,
        height: 2998,
      };
    });

    const decades = ["Todos", ...Array.from(new Set(editions.map((e) => e.decade))).filter((d) => d !== "s/d").sort()];

    return <JornaisLanding content={{ ...journals, decades, editions }} />;
  } catch {
    return <JornaisLanding content={journals} />;
  }
}
