/**
 * Règles de livraison. ⚠️ Doivent rester identiques à celles du site (frontend/src/lib/site.ts),
 * qui les utilise pour afficher le total dans le panier. Le total officiel est celui calculé ici.
 */
const freeDeliveryFrom = 30000; // livraison offerte à partir de ce montant (F CFA)
const deliveryFee = 1000; // frais en dessous de ce montant (F CFA)
const freeDeliveryDays = [2, 3]; // mardi et mercredi (0 = dimanche)

/** Ouagadougou = UTC+0 sans changement d’heure : le jour UTC est le jour local. */
export function computeTotals(subtotal: number, date: Date = new Date()) {
  const free = subtotal === 0 || subtotal >= freeDeliveryFrom || freeDeliveryDays.includes(date.getUTCDay());
  const delivery = free ? 0 : deliveryFee;
  return { subtotal, delivery, total: subtotal + delivery };
}
