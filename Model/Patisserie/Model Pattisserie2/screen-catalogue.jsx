// Atelier Kern — Catalogue screen

function KernCatalogue({ onOpenProduct, tweaks }) {
  const [filter, setFilter] = React.useState('Tout');

  const list = filter === 'Tout'
    ? KERN_PRODUCTS
    : KERN_PRODUCTS.filter(p => p.category === filter || p.tag === filter);

  // Assign sizes in a varied pattern for asymmetric grid
  const sizeAt = (i) => ['tall', 'normal', 'normal', 'wide', 'normal', 'tall', 'wide', 'normal'][i % 8];

  return (
    <div className="kern-page">
      <section style={{ padding: '60px 24px 0', position: 'relative' }}>
        {tweaks.showNumerals && (
          <div style={{
            position: 'absolute',
            right: -8, top: 32,
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 140,
            lineHeight: 1,
            color: 'rgba(245,240,232,0.045)',
            userSelect: 'none',
            pointerEvents: 'none',
            letterSpacing: '-0.05em',
          }}>02</div>
        )}
        <div style={{ position: 'relative' }}>
          <div className="kern-eyebrow" style={{ marginBottom: 12 }}>Catalogue</div>
          <h1 className="kern-syne" style={{
            fontSize: 44, fontWeight: 700, letterSpacing: '-0.02em',
            lineHeight: 0.95, color: 'var(--creme)',
          }}>
            Toute<br/>
            <span style={{ fontWeight: 400 }}>la carte.</span>
          </h1>
          <p className="kern-outfit" style={{
            marginTop: 16, maxWidth: 280,
            fontSize: 13, fontWeight: 300,
            color: 'var(--creme-dim)', lineHeight: 1.55,
          }}>
            {list.length} pièces disponibles aujourd'hui. Commande minimum 15 pièces pour événements.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="kern-scroll" style={{
        display: 'flex', gap: 8,
        overflowX: 'auto',
        padding: '28px 24px 20px',
      }}>
        {KERN_CATEGORIES.map(c => (
          <button
            key={c}
            className={`kern-filter ${filter === c ? 'active' : ''}`}
            onClick={() => setFilter(c)}
          >{c}</button>
        ))}
      </div>

      {/* Asymmetric grid — CSS grid with auto-rows masonry-lite */}
      <div style={{
        padding: '0 14px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        gridAutoRows: 10,
      }}>
        {list.map((p, i) => {
          const sz = sizeAt(i);
          const rowSpan = sz === 'tall' ? 24 : sz === 'wide' ? 16 : 20;
          return (
            <div
              key={p.id}
              className="kern-card"
              onClick={() => onOpenProduct(p)}
              style={{
                gridRow: `span ${rowSpan}`,
                borderRadius: 12,
                border: '1px solid var(--vert-border)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
              }}>
              <KernThumbnail tone={p.tone} name={p.name} size={200} rounded={12} />
              {p.tag && (
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <span className="kern-tag">{p.tag}</span>
                </div>
              )}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(15,25,20,0.85) 0%, transparent 55%)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12 }}>
                <div className="kern-syne" style={{
                  fontSize: 16, fontWeight: 600, color: 'var(--creme)', lineHeight: 1.15,
                }}>{p.name}</div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  marginTop: 3,
                }}>
                  <div className="kern-micro" style={{ color: 'var(--creme-dim)' }}>
                    {p.category}
                  </div>
                  <div className="kern-syne" style={{
                    fontSize: 14, fontWeight: 700, color: 'var(--terracotta)',
                  }}>{p.price}€</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {list.length === 0 && (
        <div style={{
          padding: '48px 24px', textAlign: 'center', color: 'var(--creme-dim)',
        }}>
          <div className="kern-syne" style={{ fontSize: 20, color: 'var(--creme)', marginBottom: 8 }}>Rien dans cette catégorie.</div>
          <div className="kern-outfit" style={{ fontSize: 13 }}>Essayez une autre sélection.</div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { KernCatalogue });
