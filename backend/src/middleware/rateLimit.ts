import type { NextFunction, Request, Response } from "express";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/**
 * Anti-spam : limite le nombre de requêtes par visiteur (adresse IP) sur une durée donnée.
 * Compteurs gardés en mémoire : ils repartent à zéro au redémarrage du serveur.
 */
export function rateLimit(key: string, max: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const id = `${key}:${req.ip ?? "inconnu"}`;

    if (buckets.size > 5000) {
      for (const [name, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(name);
    }

    const bucket = buckets.get(id);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(id, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    bucket.count += 1;
    if (bucket.count > max) {
      res.status(429).json({ error: "Trop de tentatives. Réessayez dans quelques minutes." });
      return;
    }
    next();
  };
}
