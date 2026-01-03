import { buildCityContent } from "./city/content";
import { CityHero } from "./city/CityHero";
import { CitySectionNav } from "./city/CitySectionNav";
import { CityDocumentsSection } from "./city/CityDocumentsSection";
import { CityTestimonialsSection } from "./city/CityTestimonialsSection";
import { CityReferencesSection } from "./city/CityReferencesSection";
import { CityJournalsSection } from "./city/CityJournalsSection";
import { CityPhotosSection } from "./city/CityPhotosSection";
import type { CityLandingProps } from "./city/types";

export default function CityLanding({ city, previews }: CityLandingProps) {
  const { mission, docCards, depoCards, refCards, journalCards, photoCards } = buildCityContent(city, previews);

  return (
    <>
      <CityHero city={city} mission={mission} />
      <CitySectionNav city={city} />
      <CityDocumentsSection citySlug={city.slug} cards={docCards} />
      <CityTestimonialsSection citySlug={city.slug} cards={depoCards} />
      <CityReferencesSection citySlug={city.slug} cards={refCards} />
      <CityJournalsSection citySlug={city.slug} cards={journalCards} />
      <CityPhotosSection citySlug={city.slug} photos={photoCards} />
    </>
  );
}
