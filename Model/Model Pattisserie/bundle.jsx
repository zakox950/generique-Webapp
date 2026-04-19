
// ===== ios-frame.jsx =====

// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports: IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({ dark = false, time = '9:41' }) {
  const c = dark ? '#fff' : '#000';
  return (
    <div style={{
      display: 'flex', gap: 154, alignItems: 'center', justifyContent: 'center',
      padding: '21px 24px 19px', boxSizing: 'border-box',
      position: 'relative', zIndex: 20, width: '100%',
    }}>
      <div style={{ flex: 1, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 1.5 }}>
        <span style={{
          fontFamily: '-apple-system, "SF Pro", system-ui', fontWeight: 590,
          fontSize: 17, lineHeight: '22px', color: c,
        }}>{time}</span>
      </div>
      <div style={{ flex: 1, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, paddingTop: 1, paddingRight: 1 }}>
        <svg width="19" height="12" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c}/>
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c}/>
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c}/>
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c}/>
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill={c}/>
          <path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill={c}/>
          <circle cx="8.5" cy="10.5" r="1.5" fill={c}/>
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.35" fill="none"/>
          <rect x="2" y="2" width="20" height="9" rx="2" fill={c}/>
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={c} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({ children, dark = false, style = {} }) {
  return (
    <div style={{
      height: 44, minWidth: 44, borderRadius: 9999,
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: dark
        ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)'
        : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style,
    }}>
      {/* blur + tint */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 9999,
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)',
      }} />
      {/* shine */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 9999,
        boxShadow: dark
          ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)'
          : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
        border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', padding: '0 4px' }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({ title = 'Title', dark = false, trailingIcon = true }) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = (content) => (
    <IOSGlassPill dark={dark}>
      <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {content}
      </div>
    </IOSGlassPill>
  );
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      paddingTop: 62, paddingBottom: 10, position: 'relative', zIndex: 5,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
      }}>
        {/* back chevron */}
        {pillIcon(
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" style={{ marginLeft: -1 }}>
            <path d="M10 2L2 10l8 8" stroke={muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {/* trailing ellipsis */}
        {trailingIcon && pillIcon(
          <svg width="22" height="6" viewBox="0 0 22 6">
            <circle cx="3" cy="3" r="2.5" fill={muted}/>
            <circle cx="11" cy="3" r="2.5" fill={muted}/>
            <circle cx="19" cy="3" r="2.5" fill={muted}/>
          </svg>
        )}
      </div>
      {/* large title */}
      <div style={{
        padding: '0 16px',
        fontFamily: '-apple-system, system-ui',
        fontSize: 34, fontWeight: 700, lineHeight: '41px',
        color: text, letterSpacing: 0.4,
      }}>{title}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({ title, detail, icon, chevron = true, isLast = false, dark = false }) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', minHeight: 52,
      padding: '0 16px', position: 'relative',
      fontFamily: '-apple-system, system-ui', fontSize: 17,
      letterSpacing: -0.43,
    }}>
      {icon && (
        <div style={{
          width: 30, height: 30, borderRadius: 7, background: icon,
          marginRight: 12, flexShrink: 0,
        }} />
      )}
      <div style={{ flex: 1, color: text }}>{title}</div>
      {detail && <span style={{ color: sec, marginRight: 6 }}>{detail}</span>}
      {chevron && (
        <svg width="8" height="14" viewBox="0 0 8 14" style={{ flexShrink: 0 }}>
          <path d="M1 1l6 6-6 6" stroke={ter} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {!isLast && (
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          left: icon ? 58 : 16, height: 0.5, background: sep,
        }} />
      )}
    </div>
  );
}

