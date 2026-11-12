import { ObjectId, type Binary } from "mongodb";
import { Router, type Response } from "express";
import { getDb } from "../db";
import { toArticle, toBouquet } from "../lib/mappers";
import { notifyNewMessage, notifyNewOrder } from "../lib/notify";
import { computeTotals } from "../lib/pricing";
import { isEmail, isObject, text } from "../lib/validation";
import { rateLimit } from "../middleware/rateLimit";
import type { NewOrder, OrderItem } from "../types";

export const publicRouter = Router();

const fail = (res: Response, status: number, error: string): void => {
  res.status(status).json({ error });
};

// ------------------------------------------------------------------ catalogue

publicRouter.get("/bouquets", async (_req, res) => {
  const docs = await getDb().collection("bouquets").find({}, { projection: { _id: 0 } }).sort({ order: 1 }).toArray();
  res.json(docs.map(toBouquet));
});

publicRouter.get("/bouquets/:slug", async (req, res) => {
  const doc = await getDb().collection("bouquets").findOne({ slug: req.params.slug }, { projection: { _id: 0 } });
  if (!doc) return fail(res, 404, "Produit introuvable.");
  res.json(toBouquet(doc));
});

// -------------------------------------------------------------------- journal

publicRouter.get("/articles", async (_req, res) => {
  const docs = await getDb()
    .collection("articles")
    .find({ published: { $ne: false } }, { projection: { _id: 0 } })
    .sort({ date: -1 })
    .toArray();
  res.json(docs.map(toArticle));
});

publicRouter.get("/articles/:slug", async (req, res) => {
  const doc = await getDb()
    .collection("articles")
    .findOne({ slug: req.params.slug, published: { $ne: false } }, { projection: { _id: 0 } });
  if (!doc) return fail(res, 404, "Article introuvable.");
  res.json(toArticle(doc));
});

// --------------------------------------------------------------------- images

publicRouter.get("/images/:id", async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return fail(res, 404, "Introuvable.");

  const doc = await getDb().collection("images").findOne({ _id: new ObjectId(id) });
  if (!doc) return fail(res, 404, "Introuvable.");

  res.set({
    "Content-Type": typeof doc.type === "string" ? doc.type : "image/jpeg",
    "Cache-Control": "public, max-age=31536000, immutable",
  });
  res.send(Buffer.from((doc.data as Binary).buffer));
});

// ------------------------------------------------------------------- commandes

publicRouter.post("/orders", rateLimit("orders", 10, 10 * 60 * 1000), async (req, res) => {
  if (!isObject(req.body)) return fail(res, 400, "Requête invalide.");

  const c = isObject(req.body.customer) ? req.body.customer : {};
  const customer = {
    firstName: text(c.firstName, 80),
    lastName: text(c.lastName, 80),
    email: text(c.email, 254),
    phone: text(c.phone, 30),
    address: text(c.address, 200),
    district: text(c.district, 80),
    landmark: text(c.landmark, 200),
    deliveryDate: text(c.deliveryDate, 10),
    cardMessage: text(c.cardMessage, 400),
  };

  const required = [customer.firstName, customer.lastName, customer.phone, customer.address, customer.district, customer.deliveryDate];
  if (required.some((value) => value === "")) return fail(res, 400, "Merci de remplir tous les champs obligatoires.");
  if (customer.email !== "" && !isEmail(customer.email)) return fail(res, 400, "Adresse e-mail invalide.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(customer.deliveryDate)) return fail(res, 400, "Date de livraison invalide.");

  const rawLines: unknown[] = Array.isArray(req.body.lines) ? req.body.lines : [];
  if (rawLines.length === 0) return fail(res, 400, "Votre panier est vide.");
  if (rawLines.length > 50) return fail(res, 400, "Panier invalide.");

  // On reconstruit le panier côté serveur : les prix ne viennent JAMAIS du navigateur.
  const items: OrderItem[] = [];
  for (const raw of rawLines) {
    const line = isObject(raw) ? raw : {};
    const qty = Number(line.qty);
    const doc = await getDb().collection("bouquets").findOne({ slug: text(line.slug, 80) });
    if (!doc || !Number.isInteger(qty) || qty < 1 || qty > 20) return fail(res, 400, "Panier invalide.");

    const bouquet = toBouquet(doc);
    items.push({ slug: bouquet.slug, title: bouquet.title, qty, unitPrice: bouquet.price });
  }

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const totals = computeTotals(subtotal);
  const reference = `FL-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  const order: NewOrder = { reference, customer, items, totals };

  try {
    await getDb().collection("orders").insertOne({ ...order, createdAt: new Date(), status: "nouvelle" });
  } catch (error) {
    console.error("[order] Enregistrement impossible :", error);
    return fail(res, 500, "Impossible d’enregistrer la commande pour le moment. Écrivez-nous sur WhatsApp.");
  }

  await notifyNewOrder(order);
  res.json({ ok: true, reference, total: totals.total });
});

// -------------------------------------------------------------------- contact

publicRouter.post("/contact", rateLimit("contact", 5, 10 * 60 * 1000), async (req, res) => {
  if (!isObject(req.body)) return fail(res, 400, "Requête invalide.");
  const data = req.body;

  // Champ piège : un humain ne le remplit jamais. On répond « ok » sans rien enregistrer.
  if (text(data.website, 200) !== "") {
    res.json({ ok: true });
    return;
  }

  const message = {
    name: text(data.name, 100),
    email: text(data.email, 254),
    subject: text(data.subject, 100),
    message: text(data.message, 4000),
  };

  if (!message.name || !message.subject || message.message.length < 10) {
    return fail(res, 400, "Merci de remplir tous les champs (message : 10 caractères minimum).");
  }
  if (!isEmail(message.email)) return fail(res, 400, "Adresse e-mail invalide.");

  try {
    await getDb().collection("messages").insertOne({ ...message, createdAt: new Date(), read: false });
  } catch (error) {
    console.error("[contact] Enregistrement impossible :", error);
    return fail(res, 500, "Impossible d’envoyer votre message pour le moment. Écrivez-nous sur WhatsApp.");
  }

  await notifyNewMessage(message);
  res.json({ ok: true });
});

// ----------------------------------------------------------------- newsletter

publicRouter.post("/newsletter", rateLimit("newsletter", 10, 10 * 60 * 1000), async (req, res) => {
  const email = isObject(req.body) ? text(req.body.email, 254).toLowerCase() : "";
  if (!isEmail(email)) return fail(res, 400, "Adresse e-mail invalide.");

  try {
    await getDb()
      .collection("subscribers")
      .updateOne({ email }, { $setOnInsert: { createdAt: new Date() } }, { upsert: true });
  } catch (error) {
    console.error("[newsletter] Enregistrement impossible :", error);
    return fail(res, 500, "Inscription impossible pour le moment. Réessayez plus tard.");
  }

  res.json({ ok: true });
});
