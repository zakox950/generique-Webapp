// Atelier Kern — Cart & Contact screens

function KernCart({ cart, onInc, onDec, onRemove, onNav, onCheckout }) {
  const items = Object.values(cart).filter(c => c.qty > 0);
  const subtotal = items.reduce((s, c) => s + c.product.price * c.qty, 0);

  return (
    <div className="kern-page">
      <section style={{ padding: '60px 24px 0', position: 'relative' }}>
        <div className="kern-eyebrow" style={{ marginBottom: 12 }}>Panier</div>
        <h1 className="kern-syne" style={{
          fontSize: 44, fontWeight: 700, letterSpacing: '-0.02em',
          lineHeight: 0.95, color: 'var(--creme)',
        }}>
          {items.length > 0 ? "Votre" : "Panier"}<br/>
          <span style={{ fontWeight: 400 }}>{items.length > 0 ? "sélection." : "vide."}</span>
        </h1>
      </section>

      {items.length === 0 && (
        <div style={{
          padding: '48px 24px', textAlign: 'center',
        }}>
          <p className="kern-outfit" style={{
            fontSize: 13, color: 'var(--creme-dim)', marginBottom: 24,
          }}>
            Commencez par explorer la carte du jour.
          </p>
          <button className="kern-btn" onClick={() => onNav('catalogue')}>
            Voir le catalogue
          </button>
        </div>
      )}

      {items.length > 0 && (
        <>
          <div style={{ padding: '32px 24px 0' }}>
            {items.map((c, i) => (
              <div key={c.product.id} style={{
                display: 'flex', gap: 14,
                padding: '18px 0',
                borderBottom: i < items.length - 1 ? '1px solid var(--vert-border)' : 'none',
              }}>
                <div style={{
                  width: 72, height: 72,
                  borderRadius: 10,
                  overflow: 'hidden',
                  border: '1px solid var(--vert-border)',
                  flexShrink: 0,
                }}>
                  <KernThumbnail tone={c.product.tone} name={c.product.name} size={72} rounded={10} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="kern-micro" style={{ color: 'var(--creme-dim)', marginBottom: 4 }}>
                    {c.product.category}
                  </div>
                  <div className="kern-syne" style={{
                    fontSize: 16, fontWeight: 600, color: 'var(--creme)',
                    lineHeight: 1.2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{c.product.name}</div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginTop: 10,
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      background: 'var(--vert-elevated)',
                      border: '1px solid var(--vert-border)',
                      borderRadius: 100,
                      padding: 2,
                    }}>
                      <button onClick={() => c.qty > 1 ? onDec(c.product.id) : onRemove(c.product.id)}
                        style={{
                          width: 26, height: 26, borderRadius: 100,
                          background: 'transparent', border: 'none',
                          color: 'var(--creme)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                        <KernIcon name={c.qty > 1 ? "minus" : "close"} size={12} color="var(--creme)" />
                      </button>
                      <div className="kern-syne" style={{
                        minWidth: 22, textAlign: 'center',
                        fontSize: 13, fontWeight: 600, color: 'var(--creme)',
                      }}>{c.qty}</div>
                      <button onClick={() => onInc(c.product.id)}
                        style={{
                          width: 26, height: 26, borderRadius: 100,
                          background: 'transparent', border: 'none',
                          color: 'var(--creme)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                        <KernIcon name="plus" size={12} color="var(--creme)" />
                      </button>
                    </div>
                    <div className="kern-syne" style={{
                      fontSize: 16, fontWeight: 700, color: 'var(--terracotta)',
                    }}>{(c.product.price * c.qty)}€</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recap */}
          <div style={{ padding: '24px 24px 0' }}>
            <div style={{
              background: 'var(--vert-elevated)',
              border: '1px solid var(--vert-border)',
              borderRadius: 12,
              padding: 20,
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontFamily: 'Outfit', fontSize: 13,
                color: 'var(--creme-dim)',
                marginBottom: 10,
              }}>
                <span>Sous-total ({items.reduce((s,c) => s + c.qty, 0)} pièces)</span>
                <span style={{ color: 'var(--creme)' }}>{subtotal}€</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontFamily: 'Outfit', fontSize: 13,
                color: 'var(--creme-dim)',
                marginBottom: 16,
                paddingBottom: 16,
                borderBottom: '1px solid var(--vert-border)',
              }}>
                <span>Retrait atelier</span>
                <span style={{ color: 'var(--creme)' }}>Gratuit</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              }}>
                <div className="kern-syne" style={{
                  fontSize: 14, fontWeight: 600,
                  color: 'var(--creme)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>Total</div>
                <div className="kern-syne" style={{
                  fontSize: 28, fontWeight: 700, color: 'var(--terracotta)',
                }}>{subtotal}€</div>
              </div>

              <button
                onClick={onCheckout}
                style={{
                  width: '100%',
                  height: 52,
                  marginTop: 20,
                  borderRadius: 10,
                  background: 'var(--terracotta)',
                  color: 'var(--creme)',
                  border: 'none',
                  fontFamily: 'Outfit', fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  cursor: 'pointer',
                }}>
                Confirmer la commande
              </button>
              <div className="kern-outfit" style={{
                textAlign: 'center', marginTop: 12,
                fontSize: 11, color: 'var(--creme-dim)',
              }}>
                Retrait à l'atelier · 12 rue du Bailli
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function KernContact({ onNav, onSubmit }) {
  const [sent, setSent] = React.useState(null);

  return (
    <div className="kern-page">
      <section style={{ padding: '60px 24px 0', position: 'relative' }}>
        <div className="kern-eyebrow" style={{ marginBottom: 12 }}>Contact</div>
        <h1 className="kern-syne" style={{
          fontSize: 44, fontWeight: 700, letterSpacing: '-0.02em',
          lineHeight: 0.95, color: 'var(--creme)',
        }}>
          Écrivez-<br/>
          <span style={{ fontWeight: 400 }}>nous.</span>
        </h1>
      </section>

      {/* Editorial hero block */}
      <section style={{ padding: '24px 24px 0' }}>
        <div style={{
          background: 'var(--vert-elevated)',
          borderLeft: '3px solid var(--terracotta)',
          padding: '20px 20px 20px 20px',
          borderRadius: '0 12px 12px 0',
        }}>
          <div className="kern-outfit" style={{
            fontSize: 13, fontWeight: 300, color: 'var(--creme)',
            lineHeight: 1.6,
          }}>
            Une question, une commande particulière, un événement ?<br/>
            Réponse sous 24h ouvrées.
          </div>
          <div style={{
            marginTop: 14, display: 'flex', gap: 20, flexWrap: 'wrap',
          }}>
            <div>
              <div className="kern-micro" style={{ color: 'var(--creme-dim)', marginBottom: 4 }}>Email</div>
              <div className="kern-outfit" style={{ fontSize: 13, color: 'var(--creme)' }}>bonjour@atelierkern.be</div>
            </div>
            <div>
              <div className="kern-micro" style={{ color: 'var(--creme-dim)', marginBottom: 4 }}>Tél</div>
              <div className="kern-outfit" style={{ fontSize: 13, color: 'var(--creme)' }}>+32 2 512 84 00</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section style={{ padding: '32px 24px 0' }}>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit('Message envoyé.'); setSent('contact'); }}>
          <div style={{ marginBottom: 16 }}>
            <label className="kern-label">Nom</label>
            <input className="kern-input" placeholder="Prénom Nom" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="kern-label">Email</label>
            <input className="kern-input" type="email" placeholder="vous@exemple.com" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="kern-label">Message</label>
            <textarea className="kern-input" placeholder="Votre question..." />
          </div>
          <button type="submit" className="kern-btn" style={{ width: '100%', height: 48, borderRadius: 10 }}>
            Envoyer
          </button>
        </form>
      </section>

      {/* Divider + Devis section */}
      <section style={{ padding: '40px 24px 0' }}>
        <div style={{
          height: 1, background: 'var(--vert-border)', marginBottom: 20,
        }} />
        <div className="kern-micro" style={{ color: 'var(--terracotta)', marginBottom: 24 }}>
          Commande événement (15 pièces et +)
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit('Demande de devis envoyée.'); setSent('devis'); }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label className="kern-label">Date</label>
              <input className="kern-input" placeholder="JJ/MM" />
            </div>
            <div>
              <label className="kern-label">Pièces</label>
              <input className="kern-input" placeholder="15+" />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="kern-label">Type d'événement</label>
            <input className="kern-input" placeholder="Mariage, réception, cocktail..." />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="kern-label">Précisions</label>
            <textarea className="kern-input" placeholder="Nombre d'invités, allergies, souhaits spécifiques..." />
          </div>
          <button type="submit" className="kern-btn" style={{ width: '100%', height: 48, borderRadius: 10 }}>
            Demander un devis
          </button>
        </form>
      </section>
    </div>
  );
}

Object.assign(window, { KernCart, KernContact });
