// Atelier Kern — Bottom nav (floating glass pill with scroll collapse)
const { useState: useState_bn, useEffect: useEffect_bn } = React;

function BottomNav({ current, onNav, cartCount, collapsed }) {
  const T = window.AK_T;
  const items = [
    { id: 'home',      icon: 'home', label: 'Accueil' },
    { id: 'catalogue', icon: 'grid', label: 'Catalogue' },
    { id: 'cart',      icon: 'bag',  label: 'Panier' },
    { id: 'contact',   icon: 'mail', label: 'Contact' },
  ];

  return (
    <div style={{
      position: 'absolute',
      left: '50%', transform: 'translateX(-50%)',
      bottom: 28,
      width: collapsed ? 72 : 'calc(100% - 40px)',
      maxWidth: 420,
      height: 56,
      borderRadius: 100,
      background: 'rgba(26,48,40,0.88)',
      backdropFilter: 'blur(24px) saturate(160%)',
      WebkitBackdropFilter: 'blur(24px) saturate(160%)',
      border: `1px solid ${T.vertBorder}`,
      boxShadow: '0 12px 36px rgba(0,0,0,0.45), inset 0 1px 0 rgba(245,240,232,0.04)',
      transition: 'width 360ms cubic-bezier(0.32,0.72,0,1)',
      zIndex: 100,
      overflow: 'hidden',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-around',
      padding: collapsed ? 0 : '0 8px',
    }}>
      {items.map(it => {
        const active = current === it.id;
        // in collapsed mode, only show the active item icon
        if (collapsed && !active) return null;
        return (
          <button
            key={it.id}
            onClick={() => onNav(it.id)}
            style={{
              flex: collapsed ? 'none' : 1,
              width: collapsed ? 56 : 'auto',
              height: '100%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              padding: 0,
              position: 'relative',
              color: active ? T.accent : 'rgba(245,240,232,0.30)',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon
                name={it.icon}
                size={22}
                color={active ? T.accent : 'rgba(245,240,232,0.40)'}
                strokeWidth={active ? 1.8 : 1.4}
              />
              {it.id === 'cart' && cartCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: -4, right: -7,
                  minWidth: 15, height: 15, borderRadius: 100,
                  background: T.accent,
                  color: T.creme,
                  fontFamily: T.body, fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px',
                  border: `1.5px solid rgba(26,48,40,1)`,
                }}>{cartCount}</div>
              )}
            </div>
            {!collapsed && (
              <span style={{
                fontFamily: T.body,
                fontSize: 9, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.14em',
                color: active ? T.accent : 'rgba(245,240,232,0.35)',
              }}>{it.label}</span>
            )}
            {active && !collapsed && (
              <div style={{
                position: 'absolute',
                bottom: 6, left: '50%', transform: 'translateX(-50%)',
                width: 16, height: 2, background: T.accent, borderRadius: 2,
              }}/>
            )}
          </button>
        );
      })}
    </div>
  );
}

window.BottomNav = BottomNav;
