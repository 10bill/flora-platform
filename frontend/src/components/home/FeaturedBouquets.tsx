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
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <h2 className="max-w-2xl font-display text-[46px] font-semibold leading-[0.96] sm:text-[72px]">
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

        <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-3">
          {bouquets.slice(0, 3).map((bouquet, index) => (
            <div key={bouquet.slug} className={index === 1 ? "md:mt-20" : ""}>
              <BouquetCard bouquet={bouquet} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
