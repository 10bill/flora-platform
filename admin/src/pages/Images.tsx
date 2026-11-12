import { useRef, useState, type FormEvent } from "react";
import { api, formatDate, imageSrc, uploadImages, useLoad } from "../api";
import { LoadState, Notice } from "../components/Notice";
import type { ImageInfo } from "../types";

function formatSize(bytes: number): string {
  if (bytes <= 0) return "";
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} Mo` : `${Math.round(bytes / 1024)} Ko`;
}

export function Images() {
  const { data: images, loading, error, reload } = useLoad<ImageInfo[]>("/api/admin/images");
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");
  const [problem, setProblem] = useState("");

  async function upload(event: FormEvent) {
    event.preventDefault();
    const files: File[] = input.current?.files ? Array.from(input.current.files) : [];
    if (files.length === 0) return;

    setBusy(true);
    setProblem("");
    setSuccess("");
    try {
      await uploadImages(files);
      setSuccess(files.length === 1 ? "Photo envoyée." : `${files.length} photos envoyées.`);
      if (input.current) input.current.value = "";
      await reload();
    } catch (e) {
      setProblem(e instanceof Error ? e.message : "Envoi impossible.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(image: ImageInfo) {
    if (!window.confirm("Supprimer cette photo définitivement ?")) return;
    setProblem("");
    setSuccess("");
    try {
      await api.del(`/api/admin/images/${image.id}`);
      setSuccess("Photo supprimée.");
      await reload();
    } catch (e) {
      setProblem(e instanceof Error ? e.message : "Suppression impossible.");
    }
  }

  const list = images ?? [];

  return (
    <>
      <h1>Images{list.length > 0 && ` (${list.length})`}</h1>
      {success && <Notice tone="success">{success}</Notice>}
      {problem && <Notice tone="error">{problem}</Notice>}
      <LoadState loading={loading} error={error} />

      <form className="card" style={{ marginTop: 24 }} onSubmit={(event) => void upload(event)}>
        <h2>Envoyer des photos</h2>
        <input ref={input} type="file" name="images" multiple required accept="image/jpeg,image/png,image/webp" style={{ marginTop: 14 }} />
        <p className="hint">JPG, PNG ou WebP, 10 photos à la fois. Chaque photo est réduite automatiquement (1600 px maximum) avant l'envoi pour que le site reste rapide. Ensuite, choisis-les dans la fiche d'un produit ou dans un article du journal.</p>
        <button className="btn primary" type="submit" disabled={busy} style={{ marginTop: 16 }}>
          {busy ? "Envoi…" : "Envoyer"}
        </button>
      </form>

      {images && list.length === 0 && <Notice>Aucune photo envoyée pour l'instant.</Notice>}

      <ul className="gallery">
        {list.map((image) => (
          <li key={image.id}>
            <img src={imageSrc(image.url)} alt={image.name} loading="lazy" />
            <div className="body">
              <div className="truncate" style={{ fontWeight: 600 }}>{image.name}</div>
              <div className="muted">{[formatDate(image.createdAt), formatSize(image.size)].filter(Boolean).join(" · ")}</div>
              {image.usedBy.length > 0 ? (
                <ul style={{ margin: "10px 0 0", paddingLeft: 18, fontSize: 13, color: "var(--ink-soft)" }}>
                  {image.usedBy.map((use) => <li key={use}>{use}</li>)}
                </ul>
              ) : (
                <p className="muted" style={{ margin: "10px 0 0" }}>Non utilisée</p>
              )}
              <button className="btn small" style={{ marginTop: 14 }} disabled={image.usedBy.length > 0} onClick={() => void remove(image)}>
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}