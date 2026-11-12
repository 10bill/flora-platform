import { config } from "../config";

/**
 * Dit au site de rafraîchir ses pages juste après une modification dans l’admin.
 * Facultatif : sans FRONTEND_URL / REVALIDATE_SECRET, le site se met à jour tout seul
 * en moins d’une minute. N’échoue jamais.
 */
export function triggerRevalidate(): void {
  if (!config.frontendUrl || !config.revalidateSecret) return;

  fetch(`${config.frontendUrl}/api/revalidate`, {
    method: "POST",
    headers: { "x-revalidate-secret": config.revalidateSecret },
  }).catch((error: unknown) => {
    console.error("[revalidate] Le site n’a pas pu être prévenu :", error);
  });
}
