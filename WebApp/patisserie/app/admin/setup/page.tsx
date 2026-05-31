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
      .then((r) => r.json())
      .then((data) => {
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
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    if (password.length < 8) { setError("Le mot de passe doit faire au moins 8 caractères."); return; }
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

  if (loading) {
    return (
      <div className="admin-root admin-auth-page">
        <img className="bg-photo" src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80" alt="" aria-hidden="true" />
        <div className="bg-overlay" />
        <div className="auth-card glass-base">
          <div className="spinner-admin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root admin-auth-page">
      <img
        className="bg-photo"
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
        alt=""
        aria-hidden="true"
      />
      <div className="bg-overlay" />

      <div className="auth-card glass-base">
        <div className="auth-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
            <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
            <path d="M8 12h8M12 8v8"/>
          </svg>
          <span className="auth-brand-name">Françoise</span>
        </div>
        <h1 className="auth-title">Créer le compte</h1>
        <p className="auth-sub">Configuration initiale de l'administration</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <div className="form-field">
            <label className="form-label-admin">Email administrateur</label>
            <input
              className="form-input-admin"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@patisserie.fr"
            />
          </div>

          <div className="form-field" style={{ marginTop: 16 }}>
            <label className="form-label-admin">Mot de passe (min. 8 caractères)</label>
            <input
              className="form-input-admin"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="form-field" style={{ marginTop: 16 }}>
            <label className="form-label-admin">Confirmer le mot de passe</label>
            <input
              className="form-input-admin"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary full-width" style={{ marginTop: 24 }} disabled={submitting}>
            {submitting ? "Création…" : "Créer le compte"}
          </button>
        </form>
      </div>
    </div>
  );
}
