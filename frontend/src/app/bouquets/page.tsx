import type { Metadata } from "next";
import { BouquetCatalog } from "@/components/bouquets/BouquetCatalog";
import { Container } from "@/components/ui/Container";
import { Em } from "@/components/ui/Em";
import { PageHeader } from "@/components/ui/PageHeader";
import { isCategoryFilter } from "@/lib/bouquets";
import { isOccasionSlug } from "@/lib/occasions";

export const metadata: Metadata = {
  title: "Bouquets",
  description: "Tous les bouquets Flora, composés à la main et livrés avec soin.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BouquetsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const categorie = first(params.categorie);
  const occasion = first(params.occasion);

  const initialCategory = isCategoryFilter(categorie) ? categorie : "tous";
  const initialOccasion = isOccasionSlug(occasion) ? occasion : null;

  return (
    <>
      <PageHeader
        eyebrow="Les créations Flora"
        title={
          <>
            Un bouquet, <Em>mille façons</Em> de dire.
          </>
        }
        intro="Des fleurs de caractère, des couleurs qui se répondent. Trouvez le bouquet qui vous ressemble."
      />

      <section className="py-16">
        <Container>
          {/* key : réinitialise les filtres quand l’adresse change (?categorie=… / ?occasion=…) */}
          <BouquetCatalog
            key={`${initialCategory}-${initialOccasion ?? "all"}`}
            initialCategory={initialCategory}
            initialOccasion={initialOccasion}
          />
        </Container>
      </section>
    </>
  );
}
