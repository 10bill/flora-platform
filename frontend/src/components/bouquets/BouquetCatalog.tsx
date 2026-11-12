"use client";

import { useState } from "react";
import { useCatalog } from "@/components/catalog/CatalogProvider";
import { categoryFilters, type CategoryFilter } from "@/lib/bouquets";
import { occasions, type OccasionSlug } from "@/lib/occasions";
import { BouquetCard } from "./BouquetCard";

/** Catalogue filtrable : par catégorie, et par occasion (si on vient de la page Occasions). */
export function BouquetCatalog({
  initialCategory,
  initialOccasion,
}: {
  initialCategory: CategoryFilter;
  initialOccasion: OccasionSlug | null;
}) {
  const bouquets = useCatalog();
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [occasion, setOccasion] = useState<OccasionSlug | null>(initialOccasion);

  const visible = bouquets.filter(
    (bouquet) =>
      (category === "tous" || bouquet.category === category) &&
      (occasion === null || bouquet.occasions.includes(occasion)),
  );
  const occasionTitle = occasions.find((item) => item.slug === occasion)?.title;

  function reset() {
    setCategory("tous");
    setOccasion(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Filtrer les bouquets">
        {categoryFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            aria-pressed={category === filter.id}
            onClick={() => setCategory(filter.id)}
            className={`rounded-full border-2 px-5 py-2 text-[15px] font-semibold transition ${
              category === filter.id
                ? "border-ink bg-ink text-cream"
                : "border-ink/20 text-ink hover:border-ink"
            }`}
          >
            {filter.label}
          </button>
        ))}

        {occasionTitle && (
          <button
            type="button"
            onClick={() => setOccasion(null)}
            aria-label={`Retirer le filtre « ${occasionTitle} »`}
            className="inline-flex items-center gap-2 rounded-full border-2 border-bloom bg-sand px-5 py-2 text-[15px] font-semibold text-bloom transition hover:bg-white"
          >
            {occasionTitle}
            <span aria-hidden="true">✕</span>
          </button>
        )}
      </div>

      <p className="mt-6 text-[15px] text-ink-mute" role="status">
        {visible.length} bouquet{visible.length > 1 ? "s" : ""}
      </p>

      {visible.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-8">
          {visible.map((bouquet) => (
            <BouquetCard key={bouquet.slug} bouquet={bouquet} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-line-strong bg-sand/50 px-6 py-16 text-center">
          <p className="font-display text-[30px]">Aucun bouquet ne correspond.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 text-[15px] font-semibold text-bloom underline underline-offset-6 hover:text-ink"
          >
            Voir tous les bouquets
          </button>
        </div>
      )}
    </div>
  );
}
