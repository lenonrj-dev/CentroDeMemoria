import { ContentContainer, Section, SectionTitle } from "../../_components/ui";

export function FundosSearchSection({ query }: { query: string }) {
  return (
    <Section className="pt-0 pb-4">
      <ContentContainer>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <SectionTitle
              eyebrow="Navegue pelos fundos"
              title="Previas e direcionamentos"
              description="Escolha um fundo para abrir a pagina detalhada com hero, secoes de documentos, depoimentos, referencias, jornais de epoca e acervo fotografico."
            />
          </div>
          <form className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5" method="get">
            <label htmlFor="q" className="text-sm font-semibold text-white">
              Buscar nos fundos
            </label>
            <p className="text-xs text-white/60">
              Pesquise por nome do fundo ou palavras-chave dos destaques. O filtro atua sobre as previas exibidas abaixo.
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
              <input
                id="q"
                name="q"
                defaultValue={query}
                placeholder="Ex.: greves, pastoral, contratos..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                aria-label="Buscar fundos"
              />
              <button
                type="submit"
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </ContentContainer>
    </Section>
  );
}
