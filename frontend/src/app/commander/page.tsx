import type { Metadata } from "next";
import { Checkout } from "@/components/cart/Checkout";
import { Container } from "@/components/ui/Container";
import { Em } from "@/components/ui/Em";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Commander",
  description: "Votre panier et la commande de vos bouquets.",
};

export default function CommanderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Votre commande"
        title={
          <>
            Plus qu’<Em>un pas</Em> avant les fleurs.
          </>
        }
      />

      <section className="py-16">
        <Container>
          <Checkout />
        </Container>
      </section>
    </>
  );
}
