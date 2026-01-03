import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DocumentCard, Section, SectionTitle } from "../ui";
import type { DocumentCardProps } from "../ui/types";

export function CityDocumentsSection({
  citySlug,
  cards,
}: {
  citySlug: string;
  cards: DocumentCardProps[];
}) {
  return (
    <Section>
      <SectionTitle
        eyebrow="Documentos"
        title="Documentos históricos e administrativos"
        description="Atas, ofícios, relatórios e registros que revelam processos decisórios, negociações coletivas e os bastidores da organização sindical."
        actions={
          <Link
            href={`/acervo/${citySlug}/documentos`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
          >
            Acessar documentos <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <DocumentCard key={`${c.title}-${c.date}`} {...c} />
        ))}
      </div>
    </Section>
  );
}
