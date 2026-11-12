import type { OccasionSlug } from "./occasions";

export type Category = "rose" | "coffret" | "bouquet";
export type CategoryFilter = "tous" | Category;

export const categoryFilters: { id: CategoryFilter; label: string }[] = [
  { id: "tous", label: "Tous les bouquets" },
  { id: "rose", label: "La rose" },
  { id: "coffret", label: "Coffrets cadeaux" },
  { id: "bouquet", label: "Bouquets en couleurs" },
];

export function isCategoryFilter(value: string | undefined): value is CategoryFilter {
  return categoryFilters.some((filter) => filter.id === value);
}

export type Bouquet = {
  slug: string;
  title: string;
  /** Phrase courte affichée sur les cartes */
  description: string;
  /** Texte plus long affiché sur la fiche du bouquet */
  details: string;
  /** Prix en F CFA */
  price: number;
  /** Ancien prix en F CFA (affiché barré pendant une offre) */
  oldPrice?: number;
  tag: string;
  category: Category;
  occasions: OccasionSlug[];
  flowers: string[];
  image: string;
  /** Cadrage de la photo (object-position CSS) */
  position: string;
};

// ⚠️ Photos : fichiers du dossier public/images. Remplace-les par tes photos d’origine
// (même nom de fichier, ou change le chemin ci-dessous).
const photos = {
  rose: "/images/rose-rouge.jpg",
  coffret: "/images/coffret-baileys.jpg",
  soleil: "/images/bouquet-soleil.jpg",
};

// Produits de SECOURS : le site affiche normalement les produits venant de l'API (gérés dans l'admin).
// Cette liste ne sert que si l'API est injoignable. Les produits de départ de la base sont dans
// backend/src/data/seed.ts.
export const seedBouquets: Bouquet[] = [
  {
    slug: "la-rose-rouge",
    title: "La rose rouge",
    description: "La rose à l’unité, à offrir seule ou à composer en bouquet",
    details:
      "La rose rouge, tout simplement : un geste qui dit tout. À offrir seule pour une attention sincère, ou à composer en bouquet avec les fleurs de votre choix. Pendant les 8 ans de Flora, elle est à prix doux.",
    price: 2000,
    oldPrice: 2500,
    tag: "Prix des 8 ans",
    category: "rose",
    occasions: ["amour", "juste-comme-ca", "anniversaire"],
    flowers: ["Rose rouge", "Gypsophile"],
    image: photos.rose,
    position: "50% 50%",
  },
  {
    slug: "coffret-baileys-roses",
    title: "Coffret Baileys & roses",
    description: "Roses rouges, chocolats et Baileys dans un coffret rond",
    details:
      "Un coffret cadeau pensé pour marquer le coup : des roses rouges, des chocolats dorés et une bouteille de Baileys, réunis dans un coffret rond et délicat. Idéal pour un anniversaire, une déclaration ou un grand merci.",
    price: 35000,
    tag: "Coffret cadeau",
    category: "coffret",
    occasions: ["anniversaire", "amour", "merci"],
    flowers: ["Roses rouges", "Gypsophile", "Chocolats", "Baileys"],
    image: photos.coffret,
    position: "50% 50%",
  },
  {
    slug: "bouquet-soleil",
    title: "Bouquet soleil",
    description: "Gerberas, marguerites et roses dans un papier pêche",
    details:
      "Un bouquet lumineux et joyeux : gerberas orangés, marguerites, roses et petites fleurs blanches, enveloppés dans un papier pêche. Il met de la couleur partout où il passe.",
    price: 20000,
    tag: "Tout en couleurs",
    category: "bouquet",
    occasions: ["anniversaire", "merci", "juste-comme-ca"],
    flowers: ["Gerberas", "Marguerites", "Roses", "Gypsophile"],
    image: photos.soleil,
    position: "50% 60%",
  },
];

export function isCategory(value: string): value is Category {
  return value === "rose" || value === "coffret" || value === "bouquet";
}
