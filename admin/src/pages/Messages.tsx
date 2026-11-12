import { useState } from "react";
import { api, formatDateTime, useLoad } from "../api";
import { LoadState, Notice } from "../components/Notice";
import type { Message } from "../types";

export function Messages() {
  const { data: messages, loading, error, setData } = useLoad<Message[]>("/api/admin/messages");
  const [problem, setProblem] = useState("");

  async function toggleRead(message: Message) {
    setProblem("");
    try {
      await api.patch(`/api/admin/messages/${message.id}`, { read: !message.read });
      setData((current) => current && current.map((item) => (item.id === message.id ? { ...item, read: !item.read } : item)));
    } catch (e) {
      setProblem(e instanceof Error ? e.message : "Mise à jour impossible.");
    }
  }

  async function remove(message: Message) {
    if (!window.confirm("Supprimer ce message définitivement ?")) return;
    setProblem("");
    try {
      await api.del(`/api/admin/messages/${message.id}`);
      setData((current) => current && current.filter((item) => item.id !== message.id));
    } catch (e) {
      setProblem(e instanceof Error ? e.message : "Suppression impossible.");
    }
  }

  const unread = (messages ?? []).filter((message) => !message.read).length;

  return (
    <>
      <h1>Messages</h1>
      {unread > 0 && <p style={{ color: "var(--clay)", marginTop: 8 }}>{unread} non lu{unread > 1 ? "s" : ""}</p>}
      <LoadState loading={loading} error={error} />
      {problem && <Notice tone="error">{problem}</Notice>}
      {messages && messages.length === 0 && <Notice>Aucun message pour l'instant.</Notice>}

      <div className="stack" style={{ marginTop: 24 }}>
        {(messages ?? []).map((message) => (
          <article key={message.id} className={`card ${message.read ? "" : "alert"}`}>
            <h3 style={{ fontSize: 24 }}>{message.subject}</h3>
            <p className="muted">
              {formatDateTime(message.createdAt)}
              {!message.read && <span className="badge-new">Nouveau</span>}
            </p>
            <p style={{ marginTop: 16, fontWeight: 600 }}>
              {message.name} · <a href={`mailto:${message.email}`} style={{ fontWeight: 400 }}>{message.email}</a>
            </p>
            <p style={{ whiteSpace: "pre-wrap", color: "var(--ink-soft)" }}>{message.message}</p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button className="btn small" onClick={() => void toggleRead(message)}>
                {message.read ? "Marquer comme non lu" : "Marquer comme lu"}
              </button>
              <button className="btn small" onClick={() => void remove(message)}>Supprimer</button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
