import Link from "next/link";
import { DocumentCard, Section, SectionTitle } from "../../../_components/ui";
import type { JournalItem } from "../data";

export function DomWaldyrJornais({ jornais }: { jornais: JournalItem[] }) {
  return (
    <Section id="jornais" className="bg-black">
      <SectionTitle
        eyebrow="Jornais de época"
        title="Publicações solidárias e circulares pastorais"
        description="Edições que registram posicionamentos públicos, apoio aos trabalhadores e alertas de direitos humanos durante os conflitos."
        actions={
          <Link
            href="/acervo/boletins"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            Ler boletins
          </Link>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {jornais.map((j) => (
          <DocumentCard key={j.title} {...j} href="/acervo/boletins" />
        ))}
      </div>
    </Section>
  );
}
