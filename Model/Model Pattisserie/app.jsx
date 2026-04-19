// Atelier Kern — main app

const { useState, useEffect, useCallback } = React;

// Tweaks defaults — wrapped in editmode markers
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#D4603A",
  "background": "#1A3028",
  "showNumerals": true,
  "showRule": true,
  "showGrain": true,
  "fontDisplay": "Syne"
}/*EDITMODE-END*/;

function KernApp() {
  // Load persisted page
  const [page, setPage] = useState(() => {
    try { return localStorage.getItem('kern.page') || 'home'; } catch (e) { return 'home'; }
  });
  const [productOpen, setProductOpen] = useState(null);
  const [cart, setCart] = useState({});
  const [toast, setToast] = useState(null);
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => { try { localStorage.setItem('kern.page', page); } catch (e) {} }, [page]);

  // apply accent + bg via CSS vars
  useEffect(() => {
    document.documentElement.style.setProperty('--terracotta', tweaks.accent);
    document.documentElement.style.setProperty('--vert', tweaks.background);
    // derive variants
    const hex = tweaks.accent.replace('#','');
    const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
    document.documentElement.style.setProperty('--terracotta-dim', `rgba(${r},${g},${b},0.20)`);
    document.documentElement.style.setProperty('--terracotta-border', `rgba(${r},${g},${b},0.35)`);
  }, [tweaks.accent, tweaks.background]);

  // Edit mode wiring
  useEffect(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setEditMode(true);
      if (e.data.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const updateTweak = (key, value) => {
    setTweaks(t => ({ ...t, [key]: value }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: value } }, '*');
  };

  const showToast = useCallback((text) => {
    setToast({ id: Date.now(), text });
    setTimeout(() => setToast(null), 2400);
  }, []);

  const addToCart = (product, qty = 1) => {
    setCart(c => {
      const existing = c[product.id];
      return {
        ...c,
        [product.id]: {
          product,
          qty: (existing?.qty || 0) + qty,
        },
      };
    });
    showToast(`${product.name} ajouté au panier`);
  };

  const incCart = (id) => setCart(c => ({ ...c, [id]: { ...c[id], qty: c[id].qty + 1 } }));
  const decCart = (id) => setCart(c => {
    const q = c[id].qty - 1;
    if (q <= 0) {
      const rest = {};
      Object.keys(c).forEach(k => { if (k !== id) rest[k] = c[k]; });
      return rest;
    }
    return { ...c, [id]: { ...c[id], qty: q } };
  });
  const removeCart = (id) => setCart(c => {
    const rest = {};
    Object.keys(c).forEach(k => { if (k !== id) rest[k] = c[k]; });
    return rest;
  });

  const handleCheckout = () => {
    showToast('Commande confirmée · email envoyé');
    setCart({});
    setTimeout(() => setPage('home'), 400);
  };

  const cartCount = Object.values(cart).reduce((s, c) => s + c.qty, 0);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <KernHome onNav={setPage} onOpenProduct={setProductOpen} tweaks={tweaks} />;
      case 'catalogue':
        return <KernCatalogue onOpenProduct={setProductOpen} tweaks={tweaks} />;
      case 'cart':
        return <KernCart
          cart={cart} onInc={incCart} onDec={decCart} onRemove={removeCart}
          onNav={setPage} onCheckout={handleCheckout} />;
      case 'contact':
        return <KernContact onNav={setPage} onSubmit={(msg) => showToast(msg)} />;
      default:
        return null;
    }
  };

  return (
    <IOSDevice width={402} height={874} dark={true}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'var(--vert)',
        overflow: 'hidden',
      }}>
        {/* grain overlay */}
        {tweaks.showGrain && <div className="kern-grain" />}

        {/* scrollable page area */}
        <div
          key={page}
          className="kern-scroll"
          style={{
            position: 'absolute', inset: 0,
            overflowY: 'auto',
            paddingTop: 50, /* for status bar */
            zIndex: 1,
          }}>
          {renderPage()}
        </div>

        {/* Bottom nav */}
        <KernNav active={page} onNav={(p) => { setPage(p); }} cartCount={cartCount} />

        {/* Product sheet */}
        <KernProductSheet
          product={productOpen}
          onClose={() => setProductOpen(null)}
          onAdd={addToCart}
        />

        {/* Toast */}
        <KernToast msg={toast} />

        {/* Tweaks panel */}
        {editMode && (
          <div style={{
            position: 'absolute',
            bottom: 94, right: 16,
            width: 260,
            background: 'rgba(15,25,20,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--vert-border)',
            borderRadius: 12,
            padding: 16,
            zIndex: 100,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 14,
            }}>
              <div className="kern-syne" style={{
                fontSize: 14, fontWeight: 700, color: 'var(--creme)',
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>Tweaks</div>
              <div className="kern-micro" style={{ color: 'var(--terracotta)' }}>Live</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div className="kern-micro" style={{ color: 'var(--creme-dim)', marginBottom: 8 }}>Accent</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#D4603A', '#C9A96E', '#E8754C', '#B8523C', '#8FA876'].map(c => (
                  <button key={c} onClick={() => updateTweak('accent', c)}
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: c,
                      border: tweaks.accent === c ? '2px solid var(--creme)' : '1px solid var(--vert-border)',
                      cursor: 'pointer',
                    }} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div className="kern-micro" style={{ color: 'var(--creme-dim)', marginBottom: 8 }}>Fond</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#1A3028', '#0F1C18', '#1E2C3A', '#2A1E1A', '#1A1A1A'].map(c => (
                  <button key={c} onClick={() => updateTweak('background', c)}
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: c,
                      border: tweaks.background === c ? '2px solid var(--creme)' : '1px solid var(--vert-border)',
                      cursor: 'pointer',
                    }} />
                ))}
              </div>
            </div>

            {[
              { k: 'showNumerals', label: 'Numéros géants' },
              { k: 'showRule', label: 'Ligne éditoriale' },
              { k: 'showGrain', label: 'Grain' },
            ].map(t => (
              <div key={t.k} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0',
              }}>
                <div className="kern-outfit" style={{ fontSize: 12, color: 'var(--creme)' }}>{t.label}</div>
                <button onClick={() => updateTweak(t.k, !tweaks[t.k])}
                  style={{
                    width: 36, height: 20, borderRadius: 100,
                    background: tweaks[t.k] ? 'var(--terracotta)' : 'var(--vert-elevated)',
                    border: '1px solid var(--vert-border)',
                    position: 'relative', cursor: 'pointer',
                    transition: 'background 160ms ease',
                  }}>
                  <div style={{
                    position: 'absolute',
                    top: 2, left: tweaks[t.k] ? 18 : 2,
                    width: 14, height: 14, borderRadius: 100,
                    background: 'var(--creme)',
                    transition: 'left 160ms ease',
                  }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </IOSDevice>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<KernApp />);
