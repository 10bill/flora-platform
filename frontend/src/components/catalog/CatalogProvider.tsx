"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Bouquet } from "@/lib/bouquets";

/**
 * Met la liste des produits (lue en base par le serveur) à disposition des composants
 * « client » : panier, filtres du catalogue…
 */
const CatalogContext = createContext<Bouquet[]>([]);

export function CatalogProvider({
  bouquets,
  children,
}: {
  bouquets: Bouquet[];
  children: ReactNode;
}) {
  return <CatalogContext.Provider value={bouquets}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): Bouquet[] {
  return useContext(CatalogContext);
}
