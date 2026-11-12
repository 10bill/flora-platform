export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  /** Date ISO : AAAA-MM-JJ */
  date: string;
  image: string;
  position: string;
  /** Paragraphes de l’article */
  body: string[];
  /** false = brouillon, invisible sur le site (par défaut : publié) */
  published?: boolean;
};

// ⚠️ Articles d’exemple : à réécrire avec la vraie voix de Flora.
// Articles de SECOURS : le site affiche normalement ceux de l'API (gérés dans l'admin).
// Cette liste ne sert que si l'API est injoignable. Les articles de départ de la base sont dans
// backend/src/data/seed.ts.
export const seedArticles: Article[] = [
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
