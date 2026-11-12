import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { buttonClass } from "@/components/ui/buttons";
import { Container } from "@/components/ui/Container";
import { Em } from "@/components/ui/Em";
import { PageHeader } from "@/components/ui/PageHeader";
import { faq } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description: "Livraison, délais, messages, entretien : les réponses à vos questions.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Questions fréquentes"
        title={
          <>
            Tout ce que vous <Em>voulez savoir.</Em>
          </>
        }
      />

      <section className="py-16">
        <Container className="max-w-3xl">
          <div>
            {faq.map((item) => (
              <details key={item.question} className="group border-b border-line py-6 first:border-t">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-[26px] leading-tight transition-colors hover:text-bloom [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-[20px] text-clay transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-[16px] font-light leading-8 text-ink-soft">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-16 rounded-3xl bg-sand p-8 text-center sm:p-12">
            <p className="font-display text-[32px] leading-tight">Une autre question ?</p>
            <Link href="/contact" className={buttonClass("primary", "mt-6")}>
              Nous écrire <Arrow />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