function IOSList({ header, children, dark = false }) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return (
    <div>
      {header && (
        <div style={{
          fontFamily: '-apple-system, system-ui', fontSize: 13,
          color: hc, textTransform: 'uppercase',
          padding: '8px 36px 6px', letterSpacing: -0.08,
        }}>{header}</div>
      )}
      <div style={{
        background: bg, borderRadius: 26,
        margin: '0 16px', overflow: 'hidden',
      }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children, width = 402, height = 874, dark = false,
  title, keyboard = false,
}) {
  return (
    <div style={{
      width, height, borderRadius: 48, overflow: 'hidden',
      position: 'relative', background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
      }} />
      {/* status bar (absolute) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <IOSStatusBar dark={dark} />
      </div>
      {/* nav + content */}
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {title !== undefined && <IOSNavBar title={title} dark={dark} />}
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
        {keyboard && <IOSKeyboard dark={dark} />}
      </div>
      {/* home indicator — always on top */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
        height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        paddingBottom: 8, pointerEvents: 'none',
      }}>
        <div style={{
          width: 139, height: 5, borderRadius: 100,
          background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)',
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({ dark = false }) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: <svg width="19" height="17" viewBox="0 0 19 17"><path d="M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z" fill={glyph}/></svg>,
    del: <svg width="23" height="17" viewBox="0 0 23 17"><path d="M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z" fill="none" stroke={glyph} strokeWidth="1.6" strokeLinejoin="round"/><path d="M10 5l7 7M17 5l-7 7" stroke={glyph} strokeWidth="1.6" strokeLinecap="round"/></svg>,
    ret: <svg width="20" height="14" viewBox="0 0 20 14"><path d="M18 1v6H4m0 0l4-4M4 7l4 4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  };

  const key = (content, { w, flex, ret, fs = 25, k } = {}) => (
    <div key={k} style={{
      height: 42, borderRadius: 8.5,
      flex: flex ? 1 : undefined, width: w, minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs, fontWeight: 458, color: ret ? '#fff' : glyph,
    }}>{content}</div>
  );

  const row = (keys, pad = 0) => (
    <div style={{ display: 'flex', gap: 6.5, justifyContent: 'center', padding: `0 ${pad}px` }}>
      {keys.map(l => key(l, { flex: true, k: l }))}
    </div>
  );

  return (
    <div style={{
      position: 'relative', zIndex: 15, borderRadius: 27, overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      boxShadow: dark
        ? '0 -2px 20px rgba(0,0,0,0.09)'
        : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)',
    }}>
      {/* liquid glass bg — same recipe as nav pills */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 27,
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 27,
        boxShadow: dark
          ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)'
          : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
        border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
        pointerEvents: 'none',
      }} />

      {/* autocorrect bar */}
      <div style={{
        display: 'flex', gap: 20, alignItems: 'center',
        padding: '8px 22px 13px', width: '100%', boxSizing: 'border-box',
        position: 'relative',
      }}>
        {['"The"', 'the', 'to'].map((w, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ width: 1, height: 25, background: '#ccc', opacity: 0.3 }} />}
            <div style={{
              flex: 1, textAlign: 'center',
              fontFamily: '-apple-system, system-ui', fontSize: 17,
              color: sugg, letterSpacing: -0.43, lineHeight: '22px',
            }}>{w}</div>
          </React.Fragment>
        ))}
      </div>

      {/* key layout */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 13,
        padding: '0 6.5px', width: '100%', boxSizing: 'border-box',
        position: 'relative',
      }}>
        {row(['q','w','e','r','t','y','u','i','o','p'])}
        {row(['a','s','d','f','g','h','j','k','l'], 20)}
        <div style={{ display: 'flex', gap: 14.25, alignItems: 'center' }}>
          {key(icons.shift, { w: 45, k: 'shift' })}
          <div style={{ display: 'flex', gap: 6.5, flex: 1 }}>
            {['z','x','c','v','b','n','m'].map(l => key(l, { flex: true, k: l }))}
          </div>
          {key(icons.del, { w: 45, k: 'del' })}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {key('ABC', { w: 92.25, fs: 18, k: 'abc' })}
          {key('', { flex: true, k: 'space' })}
          {key(icons.ret, { w: 92.25, ret: true, k: 'ret' })}
        </div>
      </div>

      {/* bottom spacer (emoji+mic area, icons omitted) */}
      <div style={{ height: 56, width: '100%', position: 'relative' }} />
    </div>
  );
}

Object.assign(window, {
  IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard,
});


// ===== data.jsx =====
// Atelier Kern — demo data

