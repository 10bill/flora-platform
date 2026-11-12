export type Category = "rose" | "coffret" | "bouquet";
export const categories: Category[] = ["rose", "coffret", "bouquet"];

export const occasionSlugs = ["amour", "anniversaire", "juste-comme-ca", "merci"] as const;
export type OccasionSlug = (typeof occasionSlugs)[number];

export type Bouquet = {
  slug: string;
  title: string;
  description: string;
  details: string;
  /** Prix en F CFA */
  price: number;
  oldPrice?: number;
  tag: string;
  category: Category;
  occasions: OccasionSlug[];
  flowers: string[];
  image: string;
  position: string;
  order: number;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  /** AAAA-MM-JJ */
  date: string;
  image: string;
  position: string;
  body: string[];
  published: boolean;
};

export type OrderStatus = "nouvelle" | "confirmee" | "livree" | "annulee";
export const orderStatuses: OrderStatus[] = ["nouvelle", "confirmee", "livree", "annulee"];

export type OrderCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  landmark: string;
  deliveryDate: string;
  cardMessage: string;
};
export type OrderItem = { slug: string; title: string; qty: number; unitPrice: number };
export type NewOrder = {
  reference: string;
  customer: OrderCustomer;
  items: OrderItem[];
  totals: { subtotal: number; delivery: number; total: number };
};
export type NewMessage = { name: string; email: string; subject: string; message: string };
