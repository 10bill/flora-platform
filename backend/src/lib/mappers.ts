import type { Document, WithId } from "mongodb";
import {
  categories,
  occasionSlugs,
  orderStatuses,
  type Article,
  type Bouquet,
  type OccasionSlug,
  type OrderStatus,
} from "../types";

const str = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);
const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
const iso = (value: unknown) => (value ? new Date(value as Date).toISOString() : "");

/** Transforme un document MongoDB en objet propre (tolère les champs manquants). */
export function toBouquet(doc: Document): Bouquet {
  const category = str(doc.category);
  const oldPrice = typeof doc.oldPrice === "number" && doc.oldPrice > 0 ? doc.oldPrice : undefined;

  return {
    slug: str(doc.slug),
    title: str(doc.title),
    description: str(doc.description),
    details: str(doc.details, str(doc.description)),
    price: typeof doc.price === "number" ? doc.price : 0,
    ...(oldPrice ? { oldPrice } : {}),
    tag: str(doc.tag),
    category: categories.find((item) => item === category) ?? "bouquet",
    occasions: strings(doc.occasions).filter((item): item is OccasionSlug =>
      (occasionSlugs as readonly string[]).includes(item),
    ),
    flowers: strings(doc.flowers),
    image: str(doc.image),
    position: str(doc.position, "50% 50%"),
    order: typeof doc.order === "number" ? doc.order : 999,
  };
}

export function toArticle(doc: Document): Article {
  return {
    slug: str(doc.slug),
    title: str(doc.title),
    excerpt: str(doc.excerpt),
    date: str(doc.date),
    image: str(doc.image),
    position: str(doc.position, "50% 50%"),
    body: strings(doc.body),
    published: doc.published !== false,
  };
}

export function toOrder(doc: Document) {
  const status = str(doc.status);
  return {
    reference: str(doc.reference),
    customer: doc.customer ?? {},
    items: doc.items ?? [],
    totals: doc.totals ?? { subtotal: 0, delivery: 0, total: 0 },
    createdAt: iso(doc.createdAt),
    status: (orderStatuses.find((item) => item === status) ?? "nouvelle") as OrderStatus,
  };
}

export function toMessage(doc: WithId<Document>) {
  return {
    id: doc._id.toString(),
    name: str(doc.name),
    email: str(doc.email),
    subject: str(doc.subject),
    message: str(doc.message),
    createdAt: iso(doc.createdAt),
    read: doc.read === true,
  };
}