const KERN_PRODUCTS = [
  {
    id: 'p1',
    name: 'Kouign-amann',
    price: 6,
    category: 'Viennoiserie',
    tag: 'Signature',
    tone: 0,
    size: 'tall',
    desc: "Pâte feuilletée au beurre Bordier, caramélisée au sucre muscovado. Cuit 48 minutes, consommer tiède.",
  },
  {
    id: 'p2',
    name: 'Tarte citron',
    price: 8,
    category: 'Tarte',
    tag: null,
    tone: 1,
    size: 'normal',
    desc: "Sablé breton, crème de citron de Menton non tamisée, meringue italienne légèrement brûlée au chalumeau.",
  },
  {
    id: 'p3',
    name: 'Paris-Brest',
    price: 9,
    category: 'Classique',
    tag: null,
    tone: 2,
    size: 'normal',
    desc: "Pâte à choux, praliné maison noisettes du Piémont torréfiées à 160°C, crème mousseline légère.",
  },
  {
    id: 'p4',
    name: 'Éclair café',
    price: 7,
    category: 'Classique',
    tag: null,
    tone: 0,
    size: 'wide',
    desc: "Choux long, crème pâtissière infusée aux grains de café éthiopien, glaçage fondant café.",
  },
  {
    id: 'p5',
    name: 'Millefeuille vanille',
    price: 9,
    category: 'Classique',
    tag: 'Nouveau',
    tone: 1,
    size: 'normal',
    desc: "Feuilletage inversé 6 tours, crème légère à la vanille Bourbon de Madagascar, glaçage fondant et chocolat noir.",
  },
  {
    id: 'p6',
    name: 'Saint-Honoré',
    price: 11,
    category: 'Signature',
    tag: null,
    tone: 2,
    size: 'tall',
    desc: "Feuilletage, choux caramélisés, crème chiboust à la vanille. Assemblé à la commande.",
  },
  {
    id: 'p7',
    name: 'Tarte au chocolat',
    price: 8,
    category: 'Tarte',
    tag: null,
    tone: 0,
    size: 'normal',
    desc: "Pâte sablée cacao, ganache chocolat Valrhona 70%, fleur de sel de Guérande.",
  },
  {
    id: 'p8',
    name: 'Canelé',
    price: 3,
    category: 'Viennoiserie',
    tag: null,
    tone: 2,
    size: 'wide',
    desc: "Moule en cuivre, pâte reposée 48h, rhum AOC Martinique, vanille. Cuisson haute température.",
  },
];

const KERN_CATEGORIES = ['Tout', 'Signature', 'Classique', 'Tarte', 'Viennoiserie'];

Object.assign(window, { KERN_PRODUCTS, KERN_CATEGORIES });


// ===== ui.jsx =====
// Atelier Kern — shared UI primitives

const kernTones = ['var(--tertiary-1)', 'var(--tertiary-2)', 'var(--tertiary-3)'];

