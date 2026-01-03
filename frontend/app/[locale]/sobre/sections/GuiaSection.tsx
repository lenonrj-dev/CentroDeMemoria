import type { SiteContent } from "@/lib/content-types";
import { Section } from "../components/Section";

export function GuiaSection({ data }: { data: SiteContent["about"]["guia"] }) {
  return (
    <Section id="pesquisa" title={data.title} subtitle={data.subtitle}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.tips.map((t, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-base font-semibold text-white">{t.title}</h3>
            <p className="mt-2 text-sm text-white/70">{t.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
