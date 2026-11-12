import { site } from "./site";

/**
 * Livraison gratuite les mardis et mercredis (Ouagadougou = UTC+0, sans changement d’heure :
 * le jour UTC est donc le jour local, côté navigateur comme côté serveur).
 */
export function isFreeDeliveryDay(date: Date = new Date()): boolean {
  return (site.freeDeliveryDays as readonly number[]).includes(date.getUTCDay());
}

/**
 * Calcule la livraison et le total à partir du sous-total.
 * Utilisé côté navigateur (panier) ET côté serveur (API commandes),
 * pour que les deux donnent toujours le même résultat.
 */
export function computeTotals(subtotal: number, date: Date = new Date()) {
  const free = subtotal === 0 || subtotal >= site.freeDeliveryFrom || isFreeDeliveryDay(date);
  const delivery = free ? 0 : site.deliveryFee;

  return { subtotal, delivery, total: subtotal + delivery };
}
