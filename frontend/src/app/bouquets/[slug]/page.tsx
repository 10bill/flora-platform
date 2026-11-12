import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BouquetCard } from "@/components/bouquets/BouquetCard";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { getBouquet, getBouquets } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { occasions } from "@/lib/occasions";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bouquet = await getBouquet(slug);
  if (!bouquet) return {};

  return {
    title: bouquet.title,
    description: bouquet.description,
    openGraph: { images: [bouquet.image] },
  };
}

export default async function BouquetPage({ params }: Props) {
  const { slug } = await params;
  const bouquet = await getBouquet(slug);
  if (!bouquet) notFound();

  const related = (await getBouquets()).filter((item) => item.slug !== bouquet.slug).slice(0, 3);
  const forOccasions = occasions.filter((occasion) =>
    bouquet.occasions.some((slugOccasion) => slugOccasion === occasion.slug),
  );

  return (
    <>
      <section className="py-12 lg:py-16">
        <Container>
          <Link
            href="/bouquets"
            className="text-[14px] text-ink-mute transition hover:text-bloom"
          >
            ← Tous les bouquets
          </Link>

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
            <Photo
              src={bouquet.image}
              alt={bouquet.title}
              position={bouquet.position}
              sizes="(min-width: 1024px) 50vw, 100vw"
              eager
              className="mx-auto aspect-square w-full max-w-md rounded-4xl border border-line bg-sand lg:mx-0 lg:max-w-none"
            />

            <div className="lg:sticky lg:top-28">
              <Eyebrow>{bouquet.tag}</Eyebrow>
              <h1 className="mt-6 font-display text-[36px] font-medium leading-[0.98] tracking-[-0.02em] sm:text-[52px] lg:text-[64px]">
                {bouquet.title}
              </h1>
              <p className="mt-4 font-display text-[36px] text-clay">
                {formatPrice(bouquet.price)}
                {bouquet.oldPrice && (
                  <span className="ml-3 text-[18px] text-ink-mute line-through">
                    {formatPrice(bouquet.oldPrice)}
                  </span>
                )}
              </p>

              <p className="mt-6 text-[17px] font-light leading-8 text-ink-soft">{bouquet.details}</p>

              <div className="mt-8">
                <h2 className="text-[14px] font-medium text-clay">
                  Composition
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {bouquet.flowers.map((flower) => (
                    <li
                      key={flower}
                      className="rounded-full border border-line-strong px-4 py-1.5 text-[13px] text-ink-soft"
                    >
                      {flower}
                    </li>
                  ))}
                </ul>
              </div>

              {forOccasions.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-[14px] font-medium text-clay">
                    Idéal pour
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {forOccasions.map((occasion) => (
                      <li key={occasion.slug}>
                        <Link
                          href={`/bouquets?occasion=${occasion.slug}`}
                          className="inline-block rounded-full bg-sand px-4 py-1.5 text-[13px] text-ink-soft transition hover:bg-blush"
                        >
                          {occasion.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-10 max-w-sm">
                <AddToCartButton slug={bouquet.slug} title={bouquet.title} variant="solid" />
                <Link
                  href="/commander"
                  className="mt-4 inline-block text-[14px] text-clay underline underline-offset-6 hover:text-bloom"
                >
                  Voir mon panier
                </Link>
              </div>

              <ul className="mt-10 space-y-2 border-t border-line pt-6 text-[14px] font-light text-ink-soft">
                <li>✿ Composé à la main, selon les fleurs du moment</li>
                <li>
                  ✿ Livraison gratuite les mardis et mercredis, ou dès{" "}
                  {formatPrice(site.freeDeliveryFrom)} d’achat
                </li>
                <li>✿ Un message pour la carte, recopié à la main</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-sand/50 py-20">
          <Container>
            <h2 className="mb-10 font-display text-[40px] font-medium leading-none">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-8">
              {related.map((item) => (
                <BouquetCard key={item.slug} bouquet={item} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
