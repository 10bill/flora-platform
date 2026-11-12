import Link from "next/link";
import { buttonClass } from "@/components/ui/buttons";
import { Container } from "@/components/ui/Container";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

/** Grand bandeau rouge de l’offre en cours (ici : les 8 ans de Flora). */
export function SeasonBanner() {
  const { years, price, oldPrice } = site.anniversary;

  return (
    <section className="relative overflow-hidden bg-bloom py-24 text-cream sm:py-32">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-16 select-none font-display text-[420px] font-semibold italic leading-none text-bloom-deep sm:-top-28 sm:right-8 sm:text-[640px]"
      >
        {years}
      </span>

      <Container className="relative">
        <h2 className="font-display text-[60px] font-semibold leading-[0.92] sm:text-[112px]">
          {years} ans,
          <br />
          <em className="font-normal italic">ça se fête !</em>
        </h2>

        <div className="mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <p className="font-display text-[38px] font-medium leading-none sm:text-[52px]">
            La rose à {formatPrice(price)}
          </p>
          <s className="text-[20px] text-blush">{formatPrice(oldPrice)}</s>
        </div>

        <p className="mt-6 max-w-md text-[19px] leading-8 text-cream/90">
          Tout le mois de novembre, offrez des roses à prix doux.
        </p>
        <p className="mt-4 inline-block rounded-full bg-yolk px-4 py-1.5 text-[15px] font-bold text-ink">
          Livraison gratuite les mardis et mercredis
        </p>

        <div>
          <Link href="/bouquets?categorie=rose" className={buttonClass("light", "mt-10")}>
            Profiter de l’offre
          </Link>
        </div>
      </Container>
    </section>
  );
}
