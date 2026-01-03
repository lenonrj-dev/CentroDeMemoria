import type { ReactNode } from "react";

export type SectionProps = { id?: string; title?: string; subtitle?: string; children: ReactNode };

export function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="relative w-full py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-6 sm:mb-8">
          {subtitle && <p className="mb-2 text-xs uppercase tracking-[0.25em] text-white/50">{subtitle}</p>}
          {title && <h2 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">{title}</h2>}
        </header>
        {children}
      </div>
    </section>
  );
}
