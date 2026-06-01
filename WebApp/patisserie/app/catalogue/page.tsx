"use client";
import { useState, useEffect, useRef } from "react";
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

function fallback(idx: number, size = 400) {
  const id = UNSPLASH_FALLBACKS[idx % UNSPLASH_FALLBACKS.length];
  return `https://images.unsplash.com/${id}?w=${size}&q=85`;
}

function imgUrl(p: Produit, idx: number) {
  return p.photos[0]?.photoUrl || fallback(idx);
}

function eur(cents: number) {
  return Number(cents).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

// ────────────────────────────────────────────────
// Product detail modal
// ────────────────────────────────────────────────

interface ProductModalProps {
  produit: Produit;
  prodIdx: number;
  onClose: () => void;
  onAdd: () => void;
}

function ProductModal({ produit, prodIdx, onClose, onAdd }: ProductModalProps) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const photos = produit.photos.length > 0
    ? produit.photos.map((p) => p.photoUrl)
    : [fallback(prodIdx, 800)];

  function prev() { setPhotoIdx((i) => (i - 1 + photos.length) % photos.length); }
  function next() { setPhotoIdx((i) => (i + 1) % photos.length); }

  // Lock body scroll while modal is open
  useEffect(() => {
    const saved = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = saved; };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { if (zoomed) setZoomed(false); else onClose(); return; }
      if (zoomed) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40) next();
    else if (dx > 40) prev();
    touchStartX.current = null;
  }

  const inStock = produit.stockDisponible !== 0;

  return (
    <>
      {/* Bottom-sheet modal */}
      <div className="prod-modal-backdrop" onClick={onClose}>
        <div className="prod-modal" onClick={(e) => e.stopPropagation()}>

          {/* Drag handle */}
          <div className="prod-modal-handle" />

          {/* Close button */}
          <button className="prod-modal-close" onClick={onClose} aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Carousel */}
          <div
            className="prod-carousel"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              key={photoIdx}
              src={photos[photoIdx]}
              alt={`${produit.nom} — photo ${photoIdx + 1}`}
              className="prod-carousel-img"
              onClick={() => setZoomed(true)}
            />

            {photos.length > 1 && (
              <>
                <button
                  className="carousel-arrow carousel-prev"
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Photo précédente"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                <button
                  className="carousel-arrow carousel-next"
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Photo suivante"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
                <div className="carousel-dots">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      className={`carousel-dot${i === photoIdx ? " active" : ""}`}
                      onClick={(e) => { e.stopPropagation(); setPhotoIdx(i); }}
                      aria-label={`Photo ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            <button
              className="carousel-zoom-btn"
              onClick={() => setZoomed(true)}
              aria-label="Zoomer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </button>
          </div>

          {/* Product details */}
          <div className="prod-modal-body">
            <div className="prod-modal-header">
              <h2 className="prod-modal-name">{produit.nom}</h2>
              <div className="prod-modal-price">{eur(produit.prix)}</div>
            </div>

            {produit.description && (
              <p className="prod-modal-desc">{produit.description}</p>
            )}

            {produit.ingredient && (
              <div className="prod-modal-section">
                <div className="prod-modal-section-label">Ingrédients</div>
                <p className="prod-modal-section-text">{produit.ingredient}</p>
              </div>
            )}

            <button
              className="prod-modal-add"
              onClick={() => { onAdd(); }}
              disabled={!inStock}
            >
              {!inStock
                ? "Rupture de stock"
                : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Ajouter au panier
                  </>
                )
              }
            </button>
          </div>
        </div>
      </div>

      {/* Zoom lightbox */}
      {zoomed && (
        <div className="zoom-backdrop" onClick={() => setZoomed(false)}>
          <img
            src={photos[photoIdx]}
            alt={produit.nom}
            className="zoom-img"
            draggable={false}
          />
          <button className="zoom-close" onClick={() => setZoomed(false)} aria-label="Fermer le zoom">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

// ────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────

export default function CataloguePage() {
  const { addItem } = useCart();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<{ produit: Produit; idx: number } | null>(null);

  useEffect(() => {
    fetch("/api/catalogue")
      .then((r) => r.json())
      .then((data) => { setProduits(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function addToCart(p: Produit) {
    addItem({ id: p.id, nom: p.nom, prix: Number(p.prix), photoUrl: p.photos[0]?.photoUrl });
    showToast(`${p.nom} ajouté au panier`);
  }

  const filtered = produits.filter(
    (p) => !search || p.nom.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <ClientLayout>
      <section className="page-hero">
        <h1 className="page-title">Catalogue</h1>
        <p className="page-sub">Nos créations du moment — fraîches, artisanales, sans conservateurs.</p>
      </section>

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
            <article
              key={p.id}
              className="prod-card"
              onClick={() => setDetail({ produit: p, idx: i })}
              style={{ cursor: "pointer" }}
            >
              <div className="prod-img-wrap">
                <img src={imgUrl(p, i)} alt={p.nom} className="prod-img" loading="lazy" />
                {p.stockDisponible === 0 && (
                  <div className="prod-badge-rupture">Rupture</div>
                )}
                {p.photos.length > 1 && (
                  <div className="prod-badge-photos">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                    {p.photos.length}
                  </div>
                )}
              </div>
              <div className="prod-body">
                <div className="prod-name">{p.nom}</div>
                {p.description && <div className="prod-desc">{p.description}</div>}
                <div className="prod-foot">
                  <span className="prod-price">{eur(p.prix)}</span>
                  <button
                    className="btn-add"
                    onClick={(e) => { e.stopPropagation(); addToCart(p); }}
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

      {detail && (
        <ProductModal
          produit={detail.produit}
          prodIdx={detail.idx}
          onClose={() => setDetail(null)}
          onAdd={() => { addToCart(detail.produit); setDetail(null); }}
        />
      )}
    </ClientLayout>
  );
}
