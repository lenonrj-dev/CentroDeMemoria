import type { ReactNode } from "react";
import clsx from "clsx";
import { ContentContainer } from "./ContentContainer";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={clsx("relative w-full py-10 sm:py-14 lg:py-16", className)}>
      <ContentContainer>{children}</ContentContainer>
    </section>
  );
}
