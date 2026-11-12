/**
 * Sceau rond « 8 ans » : le texte tourne autour d’un chiffre fixe.
 * Purement décoratif (l’offre est écrite en toutes lettres à côté).
 */
export function Seal({ text, center }: { text: string; center: string }) {
  return (
    <div aria-hidden="true" className="relative size-full">
      <svg viewBox="0 0 200 200" className="seal-spin absolute inset-0 size-full">
        <defs>
          <path id="seal-circle" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
        </defs>
        <circle cx="100" cy="100" r="99" className="fill-bloom" />
        <circle cx="100" cy="100" r="92" fill="none" className="stroke-cream/40" strokeWidth="1" />
        <text className="fill-cream font-sans" fontSize="17" fontWeight="600">
          <textPath href="#seal-circle" textLength="472" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-[64px] font-semibold italic leading-none text-cream sm:text-[76px]">
        {center}
      </span>
    </div>
  );
}
