import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { buttonClass } from "@/components/ui/buttons";
import { Container } from "@/components/ui/Container";
import { Em } from "@/components/ui/Em";
import { PageHeader } from "@/components/ui/PageHeader";
import { Photo } from "@/components/ui/Photo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "L’atelier",
  description: "Découvrez l’atelier Flora : des bouquets composés à la main, au rythme des saisons.",
};

const values = [
  {
    id: "01",
    title: "Au rythme des saisons",
    text: "Nous choisissons les fleurs du moment : elles sont plus belles, plus fraîches et durent plus longtemps.",
  },
  {
    id: "02",
    title: "Composé à la main",
    text: "Chaque bouquet est assemblé avec attention, selon ce que les fleurs ont de mieux à offrir.",
  },
  {
    id: "03",
    title: "Livré avec soin",
    text: "Un emballage pensé pour le trajet, et votre message transmis tel que vous l’avez écrit.",
  },
];

export default function AtelierPage() {
  return (
    <>
      <PageHeader
        eyebrow="Derrière chaque bouquet"
        title={
          <>
            Des mains, du cœur, <Em>et un peu de poésie.</Em>
          </>
        }
      />

      <section className="py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="relative">
            <Photo
              src={site.facadeImage}
              alt="Façade de la boutique Flora"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="min-h-72 rounded-4xl sm:min-h-96 lg:min-h-120 border border-line bg-[#ddd3ca]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 -z-10 size-full rounded-4xl border border-dashed border-line-strong"
            />
          </div>

          <div>
            <p className="text-[19px] font-light leading-9 text-ink-soft">
              Chez Flora, nous aimons les fleurs pour ce qu’elles disent. Une nuance délicate, une
              touche inattendue, un bouquet qui laisse un souvenir.
            </p>
            <p className="mt-5 text-[17px] font-light leading-8 text-ink-soft">
              À l’atelier, nous composons au rythme des saisons, avec des fleurs fraîches, de la
              couleur et une vraie attention au détail. Chaque bouquet est assemblé à la main, un
              par un, avant de partir à la rencontre de celle ou celui qui le recevra.
            </p>
            <blockquote className="mt-9 border-l-2 border-bloom pl-6 font-display text-[32px] italic leading-[1.3]">
              « La fleur juste, au bon endroit. »
            </blockquote>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-sand py-20">
        <Container>
          <h2 className="mb-12 font-display text-[40px] font-medium leading-none sm:text-[52px]">
            Nos engagements
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.id} className="rounded-3xl border border-line bg-cream p-8">
                <div className="font-display text-[44px] italic leading-none text-[#e3b5be]">
                  {value.id}
                </div>
                <h3 className="mt-6 font-display text-[28px] font-medium leading-tight">
                  {value.title}
                </h3>
                <p className="mt-3 text-[15px] font-light leading-7 text-ink-soft">{value.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="text-center">
          <h2 className="font-display text-[40px] font-medium leading-tight sm:text-[52px]">
            Envie de <Em>fleurs ?</Em>
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/bouquets" className={buttonClass("primary")}>
              Découvrir les bouquets <Arrow />
            </Link>
            <Link href="/contact" className={buttonClass("outline")}>
              Nous écrire
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
