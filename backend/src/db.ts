import { MongoClient, type Db } from "mongodb";
import { config } from "./config";

let client: MongoClient | undefined;
let database: Db | undefined;

/** Se connecte à MongoDB, crée les index et retourne la base. À appeler une fois au démarrage. */
export async function connectDb(): Promise<Db> {
  client = new MongoClient(config.mongoUri, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  database = client.db(config.dbName);

  // Les index « unique » empêchent les doublons (références de commande, adresses, e-mails…)
  await Promise.all([
    database.collection("orders").createIndex({ reference: 1 }, { unique: true }),
    database.collection("orders").createIndex({ createdAt: -1 }),
    database.collection("bouquets").createIndex({ slug: 1 }, { unique: true }),
    database.collection("bouquets").createIndex({ order: 1 }),
    database.collection("articles").createIndex({ slug: 1 }, { unique: true }),
    database.collection("articles").createIndex({ date: -1 }),
    database.collection("subscribers").createIndex({ email: 1 }, { unique: true }),
    database.collection("messages").createIndex({ createdAt: -1 }),
  ]).catch((error: unknown) => {
    console.error("[db] Création des index impossible (le serveur continue) :", error);
  });

  return database;
}

export function getDb(): Db {
  if (!database) throw new Error("La base de données n’est pas connectée.");
  return database;
}

export async function closeDb(): Promise<void> {
  await client?.close();
}
