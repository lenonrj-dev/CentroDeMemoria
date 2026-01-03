import type { SiteContent } from "@/lib/content-types";
import { Section } from "../components/Section";

export function GovernancaSection({ data }: { data: SiteContent["about"]["governanca"] }) {
  return (
    <Section id="governanca" title={data.title} subtitle={data.subtitle}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <article className="lg:col-span-7 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <div className="prose prose-invert max-w-none text-white/80">
            {data.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </article>
        <aside className="lg:col-span-5 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <h3 className="text-white">Frentes de trabalho</h3>
            <ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-white/70">
              {data.frentes.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <h3 className="text-white">Parcerias</h3>
            <p className="mt-2 text-sm text-white/70">{data.parcerias}</p>
          </div>
        </aside>
      </div>
    </Section>
  );
}
