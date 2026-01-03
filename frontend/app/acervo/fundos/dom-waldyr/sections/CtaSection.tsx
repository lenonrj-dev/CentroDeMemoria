import Link from "next/link";
import { Section } from "../../../_components/ui";

export function DomWaldyrCTA() {
  return (
    <Section className="bg-black pt-4 pb-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center sm:p-8">
        <h3 className="text-2xl font-semibold text-white sm:text-3xl">Explore o fundo Dom Waldyr com profundidade</h3>
        <p className="mt-3 text-sm text-white/70 sm:text-base">
          Navegue pelos documentos, relatos, referências e publicações para compreender a trajetória pastoral e seus recortes
          documentais junto aos trabalhadores da região.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/acervo/documentos"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            Documentos
          </Link>
          <Link
            href="/acervo/entrevistas"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            Depoimentos
          </Link>
          <Link
            href="/acervo/referencia-bibliografica"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            Referências
          </Link>
          <Link
            href="/acervo/boletins"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            Jornais de época
          </Link>
          <Link
            href="/acervo/fotos"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            Acervo fotográfico
          </Link>
        </div>
      </div>
    </Section>
  );
}
