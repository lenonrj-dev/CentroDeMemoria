import Link from "next/link";
import { StoryLayout } from "../StoryLayout";
import { InlinePreviewModal } from "../PreviewModal";

const hero =
  "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg";

  const journal = "https://res.cloudinary.com/dc7u5spia/image/upload/v1765195322/Sem_nome_Story_zibdeb.svg";

export const metadata = {
  title: "Fundo Dom Waldyr • Os prisioneiros políticos",
  description:
    "Dossiê completo com cartas, transcrições de visitas, recortes de jornais e mediações sobre presos políticos na região.",
};

const complements = (
  <>
    <h3 className="text-base font-semibold text-white">Complementos de pesquisa</h3>
    <p className="text-sm text-white/70">
      Explore mais fontes relacionadas: jornais de época, documentos pastorais, depoimentos, referências bibliográficas e acervo
      fotográfico deste fundo.
    </p>
    <ul className="space-y-2 text-sm text-white/80">
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/boletins" className="hover:text-white">
          Jornais de época: coberturas e notas de solidariedade
        </Link>
      </li>
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/documentos" className="hover:text-white">
          Documentos: cartas, ofícios e relatórios completos
        </Link>
      </li>
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/entrevistas" className="hover:text-white">
          Depoimentos: história oral dos envolvidos
        </Link>
      </li>
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/referencia-bibliografica" className="hover:text-white">
          Referência bibliográfica: livros e artigos
        </Link>
      </li>
      <li className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
        <Link href="/acervo/fotos" className="hover:text-white">
          Acervo fotográfico: registros de assembleias e visitas
        </Link>
      </li>
    </ul>
  </>
);

export default function PrisioneirosStoryPage() {
  return (
    <StoryLayout
      title="Os prisioneiros políticos"
      subtitle="Dossiê com registros integrais das mediações, visitas a presídios e ações de solidariedade articuladas pela Pastoral Operária."
      hero={hero}
      meta={{ type: "Dossiê", year: "1982-1985", location: "Volta Redonda" }}
      complements={complements}
    >
      <p>
        Este dossiê reúne cartas de familiares, transcrições das visitas de Dom Waldyr aos presídios, recortes de jornais e notas
        de mediação com autoridades civis e militares. Cada entrada traz data, responsável pela coleta e encaminhamento realizado
        pela Pastoral Operária, estruturando um fluxo documental que orientou campanhas de solidariedade e assistência jurídica.
      </p>
      <p>
        As transcrições de visita registram condições de encarceramento, demandas emergenciais e o estado emocional dos
        trabalhadores detidos. Os recortes de imprensa foram organizados cronologicamente, permitindo acompanhar a repercussão
        pública e identificar lacunas de informação que exigiam resposta pastoral e institucional.
      </p>
      <p>
        Notas internas detalham reuniões com advogados, sindicatos e organismos de direitos humanos, descrevendo compromissos,
        prazos e protocolos de segurança. Esses registros mostram como a Diocese buscou equilibrar confidencialidade e incidência
        pública, sempre documentando cada passo para dar transparência e preservar a memória das vítimas.
      </p>
      <p>
        A leitura deste recorte oferece um panorama da articulacao entre Igreja, movimento sindical e redes de apoio. Nenhum relato e completo: os documentos reunidos ajudam a entender a extensao do conflito e a resposta coletiva.</p>
      <div className="mt-8">
        <InlinePreviewModal
          title="Provas vinculadas"
          items={[
            {
              label: "Documento • Carta de família solicitando mediação (1983)",
              description: "Correspondência original enviada à Pastoral Operária.",
              href: "/acervo/documentos",
              previewSrc: hero,
            },
            {
              label: "Depoimento • Visitas ao presídio (áudio + transcrição)",
              description: "Trecho de entrevista sobre as condições relatadas pelos detidos.",
              href: "/acervo/entrevistas",
              previewSrc: hero,
            },
            {
              label: "Jornal de época • Nota pública de solidariedade (1984)",
              description: "Recorte de jornal destacando a campanha por liberdade e direitos.",
              href: "/acervo/boletins",
              previewSrc: journal,
            },
          ]}
        />
      </div>
    </StoryLayout>
  );
}