function KernThumbnail({ tone = 0, name = '', size = 80, rounded = 10 }) {
  const bg = kernTones[tone % 3];
  // decorative: first letter as massive ghost type
  const initial = (name || '').trim().charAt(0).toUpperCase();
  return (
    <div style={{
      width: '100%', height: '100%',
      minHeight: size,
      background: bg,
      borderRadius: rounded,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    }}>
      <div style={{
        position: 'absolute',
        right: -8,
        bottom: -28,
        fontFamily: 'Syne, sans-serif',
        fontWeight: 800,
        fontSize: Math.max(110, size * 1.6),
        lineHeight: 1,
        color: 'rgba(245,240,232,0.06)',
        letterSpacing: '-0.06em',
        userSelect: 'none',
      }}>{initial}</div>
      {/* subtle top sheen */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 40%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

function KernIcon({ name, size = 22, color = 'currentColor', strokeWidth = 1.4 }) {
  const p = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home: <><path {...p} d="M3 10.5l9-7 9 7V20a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1v-9.5z"/></>,
    grid: <><rect {...p} x="3" y="3" width="8" height="8" rx="1.5"/><rect {...p} x="13" y="3" width="8" height="8" rx="1.5"/><rect {...p} x="3" y="13" width="8" height="8" rx="1.5"/><rect {...p} x="13" y="13" width="8" height="8" rx="1.5"/></>,
    bag: <><path {...p} d="M5 8h14l-1 12a1 1 0 01-1 1H7a1 1 0 01-1-1L5 8z"/><path {...p} d="M9 8V6a3 3 0 016 0v2"/></>,
    mail: <><rect {...p} x="3" y="5" width="18" height="14" rx="2"/><path {...p} d="M3 7l9 6 9-6"/></>,
    close: <><path {...p} d="M6 6l12 12M18 6L6 18"/></>,
    plus: <><path {...p} d="M12 5v14M5 12h14"/></>,
    minus: <><path {...p} d="M5 12h14"/></>,
    arrow: <><path {...p} d="M5 12h14M13 6l6 6-6 6"/></>,
    chevron: <><path {...p} d="M9 18l6-6-6-6"/></>,
    chevronDown: <><path {...p} d="M6 9l6 6 6-6"/></>,
    check: <><path {...p} d="M5 12l5 5L20 7"/></>,
    map: <><path {...p} d="M9 20l-6-2V5l6 2m0 13l6-2m-6 2V7m6 11l6 2V7l-6-2m0 13V5"/></>,
    clock: <><circle {...p} cx="12" cy="12" r="9"/><path {...p} d="M12 7v5l3 2"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      {paths[name]}
    </svg>
  );
}

// Bottom nav — glass pill floating
function KernNav({ active, onNav, cartCount = 0 }) {
  const items = [
    { id: 'home', icon: 'home', label: 'Atelier' },
    { id: 'catalogue', icon: 'grid', label: 'Catalogue' },
    { id: 'cart', icon: 'bag', label: 'Panier' },
    { id: 'contact', icon: 'mail', label: 'Contact' },
  ];
  return (
    <div style={{
      position: 'absolute',
      left: 20, right: 20, bottom: 18,
      height: 60,
      borderRadius: 100,
      background: 'rgba(26,48,40,0.82)',
      backdropFilter: 'blur(24px) saturate(160%)',
      WebkitBackdropFilter: 'blur(24px) saturate(160%)',
      border: '1px solid var(--vert-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 40,
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
    }}>
      {items.map(it => {
        const isActive = active === it.id;
        const color = isActive ? 'var(--terracotta)' : 'rgba(245,240,232,0.40)';
        return (
          <button
            key={it.id}
            onClick={() => onNav(it.id)}
            style={{
              background: 'transparent',
              border: 'none',
              height: '100%',
              padding: '0 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              cursor: 'pointer',
              position: 'relative',
              color,
              minWidth: 60,
            }}>
            <div style={{ position: 'relative' }}>
              <KernIcon name={it.icon} size={22} color={color} />
              {it.id === 'cart' && cartCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: -6, right: -8,
                  minWidth: 16, height: 16,
                  padding: '0 4px',
                  borderRadius: 8,
                  background: 'var(--terracotta)',
                  color: 'var(--creme)',
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>{cartCount}</div>
              )}
            </div>
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color,
            }}>{it.label}</div>
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: 6,
                width: 18,
                height: 2,
                background: 'var(--terracotta)',
                borderRadius: 1,
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

function KernToast({ msg }) {
  if (!msg) return null;
  return (
    <div key={msg.id} style={{
      position: 'absolute',
      bottom: 100,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--vert-elevated)',
      border: '1px solid var(--vert-border)',
      color: 'var(--creme)',
      fontFamily: 'Outfit, sans-serif',
      fontSize: 12,
      fontWeight: 500,
      padding: '12px 20px',
      borderRadius: 100,
      zIndex: 80,
      animation: 'kern-toast-in 2400ms ease forwards',
      boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
      whiteSpace: 'nowrap',
    }}>
      {msg.text}
    </div>
  );
}

Object.assign(window, { KernThumbnail, KernIcon, KernNav, KernToast, kernTones });


// ===== screen-home.jsx =====
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


// ===== screen-catalogue.jsx =====
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


// ===== screen-product.jsx =====
// Atelier Kern — Product bottom sheet

function KernProductSheet({ product, onClose, onAdd }) {
  const [qty, setQty] = React.useState(1);
  const [closing, setClosing] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (product) {
      setQty(1);
      setClosing(false);
      // allow mount transition
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [product?.id]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 260);
  };

  if (!product && !closing) return null;
  if (!product) return null;

  return (
    <>
      {/* backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'var(--overlay-bg)',
          zIndex: 60,
          opacity: closing ? 0 : 1,
          transition: 'opacity 260ms ease',
        }}
      />
      <div style={{
        position: 'absolute',
        left: 0, right: 0, bottom: 0,
        maxHeight: '88%',
        background: 'rgba(26,48,40,0.96)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        borderTop: '2px solid rgba(212,96,58,0.3)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        zIndex: 70,
        animation: closing
          ? 'kern-sheet-out 260ms ease-in forwards'
          : 'kern-sheet-in 320ms cubic-bezier(0.32,0.72,0,1) both',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* handle */}
        <div style={{
          display: 'flex', justifyContent: 'center', padding: '10px 0 4px',
        }}>
          <div style={{
            width: 40, height: 4,
            background: 'var(--vert-border)',
            borderRadius: 2,
          }} />
        </div>

        <div className="kern-scroll" style={{
          overflowY: 'auto',
          padding: '0 24px 24px',
          flex: 1,
        }}>
          {/* image zone */}
          <div style={{
            height: 200,
            background: 'var(--vert-surface)',
            borderRadius: 12,
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 20,
            border: '1px solid var(--vert-border)',
          }}>
            <KernThumbnail tone={product.tone} name={product.name} size={200} rounded={12} />
            <button
              onClick={handleClose}
              style={{
                position: 'absolute', top: 12, right: 12,
                width: 36, height: 36,
                borderRadius: 100,
                background: 'rgba(15,25,20,0.6)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--vert-border)',
                color: 'var(--creme)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
              <KernIcon name="close" size={16} color="var(--creme)" />
            </button>
          </div>

          <div className="kern-eyebrow" style={{ marginBottom: 10 }}>
            {product.category}{product.tag ? ` · ${product.tag}` : ''}
          </div>

          <h2 className="kern-syne" style={{
            fontSize: 28, fontWeight: 600, color: 'var(--creme)',
            letterSpacing: '-0.01em', lineHeight: 1.1,
            marginBottom: 16,
          }}>{product.name}</h2>

          <p className="kern-outfit" style={{
            fontSize: 13, fontWeight: 300,
            color: 'var(--creme-dim)', lineHeight: 1.6,
            marginBottom: 24,
          }}>{product.desc}</p>

          {/* Specs row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
            padding: '18px 0',
            borderTop: '1px solid var(--vert-border)',
            borderBottom: '1px solid var(--vert-border)',
            marginBottom: 24,
          }}>
            <div>
              <div className="kern-micro" style={{ color: 'var(--creme-dim)', marginBottom: 6 }}>Disponible</div>
              <div className="kern-outfit" style={{ fontSize: 13, color: 'var(--creme)' }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: 'var(--success)', marginRight: 8, verticalAlign: 'middle' }} />
                Aujourd'hui
              </div>
            </div>
            <div>
              <div className="kern-micro" style={{ color: 'var(--creme-dim)', marginBottom: 6 }}>Retrait</div>
              <div className="kern-outfit" style={{ fontSize: 13, color: 'var(--creme)' }}>
                8h → 19h
              </div>
            </div>
          </div>

          {/* Quantity + price */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 20,
          }}>
            <div>
              <div className="kern-micro" style={{ color: 'var(--creme-dim)', marginBottom: 6 }}>Prix</div>
              <div className="kern-syne" style={{
                fontSize: 26, fontWeight: 700, color: 'var(--terracotta)',
              }}>{(product.price * qty).toFixed(0)}€</div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 0,
              background: 'var(--vert-elevated)',
              border: '1px solid var(--vert-border)',
              borderRadius: 100,
              padding: 4,
            }}>
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{
                  width: 36, height: 36, borderRadius: 100,
                  background: 'transparent', border: 'none',
                  color: 'var(--creme)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: qty <= 1 ? 0.4 : 1,
                }}>
                <KernIcon name="minus" size={16} color="var(--creme)" />
              </button>
              <div className="kern-syne" style={{
                minWidth: 28, textAlign: 'center',
                fontSize: 16, fontWeight: 600, color: 'var(--creme)',
              }}>{qty}</div>
              <button
                onClick={() => setQty(qty + 1)}
                style={{
                  width: 36, height: 36, borderRadius: 100,
                  background: 'transparent', border: 'none',
                  color: 'var(--creme)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <KernIcon name="plus" size={16} color="var(--creme)" />
              </button>
            </div>
          </div>

          <button
            onClick={() => { onAdd(product, qty); handleClose(); }}
            style={{
              width: '100%',
              height: 52,
              borderRadius: 10,
              background: 'var(--terracotta)',
              color: 'var(--creme)',
              border: 'none',
              fontFamily: 'Outfit, sans-serif',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transition: 'filter 120ms ease, transform 120ms ease',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <KernIcon name="plus" size={14} color="var(--creme)" strokeWidth={2} />
            Ajouter au panier
          </button>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { KernProductSheet });


// ===== screen-cart-contact.jsx =====
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


// ===== app.jsx =====
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

