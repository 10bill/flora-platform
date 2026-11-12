import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import multer from "multer";
import { config } from "./config";
import { adminRouter } from "./routes/admin";
import { publicRouter } from "./routes/public";

export function createApp() {
  const app = express();

  // Derrière un hébergeur (Render, Railway…), l’adresse du visiteur est dans X-Forwarded-For
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  // « cross-origin » : le site et l’admin (autres adresses) doivent pouvoir afficher les photos
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

  app.use(
    cors({
      origin(origin, callback) {
        // Pas d’en-tête Origin = appel serveur à serveur (site Next.js, curl) : autorisé
        if (!origin || config.corsOrigins.includes(origin)) callback(null, true);
        else callback(null, false);
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });
  app.use("/api/admin", adminRouter);
  app.use("/api", publicRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Introuvable." });
  });

  // Gestion des erreurs : jamais de détail technique envoyé au visiteur
  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Photo trop lourde (4 Mo maximum). Réduis-la puis réessaie."
          : "Envoi de photos invalide (10 photos maximum à la fois).";
      res.status(400).json({ error: message });
      return;
    }
    if (error instanceof Error && error.message === "TYPE_IMAGE") {
      res.status(400).json({ error: "La photo doit être au format JPG, PNG ou WebP." });
      return;
    }
    if (error instanceof SyntaxError) {
      res.status(400).json({ error: "Requête invalide." });
      return;
    }
    console.error("[erreur]", error);
    res.status(500).json({ error: "Erreur du serveur. Réessayez dans un instant." });
  });

  return app;
}
