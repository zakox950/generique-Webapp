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
