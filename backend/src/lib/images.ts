import { Binary, ObjectId } from "mongodb";
import { getDb } from "../db";

export const MAX_IMAGE = 4 * 1024 * 1024; // 4 Mo
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const PREFIX = "/api/images/";

export type ImageInfo = {
  id: string;
  /** Adresse relative : /api/images/… (le site et l’admin la complètent avec leur adresse d’API) */
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  /** Où la photo est utilisée */
  usedBy: string[];
};

export async function saveImage(file: { originalname: string; mimetype: string; size: number; buffer: Buffer }) {
  const { insertedId } = await getDb()
    .collection("images")
    .insertOne({
      data: new Binary(file.buffer),
      type: file.mimetype,
      name: Buffer.from(file.originalname, "latin1").toString("utf8").slice(0, 120),
      size: file.size,
      createdAt: new Date(),
    });
  return `${PREFIX}${insertedId.toString()}`;
}

export async function listImages(): Promise<ImageInfo[]> {
  const db = getDb();
  const [docs, bouquets, articles] = await Promise.all([
    db.collection("images").find({}, { projection: { data: 0 } }).sort({ createdAt: -1 }).toArray(),
    db.collection("bouquets").find({}, { projection: { title: 1, image: 1 } }).toArray(),
    db.collection("articles").find({}, { projection: { title: 1, image: 1 } }).toArray(),
  ]);

  const usage = new Map<string, string[]>();
  const add = (image: unknown, label: string) => {
    if (typeof image !== "string" || !image.startsWith(PREFIX)) return;
    usage.set(image, [...(usage.get(image) ?? []), label]);
  };
  for (const doc of bouquets) add(doc.image, `Produit : ${String(doc.title ?? "")}`);
  for (const doc of articles) add(doc.image, `Journal : ${String(doc.title ?? "")}`);

  return docs.map((doc) => {
    const url = `${PREFIX}${doc._id.toString()}`;
    return {
      id: doc._id.toString(),
      url,
      name: typeof doc.name === "string" && doc.name ? doc.name : "Photo sans nom",
      type: typeof doc.type === "string" ? doc.type : "image/jpeg",
      size: typeof doc.size === "number" ? doc.size : 0,
      createdAt: doc.createdAt ? new Date(doc.createdAt as Date).toISOString() : "",
      usedBy: usage.get(url) ?? [],
    };
  });
}

/** Supprime une photo, sauf si un produit ou un article l’utilise encore. */
export async function deleteImage(id: string): Promise<{ error?: string }> {
  if (!ObjectId.isValid(id)) return { error: "Photo introuvable." };

  const url = `${PREFIX}${id}`;
  const db = getDb();
  const [product, article] = await Promise.all([
    db.collection("bouquets").findOne({ image: url }, { projection: { title: 1 } }),
    db.collection("articles").findOne({ image: url }, { projection: { title: 1 } }),
  ]);

  const user = product?.title ?? article?.title;
  if (user) return { error: `Cette photo est utilisée par « ${String(user)} ». Change d’abord sa photo.` };

  await db.collection("images").deleteOne({ _id: new ObjectId(id) });
  return {};
}
