import Link from "next/link";
import { StoryLayout } from "../StoryLayout";
import { InlinePreviewModal } from "../PreviewModal";
import { heroImage } from "../../data";

export const metadata = {
  title: "Fundo Dom Waldyr - Breve biografia",
  description:
    "Síntese biográfica de Dom Waldyr Calheiros com recortes documentais e linhas de atuação pastoral.",
};

const complements = (
  <>
    <h3 className="text-base font-semibold text-white">Complementos de pesquisa</h3>
    <p className="text-sm text-white/70">
      Consulte materiais relacionados para aprofundar: cartas pastorais, depoimentos, jornais de época e registros fotográficos.
    </p>
    <ul className="space-y-2 text-sm text-white/80">
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/documentos" className="hover:text-white">
          Documentos: cartas, notas e relatórios pastorais
        </Link>
      </li>
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/entrevistas" className="hover:text-white">
          Depoimentos: história oral e transcrições
        </Link>
      </li>
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/boletins" className="hover:text-white">
          Jornais de época: boletins solidários e circulares pastorais
        </Link>
      </li>
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/fotos" className="hover:text-white">
          Acervo fotográfico: imagens de assembleias e visitas comunitárias
        </Link>
      </li>
    </ul>
  </>
);

export default function BreveBiografiaPage() {
  return (
    <StoryLayout
      title="Breve biografia"
      subtitle="Síntese biográfica com recortes documentais sobre a atuação pastoral e social de Dom Waldyr."
      hero={heroImage}
      meta={{ type: "Biografia breve", year: "s/d", location: "Barra do Piraí / Volta Redonda" }}
      complements={complements}
    >
      <p>
        Dom Waldyr Calheiros de Novaes dedicou sua vida à pastoral social e à defesa dos trabalhadores do Sul Fluminense. Sua atuação
        ficou marcada pela presença constante nas comunidades, pela escuta das demandas populares e pelo apoio às iniciativas de
        organização de base.
      </p>
      <p>
        Ao longo de sua trajetória, promoveu mediações em conflitos trabalhistas, acompanhou famílias afetadas pela repressão e
        manteve diálogo contínuo com sindicatos e lideranças comunitárias. Os recortes documentais aqui apresentados revelam uma
        atuação pastoral comprometida com direitos humanos e justiça social.
      </p>
      <p>
        Esta biografia é uma síntese e não esgota a história de Dom Waldyr. Para aprofundar a pesquisa, navegue pelos documentos,
        depoimentos e jornais de época disponíveis no fundo.
      </p>
      <div className="mt-8">
        <InlinePreviewModal
          title="Recortes vinculados"
          items={[
            {
              label: "Documento - Carta pastoral sobre justiça social",
              description: "Recorte com orientações pastorais e defesa de direitos.",
              href: "/acervo/documentos",
              previewSrc: heroImage,
            },
            {
              label: "Depoimento - Memórias de agentes pastorais",
              description: "Trecho de história oral sobre a atuação comunitária.",
              href: "/acervo/entrevistas",
              previewSrc: heroImage,
            },
            {
              label: "Jornal de época - Boletim solidário",
              description: "Chamada pública de apoio aos trabalhadores.",
              href: "/acervo/boletins",
              previewSrc: heroImage,
            },
          ]}
        />
      </div>
    </StoryLayout>
  );
}
