"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ClientLayout from "@/components/ClientLayout";

function ConfirmationContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const type = params.get("type");
  const isDevis = type === "devis";

  return (
    <div className="confirmation-wrap">
      <div className="confirmation-icon">
        {isDevis ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="56" height="56">
            <path d="M6 2h9l5 5v15H6Z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h4"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="56" height="56">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        )}
      </div>

      <h1 className="confirmation-title">
        {isDevis ? "Demande reçue !" : "Commande confirmée !"}
      </h1>

      <p className="confirmation-text">
        {isDevis
          ? "Votre demande de devis a bien été enregistrée. Nous vous contacterons dans les 24 à 48h pour valider les détails et vous transmettre votre devis personnalisé."
          : "Votre commande a bien été enregistrée. Vous recevrez un email de confirmation. Votre commande sera prête à la date et l'heure choisies."}
      </p>

      {id && (
        <div className="confirmation-ref">
          Référence {isDevis ? "devis" : "commande"} : <strong>#{id}</strong>
        </div>
      )}

      <div className="confirmation-actions">
        <Link href="/" className="btn-primary">Retour à l&rsquo;accueil</Link>
        <Link href="/catalogue" className="btn-outline">Continuer mes achats</Link>
      </div>

      <div className="surface-card" style={{ marginTop: 32, textAlign: "left" }}>
        <div className="summary-title">Informations utiles</div>
        <div className="boutique-info">
          <div className="boutique-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 012 1.18 2 2 0 014 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
            </svg>
            <span>Nous vous contacterons par email et/ou téléphone.</span>
          </div>
          <div className="boutique-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M3 9l1-5h16l1 5"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/>
            </svg>
            <span>Retrait uniquement en boutique aux horaires d&rsquo;ouverture.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <ClientLayout>
      <section className="page-hero">
        <h1 className="page-title">Merci</h1>
      </section>
      <Suspense fallback={<div className="loading-state"><div className="spinner" /></div>}>
        <ConfirmationContent />
      </Suspense>
      <footer className="site-footer">
        <div className="footer-brand">Pâtisserie Françoise</div>
        <p className="footer-copy">Artisans pâtissiers depuis 1987</p>
      </footer>
    </ClientLayout>
  );
}
