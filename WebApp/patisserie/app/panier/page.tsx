"use client";
import Link from "next/link";
import ClientLayout from "@/components/ClientLayout";
import { useCart } from "@/hooks/useCart";

const UNSPLASH_FALLBACK = "photo-1612203985729-70726954388c";

function eur(cents: number) {
  return Number(cents).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export default function PanierPage() {
  const { items, total, count, mounted, updateQuantity, removeItem } = useCart();

  if (!mounted) return null;

  return (
    <ClientLayout>
      <section className="page-hero">
        <h1 className="page-title">Panier</h1>
        <p className="page-sub">{count > 0 ? `${count} article${count > 1 ? "s" : ""}` : "Votre panier est vide"}</p>
      </section>

      {items.length === 0 ? (
        <div className="empty-cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="56" height="56" style={{ opacity: 0.3, marginBottom: 16 }}>
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <p>Votre panier est vide</p>
          <Link href="/catalogue" className="btn-primary" style={{ marginTop: 20 }}>Voir le catalogue</Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Liste */}
          <div className="cart-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  <img
                    src={item.photoUrl || `https://images.unsplash.com/${UNSPLASH_FALLBACK}?w=120&q=80`}
                    alt={item.nom}
                  />
                </div>
                <div className="cart-item-body">
                  <div className="cart-item-name">{item.nom}</div>
                  <div className="cart-item-price">{eur(item.prix)}</div>
                </div>
                <div className="cart-item-right">
                  <div className="qty-ctrl">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantite - 1)}
                      aria-label="Diminuer"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                    <span className="qty-val">{item.quantite}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantite + 1)}
                      aria-label="Augmenter"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                  </div>
                  <div className="cart-item-total">{eur(item.prix * item.quantite)}</div>
                  <button
                    className="cart-remove"
                    onClick={() => removeItem(item.id)}
                    aria-label="Supprimer"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Récapitulatif */}
          <div className="cart-summary">
            <div className="surface-card">
              <div className="summary-title">Récapitulatif</div>
              <div className="summary-line">
                <span>Sous-total ({count} article{count > 1 ? "s" : ""})</span>
                <span>{eur(total)}</span>
              </div>
              <div className="summary-line muted">
                <span>Retrait en boutique</span>
                <span>Gratuit</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>{eur(total)}</span>
              </div>
              <Link href="/commande" className="btn-primary full-width">
                Valider la commande
              </Link>
              <Link href="/catalogue" className="btn-ghost full-width" style={{ marginTop: 10 }}>
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
