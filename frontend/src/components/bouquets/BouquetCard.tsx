import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Photo } from "@/components/ui/Photo";
import type { Bouquet } from "@/lib/bouquets";
import { formatPrice } from "@/lib/format";

export function BouquetCard({ bouquet }: { bouquet: Bouquet }) {
  const href = `/bouquets/${bouquet.slug}`;

  return (
    <article className="group">
      <div className="relative">
        <Link href={href} aria-label={`Voir ${bouquet.title}`} className="block">
          <Photo
            src={bouquet.image}
            alt={bouquet.title}
            position={bouquet.position}
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 33vw, 50vw"
            className="aspect-square rounded-t-full rounded-b-3xl bg-peach"
            imgClassName="transition duration-700 group-hover:scale-105"
          />
        </Link>
        {bouquet.tag && (
          <span className="pointer-events-none absolute -bottom-3.5 left-5 -rotate-2 rounded-lg bg-yolk px-3.5 py-1.5 text-[14px] font-bold text-ink">
            {bouquet.tag}
          </span>
        )}
        <AddToCartButton slug={bouquet.slug} title={bouquet.title} variant="overlay" />
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h3 className="font-display text-[20px] font-semibold leading-[1.05] sm:text-[26px] lg:text-[30px]">
            <Link href={href} className="transition-colors hover:text-bloom">
              {bouquet.title}
            </Link>
          </h3>
          <p className="mt-1.5 text-[13px] leading-5 text-ink-soft sm:mt-2 sm:text-[16px] sm:leading-6">{bouquet.description}</p>
        </div>
        <div className="shrink-0 sm:text-right">
          <span className="block whitespace-nowrap text-[16px] font-bold text-bloom sm:text-[19px]">
            {formatPrice(bouquet.price)}
          </span>
          {bouquet.oldPrice && (
            <s className="block whitespace-nowrap text-[14px] text-ink-mute">
              {formatPrice(bouquet.oldPrice)}
            </s>
          )}
        </div>
      </div>
    </article>
  );
}
