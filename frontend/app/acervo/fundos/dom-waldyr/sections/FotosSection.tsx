import Link from "next/link";
import { PhotoMasonryGrid, Section, SectionTitle } from "../../../_components/ui";
import type { FotoItem } from "../data";

export function DomWaldyrFotos({ fotos }: { fotos: FotoItem[] }) {
  return (
    <Section id="acervo-fotografico" className="bg-black">
      <SectionTitle
        eyebrow="Acervo fotográfico"
        title="Imagens da presença pastoral"
        description="Pré-visualização de fotografias com metadados básicos para orientar a consulta completa."
        actions={
          <Link
            href="/acervo/fotos"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            Ver acervo fotográfico
          </Link>
        }
      />
      <PhotoMasonryGrid photos={fotos} />
    </Section>
  );
}
