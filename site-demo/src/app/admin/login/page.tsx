"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("helene@atelier.fr");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 600);
  };

  return (
    <div
      className="admin-bg-animated"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Halo particles bordeaux */}
      {[
        { size: 200, top: "10%", left: "5%", duration: "9s", delay: "0s" },
        { size: 140, top: "60%", left: "75%", duration: "12s", delay: "2s" },
        { size: 80, top: "30%", left: "85%", duration: "7s", delay: "1s" },
        { size: 120, top: "80%", left: "15%", duration: "11s", delay: "3s" },
        { size: 60, top: "45%", left: "50%", duration: "8s", delay: "4s" },
      ].map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(192,96,96,0.12) 0%, transparent 70%)",
            top: p.top,
            left: p.left,
            "--duration": p.duration,
            "--delay": p.delay,
          } as React.CSSProperties}
        />
      ))}

      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "rgba(34,16,19,0.88)",
          backdropFilter: "blur(24px)",
          borderRadius: "24px",
          padding: "40px 32px",
          border: "1px solid rgba(192,96,96,0.15)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #6a2828, #8a2a3e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
              fontSize: "24px",
              boxShadow: "0 4px 16px rgba(106,40,40,0.4)",
            }}
          >
            🥐
          </div>
          <h1
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "28px",
              fontWeight: 500,
              color: "#f5ede8",
              margin: "0 0 4px",
            }}
          >
            Atelier · Hélène
          </h1>
          <p style={{ fontSize: "12px", color: "rgba(245,237,232,0.4)", fontFamily: "var(--font-manrope)", margin: 0 }}>
            Espace administration
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "rgba(245,237,232,0.45)",
                fontFamily: "var(--font-manrope)",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1.5px solid rgba(192,96,96,0.2)",
                background: "rgba(255,255,255,0.06)",
                fontSize: "14px",
                fontFamily: "var(--font-manrope)",
                color: "#f5ede8",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "rgba(245,237,232,0.45)",
                fontFamily: "var(--font-manrope)",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1.5px solid rgba(192,96,96,0.2)",
                background: "rgba(255,255,255,0.06)",
                fontSize: "14px",
                fontFamily: "var(--font-manrope)",
                color: "#f5ede8",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "8px",
              background: loading
                ? "rgba(106,40,40,0.5)"
                : "linear-gradient(135deg, #6a2828, #8a2a3e)",
              color: "#f5ede8",
              borderRadius: "12px",
              padding: "13px",
              fontSize: "15px",
              fontWeight: 600,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "var(--font-manrope)",
              boxShadow: loading ? "none" : "0 4px 16px rgba(106,40,40,0.4)",
              transition: "all 0.2s",
              letterSpacing: "0.3px",
            }}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p
          style={{
            marginTop: "20px",
            fontSize: "12px",
            color: "rgba(245,237,232,0.3)",
            textAlign: "center",
            fontFamily: "var(--font-manrope)",
          }}
        >
          Démo — aucune authentification réelle
        </p>
      </div>
    </div>
  );
}
