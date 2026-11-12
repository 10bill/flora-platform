import { Link, useLocation } from "react-router-dom";
import { formatDate, imageSrc, useLoad } from "../api";
import { LoadState, Notice } from "../components/Notice";
import type { Article } from "../types";

export function Journal() {
  const { data, loading, error } = useLoad<Article[]>("/api/admin/articles");
  const flash = (useLocation().state as { flash?: string } | null)?.flash;

  return (
    <>
      <div className="row">
        <h1>Journal</h1>
        <Link to="/journal/nouveau" className="btn primary">Écrire un article</Link>
      </div>
      {flash && <Notice tone="success">{flash}</Notice>}
      <LoadState loading={loading} error={error} />
      {data && data.length === 0 && <Notice>Aucun article pour l'instant.</Notice>}

      {data && data.length > 0 && (
        <ul className="list">
          {data.map((article) => (
            <li key={article.slug}>
              <img className="thumb" src={imageSrc(article.image)} alt={article.title} style={{ objectPosition: article.position }} />
              <div className="grow">
                <div className="truncate" style={{ fontFamily: "Bodoni Moda, Georgia, serif", fontSize: 22 }}>{article.title}</div>
                <div className="muted">
                  {formatDate(article.date)}
                  {!article.published && <span style={{ marginLeft: 12, color: "var(--clay)", fontWeight: 600 }}>Brouillon</span>}
                </div>
              </div>
              <Link to={`/journal/${article.slug}`} className="btn small">Modifier</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
