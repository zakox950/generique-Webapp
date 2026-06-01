"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ClientLayout from "@/components/ClientLayout";

interface SiteConfig {
  boutique_nom?: string;
  boutique_adresse?: string;
  boutique_tel?: string;
  boutique_horaires?: string;
}

export default function ContactPage() {
  const [config, setConfig] = useState<SiteConfig>({});

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => {});
  }, []);

  return (
    <ClientLayout>
      <section className="page-hero">
        <h1 className="page-title">Contact</h1>
        <p className="page-sub">Nous sommes à votre écoute</p>
      </section>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 var(--page-padding) var(--space-20)" }}>

        {/* Infos boutique */}
        <div className="surface-card" style={{ marginBottom: 20 }}>
          <div className="summary-title">La boutique</div>
          <div className="boutique-info" style={{ marginTop: 16 }}>
            <div className="boutique-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{config.boutique_adresse || "Adresse à configurer dans les paramètres"}</span>
            </div>
            {config.boutique_tel && (
              <div className="boutique-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 012 1.18 2 2 0 014 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <a href={`tel:${config.boutique_tel}`} style={{ color: "var(--color-accent)" }}>
                  {config.boutique_tel}
                </a>
              </div>
            )}
            {config.boutique_horaires && (
              <div className="boutique-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                <span>{config.boutique_horaires}</span>
              </div>
            )}
          </div>
        </div>

        {/* Commande / devis */}
        <div className="surface-card">
          <div className="summary-title">Commander ou demander un devis</div>
          <p style={{ marginTop: 12, fontSize: "var(--text-base)", color: "var(--color-muted)", lineHeight: "var(--leading-loose)" }}>
            Pour une commande ou un devis personnalisé, sélectionnez vos créations dans notre catalogue.
            Nous vous recontacterons pour valider les détails et confirmer votre retrait en boutique.
          </p>
          <Link href="/catalogue" className="btn-primary" style={{ marginTop: 20, display: "inline-flex" }}>
            Parcourir le catalogue
          </Link>
        </div>

      </div>
    </ClientLayout>
  );
}
