import { useCallback, useEffect, useState } from "react";

/** Adresse de l'API (backend/) et du site public : réglées dans .env (voir .env.example). */
export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const TOKEN_KEY = "flora_admin_token";

export function getToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setToken(token: string): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // stockage indisponible (navigation privée…) : la connexion durera jusqu'au rechargement
  }
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body; // le navigateur ajoute lui-même le Content-Type
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError("Impossible de joindre l'API. Vérifie qu'elle est lancée et que VITE_API_URL est correct.", 0);
  }

  const data = (await response.json().catch(() => null)) as { error?: string } | null;

  if (!response.ok) {
    // Session expirée : on renvoie vers la page de connexion (sauf pour la connexion elle-même)
    if (response.status === 401 && path !== "/api/admin/login") {
      setToken("");
      window.dispatchEvent(new Event("flora:unauthorized"));
    }
    throw new ApiError(data?.error ?? "Une erreur est survenue.", response.status);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  del: <T>(path: string, body?: unknown) => request<T>("DELETE", path, body),
};

/** Envoie des photos (jusqu'à 10) et retourne leurs adresses. */
export async function uploadImages(files: File[]): Promise<string[]> {
  const form = new FormData();
  for (const file of files) form.append("images", file);
  return (await request<{ urls: string[] }>("POST", "/api/admin/images", form)).urls;
}

/** Adresse complète d'une photo : celles de l'admin viennent de l'API, les autres du site public. */
export function imageSrc(url: string): string {
  if (url.startsWith("/api/")) return `${API_URL}${url}`;
  if (url.startsWith("/")) return `${SITE_URL}${url}`;
  return url;
}

/** Charge une donnée de l'API et permet de la recharger. */
export function useLoad<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      setData(await api.get<T>(path));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, error, loading, reload, setData };
}

const franc = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 });
export const formatPrice = (value: number) => franc.format(value);

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Ouagadougou" });
const dateOnly = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "Africa/Ouagadougou" });
export const formatDateTime = (iso: string) => (iso ? dateTime.format(new Date(iso)) : "");
export const formatDate = (iso: string) => (iso ? dateOnly.format(new Date(iso)) : "");
