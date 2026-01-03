import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PhotoMasonryGrid, Section, SectionTitle } from "../ui";
import type { PhotoItem } from "../ui/types";

export function CityPhotosSection({
  citySlug,
  photos,
}: {
  citySlug: string;
  photos: PhotoItem[];
}) {
  return (
    <Section>
      <SectionTitle
        eyebrow="Fotografias"
        title="Acervo fotográfico"
        description="Imagens de assembleias, manifestações, equipamentos urbanos e cotidiano da cidade."
        actions={
          <Link
            href={`/acervo/${citySlug}/acervo-fotografico`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
          >
            Ver fotografias <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
      <PhotoMasonryGrid photos={photos.length ? photos : []} />
    </Section>
  );
}
