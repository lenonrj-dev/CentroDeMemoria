import Image from "next/image";
import Link from "next/link";
import { DocumentCard, Section, SectionTitle } from "../../../_components/ui";
import type { DocumentItem } from "../data";

export function DomWaldyrDocuments({ documents }: { documents: DocumentItem[] }) {
  return (
    <Section id="documentos" className="bg-black">
      <SectionTitle
        eyebrow="Documentos"
        title="Cartas, relatórios e notas pastorais"
        description="Seleção de peças que mostram a atuação direta de Dom Waldyr em mediação de conflitos, escuta comunitária e defesa de direitos."
        actions={
          <Link
            href="/acervo/documentos"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            Abrir todos
          </Link>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <DocumentCard key={doc.title} {...doc} href="/acervo/documentos" />
        ))}
      </div>
      <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-sm">
        <div className="relative overflow-hidden rounded-xl border border-white/10">
          <div className="relative aspect-[16/7] w-full">
            <Image
              src="https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg"
              alt="Registros históricos e arquivos de memória"
              fill
              sizes="(min-width:1024px) 640px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Contexto ampliado</p>
        <h3 className="mt-2 text-lg font-semibold text-white sm:text-xl">Os prisioneiros políticos</h3>
        <p className="mt-2 text-sm text-white/70 sm:text-base">
          Além das peças pastorais, o acervo reúne notas de campo e registros de articulação com sindicatos, movimentos populares e
          comunidades paroquiais, evidenciando como a documentação foi usada para fortalecer redes de solidariedade e defesa de
          direitos.
        </p>
        <Link
          href="/acervo/fundos/dom-waldyr/historias/prisioneiros"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
        >
          Ver recorte
        </Link>
      </div>
    </Section>
  );
}
