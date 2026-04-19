// components.jsx — Maison Dorée pages and interactive shell

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const { PRODUCTS, CATEGORIES, VALUES, TIME_SLOTS } = window.MaisonData;

// ─── Placeholder media — mix of striped and solid (charte: "mix") ───
function Media({ product, variant }) {
  // variant: 'striped' | 'solid' | 'mix' (decide by id parity for mix)
  const useSolid = variant === 'solid' || (variant === 'mix' && (product.id.charCodeAt(1) % 2 === 0));
  if (useSolid) {
    return (
      <div className="ph-solid" style={{ '--bg': product.bg }}>
        <div className="mono">{product.mono}</div>
      </div>
    );
  }
  return (
    <div className="ph" style={{ '--bg': product.bg }}>
      <div className="ph-label">{product.name.toUpperCase()} · PHOTO</div>
    </div>
  );
}

// ─── Hero ───
function Hero({ tagline, showOrb, onShop }) {
  return (
    <section className="hero">
      {showOrb && <div className="orb" />}
      <div className="scroll-indicator">
        <div className="line" />
        <div className="label">Scroll</div>
      </div>
      <div className="eyebrow">Maison Dorée · Bruxelles</div>
      <h1 className="hero-title">
        Maison
        <span className="accent">Dorée.</span>
      </h1>
      <div className="hairline" style={{ marginLeft: 0, marginTop: 28 }} />
      <p className="hero-sub">{tagline}</p>
      <button className="cta-pill" onClick={onShop}>
        Découvrir le catalogue
        <Icon.Arrow />
      </button>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, paddingBottom: 32, opacity: 0.7 }}>
        <div className="micro" style={{ color: 'var(--or-dim)' }}>Pâtisserie artisanale</div>
        <div style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.18)' }} />
        <div className="micro" style={{ color: 'var(--or-dim)' }}>Sur commande</div>
      </div>
    </section>
  );
}

