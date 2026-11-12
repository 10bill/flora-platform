import type { ReactNode } from "react";

/** Passage en italique dans un titre (même couleur : c'est le rythme qui change). */
export function Em({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <em className={`font-normal italic ${className}`}>{children}</em>;
}
