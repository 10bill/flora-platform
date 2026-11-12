import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, useLoad } from "../api";
import { ImagePicker } from "../components/ImagePicker";
import { LoadState, Notice } from "../components/Notice";
import { categoryLabels, occasionLabels, type Bouquet, type Category } from "../types";

type FormState = {
  title: string;
  description: string;
  details: string;
  price: string;
  oldPrice: string;
  category: Category | "";
  tag: string;
  occasions: string[];
  flowers: string;
  image: string;
  position: string;
  order: string;
  slug: string;
};

const empty: FormState = {
  title: "", description: "", details: "", price: "", oldPrice: "", category: "", tag: "",
  occasions: [], flowers: "", image: "", position: "50% 50%", order: "", slug: "",
};

export function ProductForm() {
  const { slug: original } = useParams();
  const navigate = useNavigate();
  const { data: bouquets, loading, error } = useLoad<Bouquet[]>("/api/admin/bouquets");

  const [form, setForm] = useState<FormState>(empty);
  const [ready, setReady] = useState(false);
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const current = original ? bouquets?.find((item) => item.slug === original) : undefined;

  // Remplit le formulaire une fois les produits chargés
  useEffect(() => {
    if (!bouquets || ready) return;
    if (current) {
      setForm({
        title: current.title,
        description: current.description,
        details: current.details !== current.description ? current.details : "",
        price: String(current.price),
        oldPrice: current.oldPrice ? String(current.oldPrice) : "",
        category: current.category,
        tag: current.tag,
        occasions: current.occasions,
        flowers: current.flowers.join(", "),
        image: current.image,
        position: current.position,
        order: String(current.order),
        slug: current.slug,
      });
    } else if (!original) {
      setForm({ ...empty, order: String(bouquets.length + 1) });
    }
    setReady(true);
  }, [bouquets, current, original, ready]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setProblem("");

    const clean = (value: string) => value.replace(/\s/g, "");
    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      details: form.details,
      price: clean(form.price) === "" ? NaN : Number(clean(form.price)),
      oldPrice: clean(form.oldPrice) === "" ? null : Number(clean(form.oldPrice)),
      category: form.category,
      tag: form.tag,
      occasions: form.occasions,
      flowers: form.flowers.split(",").map((item) => item.trim()).filter(Boolean),
      image: form.image,
      position: form.position,
      order: Number(form.order) || 999,
    };

    try {
      if (original) await api.put(`/api/admin/bouquets/${encodeURIComponent(original)}`, payload);
      else await api.post("/api/admin/bouquets", payload);
      navigate("/produits", { state: { flash: "Produit enregistré." } });
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
      await api.del(`/api/admin/bouquets/${encodeURIComponent(original)}`);
      navigate("/produits", { state: { flash: "Produit supprimé." } });
    } catch (e) {
      setProblem(e instanceof Error ? e.message : "Suppression impossible.");
    }
  }

  if (loading || error) return <LoadState loading={loading} error={error} />;
  if (original && !current) {
    return (
      <>
        <h1>Produit introuvable</h1>
        <p style={{ marginTop: 16 }}><Link to="/produits">← Retour aux produits</Link></p>
      </>
    );
  }

  return (
    <>
      <p><Link to="/produits" className="muted">← Retour aux produits</Link></p>
      <h1 style={{ marginTop: 12 }}>{current ? current.title : "Nouveau produit"}</h1>
      {problem && <Notice tone="error">{problem}</Notice>}

      <form className="form" onSubmit={(event) => void save(event)}>
        <label className="field full">Nom du produit *
          <input value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </label>
        <label className="field full">Phrase courte (affichée sur la carte) *
          <input value={form.description} onChange={(e) => set("description", e.target.value)} required />
        </label>
        <label className="field full">Description complète (fiche produit)
          <textarea rows={4} value={form.details} onChange={(e) => set("details", e.target.value)} />
        </label>

        <label className="field">Prix (F CFA) *
          <input inputMode="numeric" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="Ex. 20000" required />
        </label>
        <label className="field">Ancien prix barré (facultatif)
          <input inputMode="numeric" value={form.oldPrice} onChange={(e) => set("oldPrice", e.target.value)} placeholder="Ex. 25000" />
        </label>

        <label className="field">Catégorie *
          <select value={form.category} onChange={(e) => set("category", e.target.value as Category)} required>
            <option value="" disabled>Choisir…</option>
            {(Object.keys(categoryLabels) as Category[]).map((id) => <option key={id} value={id}>{categoryLabels[id]}</option>)}
          </select>
        </label>
        <label className="field">Étiquette sur la photo
          <input value={form.tag} onChange={(e) => set("tag", e.target.value)} placeholder="Ex. Coffret cadeau" />
        </label>

        <fieldset className="full" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-soft)" }}>Occasions</legend>
          <div className="checks">
            {Object.entries(occasionLabels).map(([id, label]) => (
              <label key={id}>
                <input
                  type="checkbox"
                  checked={form.occasions.includes(id)}
                  onChange={(e) => set("occasions", e.target.checked ? [...form.occasions, id] : form.occasions.filter((o) => o !== id))}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="field full">Composition (séparée par des virgules)
          <input value={form.flowers} onChange={(e) => set("flowers", e.target.value)} placeholder="Roses rouges, Gypsophile, Chocolats" />
        </label>

        <div className="full">
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 8 }}>Photo *</div>
          <ImagePicker value={form.image} onChange={(url) => set("image", url)} />
        </div>

        <label className="field">Cadrage de la photo
          <input value={form.position} onChange={(e) => set("position", e.target.value)} placeholder="50% 50%" />
        </label>
        <label className="field">Position dans la liste (1 = en premier)
          <input type="number" min={1} value={form.order} onChange={(e) => set("order", e.target.value)} />
        </label>

        <details className="full">
          <summary>Options avancées</summary>
          <label className="field" style={{ marginTop: 14 }}>Adresse de la fiche (laisser vide = automatique)
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="ex. la-rose-rouge" />
          </label>
        </details>

        <div className="full">
          <button className="btn primary" type="submit" disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer"}</button>
        </div>
      </form>

      {current && (
        <div className="danger">
          <h2>Supprimer ce produit</h2>
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
