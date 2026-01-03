import type { SiteContent } from "@/lib/content-types";
import { Section } from "../components/Section";

export function FaqSection({ data }: { data: SiteContent["about"]["faq"] }) {
  return (
    <Section id="faq" title="Perguntas frequentes" subtitle="Antes de escrever para a equipe">
      <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {data.map((x, i) => (
          <details key={i} className="group open:bg-white/5">
            <summary className="cursor-pointer list-none px-5 py-4 text-white/90 hover:bg-white/5">
              <span className="text-sm font-medium">{x.q}</span>
            </summary>
            <div className="px-5 pb-5 text-sm text-white/70">{x.a}</div>
          </details>
        ))}
      </div>
    </Section>
  );
}
