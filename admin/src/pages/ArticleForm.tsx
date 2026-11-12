import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, useLoad } from "../api";
import { ImagePicker } from "../components/ImagePicker";
import { LoadState, Notice } from "../components/Notice";
import type { Article } from "../types";

type FormState = {
  title: string;
  excerpt: string;
  body: string;
  date: string;
  position: string;
  image: string;
  published: boolean;
  slug: string;
};

const today = () => new Date().toISOString().slice(0, 10);
const empty: FormState = { title: "", excerpt: "", body: "", date: today(), position: "50% 50%", image: "", published: true, slug: "" };

export function ArticleForm() {
  const { slug: original } = useParams();
  const navigate = useNavigate();
  const { data: articles, loading, error } = useLoad<Article[]>("/api/admin/articles");

  const [form, setForm] = useState<FormState>(empty);
  const [ready, setReady] = useState(false);
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const current = original ? articles?.find((item) => item.slug === original) : undefined;

  useEffect(() => {
    if (!articles || ready) return;
    if (current) {
      setForm({
        title: current.title,
        excerpt: current.excerpt,
        body: current.body.join("\n\n"),
        date: current.date,
        position: current.position,
        image: current.image,
        published: current.published,
        slug: current.slug,
      });
    }
    setReady(true);
  }, [articles, current, ready]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setProblem("");

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      date: form.date,
      // Les paragraphes sont séparés par une ligne vide
      body: form.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
      image: form.image,
      position: form.position,
      published: form.published,
    };

    try {
      if (original) await api.put(`/api/admin/articles/${encodeURIComponent(original)}`, payload);
      else await api.post("/api/admin/articles", payload);
      navigate("/journal", { state: { flash: "Article enregistré." } });
    } catch (e) {
      setProblem(e instanceof Error ? e.message : "Enregistrement impossible.");
      setBusy(false);
    }
  }

  async function remove() {
    if (!original || !confirmDelete) {
      setProblem("Coche la case pour confirmer la suppression.");
      return;
    }
    try {
      await api.del(`/api/admin/articles/${encodeURIComponent(original)}`);
      navigate("/journal", { state: { flash: "Article supprimé." } });
    } catch (e) {
      setProblem(e instanceof Error ? e.message : "Suppression impossible.");
    }
  }

  if (loading || error) return <LoadState loading={loading} error={error} />;
  if (original && !current) {
    return (
      <>
        <h1>Article introuvable</h1>
        <p style={{ marginTop: 16 }}><Link to="/journal">← Retour au journal</Link></p>
      </>
    );
  }

  return (
    <>
      <p><Link to="/journal" className="muted">← Retour au journal</Link></p>
      <h1 style={{ marginTop: 12 }}>{current ? current.title : "Nouvel article"}</h1>
      {problem && <Notice tone="error">{problem}</Notice>}

      <form className="form" onSubmit={(event) => void save(event)}>
        <label className="field full">Titre *
          <input value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </label>
        <label className="field full">Résumé (affiché sur la liste du journal) *
          <textarea rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} required />
        </label>
        <label className="field full">Texte de l'article *
          <textarea rows={14} value={form.body} onChange={(e) => set("body", e.target.value)} required />
          <span className="hint">Sépare les paragraphes par une ligne vide.</span>
        </label>

        <label className="field">Date *
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
        </label>
        <label className="field">Cadrage de la photo
          <input value={form.position} onChange={(e) => set("position", e.target.value)} placeholder="50% 50%" />
        </label>

        <div className="full">
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 8 }}>Photo *</div>
          <ImagePicker value={form.image} onChange={(url) => set("image", url)} />
        </div>

        <label className="full" style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--ink-soft)" }}>
          <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
          Publié (décoche pour garder l'article en brouillon, invisible sur le site)
        </label>

        <details className="full">
          <summary>Options avancées</summary>
          <label className="field" style={{ marginTop: 14 }}>Adresse de l'article (laisser vide = automatique)
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="ex. dahlias-automne" />
          </label>
        </details>

        <div className="full">
          <button className="btn primary" type="submit" disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer"}</button>
        </div>
      </form>

      {current && (
        <div className="danger">
          <h2>Supprimer cet article</h2>
          <label style={{ display: "flex", gap: 8, alignItems: "center", margin: "14px 0", color: "var(--ink-soft)" }}>
            <input type="checkbox" checked={confirmDelete} onChange={(e) => setConfirmDelete(e.target.checked)} />
            Je confirme la suppression définitive
          </label>
          <button className="btn" onClick={() => void remove()}>Supprimer</button>
        </div>
      )}
    </>
  );
}
