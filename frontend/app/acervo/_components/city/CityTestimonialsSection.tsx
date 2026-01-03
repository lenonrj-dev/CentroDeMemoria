import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DepoimentoCard, Section, SectionTitle } from "../ui";
import type { DepoimentoCardProps } from "../ui/types";

export function CityTestimonialsSection({
  citySlug,
  cards,
}: {
  citySlug: string;
  cards: DepoimentoCardProps[];
}) {
  return (
    <Section>
      <SectionTitle
        eyebrow="História oral"
        title="Depoimentos e memória viva"
        description="Metodologia de história oral aplicada a lideranças, base sindical e comunidade. Áudios, transcrições e registros contextuais."
        actions={
          <Link
            href={`/acervo/${citySlug}/depoimentos`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
          >
            Ver depoimentos <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((d) => (
          <DepoimentoCard key={`${d.author}-${d.date}`} {...d} />
        ))}
      </div>
    </Section>
  );
}
