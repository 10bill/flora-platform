import { apiGet } from "./backend";
import { seedBouquets, type Bouquet } from "./bouquets";

/**
 * Tous les produits, dans l'ordre d'affichage, depuis l'API.
 * Si l'API est injoignable : la liste de secours de lib/bouquets.ts.
 */
export async function getBouquets(): Promise<Bouquet[]> {
  return (await apiGet<Bouquet[]>("/api/bouquets")) ?? seedBouquets;
}

export async function getBouquet(slug: string): Promise<Bouquet | undefined> {
  return (await getBouquets()).find((bouquet) => bouquet.slug === slug);
}
