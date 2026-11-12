const phrases = [
  "Fleurs fraîches",
  "Composées à la main",
  "Livraison soignée",
  "Récolte de saison",
  "Fait avec amour",
];

// Deux moitiés identiques : l’animation décale de -50 % puis recommence, sans coupure visible.
const half = [...phrases, ...phrases];
const track = [...half, ...half];

export function Marquee() {
  return (
    <div aria-hidden="true" className="overflow-hidden bg-ink py-5">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {track.map((phrase, index) => (
          <span
            key={index}
            className="flex items-center gap-10 pr-10 font-display text-[30px] italic text-cream"
          >
            {phrase}
            <span className="text-[22px] text-yolk">✿</span>
          </span>
        ))}
      </div>
    </div>
  );
}
