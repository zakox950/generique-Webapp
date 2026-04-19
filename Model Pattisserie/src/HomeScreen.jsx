// Atelier Kern — Home screen (hero + strip produits phares + valeurs editoriale list)

function HomeScreen({ onOpenProduct, onNav }) {
  const T = window.AK_T;
  const { PRODUCTS, VALEURS } = window.AK_DATA;
  const signatures = PRODUCTS.filter(p => ['p1','p2','p7','p4','p9'].includes(p.id));

  return (
    <div style={{ paddingBottom: 140 }}>
      {/* ───────── HERO ───────── */}
      <section style={{
        position: 'relative',
        minHeight: 640,
        padding: '80px 24px 48px',
        boxSizing: 'border-box',
      }}>
        {/* big background numeral 01 */}
        <BgNumeral n="01" side="right" top={70} size={200}/>

        {/* horizontal editorial line at 60% */}
        <div style={{
          position: 'absolute',
          left: 0, right: 0, top: '60%',
          height: 1, background: 'rgba(245,240,232,0.15)',
          pointerEvents: 'none',
        }}/>

        <Eyebrow>Atelier Kern · Bruxelles</Eyebrow>

        <h1 style={{
          fontFamily: T.display,
          color: T.creme,
          margin: '18px 0 0',
          lineHeight: 0.92,
          letterSpacing: '-0.025em',
        }}>
          <span style={{ display: 'block', fontWeight: 700, fontSize: 62 }}>
            L'art du
          </span>
          <span style={{ display: 'block', fontWeight: 400, fontSize: 62, color: T.creme }}>
            sucré, sans
          </span>
          <span style={{ display: 'block', fontWeight: 700, fontSize: 62 }}>
            compromis.
          </span>
        </h1>

        <p style={{
          fontFamily: T.body, fontSize: 13, fontWeight: 300,
          color: T.cremeDim, lineHeight: 1.55,
          maxWidth: 260, marginTop: 28,
        }}>
          Pâtisserie artisanale. Production du matin, quantités limitées, retrait en boutique ou livraison sur devis.
        </p>

        <div style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap' }}>
          <Btn onClick={() => onNav('catalogue')}>Voir le catalogue</Btn>
          <Btn variant="ghost" onClick={() => onNav('contact')}>Commander</Btn>
        </div>

        {/* meta strip at bottom */}
        <div style={{
          position: 'absolute', bottom: 22, left: 24, right: 24,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: T.body, fontSize: 10, fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.2em',
          color: 'rgba(245,240,232,0.45)',
        }}>
          <span>MA—SA · 08h–19h</span>
          <span>RUE DANSAERT 42</span>
        </div>
      </section>

      {/* ───────── STRIP SÉLECTION ───────── */}
      <section style={{ position: 'relative', paddingTop: 48, paddingBottom: 48 }}>
        <BgNumeral n="02" side="left" top={20} size={180}/>

        <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <Eyebrow>Sélection</Eyebrow>
            <h2 style={{
              fontFamily: T.display, fontWeight: 600, fontSize: 38,
              color: T.creme, margin: '10px 0 0',
              letterSpacing: '-0.02em', lineHeight: 1,
            }}>
              Ce qu'on<br/>fait bien.
            </h2>
          </div>
          <button
            onClick={() => onNav('catalogue')}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: T.accent, padding: 0,
              fontFamily: T.body, fontSize: 10, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.2em',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            Tout voir
            <Icon name="arrow" size={12} color={T.accent} strokeWidth={1.6}/>
          </button>
        </div>

        <div style={{
          marginTop: 24,
          display: 'flex', gap: 10,
          overflowX: 'auto',
          padding: '2px 24px 10px',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
        }}>
          {signatures.map((p, i) => (
            <button
              key={p.id}
              onClick={() => onOpenProduct(p)}
              style={{
                flexShrink: 0, width: 172, height: 220,
                borderRadius: 12,
                background: window.AK_DATA.TINTS[i % 3],
                border: `1px solid ${T.vertBorder}`,
                position: 'relative', overflow: 'hidden',
                scrollSnapAlign: 'start',
                padding: 0, cursor: 'pointer', textAlign: 'left',
              }}
            >
              <Thumb tint={window.AK_DATA.TINTS[i % 3]} product={p} big/>
              {/* overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(15,25,20,0.85) 0%, transparent 55%)',
              }}/>
              <div style={{
                position: 'absolute', left: 12, right: 12, bottom: 12,
              }}>
                {p.tag && <Tag style={{ marginBottom: 8 }}>{p.tag}</Tag>}
                <div style={{
                  fontFamily: T.display, fontWeight: 600, fontSize: 18,
                  color: T.creme, letterSpacing: '-0.01em', lineHeight: 1.05,
                }}>{p.name}</div>
                <div style={{
                  fontFamily: T.display, fontWeight: 700, fontSize: 14,
                  color: T.accent, marginTop: 4,
                }}>{p.price.toFixed(2)} €</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ───────── VALEURS — editorial list ───────── */}
      <section style={{
        position: 'relative',
        padding: '48px 24px 40px',
        borderTop: `1px solid ${T.vertBorder}`,
      }}>
        <BgNumeral n="03" side="right" top={20} size={180}/>

        <Eyebrow>Savoir-faire</Eyebrow>
        <h2 style={{
          fontFamily: T.display, fontWeight: 600, fontSize: 38,
          color: T.creme, margin: '10px 0 32px',
          letterSpacing: '-0.02em', lineHeight: 1,
        }}>
          Pourquoi nous.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {VALEURS.map((v, i) => (
            <div key={v.n} style={{
              display: 'flex', alignItems: 'flex-start', gap: 18,
              padding: '22px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${T.vertBorder}`,
            }}>
              <div style={{
                fontFamily: T.display, fontWeight: 400, fontSize: 40,
                color: T.accent, lineHeight: 1, letterSpacing: '-0.03em',
                width: 52, flexShrink: 0,
              }}>{v.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: T.display, fontWeight: 600, fontSize: 20,
                  color: T.creme, lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                }}>{v.title}</div>
                <div style={{
                  fontFamily: T.body, fontSize: 13, fontWeight: 300,
                  color: T.cremeDim, lineHeight: 1.55,
                  marginTop: 6,
                }}>{v.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── footer note ───────── */}
      <section style={{ padding: '24px 24px 40px', textAlign: 'center' }}>
        <div style={{
          fontFamily: T.display, fontWeight: 400, fontSize: 22,
          color: T.creme, letterSpacing: '-0.01em', lineHeight: 1.2,
        }}>
          Atelier Kern<br/>
          <span style={{ color: T.accent, fontWeight: 700 }}>—</span>
        </div>
        <div style={{
          fontFamily: T.body, fontSize: 10, fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.2em',
          color: 'rgba(245,240,232,0.35)',
          marginTop: 14,
        }}>
          Bruxelles · EST. 2024
        </div>
      </section>
    </div>
  );
}

window.HomeScreen = HomeScreen;
