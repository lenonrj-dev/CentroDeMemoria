import { ContentContainer, Section } from "../../_components/ui";

export function FundosHeroSection() {
  return (
    <Section className="pt-6 pb-10">
      <ContentContainer>
        <div className="rounded-3xl border border-white/10 bg-black/60 p-6 sm:p-8 lg:p-10">
          <div className="text-xs uppercase tracking-[0.26em] text-white/60">Acervo - Fundos</div>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">Fundos tematicos do acervo</h1>
          <p className="mt-3 max-w-4xl text-base text-white/75 sm:text-lg">
            Cada fundo organiza documentos, depoimentos, referencias e acervos visuais de um eixo especifico. Explore os conjuntos para visualizar amostras e acessar as paginas completas de leitura.
          </p>
        </div>
      </ContentContainer>
    </Section>
  );
}
