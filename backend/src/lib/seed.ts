import { seedArticles, seedBouquets } from "../data/seed";
import { getDb } from "../db";

/**
 * Au tout premier lancement, copie les produits et articles de départ dans MongoDB.
 * Un marqueur (collection « meta ») garantit que ça n’arrive qu’une fois : si tu supprimes
 * tous tes produits plus tard, ils ne reviendront pas.
 */
export async function seedIfEmpty(): Promise<void> {
  const db = getDb();
  const meta = db.collection<{ _id: string; at: Date }>("meta");

  if (!(await meta.findOne({ _id: "seeded" })) && (await db.collection("bouquets").countDocuments()) === 0) {
    await db.collection("bouquets").bulkWrite(
      seedBouquets.map((bouquet, index) => ({
        updateOne: {
          filter: { slug: bouquet.slug },
          update: { $setOnInsert: { ...bouquet, order: index + 1 } },
          upsert: true,
        },
      })),
    );
    await meta.updateOne({ _id: "seeded" }, { $setOnInsert: { at: new Date() } }, { upsert: true });
    console.log(`[seed] ${seedBouquets.length} produits de départ ajoutés.`);
  }

  if (!(await meta.findOne({ _id: "seeded-journal" })) && (await db.collection("articles").countDocuments()) === 0) {
    await db.collection("articles").bulkWrite(
      seedArticles.map((article) => ({
        updateOne: {
          filter: { slug: article.slug },
          update: { $setOnInsert: { ...article, published: true } },
          upsert: true,
        },
      })),
    );
    await meta.updateOne({ _id: "seeded-journal" }, { $setOnInsert: { at: new Date() } }, { upsert: true });
    console.log(`[seed] ${seedArticles.length} articles de départ ajoutés.`);
  }
}
