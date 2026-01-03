import Image from "next/image";
import Link from "next/link";
import { DepoimentoCard, Section, SectionTitle } from "../../../_components/ui";
import type { DepoimentoItem } from "../data";

export function DomWaldyrDepoimentos({ depoimentos }: { depoimentos: DepoimentoItem[] }) {
  return (
    <Section id="depoimentos" className="bg-black">
      <SectionTitle
        eyebrow="História oral"
        title="Depoimentos e memórias pastorais"
        description="Relatos de agentes, padres e lideranças que conviveram com Dom Waldyr nas portarias, assembleias e círculos de leitura."
        actions={
          <Link
            href="/acervo/entrevistas"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            Ver entrevistas
          </Link>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {depoimentos.map((d) => (
          <DepoimentoCard key={d.author} {...d} href="/acervo/entrevistas" />
        ))}
      </div>
      <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-sm">
        <div className="relative overflow-hidden rounded-xl border border-white/10">
          <div className="relative aspect-[16/7] w-full">
            <Image
              src="https://res.cloudinary.com/dc7u5spia/image/upload/v1764469350/Pres%C3%A9pio_Igreja_Santa_Cec%C3%ADlia_-_dezembro_de_1968_nwjnrn.jpg"
              alt="Mediação e diálogo comunitário"
              fill
              sizes="(min-width:1024px) 640px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Contexto ampliado</p>
        <h3 className="mt-2 text-lg font-semibold text-white sm:text-xl">Conflito com o Coronel Armínio do 1º B.I.B</h3>
        <p className="mt-2 text-sm text-white/70 sm:text-base">
          Além das peças pastorais, o acervo reúne notas de campo e registros de articulação com sindicatos, movimentos populares e
          comunidades paroquiais, evidenciando como a documentação foi usada para fortalecer redes de solidariedade e defesa de
          direitos.
        </p>
        <Link
          href="/acervo/fundos/dom-waldyr/historias/conflito"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
        >
          Ver recorte
        </Link>
      </div>
    </Section>
  );
}
