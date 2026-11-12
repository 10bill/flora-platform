import Link from "next/link";
import { BouquetCard } from "@/components/bouquets/BouquetCard";
import { Arrow } from "@/components/ui/Arrow";
import { textLink } from "@/components/ui/buttons";
import { Container } from "@/components/ui/Container";
import { Em } from "@/components/ui/Em";
import { getBouquets } from "@/lib/catalog";

export async function FeaturedBouquets() {
  const bouquets = await getBouquets();

  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <h2 className="max-w-2xl font-display text-[34px] font-semibold leading-[0.96] sm:text-[52px] lg:text-[72px]">
            Un bouquet,
            <br />
            <Em>mille façons de dire.</Em>
          </h2>

          <div className="max-w-sm">
            <p className="text-[18px] leading-8 text-ink-soft">
              Des fleurs de caractère, des couleurs qui se répondent. Trouvez le bouquet qui vous
              ressemble.
            </p>
            <Link href="/bouquets" className={`${textLink} mt-5`}>
              Voir tous les bouquets <Arrow />
            </Link>
          </div>
        </div>

        {/* mobile : défilement horizontal ; à partir de md : 3 colonnes */}
        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-16 md:overflow-visible md:px-0 md:pb-0">
          {bouquets.slice(0, 3).map((bouquet, index) => (
            <div key={bouquet.slug} className={`w-[68%] shrink-0 snap-start sm:w-[44%] md:w-auto ${index === 1 ? "md:mt-20" : ""}`}>
              <BouquetCard bouquet={bouquet} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
