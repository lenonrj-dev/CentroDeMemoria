import Link from "next/link";
import { StoryLayout } from "../StoryLayout";
import { InlinePreviewModal } from "../PreviewModal";

const hero =
  "https://res.cloudinary.com/dc7u5spia/image/upload/v1764469350/Pres%C3%A9pio_Igreja_Santa_Cec%C3%ADlia_-_dezembro_de_1968_nwjnrn.jpg";

export const metadata = {
  title: "Fundo Dom Waldyr • Conflito com o Coronel Armênio do 1º B.I.B",
  description:
    "Relatório confidencial sobre tensões com o comando local, negociações, protocolos de segurança e registros testemunhais.",
};

const complements = (
  <>
    <h3 className="text-base font-semibold text-white">Complementos de pesquisa</h3>
    <p className="text-sm text-white/70">
      Continue a exploração do acervo consultando jornais de época, documentos, depoimentos, referências bibliográficas e o acervo
      fotográfico para cruzar fontes e enriquecer análises.
    </p>
    <ul className="space-y-2 text-sm text-white/80">
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/boletins" className="hover:text-white">
          Jornais de época: coberturas e editoriais
        </Link>
      </li>
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/documentos" className="hover:text-white">
          Documentos: memorandos, cartas e relatórios
        </Link>
      </li>
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/entrevistas" className="hover:text-white">
          Depoimentos: testemunhos e história oral
        </Link>
      </li>
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/referencia-bibliografica" className="hover:text-white">
          Referência bibliográfica: obras para citação
        </Link>
      </li>
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/fotos" className="hover:text-white">
          Acervo fotográfico: imagens do contexto pastoral
        </Link>
      </li>
    </ul>
  </>
);

export default function ConflitoStoryPage() {
  return (
    <StoryLayout
      title="Conflito com o Coronel Armênio do 1º B.I.B"
      subtitle="Recorte documental das tensoes, negociacoes e estrategias de protecao as liderancas em risco."
      hero={hero}
      meta={{ type: "Relatório confidencial", year: "1984", location: "Barra Mansa" }}
      complements={complements}
    >
      <p>
        Este relatório narra o conflito entre agentes pastorais e o comando do 1º B.I.B., documentando reuniões, trocas de
        correspondência e a criação de protocolos de segurança para salvaguardar lideranças ameaçadas. As notas apresentam datas,
        participantes, decisões e encaminhamentos, permitindo reconstituir cada fase da mediação.
      </p>
      <p>
        Cartas e memorandos anexos registram pedidos de esclarecimento, propostas de cessar ações coercitivas e a articulação com
        entidades civis para monitorar eventuais abusos. O documento também reúne orientações para acolhimento de famílias,
        preservação de provas e comunicação com a imprensa.
      </p>
      <p>
        Depoimentos coletados em campo descrevem o clima de apreensão, a resistência das comunidades e o papel da Diocese na
        construção de canais de diálogo. Ao lado, cronologias detalhadas e listas de contatos oferecem um mapa completo das fontes
        disponíveis para pesquisa e verificação.
      </p>
      <p>
        A leitura deste recorte mostra como a documentacao rigorosa e a narrativa estruturada foram essenciais para proteger pessoas, evidenciar violacoes e preservar a memoria de um episodio critico na historia local.</p>
      <div className="mt-8">
        <InlinePreviewModal
          title="Provas vinculadas"
          items={[
            {
              label: "Documento • Memorando sobre negociações com o 1º B.I.B (1984)",
              description: "Trecho do dossiê com encaminhamentos e solicitações oficiais.",
              href: "/acervo/documentos",
              previewSrc: hero,
            },
            {
              label: "Depoimento • Liderança comunitária relata ameaças",
              description: "Trecho de história oral sobre o clima de tensão e proteção das lideranças.",
              href: "/acervo/entrevistas",
              previewSrc: hero,
            },
            {
              label: "Jornal de época • Editorial sobre o conflito e direitos humanos",
              description: "Recorte de jornal com posicionamento público e denúncias.",
              href: "/acervo/boletins",
              previewSrc: hero,
            },
          ]}
        />
      </div>
    </StoryLayout>
  );
}
