import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

/** Surtitre + titre h2 + texte optionnel. */
export function SectionHeading({
  eyebrow,
  title,
  children,
  light = false,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2
        className={`${eyebrow ? "mt-5" : ""} font-display text-[34px] font-semibold leading-[0.98] sm:text-[52px] lg:text-[64px] ${
          light ? "text-cream" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {children && (
        <p className={`mt-6 max-w-lg text-[18px] leading-8 ${light ? "text-mist" : "text-ink-soft"}`}>
          {children}
        </p>
      )}
    </div>
  );
}
