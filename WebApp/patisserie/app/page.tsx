"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ClientLayout, { showToast } from "@/components/ClientLayout";
import { useCart } from "@/hooks/useCart";

interface Produit {
  id: number;
  nom: string;
  prix: number;
  description?: string;
  photos: { photoUrl: string }[];
}

const UNSPLASH_FALLBACK = [
  "photo-1612203985729-70726954388c",
  "photo-1555507036-ab1f4038808a",
  "photo-1488477181946-6428a0291777",
  "photo-1464349095431-e9a21285b5f3",
];

const TRUST_ITEMS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "Fait chaque matin",
    sub: "Préparé avant l'ouverture",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
      </svg>
    ),
    title: "Sans conservateurs",
    sub: "Recettes 100% naturelles",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M3 9l1-5h16l1 5"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/>
      </svg>
    ),
    title: "Retrait en boutique",
    sub: "Commandez, on s'occupe du reste",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: "Recettes familiales",
    sub: "Transmises de génération en génération",
  },
];

const REVIEWS = [
  { name: "Marie D.", note: 5, text: "Des croissants sublimes, croustillants et beurrés à souhait. Je commande chaque semaine !" },
  { name: "Thomas B.", note: 5, text: "Le fraisier était absolument magnifique pour l'anniversaire de ma fille. Merci !" },
  { name: "Isabelle C.", note: 5, text: "Qualité artisanale exceptionnelle. On sent vraiment la passion dans chaque gâteau." },
];

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{ color: "#C5A55A" }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

export default function AccueilPage() {
  const { addItem } = useCart();
  const [bestsellers, setBestsellers] = useState<Produit[]>([]);

  useEffect(() => {
    fetch("/api/catalogue")
      .then((r) => r.json())
      .then((data: Produit[]) => {
        setBestsellers(data.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); observer.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [bestsellers]);

  function handleAddToCart(p: Produit) {
    addItem({
      id: p.id,
      nom: p.nom,
      prix: Number(p.prix),
      photoUrl: p.photos[0]?.photoUrl,
    });
    showToast(`${p.nom} ajouté au panier`);
  }

  const imgUrl = (p: Produit, idx: number) => {
    const url = p.photos[0]?.photoUrl;
    if (url) return url;
    const id = UNSPLASH_FALLBACK[idx % UNSPLASH_FALLBACK.length];
    return `https://images.unsplash.com/${id}?w=400&q=80`;
  };

  return (
    <ClientLayout>
      {/* Hero */}
      <section className="hero">
        <img
          src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&q=80"
          alt="Fraisier artisanal"
          className="hero-img"
        />
        <div className="hero-body">
          <p className="hero-eyebrow">Pâtisserie artisanale</p>
          <h1 className="hero-title">Fait avec amour,<br />chaque matin.</h1>
          <p className="hero-sub">Commandez en ligne, retirez en boutique. Fraîcheur garantie.</p>
          <Link href="/catalogue" className="btn-primary">Voir le catalogue</Link>
        </div>
      </section>

      {/* Trust */}
      <section className="trust-section reveal">
        {TRUST_ITEMS.map((item, i) => (
          <div key={i} className="trust-item">
            <div className="trust-icon">{item.icon}</div>
            <div className="trust-title">{item.title}</div>
            <div className="trust-sub">{item.sub}</div>
          </div>
        ))}
      </section>

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="section-title">Nos incontournables</h2>
            <Link href="/catalogue" className="section-link">Tout voir</Link>
          </div>
          <div className="prod-grid">
            {bestsellers.map((p, i) => (
              <article key={p.id} className="prod-card reveal">
                <div className="prod-img-wrap">
                  <img src={imgUrl(p, i)} alt={p.nom} className="prod-img" loading="lazy" />
                </div>
                <div className="prod-body">
                  <div className="prod-name">{p.nom}</div>
                  {p.description && <div className="prod-desc">{p.description}</div>}
                  <div className="prod-foot">
                    <span className="prod-price">{Number(p.prix).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span>
                    <button className="btn-add" onClick={() => handleAddToCart(p)} aria-label={`Ajouter ${p.nom}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Story */}
      <section className="story-section reveal">
        <div className="story-img-wrap">
          <img
            src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&q=80"
            alt="Notre fournil"
            className="story-img"
          />
        </div>
        <div className="story-body">
          <p className="story-eyebrow">Notre histoire</p>
          <h2 className="story-title">Une passion transmise de mère en fille</h2>
          <p className="story-text">
            Depuis 1987, Françoise perpétue les recettes familiales avec une seule obsession :
            la qualité. Chaque matin, nos artisans préparent pour vous des créations fraîches,
            sans conservateurs, avec des ingrédients soigneusement sélectionnés.
          </p>
          <Link href="/commande" className="btn-outline">Nous contacter</Link>
        </div>
      </section>

      {/* Avis */}
      <section className="section reveal">
        <div className="section-head">
          <h2 className="section-title">Ce que disent nos clients</h2>
        </div>
        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-stars">
                {Array.from({ length: r.note }).map((_, j) => <StarIcon key={j} />)}
              </div>
              <p className="review-text">{r.text}</p>
              <div className="review-name">{r.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-brand">Pâtisserie Françoise</div>
        <p className="footer-copy">Artisans pâtissiers depuis 1987</p>
        <div className="footer-links">
          <Link href="/catalogue">Catalogue</Link>
          <Link href="/panier">Panier</Link>
          <Link href="/commande">Contact</Link>
        </div>
      </footer>
    </ClientLayout>
  );
}
