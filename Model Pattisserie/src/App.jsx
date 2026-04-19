// Atelier Kern — Main App
const { useState, useEffect, useRef } = React;

function App() {
  const T = window.AK_T;

  // Tweak state with EDITMODE markers
  const DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "terracotta",
    "bg": "vert",
    "display": "Syne",
    "grain": 4,
    "numerals": true,
    "heroLine": true
  }/*EDITMODE-END*/;

  const [tweaks, setTweaks] = useState(DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [tweaksAvail, setTweaksAvail] = useState(false);

  // Apply tweaks to :root
  useEffect(() => {
    const root = document.documentElement;
    const accents = {
      terracotta: ['#D4603A', 'rgba(212,96,58,0.20)', 'rgba(212,96,58,0.35)'],
      ocre:       ['#C9A24B', 'rgba(201,162,75,0.20)', 'rgba(201,162,75,0.35)'],
      rouille:    ['#A8452C', 'rgba(168,69,44,0.22)', 'rgba(168,69,44,0.40)'],
      sable:      ['#C8B89A', 'rgba(200,184,154,0.22)', 'rgba(200,184,154,0.40)'],
    };
    const bgs = {
      vert:   ['#1A3028', '#213A30', '#2A4A3C', '#3A5A48'],
      noir:   ['#0F1410', '#171C18', '#222924', '#2E3630'],
      encre:  ['#16253A', '#1D2E46', '#263950', '#334664'],
      brique: ['#2B1A18', '#3A2522', '#4B302C', '#5F3C37'],
    };
    const [a, ad, ab] = accents[tweaks.accent];
    const [b, bs, be, bb] = bgs[tweaks.bg];
    root.style.setProperty('--accent', a);
    root.style.setProperty('--accent-dim', ad);
    root.style.setProperty('--accent-border', ab);
    root.style.setProperty('--vert', b);
    root.style.setProperty('--vert-surface', bs);
    root.style.setProperty('--vert-elevated', be);
    root.style.setProperty('--vert-border', bb);
    root.style.setProperty('--font-display', `"${tweaks.display}", "Syne", system-ui, sans-serif`);
  }, [tweaks.accent, tweaks.bg, tweaks.display]);

  const updateTweaks = (patch) => {
    const next = { ...tweaks, ...patch };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };

  // Tweaks protocol
  useEffect(() => {
    const handler = (e) => {
      if (!e.data) return;
      if (e.data.type === '__activate_edit_mode') { setTweaksAvail(true); setTweaksOpen(true); }
      if (e.data.type === '__deactivate_edit_mode') { setTweaksOpen(false); }
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  // Nav + cart state (persistent)
  const [screen, setScreen] = useState(() => localStorage.getItem('ak_screen') || 'home');
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ak_cart')) || []; } catch { return []; }
  });
  const [product, setProduct] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { localStorage.setItem('ak_screen', screen); }, [screen]);
  useEffect(() => { localStorage.setItem('ak_cart', JSON.stringify(cart)); }, [cart]);

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  const nav = (id) => {
    setScreen(id);
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
  };

  const addToCart = (p, qty) => {
    setCart(prev => {
      const ex = prev.find(x => x.id === p.id);
      if (ex) return prev.map(x => x.id === p.id ? { ...x, qty: x.qty + qty } : x);
      return [...prev, { id: p.id, qty }];
    });
    showToast(`${p.name} — ajouté au panier`);
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) setCart(prev => prev.filter(x => x.id !== id));
    else setCart(prev => prev.map(x => x.id === id ? { ...x, qty } : x));
  };

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => setToast(null), 2200);
  };

  // scroll → collapse nav
  const [collapsed, setCollapsed] = useState(false);
  const scrollerRef = useRef(null);
  const lastY = useRef(0);
  const onScroll = (e) => {
    const y = e.target.scrollTop;
    const delta = y - lastY.current;
    if (y > 120 && delta > 4) setCollapsed(true);
    else if (delta < -4 || y < 60) setCollapsed(false);
    lastY.current = y;
  };

  // Screen transitions
  const [screenKey, setScreenKey] = useState(screen);
  useEffect(() => {
    setScreenKey(screen + '_' + Date.now());
  }, [screen]);

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen onOpenProduct={setProduct} onNav={nav}/>;
      case 'catalogue': return <CatalogueScreen onOpenProduct={setProduct}/>;
      case 'cart': return <CartScreen
        cart={cart}
        updateQty={updateQty}
        onGoCatalogue={() => nav('catalogue')}
        onCheckout={() => showToast('Redirection vers Stripe…')}
      />;
      case 'contact': return <ContactScreen onSubmitted={() => showToast('Message envoyé. Réponse sous 48h.')}/>;
      default: return null;
    }
  };

  return (
    <div style={{
      height: '100%', width: '100%',
      position: 'relative',
      background: T.vert,
      overflow: 'hidden',
    }}>
      {/* grain overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: window.AK_GRAIN_URL,
        opacity: tweaks.grain / 100,
        pointerEvents: 'none',
        zIndex: 1,
        mixBlendMode: 'overlay',
      }}/>

      {/* scroller */}
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        style={{
          position: 'absolute', inset: 0,
          overflowY: 'auto', overflowX: 'hidden',
          zIndex: 2,
        }}
      >
        <div
          key={screenKey}
          style={{
            animation: 'akFade 200ms ease both',
          }}
        >
          {renderScreen()}
        </div>
      </div>

      {/* bottom nav */}
      <BottomNav
        current={screen}
        onNav={nav}
        cartCount={cartCount}
        collapsed={collapsed}
      />

      {/* product sheet */}
      <ProductSheet
        product={product}
        onClose={() => setProduct(null)}
        onAdd={addToCart}
      />

      {/* toast */}
      <Toast show={!!toast} msg={toast || ''}/>

      {/* tweaks */}
      {tweaksOpen && (
        <TweaksPanel
          state={tweaks}
          setState={updateTweaks}
          onClose={() => setTweaksOpen(false)}
        />
      )}
    </div>
  );
}

window.App = App;
