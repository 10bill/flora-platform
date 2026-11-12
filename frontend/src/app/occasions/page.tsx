import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { buttonClass, textLink } from "@/components/ui/buttons";
import { Container } from "@/components/ui/Container";
import { Em } from "@/components/ui/Em";
import { PageHeader } from "@/components/ui/PageHeader";
import { getBouquets } from "@/lib/catalog";
import { occasions } from "@/lib/occasions";

export const metadata: Metadata = {
  title: "Occasions",
  description: "Anniversaire, remerciement, déclaration… trouvez le bouquet pour chaque occasion.",
};

export default async function OccasionsPage() {
  const bouquets = await getBouquets();

  return (
    <>
      <PageHeader
        eyebrow="Les fleurs ont leurs mots"
        title={
          <>
            Il y a toujours <Em>une belle raison.</Em>
          </>
        }
        intro="Choisissez l’occasion, nous vous montrons les bouquets qui lui ressemblent."
      />

      <section className="py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {occasions.map((occasion, index) => {
              const count = bouquets.filter((bouquet) =>
                bouquet.occasions.some((slug) => slug === occasion.slug),
              ).length;

              return (
                <Link
                  key={occasion.slug}
                  href={`/bouquets?occasion=${occasion.slug}`}
                  className="group/link flex min-h-60 flex-col justify-between rounded-3xl border border-line bg-sand/60 p-8 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_40px_rgba(110,64,55,0.1)]"
                >
                  <span className="font-display text-[44px] italic leading-none text-[#e3b5be] transition-colors group-hover/link:text-bloom">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-display text-[32px] font-medium leading-tight">
                      {occasion.title}
                    </h2>
                    <p className="mt-2 max-w-sm text-[15px] font-light leading-7 text-ink-soft">
                      {occasion.text}
                    </p>
                    <span className={`${textLink} mt-5`}>
                      {count} bouquet{count > 1 ? "s" : ""} <Arrow />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 rounded-4xl bg-ink px-8 py-14 text-center sm:px-16">
            <h2 className="font-display text-[36px] font-medium leading-tight text-[#f7eee8] sm:text-[46px]">
              Une occasion particulière ?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[16px] font-light leading-7 text-mist">
              Mariage, naissance, événement : racontez-nous votre histoire, nous composons sur
              mesure.
            </p>
            <Link href="/contact" className={buttonClass("light", "mt-8")}>
              Nous écrire <Arrow />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
