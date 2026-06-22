"use client";
import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setBusy(false);
  }

  return (
    <section id="contact">
      <div className="contact-wrapper">
        <div className="contact-info">
          <div className="section-label">Contact</div>
          <h3>On discute de votre projet ?</h3>
          <p>
            Une idée, un projet, une question ? Décrivez-nous ce que vous cherchez
            et on revient vers vous sous 24h.
          </p>
          <div className="contact-links">
            <a href="mailto:hello@devstudio.fr" className="contact-link">
              → hello@devstudio.fr
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener" className="contact-link">
              → LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noopener" className="contact-link">
              → GitHub
            </a>
          </div>
        </div>

        {sent ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
            <div style={{ fontSize: "3rem" }}>✓</div>
            <p style={{ color: "var(--blue-300)", fontFamily: "var(--font-mono)", textAlign: "center" }}>
              Message reçu !<br />On revient vers vous rapidement.
            </p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Nom</label>
              <input id="name" className="form-input" type="text" placeholder="Jean Dupont" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" className="form-input" type="email" placeholder="jean@exemple.fr" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="message">Projet</label>
              <textarea
                id="message"
                className="form-textarea"
                placeholder="Décrivez votre projet, vos besoins, votre budget approximatif..."
                required
              />
            </div>
            <button type="submit" className="form-submit" disabled={busy}>
              {busy ? "Envoi..." : "Envoyer le message →"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
