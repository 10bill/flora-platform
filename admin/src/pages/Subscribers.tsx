import { useState } from "react";
import { api, formatDate, useLoad } from "../api";
import { LoadState, Notice } from "../components/Notice";
import type { Subscriber } from "../types";

/** Protège contre les « formules » Excel (=, +, -, @) et met entre guillemets. */
function csvCell(value: string): string {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function Subscribers() {
  const { data: subscribers, loading, error, setData } = useLoad<Subscriber[]>("/api/admin/subscribers");
  const [problem, setProblem] = useState("");

  async function remove(email: string) {
    if (!window.confirm(`Retirer ${email} de la liste ?`)) return;
    setProblem("");
    try {
      await api.del("/api/admin/subscribers", { email });
      setData((current) => current && current.filter((item) => item.email !== email));
    } catch (e) {
      setProblem(e instanceof Error ? e.message : "Suppression impossible.");
    }
  }

  function download() {
    const rows = (subscribers ?? []).map((s) => `${csvCell(s.email)},${csvCell(s.createdAt)}`);
    const blob = new Blob([`﻿email,date_inscription\n${rows.join("\n")}\n`], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "abonnes-flora.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const list = subscribers ?? [];

  return (
    <>
      <div className="row">
        <h1>Abonnés{list.length > 0 && ` (${list.length})`}</h1>
        {list.length > 0 && <button className="btn" onClick={download}>Télécharger (CSV)</button>}
      </div>
      <LoadState loading={loading} error={error} />
      {problem && <Notice tone="error">{problem}</Notice>}
      {subscribers && list.length === 0 && <Notice>Aucun abonné pour l'instant.</Notice>}

      {list.length > 0 && (
        <ul className="list">
          {list.map((subscriber) => (
            <li key={subscriber.email}>
              <span className="grow truncate">{subscriber.email}</span>
              <span className="muted">{formatDate(subscriber.createdAt)}</span>
              <button className="btn small" onClick={() => void remove(subscriber.email)}>Retirer</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
