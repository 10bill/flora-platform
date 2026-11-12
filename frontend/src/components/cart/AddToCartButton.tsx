"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/buttons";
import { addToCart } from "./useCart";

const styles = {
  // Sur les cartes : apparaît au survol sur ordinateur, toujours visible sur mobile
  overlay:
    "absolute inset-x-2 bottom-2 rounded-full bg-ink py-2 text-[12px] font-semibold text-cream shadow-lg transition duration-300 hover:bg-bloom sm:inset-x-4 sm:bottom-4 sm:py-3 sm:text-[15px] md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100",
  // Sur la fiche d’un bouquet
  solid: buttonClass("primary", "w-full"),
} as const;

export function AddToCartButton({
  slug,
  title,
  variant = "overlay",
}: {
  slug: string;
  title: string;
  variant?: keyof typeof styles;
}) {
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart(slug);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Ajouter ${title} au panier`}
        className={styles[variant]}
      >
        {added ? "Ajouté ✓" : "Ajouter au panier"}
      </button>
      <span className="sr-only" role="status">
        {added ? `${title} ajouté au panier` : ""}
      </span>
    </>
  );
}
