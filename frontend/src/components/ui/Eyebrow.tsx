import type { ReactNode } from "react";

/** Petite ligne d’introduction au-dessus d’un titre (phrase normale, pas de capitales). */
export function Eyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 text-[16px] font-medium ${
        light ? "text-cream" : "text-bloom"
      }`}
    >
      <span aria-hidden="true" className={`size-2 rounded-full ${light ? "bg-yolk" : "bg-bloom"}`} />
      {children}
    </div>
  );
}
