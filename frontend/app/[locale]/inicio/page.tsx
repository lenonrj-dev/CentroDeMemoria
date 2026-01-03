import FirstSection from "../../inicio/sections/FirstSection";
import SecondSection from "../../inicio/sections/SecondSection";
import ThirdSection from "../../inicio/sections/ThirdSection";
import FourthSection from "../../inicio/sections/FourthSection";
import FifthSection from "../../inicio/sections/FifthSection";
import SixthSection from "../../inicio/sections/SixthSection";
import SeventhSection from "../../inicio/sections/SeventhSection";
import SearchBarSection from "../../inicio/sections/SearchBarSection";
import { getSiteContent } from "@/lib/get-site-content";
import { apiGet } from "@/lib/backend-client";
import type { DocumentContent, JournalContent, PhotoArchiveContent } from "@/lib/backend-types";

export default async function Page() {
  const { home } = await getSiteContent();
  let featuredCollections = home.featuredCollections;
  let journals = home.journals;
  let personalTimeline = home.personalTimeline;

  try {
    const tag = "Dom Waldyr";
    const fundKey = "dom-waldyr";
    const params = `tag=${encodeURIComponent(tag)}&fundKey=${encodeURIComponent(fundKey)}`;
    const [docsRes, fotosRes, jornaisRes] = await Promise.all([
      apiGet<DocumentContent[]>(`/api/documentos?${params}&page=1&limit=6`),
      apiGet<PhotoArchiveContent[]>(`/api/acervo-fotografico?${params}&page=1&limit=4`),
      apiGet<JournalContent[]>(`/api/jornais?${params}&page=1&limit=8`),
    ]);

    const docs = docsRes.data.map((doc) => ({
      title: doc.title,
      description: doc.description || "Documento do Fundo Dom Waldyr.",
      href: `/acervo/documentos/${doc.slug}`,
      cover: doc.coverImageUrl || home.hero.imageSrc,
      badge: "Documento",
    }));

    const timelineItems = docsRes.data.map((doc) => {
      const metaParts = [doc.year ? String(doc.year) : "", doc.collection || "", doc.source || ""].filter(Boolean);
      const isCartaz = (doc.tags || []).includes("Cartazes");
      return {
        title: doc.title,
        description: doc.description || "Documento do Fundo Dom Waldyr.",
        href: `/acervo/${isCartaz ? "cartazes" : "documentos"}/${doc.slug}`,
        meta: metaParts.join(" • "),
      };
    });

    const fotos = fotosRes.data.map((photo) => ({
      title: photo.title,
      description: photo.description || "Registro fotográfico do acervo pastoral.",
      href: `/acervo/fotos/${photo.slug}`,
      cover: photo.coverImageUrl || home.hero.imageSrc,
      badge: "Foto",
    }));

    const jornais = jornaisRes.data.map((jor) => {
      const date = (jor.issueDate || jor.publishedAt || jor.createdAt || jor.updatedAt || "s/d").slice(0, 10);
      const year = Number(date.slice(0, 4));
      const decade = Number.isFinite(year) && year > 0 ? `${Math.floor(year / 10) * 10}s` : "s/d";
      return {
        title: jor.title,
        date: date || "s/d",
        decade,
        description: jor.description || "Recorte de jornal de época do acervo.",
        href: `/jornais-de-epoca/${jor.slug}`,
        cover: jor.coverImageUrl || home.hero.imageSrc,
        tags: jor.tags ?? [],
      };
    });

    const picks = [
      ...docs.slice(0, 2),
      ...jornais.slice(0, 1).map((item) => ({ ...item, badge: "Jornal" })),
      ...fotos.slice(0, 1),
    ].slice(0, 4);

    if (picks.length) {
      featuredCollections = {
        ...featuredCollections,
        items: picks.map((item) => ({
          title: item.title,
          description: item.description,
          href: item.href,
          cover: item.cover,
          badge: "badge" in item ? item.badge : "Foto",
        })),
      };
    }

    if (timelineItems.length) {
      personalTimeline = {
        ...personalTimeline,
        items: timelineItems,
        footnote: "Documentos do Fundo Dom Waldyr selecionados para contexto e pesquisa.",
      };
    }

    if (jornais.length) {
      const decades = Array.from(
        new Set(jornais.map((item) => item.decade).filter((d) => d && d !== "s/d"))
      ).sort();
      const filters = [{ value: "all", label: "Todos" }, ...decades.map((d) => ({ value: d, label: d }))];

      journals = {
        ...journals,
        filters,
        items: jornais,
      };
    }
  } catch {
    // fallback: usa conteúdo estático local
  }

  return (
    <>
      <FirstSection imageSrc={home.hero.imageSrc} alt={home.hero.alt} logos={home.hero.logos} />
      <SearchBarSection content={home.search} />
      <SecondSection content={featuredCollections} />
      <ThirdSection content={personalTimeline} />
      <FourthSection content={journals} />
      <FifthSection content={home.team} />
      <SixthSection content={home.access} />
      <SeventhSection content={home.politics} />
    </>
  );
}
