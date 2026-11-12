import type { Article, Bouquet } from "../types";

/**
 * Données de départ : copiées dans MongoDB une seule fois, au tout premier lancement
 * (si les collections sont vides). Ensuite, tout se gère depuis l’admin.
 * Les photos « /images/… » sont des fichiers du dossier public/ du site.
 */

const photos = {
  rose: "/images/rose-rouge.jpg",
  coffret: "/images/coffret-baileys.jpg",
  soleil: "/images/bouquet-soleil.jpg",
};

export const seedBouquets: Omit<Bouquet, "order">[] = [
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

export const seedArticles: Omit<Article, "published">[] = [
  {
    slug: "dahlias-automne",
    title: "Pourquoi les dahlias font l’automne",
    excerpt:
      "Corolles généreuses, teintes cuivrées : le dahlia est la fleur qui annonce la saison chaude.",
    date: "2026-10-12",
    image: "/images/bouquet-soleil.jpg",
    position: "50% 40%",
    body: [
      "Les dahlias fleurissent de la fin de l’été jusqu’aux premières gelées. Leurs corolles généreuses, du rose poudré au rouge brique, donnent aux bouquets d’octobre cette chaleur que l’on cherche en rentrant du froid.",
      "À l’atelier, nous les associons à des feuillages profonds et à quelques fleurs plus légères pour garder de l’air dans la composition. Un seul dahlia suffit parfois à porter tout un bouquet.",
      "Un conseil : coupez les tiges en biais, changez l’eau tous les deux jours et gardez le vase à l’abri du soleil direct. Les dahlias sont fragiles, mais ils récompensent les petites attentions.",
    ],
  },
  {
    slug: "faire-durer-son-bouquet",
    title: "Comment faire durer son bouquet",
    excerpt: "Quelques gestes simples pour profiter plus longtemps de vos fleurs.",
    date: "2026-09-28",
    image: "/images/rose-rouge.jpg",
    position: "50% 50%",
    body: [
      "Dès que vous recevez votre bouquet, recoupez chaque tige en biais, d’un ou deux centimètres, avec un couteau bien aiguisé. Une tige fraîchement coupée boit mieux.",
      "Retirez toutes les feuilles qui trempent dans l’eau : elles se décomposent vite et fatiguent les fleurs. Changez ensuite l’eau tous les deux jours, et rincez le vase.",
      "Enfin, choisissez un endroit frais, loin du soleil direct, des radiateurs et de la corbeille de fruits : certains fruits dégagent un gaz qui fait faner les fleurs plus vite.",
    ],
  },
  {
    slug: "offrir-des-fleurs",
    title: "Offrir des fleurs : le bon geste selon l’occasion",
    excerpt: "Anniversaire, remerciement, déclaration… comment choisir sans se tromper.",
    date: "2026-09-10",
    image: "/images/coffret-baileys.jpg",
    position: "50% 60%",
    body: [
      "Pour un anniversaire, osez la couleur : des teintes franches et généreuses, qui font de l’effet dès l’ouverture du papier.",
      "Pour un remerciement, préférez la douceur et un format plus discret. L’important est le geste, pas la taille du bouquet.",
      "Et pour une déclaration, laissez parler la chaleur des tons rouges et cuivrés. Quant au « juste comme ça », c’est peut-être le plus beau des prétextes : une surprise un mardi ordinaire change une journée.",
    ],
  },
];
