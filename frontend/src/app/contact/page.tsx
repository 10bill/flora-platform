import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Container } from "@/components/ui/Container";
import { Em } from "@/components/ui/Em";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question, une envie de bouquet sur mesure ? Écrivez à Flora.",
};

const label = "text-[14px] font-medium text-clay";

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Parlons fleurs"
        title={
          <>
            Une question, <Em>une envie ?</Em>
          </>
        }
        intro="Écrivez-nous : bouquet sur mesure, mariage, événement ou simple renseignement."
      />

      <section className="py-16">
        <Container className="grid items-start gap-14 lg:grid-cols-[1.3fr_0.7fr]">
          <ContactForm />

          <aside className="space-y-8 rounded-3xl border border-line bg-sand/60 p-8">
            <div>
              <h2 className={label}>E-mail</h2>
              <a
                href={`mailto:${site.email}`}
                className="mt-2 block font-display text-[26px] transition hover:text-bloom"
              >
                {site.email}
              </a>
            </div>
            <div>
              <h2 className={label}>Téléphone</h2>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="mt-2 block font-display text-[26px] transition hover:text-bloom"
              >
                {site.phone}
              </a>
            </div>
            <div>
              <h2 className={label}>L’atelier</h2>
              <p className="mt-2 text-[16px] font-light leading-7 text-ink-soft">{site.address}</p>
            </div>
            <div>
              <h2 className={label}>Horaires</h2>
              <ul className="mt-2 space-y-1 text-[16px] font-light text-ink-soft">
                {site.hours.map((slot) => (
                  <li key={slot.days}>
                    {slot.days} : {slot.time}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
