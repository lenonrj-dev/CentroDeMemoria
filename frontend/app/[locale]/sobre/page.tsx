import type { Metadata } from "next";
import { getSiteContent } from "@/lib/get-site-content";
import { StructuredData } from "./components/StructuredData";
import { HeroSection } from "./sections/HeroSection";
import { TocSection } from "./sections/TocSection";
import { EscopoSection } from "./sections/EscopoSection";
import { MetodologiaSection } from "./sections/MetodologiaSection";
import { CitySection } from "./sections/CitySection";
import { AcessoSection } from "./sections/AcessoSection";
import { GuiaSection } from "./sections/GuiaSection";
import { GovernancaSection } from "./sections/GovernancaSection";
import { FaqSection } from "./sections/FaqSection";
import { ContatoSection } from "./sections/ContatoSection";

export const metadata: Metadata = {
  title: "Sobre o Projeto - Centro de Memória | Sintracon",
  description:
    "Histórico, metodologia e orientações de acesso do Centro de Memória Operária Digitalizada Rubem Machado, com foco em Volta Redonda, Barra Mansa, Resende e cidades vizinhas.",
  alternates: { canonical: "/sobre" },
  openGraph: {
    title: "Sobre o Projeto - Centro de Memória | Sintracon",
    description: "Histórico, metodologia e orientações de acesso para pesquisadores, educadores e público em geral.",
    url: "/sobre",
    images: [
      {
        url: "https://res.cloudinary.com/dwf2uc6ot/image/upload/v1763052010/1_de_janeiro_de_1959_2_jkdm71.png",
        width: 1200,
        height: 630,
        alt: "Linha do tempo e imagens históricas do acervo",
      },
    ],
  },
};

export default async function Page() {
  const { about } = await getSiteContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Project",
    name: "Centro de Memória Operária Digitalizada Rubem Machado",
    url: "/sobre",
    areaServed: ["Volta Redonda", "Barra Mansa", "Resende"],
    keywords: ["acervo", "memória operária", "jornais de época", "história do trabalho"],
    creator: { "@type": "Organization", name: "Sintracon" },
  };

  return (
    <main id="main" className="relative">
      <HeroSection hero={about.hero} />
      <TocSection items={about.toc} />
      <EscopoSection data={about.escopo} />
      <MetodologiaSection data={about.metodologia} />

      {about.cities.map((city) => (
        <CitySection key={city.id} {...city} />
      ))}

      <AcessoSection data={about.acesso} />
      <GuiaSection data={about.guia} />
      <GovernancaSection data={about.governanca} />
      <FaqSection data={about.faq} />
      <ContatoSection data={about.contato} />

      <StructuredData data={jsonLd} />
    </main>
  );
}
