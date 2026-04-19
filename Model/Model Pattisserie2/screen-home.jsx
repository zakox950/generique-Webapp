// Atelier Kern — screens

function KernHome({ onNav, onOpenProduct, tweaks }) {
  const featured = KERN_PRODUCTS.slice(0, 5);
  return (
    <div className="kern-page">
      {/* HERO */}
      <section style={{
        position: 'relative',
        padding: '88px 24px 48px',
        minHeight: 560,
      }}>
        {/* giant 01 numeral */}
        {tweaks.showNumerals && (
          <div style={{
            position: 'absolute',
            right: -12,
            top: 72,
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 200,
            lineHeight: 1,
            color: 'rgba(245,240,232,0.04)',
            letterSpacing: '-0.05em',
            userSelect: 'none',
            pointerEvents: 'none',
          }}>01</div>
        )}

        {/* editorial horizontal rule at ~60% */}
        {tweaks.showRule && (
          <div className="kern-editorial-rule" style={{ top: 400 }} />
        )}

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="kern-eyebrow" style={{ marginBottom: 20 }}>
            Atelier Kern · Bruxelles
          </div>

          <h1 className="kern-syne" style={{
            fontSize: 56,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            color: 'var(--creme)',
            marginBottom: 4,
          }}>
            <div style={{ fontWeight: 700 }}>L'art du sucré,</div>
            <div style={{ fontWeight: 400, color: 'var(--creme)' }}>sans compromis.</div>
          </h1>

          <p className="kern-outfit" style={{
            marginTop: 28,
            maxWidth: 260,
            fontSize: 13,
            fontWeight: 300,
            lineHeight: 1.55,
            color: 'var(--creme-dim)',
          }}>
            Pâtisserie artisanale · Click &amp; Collect.
            Cuissons du matin, quantités limitées. Commandez la veille pour les événements.
          </p>

          <div style={{ marginTop: 40, display: 'flex', gap: 10 }}>
            <button className="kern-btn" onClick={() => onNav('catalogue')}>
              Voir la sélection
            </button>
            <button className="kern-btn kern-btn-ghost" onClick={() => onNav('contact')}>
              Commander
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED STRIP */}
      <section style={{ position: 'relative', paddingTop: 24 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          padding: '0 24px',
          marginBottom: 20,
        }}>
          <div>
            <div className="kern-eyebrow" style={{ marginBottom: 8 }}>Sélection</div>
            <h2 className="kern-syne" style={{
              fontSize: 32, fontWeight: 600, letterSpacing: '-0.01em',
              color: 'var(--creme)',
            }}>Ce qu'on fait bien.</h2>
          </div>
          <button
            onClick={() => onNav('catalogue')}
            style={{
              background: 'transparent', border: 'none',
              color: 'var(--terracotta)',
              fontFamily: 'Outfit', fontSize: 10, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.14em',
              cursor: 'pointer', paddingBottom: 4,
              borderBottom: '1px solid var(--terracotta-border)',
            }}>
            Tout voir
          </button>
        </div>

        <div className="kern-scroll" style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          padding: '0 24px 8px',
          scrollSnapType: 'x mandatory',
        }}>
          {featured.map(p => (
            <div
              key={p.id}
              onClick={() => onOpenProduct(p)}
              className="kern-card"
              style={{
                flexShrink: 0,
                width: 180,
                scrollSnapAlign: 'start',
                cursor: 'pointer',
              }}>
              <div style={{
                height: 220,
                borderRadius: 12,
                border: '1px solid var(--vert-border)',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <KernThumbnail tone={p.tone} name={p.name} size={220} rounded={12} />
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
                  <div className="kern-syne" style={{
                    fontSize: 13, fontWeight: 700, color: 'var(--terracotta)', marginTop: 2,
                  }}>{p.price}€</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SAVOIR-FAIRE — editorial list */}
      <section style={{ position: 'relative', padding: '56px 24px 32px' }}>
        <div className="kern-eyebrow" style={{ marginBottom: 8 }}>Savoir-faire</div>
        <h2 className="kern-syne" style={{
          fontSize: 32, fontWeight: 600, letterSpacing: '-0.01em',
          color: 'var(--creme)', marginBottom: 32,
        }}>Pourquoi nous.</h2>

        {[
          { n: '01', t: 'Beurre Bordier, exclusivement.', d: 'Pas de compromis sur la matière grasse. Tous les feuilletages au beurre AOP baratté à Noyal.' },
          { n: '02', t: 'Farines anciennes, moulins belges.', d: 'Froment T65 du Brabant, épeautre bio, seigle. Mouture à la meule, jamais de blé améliorant.' },
          { n: '03', t: 'Cuissons du matin, zéro stock.', d: 'Tout ce qui est vendu a été cuit entre 4h et 11h. Ce qui reste part chez les voisins à 19h.' },
        ].map(v => (
          <div key={v.n} style={{
            display: 'flex', gap: 20,
            padding: '22px 0',
            borderBottom: '1px solid var(--vert-border)',
          }}>
            <div className="kern-syne" style={{
              fontSize: 28, fontWeight: 400,
              color: 'var(--terracotta)',
              flexShrink: 0,
              lineHeight: 1,
              marginTop: 4,
            }}>{v.n}</div>
            <div style={{ flex: 1 }}>
              <div className="kern-syne" style={{
                fontSize: 17, fontWeight: 600,
                color: 'var(--creme)',
                lineHeight: 1.25,
                marginBottom: 6,
              }}>{v.t}</div>
              <div className="kern-outfit" style={{
                fontSize: 13, fontWeight: 300,
                color: 'var(--creme-dim)',
                lineHeight: 1.55,
              }}>{v.d}</div>
            </div>
          </div>
        ))}
      </section>

      {/* HORAIRES / ADRESSE BLOCK */}
      <section style={{ padding: '0 24px 48px' }}>
        <div style={{
          background: 'var(--vert-elevated)',
          border: '1px solid var(--vert-border)',
          borderRadius: 12,
          padding: 24,
        }}>
          <div className="kern-eyebrow" style={{ marginBottom: 16 }}>Atelier</div>
          <div className="kern-syne" style={{
            fontSize: 22, fontWeight: 600, color: 'var(--creme)', lineHeight: 1.2,
            marginBottom: 20,
          }}>
            12 rue du Bailli<br/>1050 Ixelles, Bruxelles
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
            paddingTop: 16, borderTop: '1px solid var(--vert-border)',
          }}>
            <div>
              <div className="kern-micro" style={{ color: 'var(--creme-dim)', marginBottom: 6 }}>Mar–Ven</div>
              <div className="kern-outfit" style={{ fontSize: 13, color: 'var(--creme)' }}>7h30 – 19h00</div>
            </div>
            <div>
              <div className="kern-micro" style={{ color: 'var(--creme-dim)', marginBottom: 6 }}>Sam · Dim</div>
              <div className="kern-outfit" style={{ fontSize: 13, color: 'var(--creme)' }}>8h00 – 18h00</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { KernHome });
