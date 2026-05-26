"use client";

import { useState } from "react";

export default function DevisPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    evenement: "",
    date: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: "32px 24px",
          textAlign: "center",
          color: "#38161b",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>✉️</div>
        <h2
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "32px",
            fontWeight: 400,
            margin: "0 0 10px",
          }}
        >
          Demande envoyée !
        </h2>
        <p style={{ fontSize: "14px", color: "rgba(56,22,27,0.65)", lineHeight: 1.6, fontFamily: "var(--font-manrope)", margin: "0 0 8px" }}>
          Merci <strong>{form.nom || "pour votre message"}</strong>.
        </p>
        <p style={{ fontSize: "13px", color: "rgba(56,22,27,0.5)", lineHeight: 1.6, fontFamily: "var(--font-manrope)", margin: "0 0 28px" }}>
          Nous vous répondrons dans les 24h ouvrées à l&apos;adresse {form.email}.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ nom:"", email:"", telephone:"", evenement:"", date:"", message:"" }); }}
          style={{
            background: "#911f23",
            color: "#fff",
            borderRadius: "999px",
            padding: "12px 28px",
            fontSize: "14px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-manrope)",
          }}
        >
          Nouvelle demande
        </button>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1.5px solid rgba(56,22,27,0.2)",
    background: "#fff",
    fontSize: "14px",
    fontFamily: "var(--font-manrope)",
    color: "#38161b",
    boxSizing: "border-box",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "rgba(56,22,27,0.6)",
    fontFamily: "var(--font-manrope)",
    display: "block",
    marginBottom: "6px",
  };

  return (
    <div style={{ padding: "24px 16px", color: "#38161b" }}>
      <h1
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "34px",
          fontWeight: 400,
          margin: "0 0 4px",
        }}
      >
        Demande de devis
      </h1>
      <p style={{ fontSize: "13px", color: "rgba(56,22,27,0.6)", margin: "0 0 24px", fontFamily: "var(--font-manrope)", lineHeight: 1.6 }}>
        Décrivez votre projet, nous vous répondons sous 24h avec une proposition personnalisée.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Nom complet *</label>
          <input
            required
            type="text"
            value={form.nom}
            onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
            placeholder="Camille Dupont"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="camille@example.com"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Téléphone</label>
          <input
            type="tel"
            value={form.telephone}
            onChange={(e) => setForm((f) => ({ ...f, telephone: e.target.value }))}
            placeholder="+33 6 12 34 56 78"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Type d&apos;événement *</label>
          <select
            required
            value={form.evenement}
            onChange={(e) => setForm((f) => ({ ...f, evenement: e.target.value }))}
            style={{ ...inputStyle, appearance: "none" }}
          >
            <option value="">Choisir…</option>
            <option value="mariage">Mariage</option>
            <option value="anniversaire">Anniversaire</option>
            <option value="bapteme">Baptême / Naissance</option>
            <option value="entreprise">Entreprise / Professionnel</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Date souhaitée</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Message & détails *</label>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder="Décrivez votre projet : nombre de personnes, type de dessert souhaité, allergènes éventuels…"
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <button
          type="submit"
          style={{
            background: "#911f23",
            color: "#fff",
            borderRadius: "999px",
            padding: "14px",
            fontSize: "15px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-manrope)",
            marginTop: "4px",
          }}
        >
          Envoyer ma demande
        </button>
      </form>
    </div>
  );
}
