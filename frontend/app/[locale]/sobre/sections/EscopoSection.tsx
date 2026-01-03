import type { SiteContent } from "@/lib/content-types";
import { Section } from "../components/Section";

export function EscopoSection({ data }: { data: SiteContent["about"]["escopo"] }) {
  return (
    <Section id="escopo" title={data.title} subtitle={data.subtitle}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <article className="lg:col-span-8 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <div className="prose prose-invert max-w-none text-white/80">
            {data.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </article>
        <aside className="lg:col-span-4 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <h3 className="text-white">Tipos documentais</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-white/70">
              {data.tiposDocumentais.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <h3 className="text-white">P??blicos priorit??rios</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-white/70">
              {data.publicos.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Section>
  );
}
