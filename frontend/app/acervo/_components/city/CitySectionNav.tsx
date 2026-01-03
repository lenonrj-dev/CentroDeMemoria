import CitySectionGrid from "../CitySectionGrid";
import { Section, SectionTitle } from "../ui";
import type { CityData } from "../../cityData";

export function CitySectionNav({ city }: { city: CityData }) {
  return (
    <Section id="sessoes">
      <SectionTitle
        eyebrow="Navegação"
        title="Seções principais"
        description="Documentos, depoimentos, referências bibliográficas, jornais de época e acervo fotográfico prontos para consulta pública."
      />
      <CitySectionGrid sections={city.sections} />
    </Section>
  );
}
