import Link from "next/link";
import { StoryLayout } from "../StoryLayout";
import { InlinePreviewModal } from "../PreviewModal";

const hero =
  "https://res.cloudinary.com/dc7u5spia/image/upload/v1764469350/Pres%C3%A9pio_Igreja_Santa_Cec%C3%ADlia_-_dezembro_de_1968_nwjnrn.jpg";

export const metadata = {
  title: "Fundo Dom Waldyr • Cadernos de campo e escutas iniciais",
  description:
    "Recorte documental das primeiras visitas as vilas operarias, registros de campo e articulacao pastoral de Dom Waldyr.",
};

const complements = (
  <>
    <h3 className="text-base font-semibold text-white">Complementos de pesquisa</h3>
    <p className="text-sm text-white/70">
      Consulte materiais relacionados para aprofundar: jornais de época, documentos pastorais, depoimentos, referências
      bibliográficas e o acervo fotográfico do Fundo Dom Waldyr.
    </p>
    <ul className="space-y-2 text-sm text-white/80">
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/boletins" className="hover:text-white">
          Jornais de época: boletins solidários e circulares pastorais
        </Link>
      </li>
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/documentos" className="hover:text-white">
          Documentos: cartas, notas e relatórios integrais
        </Link>
      </li>
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/entrevistas" className="hover:text-white">
          Depoimentos: história oral e transcrições completas
        </Link>
      </li>
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/referencia-bibliografica" className="hover:text-white">
          Referência bibliográfica: livros, artigos e teses
        </Link>
      </li>
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/fotos" className="hover:text-white">
          Acervo fotográfico: imagens de assembleias, visitas e mediações
        </Link>
      </li>
    </ul>
  </>
);

export default function IntroducaoStoryPage() {
  return (
    <StoryLayout
      title="Cadernos de campo e escutas iniciais"
      subtitle="Como as primeiras visitas às vilas operárias consolidaram a metodologia pastoral e a mediação de conflitos."
      hero={hero}
      meta={{ type: "Relato pastoral", year: "1977-1980", location: "Volta Redonda / Barra Mansa" }}
      complements={complements}
    >
      <p>
        As primeiras incursões de Dom Waldyr e dos agentes pastorais às vilas operárias revelaram um cotidiano marcado por jornadas
        longas, alojamentos improvisados e a necessidade urgente de mediação entre empresa, sindicato e comunidade. Cada visita
        gerou um caderno de campo, escrito de forma coletiva e revisado semanalmente, para que a Diocese tivesse subsídios
        consistentes ao dialogar com diferentes atores.
      </p>
      <p>
        Esses cadernos descrevem rotas, horários de assembleias, pontos de tensão e registros sobre saúde, moradia e alimentação.
        Os relatos também destacam a presença das mulheres na organização comunitária, o papel das lideranças sindicais e a
        importância das celebrações bimestrais como momentos de alinhamento político e espiritual.
      </p>
      <p>
        Ao final de cada semana, os registros eram sintetizados em notas de uma página, guardadas em pastas próprias e
        compartilhadas com a equipe de mediação. Esse método permitiu identificar padrões, antecipar conflitos e construir um
        histórico robusto que hoje integra o Fundo Dom Waldyr.
      </p>
      <p>
        A leitura deste recorte oferece um panorama fiel da fase inicial de escuta. Nenhum relato e completo: o acervo registra documentos, biografias breves e fragmentos que ajudam a compreender as articulacoes de apoio, as campanhas de solidariedade e a defesa sistematica dos direitos dos trabalhadores.</p>
      <div className="mt-8">
        <InlinePreviewModal
          title="Provas vinculadas"
          items={[
            {
              label: "Documento • Relatório de visita às vilas operárias (1978)",
              description: "Recorte com anotações originais das condições de moradia e saúde.",
              href: "/acervo/documentos",
              previewSrc:
                "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
            },
            {
              label: "Depoimento • Escutas iniciais (áudio + transcrição)",
              description: "Trecho de história oral de agente pastoral sobre as primeiras visitas.",
              href: "/acervo/entrevistas",
              previewSrc: hero,
            },
            {
              label: "Jornal de época • Boletim comunitário (1979)",
              description: "Nota publicada sobre moradia e assembleias de base.",
              href: "/acervo/boletins",
              previewSrc: hero,
            },
          ]}
        />
      </div>
    </StoryLayout>
  );
}
