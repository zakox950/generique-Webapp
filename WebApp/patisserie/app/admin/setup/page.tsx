"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/setup")
      .then(r => r.json())
      .then(data => {
        if (!data.setupDisponible) {
          router.replace("/admin/already-exists");
        } else {
          setLoading(false);
        }
      });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Erreur lors de la création du compte.");
      if (data.redirect) router.replace(data.redirect);
      setSubmitting(false);
      return;
    }
    router.replace("/admin/login");
  }

  if (loading) return <p>Chargement...</p>;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, width: 320 }}>
        <h1>Créer le compte administrateur</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: 8 }}
        />
        <input
          type="password"
          placeholder="Mot de passe (min. 8 caractères)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: 8 }}
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          style={{ padding: 8 }}
        />
        <button type="submit" disabled={submitting} style={{ padding: 10 }}>
          {submitting ? "Création..." : "Créer le compte"}
        </button>
      </form>
    </div>
  );
}
