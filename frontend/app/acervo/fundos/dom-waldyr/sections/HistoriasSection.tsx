import Link from "next/link";
import { Section, SectionTitle } from "../../../_components/ui";

export function DomWaldyrHistorias() {
  return (
    <Section id="historias" className="bg-black">
      <SectionTitle
        eyebrow="Recortes narrativos"
        title="Contexto em recortes e documentos"
        description="Nenhuma história é relatada por completo: estes são recortes documentais e narrativas curtas para orientar a pesquisa."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article
          id="historia-introducao"
          className="flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/70">
            <span className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5">Tipo: Relato pastoral</span>
            <span className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5">Ano: 1977-1980</span>
            <span className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5">Local: Volta Redonda / Barra Mansa</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Cadernos de campo e escutas iniciais</h3>
          <p className="text-sm text-white/70">
            Recorte sobre as primeiras visitas às vilas operárias, descrevendo condições de moradia, saúde e a formação dos
            grupos de base. Inclui notas de reuniões paroquiais e mapas de rotas.
          </p>
          <Link
            href="/acervo/fundos/dom-waldyr/historias/introducao"
            className="mt-auto inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            Ler recorte
          </Link>
        </article>

        <article
          id="historia-prisioneiros"
          className="flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/70">
            <span className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5">Tipo: Dossiê</span>
            <span className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5">Ano: 1982-1985</span>
            <span className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5">Local: Volta Redonda</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Os prisioneiros políticos</h3>
          <p className="text-sm text-white/70">
            Recorte com cartas de familiares, transcrições de visitas a presídios e notas de mediação com autoridades.
          </p>
          <Link
            href="/acervo/fundos/dom-waldyr/historias/prisioneiros"
            className="mt-auto inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            Ler recorte
          </Link>
        </article>

        <article
          id="historia-conflito"
          className="flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/70">
            <span className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5">Tipo: Relatório confidencial</span>
            <span className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5">Ano: 1984</span>
            <span className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5">Local: Barra Mansa</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Conflito com o Coronel Armínio do 1º B.I.B</h3>
          <p className="text-sm text-white/70">
            Recorte narrativo sobre tensões entre agentes pastorais e o comando local, com cronologia resumida e fontes anexas.
          </p>
          <Link
            href="/acervo/fundos/dom-waldyr/historias/conflito"
            className="mt-auto inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            Ler recorte
          </Link>
        </article>
      </div>
    </Section>
  );
}
