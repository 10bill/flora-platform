import { assertConfig, config } from "./config";
import { closeDb, connectDb } from "./db";
import { createApp } from "./app";
import { seedIfEmpty } from "./lib/seed";

async function main() {
  assertConfig();

  await connectDb();
  await seedIfEmpty();

  const server = createApp().listen(config.port, () => {
    console.log(`✅ API Flora prête sur http://localhost:${config.port}`);
  });

  const stop = () => {
    server.close(() => {
      closeDb().finally(() => process.exit(0));
    });
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}

main().catch((error: unknown) => {
  console.error("❌ Démarrage impossible :", error);
  process.exit(1);
});
