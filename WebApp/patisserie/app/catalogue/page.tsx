"use client";
import { useState, useEffect } from "react";
import ClientLayout, { showToast } from "@/components/ClientLayout";
import { useCart } from "@/hooks/useCart";

interface Produit {
  id: number;
  nom: string;
  prix: number;
  description?: string;
  ingredient?: string;
  modeVente?: string;
  isActif: boolean;
  stockDisponible?: number;
  photos: { photoUrl: string }[];
}

const UNSPLASH_FALLBACKS = [
  "photo-1612203985729-70726954388c",
  "photo-1555507036-ab1f4038808a",
  "photo-1488477181946-6428a0291777",
  "photo-1464349095431-e9a21285b5f3",
  "photo-1558618666-fcd25c85cd64",
  "photo-1571115177098-24ec42ed204d",
  "photo-1606890737304-57a1ca8a5b62",
  "photo-1551404973-761c83cd8339",
];

const CATEGORIES = ["Tous", "Viennoiseries", "Gâteaux", "Tartes", "Individuels"];

function imgUrl(p: Produit, idx: number) {
  const url = p.photos[0]?.photoUrl;
  if (url) return url;
  const id = UNSPLASH_FALLBACKS[idx % UNSPLASH_FALLBACKS.length];
  return `https://images.unsplash.com/${id}?w=400&q=80`;
}

function eur(cents: number) {
  return Number(cents).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export default function CataloguePage() {
  const { addItem } = useCart();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/catalogue")
      .then((r) => r.json())
      .then((data) => { setProduits(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function handleAdd(p: Produit) {
    addItem({ id: p.id, nom: p.nom, prix: Number(p.prix), photoUrl: p.photos[0]?.photoUrl });
    showToast(`${p.nom} ajouté au panier`);
  }

  const filtered = produits.filter((p) => {
    const matchSearch = !search || p.nom.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <ClientLayout>
      <section className="page-hero">
        <h1 className="page-title">Catalogue</h1>
        <p className="page-sub">Nos créations du moment — fraîches, artisanales, sans conservateurs.</p>
      </section>

      {/* Barre recherche */}
      <div className="search-wrap">
        <div className="search-field">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" style={{ opacity: 0.5 }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="search"
            placeholder="Rechercher un produit…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Chips catégories */}
      <div className="chips-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`chip${activeCategory === cat ? " active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grille */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Chargement du catalogue…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>Aucun produit trouvé.</p>
        </div>
      ) : (
        <div className="prod-grid padded">
          {filtered.map((p, i) => (
            <article key={p.id} className="prod-card">
              <div className="prod-img-wrap">
                <img src={imgUrl(p, i)} alt={p.nom} className="prod-img" loading="lazy" />
                {p.stockDisponible === 0 && (
                  <div className="prod-badge-rupture">Rupture</div>
                )}
              </div>
              <div className="prod-body">
                <div className="prod-name">{p.nom}</div>
                {p.description && <div className="prod-desc">{p.description}</div>}
                {p.ingredient && <div className="prod-ingredients">{p.ingredient}</div>}
                <div className="prod-foot">
                  <span className="prod-price">{eur(p.prix)}</span>
                  <button
                    className="btn-add"
                    onClick={() => handleAdd(p)}
                    disabled={p.stockDisponible === 0}
                    aria-label={`Ajouter ${p.nom}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <footer className="site-footer">
        <div className="footer-brand">Pâtisserie Françoise</div>
        <p className="footer-copy">Artisans pâtissiers depuis 1987</p>
      </footer>
    </ClientLayout>
  );
}
