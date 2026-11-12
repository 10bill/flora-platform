export type Category = "rose" | "coffret" | "bouquet";
export type OrderStatus = "nouvelle" | "confirmee" | "livree" | "annulee";

export const categoryLabels: Record<Category, string> = {
  rose: "La rose",
  coffret: "Coffrets cadeaux",
  bouquet: "Bouquets en couleurs",
};

export const occasionLabels: Record<string, string> = {
  amour: "Amour",
  anniversaire: "Anniversaire",
  "juste-comme-ca": "Juste comme ça",
  merci: "Merci",
};

export const statusLabels: Record<OrderStatus, string> = {
  nouvelle: "Nouvelle",
  confirmee: "Confirmée",
  livree: "Livrée",
  annulee: "Annulée",
};

export type Bouquet = {
  slug: string;
  title: string;
  description: string;
  details: string;
  price: number;
  oldPrice?: number;
  tag: string;
  category: Category;
  occasions: string[];
  flowers: string[];
  image: string;
  position: string;
  order: number;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  position: string;
  body: string[];
  published: boolean;
};

export type Order = {
  reference: string;
  customer: {
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
  items: { slug: string; title: string; qty: number; unitPrice: number }[];
  totals: { subtotal: number; delivery: number; total: number };
  createdAt: string;
  status: OrderStatus;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type Subscriber = { email: string; createdAt: string };

export type ImageInfo = {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  usedBy: string[];
};

export type Stats = {
  counts: {
    newOrders: number;
    totalOrders: number;
    unreadMessages: number;
    totalMessages: number;
    subscribers: number;
    products: number;
    articles: number;
    drafts: number;
    images: number;
  };
  recentOrders: Order[];
  recentMessages: Message[];
};
