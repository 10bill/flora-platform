const franc = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

/** 2000 → « 2 000 F CFA » */
export function formatPrice(value: number): string {
  return franc.format(value);
}

/** "2026-10-12" → « 12 octobre 2026 » */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
