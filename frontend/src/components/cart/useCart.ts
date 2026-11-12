"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Bouquet } from "@/lib/bouquets";
import { computeTotals } from "@/lib/pricing";
import { useCatalog } from "../catalog/CatalogProvider";

/**
 * Panier global, sauvegardé dans le navigateur (localStorage).
 * Aucun « provider » à ajouter : il suffit d’appeler useCart() dans un composant client.
 *
 *   const { lines, count, subtotal, delivery, total } = useCart();
 *   addToCart("douce-parenthese");
 */

export type CartLine = { slug: string; qty: number };
export type DetailedLine = { bouquet: Bouquet; qty: number; lineTotal: number };

const STORAGE_KEY = "flora-cart";
const MAX_QTY = 20;
const EMPTY: CartLine[] = [];

let cache: CartLine[] | null = null;
const listeners = new Set<() => void>();

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Partial<CartLine>;
  return (
    typeof line.slug === "string" &&
    Number.isInteger(line.qty) &&
    (line.qty as number) > 0
  );
}

function parse(raw: string | null): CartLine[] {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return EMPTY;
    const lines = data.filter(isCartLine);
    return lines.length > 0 ? lines : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): CartLine[] {
  if (cache === null) {
    try {
      cache = parse(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      cache = EMPTY;
    }
  }
  return cache;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  // Synchronise plusieurs onglets ouverts en même temps
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function commit(next: CartLine[]) {
  cache = next.length > 0 ? next : EMPTY;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    /* stockage indisponible (navigation privée…) : le panier reste en mémoire */
  }
  listeners.forEach((listener) => listener());
}

export function addToCart(slug: string, qty = 1) {
  const current = getSnapshot();
  const existing = current.find((line) => line.slug === slug);

  if (existing) {
    commit(
      current.map((line) =>
        line.slug === slug ? { ...line, qty: Math.min(MAX_QTY, line.qty + qty) } : line,
      ),
    );
  } else {
    commit([...current, { slug, qty: Math.min(MAX_QTY, qty) }]);
  }
}

export function setQuantity(slug: string, qty: number) {
  if (qty <= 0) {
    removeFromCart(slug);
    return;
  }
  commit(
    getSnapshot().map((line) =>
      line.slug === slug ? { ...line, qty: Math.min(MAX_QTY, qty) } : line,
    ),
  );
}

export function removeFromCart(slug: string) {
  commit(getSnapshot().filter((line) => line.slug !== slug));
}

export function clearCart() {
  commit(EMPTY);
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const catalog = useCatalog();

  return useMemo(() => {
    const detailed: DetailedLine[] = [];

    for (const line of lines) {
      const bouquet = catalog.find((item) => item.slug === line.slug);
      if (bouquet) {
        detailed.push({ bouquet, qty: line.qty, lineTotal: bouquet.price * line.qty });
      }
    }

    const subtotal = detailed.reduce((sum, line) => sum + line.lineTotal, 0);
    const count = detailed.reduce((sum, line) => sum + line.qty, 0);

    return { lines: detailed, count, ...computeTotals(subtotal) };
  }, [lines, catalog]);
}
