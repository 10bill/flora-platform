import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Container } from "@/components/ui/Container";
import { Em } from "@/components/ui/Em";

export function Newsletter() {
  return (
    <section className="bg-peach py-24 sm:py-28">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="font-display text-[42px] font-semibold leading-[1] sm:text-[58px]">
            Un peu de fleurs
            <br />
            <Em>dans votre boîte mail.</Em>
          </h2>
          <p className="mt-5 max-w-md text-[18px] leading-8 text-ink-soft">
            Les nouvelles créations et les offres de Flora, une fois par mois, sans spam.
          </p>
        </div>
        <NewsletterForm />
      </Container>
    </section>
  );
}
