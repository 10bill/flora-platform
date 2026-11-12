import "dotenv/config";

const list = (value: string | undefined, fallback: string) =>
  (value ?? fallback)
    .split(",")
    .map((item) => item.trim().replace(/\/$/, ""))
    .filter(Boolean);

export const config = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI ?? "",
  dbName: process.env.MONGODB_DB || "flora",
  adminPassword: process.env.ADMIN_PASSWORD ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "",
  corsOrigins: list(process.env.CORS_ORIGINS, "http://localhost:3000,http://localhost:5173"),
  frontendUrl: (process.env.FRONTEND_URL ?? "").replace(/\/$/, ""),
  revalidateSecret: process.env.REVALIDATE_SECRET ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  notifyEmail: process.env.ORDER_NOTIFY_EMAIL ?? "",
  fromEmail: process.env.ORDER_FROM_EMAIL || "Flora <onboarding@resend.dev>",
};

/** Arrête le serveur avec un message clair si un réglage obligatoire manque. */
export function assertConfig(): void {
  const missing: string[] = [];
  if (!config.mongoUri) missing.push("MONGODB_URI");
  if (!config.adminPassword) missing.push("ADMIN_PASSWORD");
  if (config.jwtSecret.length < 16) missing.push("JWT_SECRET (16 caractères minimum)");

  if (missing.length > 0) {
    console.error(`\n❌ Réglages manquants dans le fichier .env : ${missing.join(", ")}\n   (voir .env.example)\n`);
    process.exit(1);
  }
}
