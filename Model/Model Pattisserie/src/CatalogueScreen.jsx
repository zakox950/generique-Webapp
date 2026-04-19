// Atelier Kern — Catalogue screen

function CatalogueScreen({ onOpenProduct }) {
  const T = window.AK_T;
  const { PRODUCTS, CATEGORIES, TINTS } = window.AK_DATA;
  const [filter, setFilter] = React.useState('all');

  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);

  // Assign tints avoiding neighbors
  const tinted = React.useMemo(() => {
    const out = [];
    let last = -1;
    filtered.forEach((p, i) => {
      let t = i % 3;
      if (t === last) t = (t + 1) % 3;
      last = t;
      out.push({ ...p, tint: TINTS[t] });
    });
    return out;
  }, [filtered]);

  return (
    <div style={{ paddingBottom: 140 }}>
      {/* header */}
      <section style={{ position: 'relative', padding: '72px 24px 20px' }}>
        <BgNumeral n="02" side="right" top={60} size={180}/>
        <Eyebrow>Catalogue</Eyebrow>
        <h1 style={{
          fontFamily: T.display, fontWeight: 600, fontSize: 46,
          color: T.creme, margin: '10px 0 0',
          letterSpacing: '-0.025em', lineHeight: 1,
        }}>
          Tout ce qui sort<br/>
          <span style={{ fontWeight: 400 }}>du four.</span>
        </h1>
        <p style={{
          fontFamily: T.body, fontSize: 13, fontWeight: 300,
          color: T.cremeDim, lineHeight: 1.55,
          maxWidth: 280, marginTop: 18,
        }}>
          Production du matin. Quantités limitées. Certains articles disparaissent avant midi.
        </p>
      </section>

      {/* filter pills */}
      <div style={{
        display: 'flex', gap: 8,
        overflowX: 'auto',
        padding: '12px 24px 20px',
        scrollbarWidth: 'none',
      }}>
        {CATEGORIES.map(c => {
          const active = filter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              style={{
                flexShrink: 0,
                height: 34, padding: '0 16px',
                borderRadius: 100,
                background: active ? T.accent : T.vertElevated,
                border: `1px solid ${active ? T.accent : T.vertBorder}`,
                color: active ? T.creme : 'rgba(245,240,232,0.75)',
                fontFamily: T.body, fontSize: 11, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.14em',
                cursor: 'pointer',
                transition: 'background 180ms ease, color 180ms ease, border-color 180ms ease',
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* grid — asymmetric: 2 cols, tall/normal/wide */}
      <div style={{ padding: '0 14px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          gridAutoFlow: 'dense',
        }}>
          {tinted.map((p, i) => {
            const heights = { tall: 280, normal: 210, wide: 170 };
            const span = p.shape === 'wide' ? { gridColumn: 'span 2' } : {};
            return (
              <button
                key={p.id}
                onClick={() => onOpenProduct(p)}
                style={{
                  height: heights[p.shape] || 210,
                  background: p.tint,
                  border: `1px solid ${T.vertBorder}`,
                  borderRadius: 12,
                  position: 'relative',
                  overflow: 'hidden',
                  padding: 0,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'transform 160ms ease',
                  ...span,
                }}
                onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
                onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Thumb tint={p.tint} product={p} big={p.shape !== 'wide'}/>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(15,25,20,0.85) 0%, transparent 55%)',
                }}/>
                <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14 }}>
                  {p.tag && <Tag style={{ marginBottom: 8 }}>{p.tag}</Tag>}
                  <div style={{
                    fontFamily: T.body, fontSize: 9, fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.2em',
                    color: 'rgba(245,240,232,0.55)',
                    marginBottom: 4,
                  }}>{p.catLabel}</div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-end', gap: 10,
                  }}>
                    <div style={{
                      fontFamily: T.display, fontWeight: 600, fontSize: 16,
                      color: T.creme, letterSpacing: '-0.01em', lineHeight: 1.08,
                    }}>{p.name}</div>
                    <div style={{
                      fontFamily: T.display, fontWeight: 700, fontSize: 13,
                      color: T.accent, flexShrink: 0,
                    }}>{p.price.toFixed(2)} €</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* end rule */}
      <div style={{ padding: '48px 24px 0' }}>
        <div style={{ height: 1, background: T.vertBorder }}/>
        <div style={{
          textAlign: 'center', marginTop: 18,
          fontFamily: T.body, fontSize: 10, fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.25em',
          color: 'rgba(245,240,232,0.35)',
        }}>
          {filtered.length} pièces · fin de sélection
        </div>
      </div>
    </div>
  );
}

window.CatalogueScreen = CatalogueScreen;
