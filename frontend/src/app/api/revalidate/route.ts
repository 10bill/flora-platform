import { revalidatePath } from "next/cache";

/**
 * Appelée par l'API (backend/) juste après une modification dans l'admin,
 * pour que le site affiche aussitôt les changements.
 * Protégée par REVALIDATE_SECRET (même valeur dans backend/.env et frontend/.env.local).
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ error: "Non autorisé." }, { status: 401 });
  }

  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
