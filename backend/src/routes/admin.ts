import { ObjectId } from "mongodb";
import { Router, type Response } from "express";
import multer from "multer";
import { getDb } from "../db";
import { deleteImage, IMAGE_TYPES, listImages, MAX_IMAGE, saveImage } from "../lib/images";
import { toArticle, toBouquet, toMessage, toOrder } from "../lib/mappers";
import { triggerRevalidate } from "../lib/revalidate";
import { isObject, slugify, text } from "../lib/validation";
import { passwordMatches, requireAdmin, signAdminToken } from "../middleware/auth";
import { rateLimit } from "../middleware/rateLimit";
import { categories, occasionSlugs, orderStatuses, type Category, type OccasionSlug, type OrderStatus } from "../types";

export const adminRouter = Router();

const fail = (res: Response, status: number, error: string): void => {
  res.status(status).json({ error });
};

// ------------------------------------------------------------------ connexion

adminRouter.post("/login", rateLimit("login", 10, 15 * 60 * 1000), async (req, res) => {
  const password = isObject(req.body) ? text(req.body.password, 200) : "";

  if (!password || !passwordMatches(password)) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // freine les essais en rafale
    return fail(res, 401, "Mot de passe incorrect.");
  }
  res.json({ token: signAdminToken() });
});

// Tout ce qui suit exige d’être connecté
adminRouter.use(requireAdmin);

adminRouter.get("/me", (_req, res) => {
  res.json({ ok: true });
});

// ------------------------------------------------------------ tableau de bord

adminRouter.get("/stats", async (_req, res) => {
  const db = getDb();
  const count = (name: string, filter: Record<string, unknown> = {}) => db.collection(name).countDocuments(filter);

  const [newOrders, totalOrders, unreadMessages, totalMessages, subscribers, products, articles, drafts, images, recentOrders, recentMessages] =
    await Promise.all([
      count("orders", { status: { $in: ["nouvelle", null] } }),
      count("orders"),
      count("messages", { read: { $ne: true } }),
      count("messages"),
      count("subscribers"),
      count("bouquets"),
      count("articles"),
      count("articles", { published: false }),
      count("images"),
      db.collection("orders").find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(5).toArray(),
      db.collection("messages").find({}).sort({ createdAt: -1 }).limit(3).toArray(),
    ]);

  res.json({
    counts: { newOrders, totalOrders, unreadMessages, totalMessages, subscribers, products, articles, drafts, images },
    recentOrders: recentOrders.map(toOrder),
    recentMessages: recentMessages.map(toMessage),
  });
});

// ------------------------------------------------------------------- commandes

adminRouter.get("/orders", async (_req, res) => {
  const docs = await getDb().collection("orders").find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(500).toArray();
  res.json(docs.map(toOrder));
});

adminRouter.patch("/orders/:reference", async (req, res) => {
  const status = isObject(req.body) ? text(req.body.status, 20) : "";
  if (!orderStatuses.includes(status as OrderStatus)) return fail(res, 400, "Statut invalide.");

  const result = await getDb().collection("orders").updateOne({ reference: req.params.reference }, { $set: { status } });
  if (result.matchedCount === 0) return fail(res, 404, "Commande introuvable.");
  res.json({ ok: true });
});

// -------------------------------------------------------------------- messages

adminRouter.get("/messages", async (_req, res) => {
  const docs = await getDb().collection("messages").find({}).sort({ createdAt: -1 }).limit(500).toArray();
  res.json(docs.map(toMessage));
});

adminRouter.patch("/messages/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return fail(res, 404, "Message introuvable.");
  if (!isObject(req.body) || typeof req.body.read !== "boolean") return fail(res, 400, "Requête invalide.");

  await getDb().collection("messages").updateOne({ _id: new ObjectId(req.params.id) }, { $set: { read: req.body.read } });
  res.json({ ok: true });
});

adminRouter.delete("/messages/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return fail(res, 404, "Message introuvable.");
  await getDb().collection("messages").deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ ok: true });
});

// --------------------------------------------------------------------- abonnés

