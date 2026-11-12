import Link from "next/link";
import { buttonClass } from "@/components/ui/buttons";
import { Container } from "@/components/ui/Container";
import { Em } from "@/components/ui/Em";

export default function NotFound() {
  return (
    <section className="py-28">
      <Container className="text-center">
        <p className="text-[14px] text-clay">Erreur 404</p>
        <h1 className="mt-6 font-display text-[56px] font-medium leading-none sm:text-[88px]">
          Cette page a <Em>fané.</Em>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[17px] font-light leading-8 text-ink-soft">
          La page que vous cherchez n’existe plus ou n’a jamais fleuri.
        </p>
        <Link href="/" className={buttonClass("primary", "mt-10")}>
          Retour à l’accueil
        </Link>
      </Container>
    </section>
  );
}
