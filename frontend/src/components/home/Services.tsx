import Link from "next/link";
import { buttonClass } from "@/components/ui/buttons";
import { Container } from "@/components/ui/Container";
import { Em } from "@/components/ui/Em";

const services = [
  {
    title: "Le coup de cœur",
    text: "Une composition qui surprend et séduit, choisie par notre fleuriste.",
  },
  {
    title: "Votre histoire, à vous",
    text: "Des fleurs pensées selon vos goûts, votre lieu et votre occasion.",
  },
  {
    title: "À votre rythme",
    text: "Commandez sur le site ou par WhatsApp, nous faisons le reste. Livraison gratuite les mardis et mercredis.",
  },
];

export function Services() {
  return (
    <section className="bg-sky py-16 text-cream sm:py-24 lg:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <h2 className="font-display text-[34px] font-semibold leading-[0.98] sm:text-[52px] lg:text-[64px]">
            De vos envies
            <br />
            <Em>à ses mains.</Em>
          </h2>
          <Link href="/faq" className={buttonClass("light")}>
            Questions fréquentes
          </Link>
        </div>

        <div className="mt-12 grid border-t-2 border-cream/40 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="border-b-2 border-cream/40 py-9 last:border-b-0 md:border-b-0 md:border-r-2 md:px-9 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <h3 className="font-display text-[32px] font-semibold leading-tight">
                {service.title}
              </h3>
              <p className="mt-4 text-[17px] leading-7 text-cream/90">{service.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