adminRouter.get("/subscribers", async (_req, res) => {
  const docs = await getDb().collection("subscribers").find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(5000).toArray();
  res.json(docs.map((doc) => ({ email: String(doc.email ?? ""), createdAt: doc.createdAt ? new Date(doc.createdAt as Date).toISOString() : "" })));
});

adminRouter.delete("/subscribers", async (req, res) => {
  const email = isObject(req.body) ? text(req.body.email, 254).toLowerCase() : "";
  if (!email) return fail(res, 400, "Adresse manquante.");
  await getDb().collection("subscribers").deleteOne({ email });
  res.json({ ok: true });
});

// ---------------------------------------------------------------------- images

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE, files: 10 },
  fileFilter: (_req, file, callback) => {
    if (IMAGE_TYPES.includes(file.mimetype)) callback(null, true);
    else callback(new Error("TYPE_IMAGE"));
  },
});

adminRouter.get("/images", async (_req, res) => {
  res.json(await listImages());
});

adminRouter.post("/images", upload.array("images", 10), async (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];
  if (files.length === 0) return fail(res, 400, "Choisis au moins une photo.");

  const urls: string[] = [];
  for (const file of files) urls.push(await saveImage(file));
  res.json({ urls });
});

adminRouter.delete("/images/:id", async (req, res) => {
  const result = await deleteImage(req.params.id);
  if (result.error) return fail(res, 409, result.error);
  res.json({ ok: true });
});

// --------------------------------------------------------------------- produits

type Parsed<T> = { error: string } | { doc: T };

function parseBouquet(body: unknown): Parsed<Record<string, unknown>> {
  if (!isObject(body)) return { error: "Requête invalide." };

  const title = text(body.title, 120);
  if (!title) return { error: "Le nom du produit est obligatoire." };

  const slug = slugify(text(body.slug, 80) || title);
  if (!slug) return { error: "L’adresse de la fiche est invalide." };

  const price = Number(body.price);
  if (!Number.isInteger(price) || price <= 0) return { error: "Le prix doit être un nombre entier, ex. 2000." };

  const oldPrice = body.oldPrice === null || body.oldPrice === "" || body.oldPrice === undefined ? undefined : Number(body.oldPrice);
  if (oldPrice !== undefined && (!Number.isInteger(oldPrice) || oldPrice <= 0)) {
    return { error: "L’ancien prix doit être un nombre entier, ou rester vide." };
  }

  const category = text(body.category, 20);
  if (!categories.includes(category as Category)) return { error: "Choisis une catégorie." };

  const description = text(body.description, 200);
  if (!description) return { error: "Ajoute une phrase courte de description." };

  const image = text(body.image, 300);
  if (!image.startsWith("/")) return { error: "Ajoute une photo." };

  const position = text(body.position, 20);
  const order = Number(body.order);
  const rawOccasions: unknown[] = Array.isArray(body.occasions) ? body.occasions : [];
  const rawFlowers: unknown[] = Array.isArray(body.flowers) ? body.flowers : [];

  return {
    doc: {
      slug,
      title,
      description,
      details: text(body.details, 2000) || description,
      price,
      ...(oldPrice !== undefined ? { oldPrice } : {}),
      tag: text(body.tag, 40),
      category,
      occasions: rawOccasions.filter((item): item is OccasionSlug => (occasionSlugs as readonly string[]).includes(String(item))),
      flowers: rawFlowers.map((item) => text(item, 60)).filter(Boolean).slice(0, 30),
      image,
      position: /^\d{1,3}% \d{1,3}%$/.test(position) ? position : "50% 50%",
      order: Number.isFinite(order) ? order : 999,
    },
  };
}

adminRouter.get("/bouquets", async (_req, res) => {
  const docs = await getDb().collection("bouquets").find({}, { projection: { _id: 0 } }).sort({ order: 1 }).toArray();
  res.json(docs.map(toBouquet));
});

adminRouter.post("/bouquets", async (req, res) => {
  const parsed = parseBouquet(req.body);
  if ("error" in parsed) return fail(res, 400, parsed.error);

  const collection = getDb().collection("bouquets");
  if (await collection.findOne({ slug: parsed.doc.slug })) {
    return fail(res, 409, "Une fiche utilise déjà cette adresse. Change le nom ou l’adresse.");
  }

  await collection.insertOne(parsed.doc);
  triggerRevalidate();
  res.status(201).json({ ok: true, slug: parsed.doc.slug });
});

