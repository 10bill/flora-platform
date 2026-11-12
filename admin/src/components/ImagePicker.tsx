import { useState } from "react";
import { imageSrc, uploadImages, useLoad } from "../api";
import type { ImageInfo } from "../types";
import { Notice } from "./Notice";

/** Choix de la photo d'un produit ou d'un article : envoi d'une nouvelle photo ou choix dans la bibliothèque. */
export function ImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const library = useLoad<ImageInfo[]>("/api/admin/images");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFile(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const [url] = await uploadImages([files[0]]);
      onChange(url);
      void library.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Envoi impossible.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="picker">
      {value ? <img className="preview" src={imageSrc(value)} alt="Photo choisie" /> : <p className="muted">Aucune photo choisie.</p>}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={uploading}
        onChange={(event) => void onFile(event.target.files)}
      />
      <p className="hint">{uploading ? "Envoi en cours…" : "JPG, PNG ou WebP. La photo est réduite automatiquement (1600 px maximum) avant l'envoi."}</p>
      {error && <Notice tone="error">{error}</Notice>}

      {library.data && library.data.length > 0 && (
        <details style={{ marginTop: 14 }}>
          <summary>Ou choisir une photo déjà envoyée</summary>
          <div className="library">
            {library.data.map((image) => (
              <button
                key={image.id}
                type="button"
                className={image.url === value ? "selected" : ""}
                onClick={() => onChange(image.url)}
                title={image.name}
              >
                <img src={imageSrc(image.url)} alt={image.name} />
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}