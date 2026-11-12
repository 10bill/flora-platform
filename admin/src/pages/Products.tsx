import { Link, useLocation } from "react-router-dom";
import { formatPrice, imageSrc, useLoad } from "../api";
import { LoadState, Notice } from "../components/Notice";
import { categoryLabels, type Bouquet } from "../types";

export function Products() {
  const { data, loading, error } = useLoad<Bouquet[]>("/api/admin/bouquets");
  const flash = (useLocation().state as { flash?: string } | null)?.flash;

  return (
    <>
      <div className="row">
        <h1>Produits</h1>
        <Link to="/produits/nouveau" className="btn primary">Ajouter un produit</Link>
      </div>
      {flash && <Notice tone="success">{flash}</Notice>}
      <LoadState loading={loading} error={error} />
      {data && data.length === 0 && <Notice>Aucun produit pour l'instant.</Notice>}

      {data && data.length > 0 && (
        <>
          <ul className="list">
            {data.map((bouquet, index) => (
              <li key={bouquet.slug}>
                <span className="muted" style={{ width: 20, textAlign: "center", fontSize: 18 }}>{index + 1}</span>
                <img className="thumb" src={imageSrc(bouquet.image)} alt={bouquet.title} style={{ objectPosition: bouquet.position }} />
                <div className="grow">
                  <div className="truncate" style={{ fontFamily: "Bodoni Moda, Georgia, serif", fontSize: 22 }}>{bouquet.title}</div>
                  <div className="muted">
                    {categoryLabels[bouquet.category]} · <span style={{ color: "var(--clay)" }}>{formatPrice(bouquet.price)}</span>
                    {bouquet.oldPrice ? <s style={{ marginLeft: 8 }}>{formatPrice(bouquet.oldPrice)}</s> : null}
                  </div>
                </div>
                <Link to={`/produits/${bouquet.slug}`} className="btn small">Modifier</Link>
              </li>
            ))}
          </ul>
          <p className="muted" style={{ marginTop: 14 }}>Les 3 premiers produits de la liste apparaissent sur la page d'accueil du site.</p>
        </>
      )}
    </>
  );
}
