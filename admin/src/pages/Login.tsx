import { useState, type FormEvent } from "react";
import { api, setToken } from "../api";
import { Notice } from "../components/Notice";

export function Login({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { token } = await api.post<{ token: string }>("/api/admin/login", { password });
      setToken(token);
      onLogin();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Connexion impossible.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="login" onSubmit={(event) => void submit(event)}>
      <h1>Administration</h1>
      <label className="field" style={{ marginTop: 28 }}>
        Mot de passe
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" autoFocus required />
      </label>
      {error && <Notice tone="error">{error}</Notice>}
      <button className="btn primary" type="submit" disabled={busy} style={{ marginTop: 20 }}>
        {busy ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
