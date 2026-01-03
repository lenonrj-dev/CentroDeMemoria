import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReferenciaCard, Section, SectionTitle } from "../ui";
import type { ReferenciaCardProps } from "../ui/types";

export function CityReferencesSection({
  citySlug,
  cards,
}: {
  citySlug: string;
  cards: ReferenciaCardProps[];
}) {
  return (
    <Section>
      <SectionTitle
        eyebrow="Bibliografia"
        title="Referências e pesquisas"
        description="Livros, artigos e teses que contextualizam a história social e industrial de cada município."
        actions={
          <Link
            href={`/acervo/${citySlug}/referencia-bibliografica`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
          >
            Ver bibliografia <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((r) => (
          <ReferenciaCard key={`${r.title}-${r.year}`} {...r} />
        ))}
      </div>
    </Section>
  );
}
