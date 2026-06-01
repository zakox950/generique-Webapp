"use client";
import { useState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await loginAction(email, password);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
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
        <h1 className="auth-title">Connexion</h1>
        <p className="auth-sub">Espace administrateur</p>

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
            <label className="form-label-admin">Email</label>
            <input
              className="form-input-admin"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@patisserie.fr"
              autoComplete="email"
            />
          </div>

          <div className="form-field" style={{ marginTop: 16 }}>
            <label className="form-label-admin">Mot de passe</label>
            <input
              className="form-input-admin"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary full-width"
            style={{ marginTop: 24 }}
            disabled={loading}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: "center", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
          Première connexion ?{" "}
          <a href="/admin/setup" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "underline" }}>
            Créer un compte administrateur
          </a>
        </p>
      </div>
    </div>
  );
}
