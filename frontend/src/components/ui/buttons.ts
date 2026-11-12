/**
 * Styles de boutons réutilisables. S’appliquent à un <Link> comme à un <button> :
 *   <Link href="/bouquets" className={buttonClass("primary")}>…</Link>
 */
const base =
  "group/link inline-flex items-center justify-center gap-2.5 rounded-full text-[15px] font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "bg-bloom px-7 py-3.5 text-white hover:bg-ink",
  dark: "bg-ink px-7 py-3.5 text-cream hover:bg-bloom",
  outline: "border-2 border-ink px-6 py-3 text-ink hover:bg-ink hover:text-cream",
  light: "bg-cream px-7 py-3.5 text-ink hover:bg-ink hover:text-cream",
} as const;

export type ButtonVariant = keyof typeof variants;

export function buttonClass(variant: ButtonVariant = "primary", className = ""): string {
  return `${base} ${variants[variant]} ${className}`.trim();
}

/** Lien texte souligné avec flèche : « Tous les bouquets ↗ » */
export const textLink =
  "group/link inline-flex items-center gap-2 text-[15px] font-semibold text-bloom underline decoration-2 decoration-bloom/30 underline-offset-[7px] transition hover:decoration-bloom";
