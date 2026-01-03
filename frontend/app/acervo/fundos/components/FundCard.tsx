import { GroupShell } from "./GroupShell";
import { FundOverviewCard } from "./FundOverviewCard";
import { DepoimentoPreviewCard } from "./cards/DepoimentoPreviewCard";
import { DocumentPreviewCard } from "./cards/DocumentPreviewCard";
import { JournalCard } from "./cards/JournalCard";
import { PhotoPreviewCard } from "./cards/PhotoPreviewCard";
import { ReferencePreviewCard } from "./cards/ReferencePreviewCard";
import type { Fund } from "../types";

export function FundCard({ fund }: { fund: Fund }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/60 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px,1fr]">
        <FundOverviewCard fund={fund} />

        <div className="max-w-6xl space-y-8 lg:space-y-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 lg:text-3xl">
              Documentos, jornais e depoimentos
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-400 lg:text-base">
              Previa dos materiais principais do fundo. Acesse para abrir a pagina completa com hero, secoes e leitura detalhada.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <GroupShell title="Documentos">
              <div className="grid grid-cols-1 gap-3">
                {fund.documents.map((doc) => (
                  <DocumentPreviewCard key={`${fund.slug}-doc-${doc.title}`} item={doc} href={`/acervo/fundos/${fund.slug}`} />
                ))}
              </div>
            </GroupShell>
            <GroupShell title="Jornais de epoca">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {fund.jornais.map((j) => (
                  <JournalCard key={`${fund.slug}-jor-${j.title}`} item={j} href={`/acervo/fundos/${fund.slug}`} />
                ))}
              </div>
            </GroupShell>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <GroupShell title="Depoimentos">
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {fund.depoimentos.map((d) => (
                  <DepoimentoPreviewCard key={`${fund.slug}-dep-${d.author}`} item={d} href={`/acervo/fundos/${fund.slug}`} />
                ))}
              </div>
            </GroupShell>
            <GroupShell title="Referencia">
              <div className="grid grid-cols-1 gap-3">
                {fund.referencias.map((r) => (
                  <ReferencePreviewCard key={`${fund.slug}-ref-${r.title}`} item={r} />
                ))}
              </div>
            </GroupShell>
          </div>
          <GroupShell title="Acervo fotografico">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {fund.fotos.map((p) => (
                <PhotoPreviewCard key={`${fund.slug}-photo-${p.caption}`} photo={p} />
              ))}
            </div>
          </GroupShell>
        </div>
      </div>
    </div>
  );
}
