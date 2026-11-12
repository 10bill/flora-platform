import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Em } from "@/components/ui/Em";
import { Photo } from "@/components/ui/Photo";
import { occasions } from "@/lib/occasions";
import { site } from "@/lib/site";

export function OccasionsSection() {
  return (
    <section className="bg-sand py-16 sm:py-24 lg:py-32">
      <Container className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <div>
          <h2 className="max-w-lg font-display text-[34px] font-semibold leading-[0.98] sm:text-[52px] lg:text-[64px]">
            Il y a toujours
            <br />
            <Em>une belle raison.</Em>
          </h2>

          <ul className="mt-12">
            {occasions.map((occasion) => (
              <li key={occasion.slug} className="border-t-2 border-ink/90 last:border-b-2">
                <Link
                  href={`/bouquets?occasion=${occasion.slug}`}
                  className="group/link flex items-center justify-between gap-6 py-5 sm:py-6"
                >
                  <span className="font-display text-[28px] font-medium leading-tight transition-transform duration-300 group-hover/link:translate-x-2 sm:text-[36px]">
                    {occasion.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-ink text-[20px] transition group-hover/link:bg-bloom group-hover/link:border-bloom group-hover/link:text-white"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[420px] lg:mx-0 lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -bottom-5 -right-5 size-full rounded-4xl bg-sky"
          />
          <Photo
            src={site.occasionsImage}
            alt="Coffret de roses rouges, chocolats et Baileys"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="relative aspect-square rounded-4xl bg-peach"
          />
          <p className="absolute bottom-5 left-5 rounded-full bg-cream px-4 py-2 text-[15px] font-semibold">
            Roses, chocolats, Baileys
          </p>
        </div>
      </Container>
    </section>
  );
}
