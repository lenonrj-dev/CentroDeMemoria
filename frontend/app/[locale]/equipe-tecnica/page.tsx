import TeamLanding from "../../equipe-tecnica/TeamLanding";
import { getSiteContent } from "@/lib/get-site-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equipe Técnica — Banco de Memória | Sintracon",
  description:
    "Conheça a equipe técnica responsável pelo Banco de Memória: coordenação, curadoria, preservação digital, pesquisa e desenvolvimento.",
  alternates: { canonical: "/equipe-tecnica" },
  openGraph: {
    title: "Equipe Técnica — Banco de Memória",
    description: "Coordenação, curadoria, preservação digital, pesquisa e desenvolvimento.",
    url: "/equipe-tecnica",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default async function Page() {
  const { team } = await getSiteContent();

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: team.hero.title,
    description: team.hero.description,
    url: "/equipe-tecnica",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <TeamLanding content={team} />
    </>
  );
}
