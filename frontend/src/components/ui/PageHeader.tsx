import type { ReactNode } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

/** En-tête commun à toutes les pages intérieures (contient le <h1>). */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-peach">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-yolk sm:size-80"
      />
      <Container className="relative py-16 sm:py-20 lg:py-24">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-3xl font-display text-[40px] font-semibold leading-[0.95] sm:text-[64px] lg:text-[84px]">
          {title}
        </h1>
        {intro && <p className="mt-6 max-w-xl text-[18px] leading-8 text-ink-soft">{intro}</p>}
        {children}
      </Container>
    </section>
  );
}
