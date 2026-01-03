import Link from "next/link";
import { ReferenciaCard, Section, SectionTitle } from "../../../_components/ui";
import type { ReferenciaItem } from "../data";

export function DomWaldyrReferencias({ referencias }: { referencias: ReferenciaItem[] }) {
  return (
    <Section id="referencias" className="bg-black">
      <SectionTitle
        eyebrow="Referência bibliográfica"
        title="Obras sobre a atuação de Dom Waldyr"
        description="Bibliografia comentada para aprofundar estudos sobre mediação social, pastoral operária e documentação do período."
        actions={
          <Link
            href="/acervo/referencia-bibliografica"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            Acessar referências
          </Link>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {referencias.map((ref) => (
          <ReferenciaCard key={ref.title} {...ref} />
        ))}
      </div>
    </Section>
  );
}
