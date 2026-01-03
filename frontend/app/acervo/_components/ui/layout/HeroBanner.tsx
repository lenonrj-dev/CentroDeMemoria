import type { ReactNode } from "react";
import Image from "next/image";
import clsx from "clsx";

export function HeroBanner({
  eyebrow,
  title,
  description,
  image,
  badge,
  actions,
  className,
  mediaClassName,
  contentClassName,
  titleClassName,
  descriptionClassName,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
  badge?: string;
  actions?: ReactNode;
  className?: string;
  mediaClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}) {
  return (
    <div className={clsx("relative overflow-hidden rounded-3xl border border-white/10 bg-black/60", className)}>
      <div className="grid items-start gap-0 lg:grid-cols-[1.25fr_1.1fr]">
        <div className={clsx("p-6 sm:p-8 lg:p-10 space-y-4", contentClassName)}>
          {badge && (
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
              {badge}
            </div>
          )}
          {eyebrow && (
            <div className="text-xs uppercase tracking-[0.28em] text-white/60">{eyebrow}</div>
          )}
          <h1 className={clsx("text-3xl font-semibold text-white sm:text-4xl lg:text-5xl", titleClassName)}>{title}</h1>
          <p className={clsx("max-w-3xl text-base text-white/75 sm:text-lg", descriptionClassName)}>{description}</p>
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
        <div className={clsx("relative h-64 w-full", mediaClassName)}>
          <Image src={image} alt={title} fill className="object-cover" sizes="(min-width:1024px) 45vw, 100vw" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>
      </div>
    </div>
  );
}
