import Link from "next/link";
import type { CSSProperties } from "react";
import { buttonClass } from "@/components/ui/buttons";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { Seal } from "./Seal";

export function Hero() {
  const { price, oldPrice, years } = site.anniversary;
  const sealText = `${years} ans de ${site.name} · la rose à ${formatPrice(price)} · `;

  return (
    <section className="relative overflow-hidden bg-peach">
      <Container className="grid items-end gap-12 pt-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-6 lg:pt-14">
        <div className="pb-4 lg:pb-24">
          <p className="mb-7 flex items-center gap-2.5 text-[16px] font-medium">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-bloom opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-bloom" />
            </span>
            Fleuriste à {site.city} depuis {years} ans
          </p>

          <h1 className="font-display text-[60px] font-semibold leading-[0.9] sm:text-[92px] lg:text-[104px] xl:text-[122px]">
            <span className="line-mask">
              <span style={{ "--delay": "0s" } as CSSProperties}>Des fleurs.</span>
            </span>
            <span className="line-mask">
              <span className="italic" style={{ "--delay": "0.14s" } as CSSProperties}>
                Des liens.
              </span>
            </span>
            <span className="line-mask">
              <span style={{ "--delay": "0.28s" } as CSSProperties}>De la vie.</span>
            </span>
          </h1>

          <p className="mt-9 max-w-md text-[19px] leading-8 text-ink-soft">
            Des bouquets vivants, composés à la main, pour les grandes occasions et les petits
            bonheurs du quotidien.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="/bouquets" className={buttonClass("dark")}>
              Découvrir les bouquets
            </Link>
            <Link
              href="/atelier"
              className="text-[16px] font-semibold underline decoration-2 decoration-ink/30 underline-offset-[7px] transition hover:decoration-ink"
            >
              Notre atelier
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:max-w-none">
          {/* le soleil derrière l’arche */}
          <div
            aria-hidden="true"
            className="absolute -right-6 top-4 size-44 rounded-full bg-yolk sm:size-60 lg:-right-10"
          />

          <Photo
            src={site.heroImage}
            alt="Bouquet soleil en papier pêche devant la boutique Flora"
            sizes="(min-width: 1024px) 480px, 100vw"
            eager
            className="relative z-10 h-[470px] rounded-t-full bg-sky-soft sm:h-[620px] lg:h-[700px]"
          />

          <div className="absolute -left-1 top-12 z-20 size-28 sm:-left-8 sm:size-36">
            <Seal text={sealText} center={String(years)} />
          </div>

          {/* l’étiquette accrochée au bouquet, comme celles de la boutique */}
          <div className="absolute bottom-8 left-2 z-20 w-[220px] -rotate-3 sm:-left-10 sm:w-[240px] lg:-left-16">
            <span
              aria-hidden="true"
              className="absolute -top-9 left-1/2 h-11 w-0.5 -translate-x-1/2 rotate-6 bg-bloom"
            />
            <div className="relative rounded-xl border-2 border-ink bg-cream px-5 pb-5 pt-9 shadow-[6px_7px_0_var(--color-ink)]">
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-3 size-3.5 -translate-x-1/2 rounded-full border-2 border-ink bg-peach"
              />
              <p className="text-[15px] font-medium text-ink-mute">Offre des {years} ans</p>
              <p className="font-display text-[34px] font-semibold leading-none">La rose</p>
              <p className="mt-2 flex flex-wrap items-baseline gap-x-2.5">
                <span className="text-[20px] font-bold text-bloom">{formatPrice(price)}</span>
                <s className="text-[14px] text-ink-mute">{formatPrice(oldPrice)}</s>
              </p>
              <Link
                href="/bouquets?categorie=rose"
                className="mt-3 inline-block text-[15px] font-semibold underline decoration-2 decoration-bloom underline-offset-4 transition hover:text-bloom"
              >
                J’en profite
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