// ─── Selection strip + values (part of Accueil) ───
function HomeContent({ onOpenProduct, imagery }) {
  const picks = PRODUCTS.filter(p => ['p1', 'p3', 'p6', 'p11'].includes(p.id));
  return (
    <>
      <section className="strip">
        <div className="strip-head">
          <div>
            <div className="eyebrow">Sélection du moment</div>
            <h2 style={{ marginTop: 10 }}>Pièces phares</h2>
          </div>
          <div style={{ fontSize: 11, color: 'var(--or-mat)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Voir tout</div>
        </div>
        <div className="strip-rail scroll">
          {picks.map(p => (
            <div key={p.id} className="strip-card" onClick={() => onOpenProduct(p)}>
              <div className="media"><Media product={p} variant={imagery} /></div>
              <div className="info">
                <div className="eyebrow" style={{ fontSize: 9 }}>{p.catLabel}</div>
                <h3 style={{ marginTop: 6 }}>{p.name}</h3>
                <div className="price">{p.price.toFixed(2)} €</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="values">
        <div className="values-head">
          <div className="eyebrow">Notre engagement</div>
          <h2>Quatre <em>principes</em>.</h2>
          <div className="hairline" style={{ marginTop: 18 }} />
        </div>
        <div className="values-grid">
          {VALUES.map(v => (
            <div key={v.num} className="value-card">
              <div className="num">{v.num}</div>
              <div>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '0 24px 180px' }}>
        <div className="eyebrow">Informations</div>
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, fontSize: 12, lineHeight: 1.8 }}>
          <div>
            <div className="micro" style={{ color: 'var(--or-mat)' }}>Atelier</div>
            <div style={{ marginTop: 6, color: 'rgba(240,237,230,0.7)' }}>Rue du Page 42<br/>1050 Bruxelles</div>
          </div>
          <div>
            <div className="micro" style={{ color: 'var(--or-mat)' }}>Horaires</div>
            <div style={{ marginTop: 6, color: 'rgba(240,237,230,0.7)' }}>Jeu – Dim<br/>10h – 18h</div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Catalogue ───
function Catalogue({ onOpenProduct, imagery, density }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
  // In 3-col mode, ignore 'tall' special, keep 'wide' as span 2.
  const gridClass = density === 3 ? 'grid three' : 'grid';
  return (
    <>
      <div className="cat-head">
        <div className="eyebrow">Catalogue · {filtered.length} pièces</div>
        <h1>La <em>collection</em></h1>
        <div className="filter-rail scroll">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`filter-pill ${filter === c.id ? 'active' : ''}`}
              onClick={() => setFilter(c.id)}
            >{c.label}</button>
          ))}
        </div>
      </div>
      <div className={gridClass}>
        {filtered.map(p => (
          <div
            key={p.id}
            className={`product-card ${density === 3 ? (p.layout === 'wide' ? 'wide' : 'normal') : p.layout}`}
            onClick={() => onOpenProduct(p)}
          >
            {p.tag && <div className="tag">{p.tag}</div>}
            <div className="media"><Media product={p} variant={imagery} /></div>
            <div className="card-overlay">
              <div className="name">{p.name}</div>
              <div className="price">{p.price.toFixed(2)} €</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Product Sheet ───
function ProductSheet({ product, open, onClose, onAdd, imagery }) {
  const [qty, setQty] = useState(1);
  useEffect(() => { if (open) setQty(1); }, [open, product]);
  if (!product) return null;
  return (
    <>
      <div className={`sheet-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`sheet ${open ? 'open' : ''}`}>
        <div className="sheet-handle" />
        <div className="sheet-image">
          {product.tag && <div className="tag" style={{ top: 14, left: 14 }}>{product.tag}</div>}
          <Media product={product} variant={imagery} />
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 14, zIndex: 5,
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(10,10,8,0.7)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(201,169,110,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--or-mat)', cursor: 'pointer',
            }}
          ><Icon.Close /></button>
        </div>
        <div className="sheet-body">
          <div className="sheet-cat">{product.catLabel}</div>
          <h2 className="sheet-name">{product.name}</h2>
          <p className="sheet-desc">{product.desc}</p>

          <div className="sheet-ingredients">
            <div>
              <div className="k">Origine</div>
              <div className="v">{product.origin}</div>
            </div>
            <div>
              <div className="k">Préparation</div>
              <div className="v">{product.time}</div>
            </div>
            <div>
              <div className="k">Allergènes</div>
              <div className="v" style={{ fontSize: 12 }}>{product.allergens}</div>
            </div>
          </div>

          <div className="sheet-row">
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Prix pièce</div>
              <div className="sheet-price">{(product.price * qty).toFixed(2)} €</div>
            </div>
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(20, qty + 1))}>+</button>
            </div>
          </div>
        </div>
        <button className="sheet-cta" onClick={() => onAdd(product, qty)}>Ajouter au panier</button>
      </div>
    </>
  );
}

// ─── Cart ───
function Cart({ cart, setCart, onCheckout, imagery }) {
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const updateQty = (id, delta) => {
    setCart(cart.map(i => i.product.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };
  const remove = (id) => setCart(cart.filter(i => i.product.id !== id));

  if (cart.length === 0) {
    return (
      <>
        <div className="screen-head">
          <div className="eyebrow">Panier</div>
          <h1>Votre <em>sélection</em></h1>
        </div>
        <div className="cart-empty">
          <Icon.Bag2 color="var(--or-dim)" />
          <h3>Panier vide</h3>
          <p>Chaque pièce, façonnée pour durer un instant. Composez votre sélection.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="screen-head">
        <div className="eyebrow">Panier · {cart.length} pièce{cart.length > 1 ? 's' : ''}</div>
        <h1>Votre <em>sélection</em></h1>
      </div>
      <div className="cart-list">
        {cart.map(item => (
          <div key={item.product.id} className="cart-item">
            <div className="thumb"><Media product={item.product} variant={imagery} /></div>
            <div className="info">
              <div className="cat">{item.product.catLabel}</div>
              <h4>{item.product.name}</h4>
              <div className="row">
                <div className="qty small">
                  <button onClick={() => updateQty(item.product.id, -1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.product.id, +1)}>+</button>
                </div>
                <div className="price">{(item.product.price * item.qty).toFixed(2)} €</div>
              </div>
            </div>
            <button
              onClick={() => remove(item.product.id)}
              style={{ background: 'none', border: 'none', color: 'var(--or-dim)', cursor: 'pointer', padding: 4, alignSelf: 'flex-start' }}
            ><Icon.Trash /></button>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div className="line">
          <div className="k">Sous-total</div>
          <div className="v">{subtotal.toFixed(2)} €</div>
        </div>
        <div className="pickup">Click and collect · Gratuit · Atelier Rue du Page 42</div>
        <button className="submit" onClick={onCheckout}>
          Commander
          <Icon.Arrow />
        </button>
      </div>
    </>
  );
}

// ─── Checkout ───
function Checkout({ cart, onConfirm, onBack }) {
  const [form, setForm] = useState({ prenom: '', email: '', tel: '', slot: 4 });
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const valid = form.prenom.length > 1 && form.email.includes('@') && form.tel.length > 6;
  return (
    <>
      <div className="screen-head">
        <div className="eyebrow" onClick={onBack} style={{ cursor: 'pointer' }}>← Retour panier</div>
        <h1>Finaliser la <em>commande</em></h1>
      </div>
      <div className="form-wrap">
        <div style={{ padding: '18px 0 12px' }}>
          <div className="micro" style={{ color: 'var(--or-mat)' }}>Retrait · Click & Collect</div>
        </div>
        <div className="slot-grid">
          {TIME_SLOTS.map((s, i) => (
            <div key={i} className={`slot ${form.slot === i ? 'active' : ''}`} onClick={() => setForm({ ...form, slot: i })}>
              <div className="day">{s.day}</div>
              <div className="time">{s.time}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '28px 0 4px' }}>
          <div className="micro" style={{ color: 'var(--or-mat)' }}>Coordonnées</div>
        </div>

        <div className="field">
          <label>Prénom</label>
          <input type="text" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} placeholder="Votre prénom" />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="vous@exemple.com" />
        </div>
        <div className="field">
          <label>Téléphone</label>
          <input type="tel" value={form.tel} onChange={e => setForm({ ...form, tel: e.target.value })} placeholder="+32 ..." />
        </div>

        <div style={{
          marginTop: 28, padding: '18px 20px', borderRadius: 14,
          background: 'rgba(26,28,24,0.6)', border: '1px solid rgba(201,169,110,0.15)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(240,237,230,0.6)', marginBottom: 10 }}>
            <span>{cart.length} pièce{cart.length > 1 ? 's' : ''}</span>
            <span>Retrait {TIME_SLOTS[form.slot].day} · {TIME_SLOTS[form.slot].time}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div className="eyebrow">Total</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--or-mat)' }}>{subtotal.toFixed(2)} €</div>
          </div>
        </div>

        <button
          className="submit-btn"
          onClick={() => valid && onConfirm()}
          style={{ opacity: valid ? 1 : 0.4, cursor: valid ? 'pointer' : 'not-allowed' }}
        >
          Confirmer · {subtotal.toFixed(2)} €
        </button>
      </div>
    </>
  );
}

// ─── Contact / Devis ───
function Contact() {
  const [tab, setTab] = useState('contact');
  const [sent, setSent] = useState(false);
  return (
    <>
      <div className="screen-head">
        <div className="eyebrow">Nous écrire</div>
        <h1>Un <em>mot.</em></h1>
      </div>
      <div className="segmented">
        <button className={tab === 'contact' ? 'active' : ''} onClick={() => { setTab('contact'); setSent(false); }}>Contact</button>
        <button className={tab === 'devis' ? 'active' : ''} onClick={() => { setTab('devis'); setSent(false); }}>Devis événement</button>
      </div>

      {sent ? (
        <div style={{ padding: '80px 40px', textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', margin: '0 auto 20px',
            background: 'rgba(201,169,110,0.12)', border: '1px solid var(--or-mat)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--or-mat)',
          }}><Icon.Check size={22} /></div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 300, margin: 0 }}>Message envoyé</h3>
          <p style={{ fontSize: 13, color: 'rgba(240,237,230,0.55)', marginTop: 12, lineHeight: 1.7 }}>
            Nous revenons vers vous sous 24h ouvrables.
          </p>
        </div>
      ) : tab === 'contact' ? (
        <div className="form-wrap">
          <div className="field">
            <label>Nom</label>
            <input type="text" placeholder="Votre nom" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="vous@exemple.com" />
          </div>
          <div className="field">
            <label>Objet</label>
            <select defaultValue="">
              <option value="" disabled>Choisir un objet</option>
              <option>Question produit</option>
              <option>Suivi de commande</option>
              <option>Partenariat</option>
            </select>
          </div>
          <div className="field">
            <label>Message</label>
            <textarea placeholder="Votre message..."></textarea>
          </div>
          <button className="submit-btn" onClick={() => setSent(true)}>Envoyer le message</button>
        </div>
      ) : (
        <div className="form-wrap">
          <div style={{
            margin: '16px 0 8px', padding: '12px 16px',
            border: '1px solid rgba(201,169,110,0.25)', borderRadius: 12,
            background: 'rgba(201,169,110,0.05)',
          }}>
            <div className="micro" style={{ color: 'var(--or-mat)', marginBottom: 4 }}>Commande événement</div>
            <div style={{ fontSize: 12, color: 'rgba(240,237,230,0.7)', lineHeight: 1.6 }}>
              Pour les commandes de 15 pièces et plus. Délai minimum 48h.
            </div>
          </div>
          <div className="field-row" style={{ marginTop: 16 }}>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Prénom</label>
              <input type="text" />
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Téléphone</label>
              <input type="tel" />
            </div>
          </div>
          <div className="field">
            <label>Type d'événement</label>
            <select defaultValue="">
              <option value="" disabled>Choisir</option>
              <option>Mariage</option>
              <option>Anniversaire</option>
              <option>Réception</option>
              <option>Entreprise</option>
              <option>Autre</option>
            </select>
          </div>
          <div className="field-row">
            <div className="field" style={{ marginTop: 0 }}>
              <label>Date souhaitée</label>
              <input type="text" placeholder="JJ / MM / AAAA" />
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Pièces</label>
              <input type="number" placeholder="15 +" min="15" />
            </div>
          </div>
          <div className="field">
            <label>Allergènes à exclure</label>
            <input type="text" placeholder="Ex : fruits à coque" />
          </div>
          <div className="field">
            <label>Budget indicatif (€)</label>
            <input type="text" placeholder="À partir de 150 €" />
          </div>
          <div className="field">
            <label>Message libre</label>
            <textarea placeholder="Décrivez votre événement, l'esprit recherché..."></textarea>
          </div>
          <button className="submit-btn" onClick={() => setSent(true)}>Envoyer le devis</button>
        </div>
      )}
    </>
  );
}

// ─── Bottom nav ───
function BottomNav({ page, setPage, cartCount, collapsed }) {
  const items = [
    { id: 'home', label: 'Accueil', icon: Icon.Home },
    { id: 'catalogue', label: 'Catalogue', icon: Icon.Catalogue },
    { id: 'cart', label: 'Panier', icon: Icon.Bag },
    { id: 'contact', label: 'Contact', icon: Icon.Mail },
  ];
  return (
    <div className={`bottom-nav ${collapsed ? 'collapsed' : ''}`}>
      {items.map(it => {
        const active = page === it.id || (page === 'checkout' && it.id === 'cart');
        return (
          <button key={it.id} className={`nav-item ${active ? 'active' : ''}`} onClick={() => setPage(it.id)}>
            <it.icon size={20} />
            <div className="nav-label">{it.label}</div>
            <div className="nav-dot" />
            {it.id === 'cart' && cartCount > 0 && <div className="nav-badge">{cartCount}</div>}
          </button>
        );
      })}
    </div>
  );
}

// ─── Tweaks panel ───
function TweaksPanel({ tweaks, setTweaks, visible }) {
  if (!visible) return null;
  const hues = [
    { label: 'Or mat', main: '#C9A96E', pale: '#E8D5A3', dim: '#7A6040' },
    { label: 'Rose gold', main: '#D4A088', pale: '#F0CAB9', dim: '#8A5F50' },
    { label: 'Laiton', main: '#B8955A', pale: '#E0C48A', dim: '#6E5838' },
    { label: 'Bronze', main: '#A67A4A', pale: '#D4A878', dim: '#604230' },
  ];
  return (
    <div className="tweaks-panel">
      <h4>Tweaks</h4>
      <div className="tweaks-row">
        <div className="k">Accent</div>
        <div className="hue-row">
          {hues.map(h => (
            <div
              key={h.label}
              className={`hue-swatch ${tweaks.accent === h.label ? 'active' : ''}`}
              style={{ background: h.main }}
              onClick={() => setTweaks({ ...tweaks, accent: h.label, accentMain: h.main, accentPale: h.pale, accentDim: h.dim })}
            />
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <div className="k">Grain</div>
        <button className={`toggle ${tweaks.grain ? 'on' : ''}`} onClick={() => setTweaks({ ...tweaks, grain: !tweaks.grain })} />
      </div>
      <div className="tweaks-row">
        <div className="k">Orbe doré</div>
        <button className={`toggle ${tweaks.orb ? 'on' : ''}`} onClick={() => setTweaks({ ...tweaks, orb: !tweaks.orb })} />
      </div>
      <div className="tweaks-row">
        <div className="k">Nav collapse</div>
        <button className={`toggle ${tweaks.navCollapse ? 'on' : ''}`} onClick={() => setTweaks({ ...tweaks, navCollapse: !tweaks.navCollapse })} />
      </div>
      <div className="tweaks-row">
        <div className="k">Densité grille</div>
        <button
          className="toggle"
          style={{ background: 'rgba(201,169,110,0.25)' }}
          onClick={() => setTweaks({ ...tweaks, density: tweaks.density === 2 ? 3 : 2 })}
        >
          <span style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            fontSize: 10, color: '#fff', fontWeight: 600,
          }}>{tweaks.density}</span>
        </button>
      </div>
      <div className="tweaks-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <div className="k" style={{ marginBottom: 6 }}>Tagline hero</div>
        <textarea
          value={tweaks.tagline}
          onChange={e => setTweaks({ ...tweaks, tagline: e.target.value })}
          style={{
            width: '100%', background: 'rgba(26,28,24,0.8)',
            border: '1px solid rgba(201,169,110,0.2)', borderRadius: 8,
            padding: '8px 10px', color: 'var(--blanc-casse)',
            fontSize: 11, resize: 'none', minHeight: 48, fontFamily: 'var(--font-sans)',
          }}
        />
      </div>
      <div className="tweaks-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <div className="k" style={{ marginBottom: 6 }}>Imagerie cartes</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['mix', 'striped', 'solid'].map(v => (
            <button
              key={v}
              onClick={() => setTweaks({ ...tweaks, imagery: v })}
              style={{
                flex: 1, padding: '6px 4px', borderRadius: 6,
                border: '1px solid rgba(201,169,110,0.2)',
                background: tweaks.imagery === v ? 'var(--or-mat)' : 'transparent',
                color: tweaks.imagery === v ? 'var(--noir)' : 'var(--blanc-casse)',
                fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >{v}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Hero, HomeContent, Catalogue, ProductSheet, Cart, Checkout, Contact, BottomNav, TweaksPanel, Media });
