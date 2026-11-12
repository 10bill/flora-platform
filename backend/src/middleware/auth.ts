import { createHash, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

const hash = (value: string) => createHash("sha256").update(value).digest();

export function passwordMatches(password: string): boolean {
  return timingSafeEqual(hash(password), hash(config.adminPassword));
}

export function signAdminToken(): string {
  return jwt.sign({ role: "admin" }, config.jwtSecret, { expiresIn: "7d" });
}

/** Protège les routes /api/admin/* : exige l’en-tête « Authorization: Bearer <jeton> ». */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (typeof payload === "object" && payload.role === "admin") {
      next();
      return;
    }
  } catch {
    // jeton absent, invalide ou expiré
  }
  res.status(401).json({ error: "Connexion requise." });
}
