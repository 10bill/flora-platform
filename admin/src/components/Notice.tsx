import type { ReactNode } from "react";

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "success" | "error" }) {
  return (
    <p className={`notice ${tone === "info" ? "" : tone}`} role={tone === "error" ? "alert" : undefined}>
      {children}
    </p>
  );
}

/** Affiche le chargement ou l'erreur d'une donnée ; retourne null quand les données sont prêtes. */
export function LoadState({ loading, error }: { loading: boolean; error: string }) {
  if (loading) return <p className="muted" style={{ marginTop: 24 }}>Chargement…</p>;
  if (error) return <Notice tone="error">{error}</Notice>;
  return null;
}
