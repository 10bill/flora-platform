import { useState } from "react";
import { api, formatDateTime, formatPrice, useLoad } from "../api";
import { LoadState, Notice } from "../components/Notice";
import { statusLabels, type Order, type OrderStatus } from "../types";

const statuses = Object.keys(statusLabels) as OrderStatus[];

export function Orders() {
  const { data: orders, loading, error, setData } = useLoad<Order[]>("/api/admin/orders");
  const [filter, setFilter] = useState<OrderStatus | "">("");
  const [problem, setProblem] = useState("");

  async function changeStatus(reference: string, status: OrderStatus) {
    setProblem("");
    try {
      await api.patch(`/api/admin/orders/${encodeURIComponent(reference)}`, { status });
      setData((current) => current && current.map((order) => (order.reference === reference ? { ...order, status } : order)));
    } catch (e) {
      setProblem(e instanceof Error ? e.message : "Mise à jour impossible.");
    }
  }

  const all = orders ?? [];
  const shown = filter ? all.filter((order) => order.status === filter) : all;

  return (
    <>
      <h1>Commandes</h1>

      <div className="pills">
        <button className={`pill ${filter === "" ? "active" : ""}`} onClick={() => setFilter("")}>Toutes ({all.length})</button>
        {statuses.map((status) => (
          <button key={status} className={`pill ${filter === status ? "active" : ""}`} onClick={() => setFilter(status)}>
            {statusLabels[status]} ({all.filter((order) => order.status === status).length})
          </button>
        ))}
      </div>

      <LoadState loading={loading} error={error} />
      {problem && <Notice tone="error">{problem}</Notice>}
      {orders && shown.length === 0 && <Notice>{filter ? "Aucune commande avec ce statut." : "Aucune commande pour l'instant."}</Notice>}

      <div className="stack" style={{ marginTop: 24 }}>
        {shown.map((order) => (
          <article key={order.reference} className="card order">
            <div className="row" style={{ alignItems: "flex-start" }}>
              <div>
                <h3>{order.reference}</h3>
                <p className="muted">{formatDateTime(order.createdAt)}</p>
              </div>
              <div className="price">{formatPrice(order.totals.total)}</div>
            </div>

            <div className="cols">
              <div>
                <strong style={{ color: "var(--ink)" }}>{order.customer.firstName} {order.customer.lastName}</strong>
                <div><a href={`tel:${order.customer.phone.replace(/\s/g, "")}`}>{order.customer.phone}</a></div>
                {order.customer.email && <div>{order.customer.email}</div>}
                <div style={{ marginTop: 8 }}>{order.customer.address}, {order.customer.district}</div>
                {order.customer.landmark && <div>Repère : {order.customer.landmark}</div>}
                <div>Livraison souhaitée : {order.customer.deliveryDate}</div>
                {order.customer.cardMessage && <div style={{ marginTop: 8, fontStyle: "italic" }}>Carte : « {order.customer.cardMessage} »</div>}
              </div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {order.items.map((item) => (
                  <li key={item.slug}>{item.qty} × {item.title} <span className="muted">· {formatPrice(item.unitPrice)}</span></li>
                ))}
                <li className="muted" style={{ listStyle: "none", marginLeft: -18, marginTop: 8 }}>
                  Livraison : {order.totals.delivery === 0 ? "offerte" : formatPrice(order.totals.delivery)}
                </li>
              </ul>
            </div>

            <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <label className="muted" htmlFor={`status-${order.reference}`}>STATUT</label>
              <select
                id={`status-${order.reference}`}
                className="input"
                style={{ width: "auto", marginTop: 0, borderRadius: 999, padding: "8px 16px" }}
                value={order.status}
                onChange={(event) => void changeStatus(order.reference, event.target.value as OrderStatus)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{statusLabels[status]}</option>
                ))}
              </select>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
