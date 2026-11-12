import { Link } from "react-router-dom";
import { formatDateTime, formatPrice, useLoad } from "../api";
import { LoadState } from "../components/Notice";
import { statusLabels, type Stats } from "../types";

export function Dashboard() {
  const { data, loading, error } = useLoad<Stats>("/api/admin/stats");
  const c = data?.counts;
  const s = (n: number) => (n > 1 ? "s" : "");

  const cards = c
    ? [
        { to: "/commandes", title: "Commandes", big: c.newOrders, note: `nouvelle${s(c.newOrders)} · ${c.totalOrders} au total`, alert: c.newOrders > 0 },
        { to: "/messages", title: "Messages", big: c.unreadMessages, note: `non lu${s(c.unreadMessages)} · ${c.totalMessages} au total`, alert: c.unreadMessages > 0 },
        { to: "/images", title: "Images", big: c.images, note: "dans la bibliothèque", alert: false },
        { to: "/produits", title: "Produits", big: c.products, note: "en catalogue", alert: false },
        { to: "/journal", title: "Journal", big: c.articles, note: `article${s(c.articles)}${c.drafts > 0 ? ` · ${c.drafts} brouillon${s(c.drafts)}` : ""}`, alert: false },
        { to: "/abonnes", title: "Abonnés", big: c.subscribers, note: "à la newsletter", alert: false },
      ]
    : [];

  return (
    <>
      <h1>Tableau de bord</h1>
      <LoadState loading={loading} error={error} />

      <div className="grid cols3">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className={`card stat ${card.alert ? "alert" : ""}`}>
            <div className="label">{card.title}</div>
            <div className="big">{card.big}</div>
            <div className="muted" style={{ marginTop: 8 }}>{card.note}</div>
          </Link>
        ))}
      </div>

      {data && (
        <div className="grid cols2" style={{ marginTop: 48 }}>
          <section>
            <div className="row">
              <h2>Dernières commandes</h2>
              <Link to="/commandes" className="muted">Tout voir</Link>
            </div>
            {data.recentOrders.length === 0 ? (
              <p className="muted" style={{ marginTop: 16 }}>Aucune commande pour l'instant.</p>
            ) : (
              <ul className="list">
                {data.recentOrders.map((order) => (
                  <li key={order.reference} style={{ flexWrap: "wrap", gap: "2px 16px" }}>
                    <strong>{order.reference}</strong>
                    <span>{order.customer.firstName} {order.customer.lastName}</span>
                    <span style={{ marginLeft: "auto", color: "var(--clay)" }}>{formatPrice(order.totals.total)}</span>
                    <span className="muted" style={{ width: "100%" }}>{statusLabels[order.status]} · {formatDateTime(order.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <div className="row">
              <h2>Derniers messages</h2>
              <Link to="/messages" className="muted">Tout voir</Link>
            </div>
            {data.recentMessages.length === 0 ? (
              <p className="muted" style={{ marginTop: 16 }}>Aucun message pour l'instant.</p>
            ) : (
              <ul className="list">
                {data.recentMessages.map((message) => (
                  <li key={message.id} style={{ display: "block" }}>
                    <strong>{!message.read && <span className="dot" aria-label="Non lu" />}{message.subject}</strong>
                    <div style={{ color: "var(--ink-soft)", fontSize: 14 }}>{message.name}</div>
                    <div className="muted truncate">{message.message}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </>
  );
}
