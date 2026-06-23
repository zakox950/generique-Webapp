"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

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
      <div className="section">
        <motion.h2
          className="contact-hero"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease }}
        >
          On discute<br />
          de ton <span className="tan">projet</span>&nbsp;?
        </motion.h2>

        <div className="contact-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            <div className="contact-links">
              <a href="mailto:hello@spyfie.fr" className="contact-link">
                → hello@spyfie.fr
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                → LinkedIn
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                → GitHub
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.18, ease }}
          >
            {sent ? (
              <div style={{ padding: "2rem 0" }}>
                <div style={{ fontSize: "1.4rem", color: "var(--tan)", marginBottom: "0.75rem" }}>—</div>
                <p style={{ color: "var(--muted)", fontWeight: 300 }}>
                  Message reçu — on revient vers vous rapidement.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-field">
                  <label className="form-label" htmlFor="cf-name">Nom</label>
                  <input
                    id="cf-name"
                    className="form-input"
                    type="text"
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="cf-email">Email</label>
                  <input
                    id="cf-email"
                    className="form-input"
                    type="email"
                    placeholder="jean@exemple.fr"
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="cf-message">Projet</label>
                  <textarea
                    id="cf-message"
                    className="form-textarea"
                    placeholder="Décrivez votre projet..."
                    required
                  />
                </div>
                <button type="submit" className="form-submit" disabled={busy}>
                  {busy ? "Envoi..." : "Envoyer →"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
