import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DocumentCard, Section, SectionTitle } from "../ui";
import type { DocumentCardProps } from "../ui/types";

export function CityJournalsSection({
  citySlug,
  cards,
}: {
  citySlug: string;
  cards: DocumentCardProps[];
}) {
  return (
    <Section>
      <SectionTitle
        eyebrow="Jornais"
        title="Recortes e edições locais"
        description="Jornais de época com cobertura de greves, debates públicos e mobilizações trabalhistas."
        actions={
          <Link
            href={`/acervo/${citySlug}/jornais-de-epoca`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
          >
            Ver jornais <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((j) => (
          <DocumentCard key={`${j.title}-${j.date}`} {...j} />
        ))}
      </div>
    </Section>
  );
}
