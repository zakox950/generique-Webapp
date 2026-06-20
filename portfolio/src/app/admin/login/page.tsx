"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        // Navigation dure : le cookie doit être présent avant le rendu de /admin.
        window.location.href = "/admin";
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "ACCESS DENIED");
        setLoading(false);
      }
    } catch {
      setError("CONNEXION IMPOSSIBLE — réessayer");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <form
        onSubmit={onSubmit}
        className="glass"
        style={{
          width: "100%",
          maxWidth: 380,
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <div>
          <span className="mono-label">accès restreint</span>
          <h1
            className="display"
            style={{ fontSize: "var(--text-xl)", marginTop: 8 }}
          >
            Console Spyfie
          </h1>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="mono-label">mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
            style={{
              background: "var(--slate-deep)",
              border: "1px solid var(--glass-border)",
              borderRadius: 8,
              padding: "10px 12px",
              color: "var(--text)",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-sm)",
              outline: "none",
            }}
          />
        </label>

        {error && (
          <p
            className="mono"
            style={{ color: "var(--fail)", fontSize: "var(--text-xs)" }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          style={{
            background: loading ? "transparent" : "var(--signal)",
            color: loading ? "var(--signal)" : "var(--void)",
            border: "1px solid var(--signal)",
            borderRadius: 8,
            padding: "11px 12px",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            opacity: !password ? 0.5 : 1,
            transition: "opacity var(--dur-hover) ease",
          }}
        >
          {loading ? "vérification…" : "s'authentifier"}
        </button>
      </form>
    </main>
  );
}
