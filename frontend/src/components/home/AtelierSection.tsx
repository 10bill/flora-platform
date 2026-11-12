import Link from "next/link";
import { buttonClass } from "@/components/ui/buttons";
import { Container } from "@/components/ui/Container";
import { Em } from "@/components/ui/Em";
import { Photo } from "@/components/ui/Photo";
import { site } from "@/lib/site";

export function AtelierSection() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div className="relative mx-auto w-full max-w-[480px] lg:mx-0">
          <div
            aria-hidden="true"
            className="absolute -left-5 -top-5 size-full rounded-4xl border-2 border-bloom"
          />
          <Photo
            src={site.facadeImage}
            alt="Façade de la boutique Flora, avec sa grande rose rouge"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="relative aspect-3/4 rounded-4xl bg-peach"
          />
        </div>

        <div>
          <h2 className="font-display text-[44px] font-semibold leading-[0.98] sm:text-[64px]">
            Des mains, du cœur,
            <br />
            <Em>et un peu de poésie.</Em>
          </h2>

          <p className="mt-8 max-w-xl text-[19px] leading-8 text-ink-soft">
            Depuis 8 ans, Flora compose des bouquets pour dire merci, s’excuser, fêter ou aimer. Une
            rose, un coffret, un panier : chaque création est assemblée à la main.
          </p>
          <p className="mt-4 max-w-xl text-[17px] leading-8 text-ink-soft">
            8 ans de passion, de fleurs et de belles émotions… Merci de faire partie de cette
            aventure !
          </p>

          <blockquote className="mt-10 max-w-xl font-display text-[34px] italic leading-[1.15] text-bloom sm:text-[42px]">
            « La fleur juste, au bon endroit. »
          </blockquote>

          <Link href="/atelier" className={buttonClass("outline", "mt-10")}>
            Découvrir l’atelier
          </Link>
        </div>
      </Container>
    </section>
  );
}
