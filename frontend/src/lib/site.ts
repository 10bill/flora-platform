/**
 * Informations de la boutique, utilisées partout (footer, contact, FAQ, panier…).
 * Modifie les valeurs ici et tout le site est mis à jour.
 * ⚠️ À vérifier : numéros, e-mail, horaires et tarifs de livraison.
 */
export const site = {
  name: "Flora",
  tagline: "Votre fleuriste",
  city: "Ouagadougou",
  country: "Burkina Faso",
  email: "bonjour@flora.bf",
  phone: "+226 70 48 43 12",
  phoneSecondary: "+226 54 32 22 22",
  /** Numéro WhatsApp au format international, sans + ni espaces */
  whatsapp: "22670484312",
  address: "Ouagadougou, Burkina Faso",
  /** Boutiques et point de vente */
  locations: [
    { area: "Patte d’oie", name: "Boutique Flora_votrefleuriste" },
    { area: "Koulouba", name: "La Maison des fleurs" },
    { area: "Super U Zad", name: "Point de vente" },
  ],
  hours: [
    { days: "Lundi – Samedi", time: "8 h – 19 h" },
    { days: "Dimanche", time: "9 h – 13 h" },
  ],
  /** Livraison offerte à partir de ce montant (en F CFA) */
  freeDeliveryFrom: 30000,
  /** Frais de livraison en dessous de ce montant (en F CFA) */
  deliveryFee: 1000,
  /** Jours de livraison gratuite (0 = dimanche … 6 = samedi) : mardi et mercredi */
  freeDeliveryDays: [2, 3],
  /** Heure limite pour une livraison le jour même */
  sameDayCutoff: "14 h",
  /** Photo de la boutique (public/images) */
  facadeImage: "/images/facade-flora.jpg",
  /** Photo du hero (accueil) et de la section « Il y a toujours une belle raison » */
  heroImage: "/images/bouquet-soleil.jpg",
  occasionsImage: "/images/coffret-baileys.jpg",
  /** Offre des 8 ans */
  anniversary: {
    years: 8,
    price: 2000,
    oldPrice: 2500,
    period: "tout le mois de novembre",
  },
} as const;
