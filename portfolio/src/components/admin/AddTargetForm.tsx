"use client";
import { useState } from "react";

export default function AddTargetForm({ onAdded }: { onAdded: () => void }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          title: title.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErr((d as { error?: string }).error ?? "Erreur inconnue");
        return;
      }
      setUrl("");
      setTitle("");
      onAdded();
    } catch {
      setErr("RÉSEAU INJOIGNABLE — vérifier la connexion");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="add-target-form">
      <input
        className="input-mono"
        type="url"
        placeholder="https://cible.example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        disabled={busy}
        aria-label="URL de la cible"
      />
      <input
        className="input-mono"
        type="text"
        placeholder="titre (optionnel)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
        disabled={busy}
        aria-label="Titre de la cible"
      />
      <button type="submit" className="btn-console" disabled={busy}>
        {busy ? "ajout…" : "+ capturer"}
      </button>
      {err && <span className="form-error">ERREUR — {err}</span>}
    </form>
  );
}