adminRouter.put("/bouquets/:slug", async (req, res) => {
  const parsed = parseBouquet(req.body);
  if ("error" in parsed) return fail(res, 400, parsed.error);

  const original = req.params.slug;
  const collection = getDb().collection("bouquets");

  if (parsed.doc.slug !== original && (await collection.findOne({ slug: parsed.doc.slug }))) {
    return fail(res, 409, "Une fiche utilise déjà cette adresse. Change le nom ou l’adresse.");
  }

  const update =
    "oldPrice" in parsed.doc ? { $set: parsed.doc } : { $set: parsed.doc, $unset: { oldPrice: "" as const } };

  const result = await collection.updateOne({ slug: original }, update);
  if (result.matchedCount === 0) return fail(res, 404, "Produit introuvable.");

  triggerRevalidate();
  res.json({ ok: true, slug: parsed.doc.slug });
});

adminRouter.delete("/bouquets/:slug", async (req, res) => {
  await getDb().collection("bouquets").deleteOne({ slug: req.params.slug });
  triggerRevalidate();
  res.json({ ok: true });
});

// ---------------------------------------------------------------------- journal

function parseArticle(body: unknown): Parsed<Record<string, unknown>> {
  if (!isObject(body)) return { error: "Requête invalide." };

  const title = text(body.title, 140);
  if (!title) return { error: "Le titre est obligatoire." };

  const slug = slugify(text(body.slug, 80) || title);
  if (!slug) return { error: "L’adresse de l’article est invalide." };

  const excerpt = text(body.excerpt, 300);
  if (!excerpt) return { error: "Ajoute une phrase de résumé." };

  const date = text(body.date, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "La date est invalide." };

  const rawBody: unknown[] = Array.isArray(body.body) ? body.body : [];
  const paragraphs = rawBody.map((item) => text(item, 5000)).filter(Boolean).slice(0, 100);
  if (paragraphs.length === 0) return { error: "Écris le texte de l’article." };

  const image = text(body.image, 300);
  if (!image.startsWith("/")) return { error: "Ajoute une photo." };

  const position = text(body.position, 20);

  return {
    doc: {
      slug,
      title,
      excerpt,
      date,
      body: paragraphs,
      image,
      position: /^\d{1,3}% \d{1,3}%$/.test(position) ? position : "50% 50%",
      published: body.published !== false,
    },
  };
}

adminRouter.get("/articles", async (_req, res) => {
  const docs = await getDb().collection("articles").find({}, { projection: { _id: 0 } }).sort({ date: -1 }).toArray();
  res.json(docs.map(toArticle));
});

adminRouter.post("/articles", async (req, res) => {
  const parsed = parseArticle(req.body);
  if ("error" in parsed) return fail(res, 400, parsed.error);

  const collection = getDb().collection("articles");
  if (await collection.findOne({ slug: parsed.doc.slug })) {
    return fail(res, 409, "Un article utilise déjà cette adresse. Change le titre ou l’adresse.");
  }

  await collection.insertOne(parsed.doc);
  triggerRevalidate();
  res.status(201).json({ ok: true, slug: parsed.doc.slug });
});

adminRouter.put("/articles/:slug", async (req, res) => {
  const parsed = parseArticle(req.body);
  if ("error" in parsed) return fail(res, 400, parsed.error);

  const original = req.params.slug;
  const collection = getDb().collection("articles");

  if (parsed.doc.slug !== original && (await collection.findOne({ slug: parsed.doc.slug }))) {
    return fail(res, 409, "Un article utilise déjà cette adresse. Change le titre ou l’adresse.");
  }

  const result = await collection.updateOne({ slug: original }, { $set: parsed.doc });
  if (result.matchedCount === 0) return fail(res, 404, "Article introuvable.");

  triggerRevalidate();
  res.json({ ok: true, slug: parsed.doc.slug });
});

adminRouter.delete("/articles/:slug", async (req, res) => {
  await getDb().collection("articles").deleteOne({ slug: req.params.slug });
  triggerRevalidate();
  res.json({ ok: true });
});
