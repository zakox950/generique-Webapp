// Atelier Kern — Cart + Contact screens

function CartScreen({ cart, updateQty, onGoCatalogue, onCheckout }) {
  const T = window.AK_T;
  const { PRODUCTS, TINTS } = window.AK_DATA;
  const lines = cart.map((c, i) => {
    const p = PRODUCTS.find(x => x.id === c.id);
    return { ...p, qty: c.qty, tint: TINTS[i % 3] };
  }).filter(Boolean);

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const service = lines.length > 0 ? 1.50 : 0;
  const total = subtotal + service;

  return (
    <div style={{ paddingBottom: 160 }}>
      <section style={{ position: 'relative', padding: '72px 24px 24px' }}>
        <BgNumeral n="03" side="right" top={60} size={180}/>
        <Eyebrow>Panier</Eyebrow>
        <h1 style={{
          fontFamily: T.display, fontWeight: 600, fontSize: 46,
          color: T.creme, margin: '10px 0 0',
          letterSpacing: '-0.025em', lineHeight: 1,
        }}>
          Votre<br/>
          <span style={{ fontWeight: 400 }}>sélection.</span>
        </h1>
      </section>

      {lines.length === 0 ? (
        <div style={{
          padding: '40px 24px',
          textAlign: 'center',
        }}>
          <div style={{
            margin: '0 auto 24px', width: 80, height: 80,
            borderRadius: 12, background: T.vertElevated,
            border: `1px solid ${T.vertBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="bag" size={32} color="rgba(245,240,232,0.35)" strokeWidth={1.4}/>
          </div>
          <div style={{
            fontFamily: T.display, fontWeight: 600, fontSize: 22,
            color: T.creme, letterSpacing: '-0.01em',
          }}>Rien pour l'instant.</div>
          <div style={{
            fontFamily: T.body, fontSize: 13, fontWeight: 300,
            color: T.cremeDim, marginTop: 8,
          }}>Le catalogue change chaque matin.</div>
          <div style={{ marginTop: 24 }}>
            <Btn onClick={onGoCatalogue}>Voir le catalogue</Btn>
          </div>
        </div>
      ) : (
        <>
          <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {lines.map(l => (
              <div key={l.id} style={{
                display: 'flex', gap: 14, alignItems: 'stretch',
                background: T.vertSurface,
                border: `1px solid ${T.vertBorder}`,
                borderRadius: 12, padding: 12,
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 8,
                  background: l.tint, position: 'relative', overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  <Thumb tint={l.tint} product={l}/>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{
                      fontFamily: T.body, fontSize: 9, fontWeight: 600,
                      textTransform: 'uppercase', letterSpacing: '0.2em',
                      color: 'rgba(245,240,232,0.45)',
                    }}>{l.catLabel}</div>
                    <div style={{
                      fontFamily: T.display, fontWeight: 600, fontSize: 16,
                      color: T.creme, letterSpacing: '-0.01em',
                      marginTop: 2,
                    }}>{l.name}</div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    {/* qty */}
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      height: 30, borderRadius: 100,
                      background: T.vertElevated,
                      border: `1px solid ${T.vertBorder}`,
                      overflow: 'hidden',
                    }}>
                      <button onClick={() => updateQty(l.id, l.qty - 1)} style={qtyBtn}>
                        <Icon name="minus" size={13} color={T.creme} strokeWidth={1.8}/>
                      </button>
                      <div style={{
                        minWidth: 20, textAlign: 'center',
                        fontFamily: T.body, fontSize: 13, fontWeight: 600,
                        color: T.creme, padding: '0 4px',
                      }}>{l.qty}</div>
                      <button onClick={() => updateQty(l.id, l.qty + 1)} style={qtyBtn}>
                        <Icon name="plus" size={13} color={T.creme} strokeWidth={1.8}/>
                      </button>
                    </div>
                    <div style={{
                      fontFamily: T.display, fontWeight: 700, fontSize: 18,
                      color: T.accent,
                    }}>{(l.price * l.qty).toFixed(2)} €</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* recap */}
          <div style={{ padding: '28px 24px 0' }}>
            <div style={{
              background: T.vertElevated,
              border: `1px solid ${T.vertBorder}`,
              borderRadius: 12, padding: '18px 18px 20px',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontFamily: T.body, fontSize: 13,
                color: T.cremeDim, marginBottom: 8,
              }}>
                <span>Sous-total</span>
                <span style={{ color: T.creme }}>{subtotal.toFixed(2)} €</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontFamily: T.body, fontSize: 13,
                color: T.cremeDim, marginBottom: 14,
              }}>
                <span>Préparation & emballage</span>
                <span style={{ color: T.creme }}>{service.toFixed(2)} €</span>
              </div>
              <div style={{ height: 1, background: T.vertBorder, marginBottom: 14 }}/>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              }}>
                <span style={{
                  fontFamily: T.body, fontSize: 10, fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.2em',
                  color: T.cremeDim,
                }}>Total TTC</span>
                <span style={{
                  fontFamily: T.display, fontWeight: 700, fontSize: 30,
                  color: T.accent, letterSpacing: '-0.01em',
                }}>{total.toFixed(2)} €</span>
              </div>

              <div style={{ marginTop: 18 }}>
                <Btn variant="solid" fullWidth onClick={onCheckout}>
                  Click & Collect — Payer
                </Btn>
              </div>
              <div style={{
                marginTop: 12, textAlign: 'center',
                fontFamily: T.body, fontSize: 10, fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '0.2em',
                color: 'rgba(245,240,232,0.4)',
              }}>
                Retrait demain · dès 08h30
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const qtyBtn = {
  width: 32, height: 30, padding: 0,
  background: 'transparent', border: 'none',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

// ─────────────────────────────────────────────────────
// Contact screen
// ─────────────────────────────────────────────────────

function ContactScreen({ onSubmitted }) {
  const T = window.AK_T;
  const [form, setForm] = React.useState({ name: '', email: '', message: '' });
  const [quote, setQuote] = React.useState({ event: '', date: '', pieces: '', notes: '' });
  const [focus, setFocus] = React.useState('');

  const field = (key, obj, setObj) => ({
    value: obj[key],
    onChange: e => setObj({ ...obj, [key]: e.target.value }),
    onFocus: () => setFocus(key),
    onBlur: () => setFocus(''),
  });

  const inputStyle = (key) => ({
    width: '100%',
    background: T.vertElevated,
    border: `1px solid ${focus === key ? T.accent : T.vertBorder}`,
    borderRadius: 10,
    padding: '13px 16px',
    color: T.creme,
    fontFamily: T.body, fontSize: 14, fontWeight: 400,
    boxShadow: focus === key ? '0 0 0 3px rgba(212,96,58,0.12)' : 'none',
    outline: 'none',
    transition: 'border-color 180ms ease, box-shadow 180ms ease',
    boxSizing: 'border-box',
  });

  const labelStyle = {
    fontFamily: T.body, fontSize: 10, fontWeight: 500,
    textTransform: 'uppercase', letterSpacing: '0.2em',
    color: 'rgba(245,240,232,0.55)',
    marginBottom: 8,
    display: 'block',
  };

  return (
    <div style={{ paddingBottom: 160 }}>
      <section style={{ position: 'relative', padding: '72px 24px 0' }}>
        <BgNumeral n="04" side="right" top={60} size={180}/>
        <Eyebrow>Commander</Eyebrow>
        <h1 style={{
          fontFamily: T.display, fontWeight: 600, fontSize: 46,
          color: T.creme, margin: '10px 0 0',
          letterSpacing: '-0.025em', lineHeight: 1,
        }}>
          Nous<br/>
          <span style={{ fontWeight: 400 }}>parler.</span>
        </h1>
      </section>

      {/* Editorial contact hero block with left terracotta accent */}
      <div style={{ padding: '28px 24px 0' }}>
        <div style={{
          background: T.vertElevated,
          borderLeft: `3px solid ${T.accent}`,
          borderRadius: 8,
          padding: '18px 18px 18px 22px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '14px 16px',
            alignItems: 'center',
          }}>
            <Icon name="pin" size={18} color={T.accent}/>
            <div style={{ fontFamily: T.body, fontSize: 13, color: T.creme }}>
              Rue Dansaert 42 · 1000 Bruxelles
            </div>
            <Icon name="clock" size={18} color={T.accent}/>
            <div style={{ fontFamily: T.body, fontSize: 13, color: T.creme }}>
              Ma–Sa · 08h00 – 19h00
            </div>
            <Icon name="mail" size={18} color={T.accent}/>
            <div style={{ fontFamily: T.body, fontSize: 13, color: T.creme }}>
              bonjour@atelier-kern.be
            </div>
          </div>
        </div>
      </div>

      {/* Contact form */}
      <section style={{ padding: '36px 24px 0' }}>
        <div style={{
          fontFamily: T.body, fontSize: 10, fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.2em',
          color: T.accent, marginBottom: 18,
        }}>Message général</div>

        <label style={labelStyle}>Nom</label>
        <input style={inputStyle('name')} placeholder="Votre nom" {...field('name', form, setForm)} />

        <div style={{ height: 14 }}/>
        <label style={labelStyle}>Email</label>
        <input style={inputStyle('email')} placeholder="vous@email.com" {...field('email', form, setForm)} />

        <div style={{ height: 14 }}/>
        <label style={labelStyle}>Message</label>
        <textarea
          rows={4}
          style={{ ...inputStyle('message'), resize: 'none', minHeight: 96, fontFamily: T.body }}
          placeholder="Une question, une remarque…"
          {...field('message', form, setForm)}
        />

        <div style={{ marginTop: 22 }}>
          <Btn variant="solid" fullWidth onClick={onSubmitted}>Envoyer</Btn>
        </div>
      </section>

      {/* Divider + devis */}
      <div style={{ padding: '44px 24px 0' }}>
        <div style={{ height: 1, background: T.vertBorder, marginBottom: 18 }}/>
        <div style={{
          fontFamily: T.body, fontSize: 10, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.22em',
          color: T.accent, marginBottom: 6,
        }}>Commande événement (15 pièces et +)</div>
        <p style={{
          fontFamily: T.body, fontSize: 13, fontWeight: 300,
          color: T.cremeDim, lineHeight: 1.55, margin: 0,
        }}>
          Mariages, entreprises, réceptions. Devis personnalisé sous 48h ouvrées.
        </p>
      </div>

      <section style={{ padding: '24px 24px 0' }}>
        <label style={labelStyle}>Type d'événement</label>
        <input style={inputStyle('event')} placeholder="Mariage, cocktail d'entreprise…" {...field('event', quote, setQuote)} />

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Date</label>
            <input style={inputStyle('date')} placeholder="JJ / MM / AAAA" {...field('date', quote, setQuote)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Pièces</label>
            <input style={inputStyle('pieces')} placeholder="15+" {...field('pieces', quote, setQuote)} />
          </div>
        </div>

        <div style={{ height: 14 }}/>
        <label style={labelStyle}>Précisions</label>
        <textarea
          rows={3}
          style={{ ...inputStyle('notes'), resize: 'none', minHeight: 80, fontFamily: T.body }}
          placeholder="Allergies, goûts, inspirations…"
          {...field('notes', quote, setQuote)}
        />

        <div style={{ marginTop: 22 }}>
          <Btn variant="solid" fullWidth onClick={onSubmitted}>Demander un devis</Btn>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { CartScreen, ContactScreen });
