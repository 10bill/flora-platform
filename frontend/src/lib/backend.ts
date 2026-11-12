/**
 * Appels du site vers l'API (le dossier backend/), côté serveur uniquement.
 * Réglage dans .env.local : API_URL = adresse de l'API (ex. http://localhost:4000).
 *
 * Les pages gardent les données en cache 30 secondes ; une modification faite dans l'admin
 * les rafraîchit aussitôt si REVALIDATE_SECRET est réglé (voir app/api/revalidate).
 * Si l'API est injoignable, retourne null : le site affiche alors ses données de secours.
 */
const API_URL = (process.env.API_URL ?? "http://localhost:4000").replace(/\/$/, "");

export async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, { next: { revalidate: 30 } });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch (error) {
    console.error(`[api] ${path} injoignable, données de secours utilisées :`, error);
    return null;
  }
}
