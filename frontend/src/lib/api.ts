/**
 * Petit helper pour envoyer du JSON à une route /api/*.
 * Ne lance jamais d’erreur : retourne { ok, data }.
 */
export async function postJson<T = unknown>(
  url: string,
  body: unknown,
): Promise<{ ok: boolean; data: T | null }> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json().catch(() => null)) as T | null;
    return { ok: response.ok, data };
  } catch {
    return { ok: false, data: null };
  }
}
