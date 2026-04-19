// Atelier Kern — shared atoms
const { useState, useEffect, useRef, useMemo } = React;
const T = window.AK_T;

// ---------- Icon set (stroke 1.4, Lucide-ish, original) ----------
function Icon({ name, size = 22, color, strokeWidth = 1.4 }) {
  const s = size;
  const c = color || T.creme;
  const common = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: c, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home': return <svg {...common}><path d="M4 11 12 4l8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-9z"/></svg>;
    case 'grid': return <svg {...common}><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="4" rx="1"/><rect x="13" y="10" width="7" height="10" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/></svg>;
    case 'bag': return <svg {...common}><path d="M5 8h14l-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>;
    case 'mail': return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
    case 'plus': return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case 'minus': return <svg {...common}><path d="M5 12h14"/></svg>;
    case 'x': return <svg {...common}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case 'arrow': return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'clock': return <svg {...common}><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2.5"/></svg>;
    case 'pin': return <svg {...common}><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case 'check': return <svg {...common}><path d="M4 12l5 5L20 6"/></svg>;
    default: return null;
  }
}

// ---------- Eyebrow ----------
function Eyebrow({ children, style = {} }) {
  return <div style={{ ...window.AK_eyebrow(), ...style }}>{children}</div>;
}

// ---------- Button ----------
function Btn({ children, onClick, variant = 'primary', fullWidth, style = {}, icon }) {
  const [press, setPress] = useState(false);
  const base = {
    fontFamily: T.body, fontWeight: 600, fontSize: 11,
    textTransform: 'uppercase', letterSpacing: '0.14em',
    height: 48, padding: '0 22px', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', gap: 8,
    border: 'none', cursor: 'pointer', width: fullWidth ? '100%' : 'auto',
    borderRadius: 8,
    transition: 'transform 120ms ease, filter 120ms ease',
    transform: press ? 'scale(0.96)' : 'scale(1)',
    filter: press ? 'brightness(1.08)' : 'none',
  };
  const variants = {
    primary: { background: T.accent, color: T.creme },
    solid:   { background: T.accent, color: T.creme, height: 52, fontSize: 12, borderRadius: 10 },
    ghost:   { background: 'transparent', color: T.creme, border: `1px solid ${T.vertBorder}` },
    elev:    { background: T.vertElevated, color: T.creme, border: `1px solid ${T.vertBorder}` },
  };
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerLeave={() => setPress(false)}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {icon && icon}
      {children}
    </button>
  );
}

// ---------- Tag (rectangle 6px radius) ----------
function Tag({ children, style = {} }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 8px',
      background: T.accentDim,
      border: `1px solid ${T.accentBorder}`,
      color: T.accent,
      borderRadius: 6,
      ...window.AK_micro(),
      ...style,
    }}>
      {children}
    </span>
  );
}

// ---------- Thumbnail (no photo, tertiary tint + monospace placeholder) ----------
function Thumb({ tint, product, aspect = '1 / 1', big = false }) {
  // subtle internal pattern for depth: stripes + centred placeholder label
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: tint,
      overflow: 'hidden',
    }}>
      {/* diagonal stripes — very subtle */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.018) 0 14px, transparent 14px 28px)`,
      }}/>
      {/* large decorative first letter */}
      <div style={{
        position: 'absolute',
        top: big ? 18 : 14, left: big ? 18 : 12,
        fontFamily: T.display, fontWeight: 700,
        fontSize: big ? 72 : 42,
        color: 'rgba(245,240,232,0.09)',
        lineHeight: 1, letterSpacing: '-0.02em',
      }}>
        {product.name.charAt(0)}
      </div>
      {/* tiny monospace placeholder label bottom-left */}
      <div style={{
        position: 'absolute', top: 10, right: 10,
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: 8, letterSpacing: '0.15em',
        color: 'rgba(245,240,232,0.35)',
        textTransform: 'uppercase',
      }}>
        PHOTO — {product.id.toUpperCase()}
      </div>
    </div>
  );
}

// ---------- Big background numeral ----------
function BgNumeral({ n, side = 'right', top = 0, size = 160 }) {
  return (
    <div style={{
      position: 'absolute',
      top, [side]: -size * 0.18,
      fontFamily: T.display, fontWeight: 700,
      fontSize: size, lineHeight: 1,
      color: 'rgba(245,240,232,0.05)',
      pointerEvents: 'none', userSelect: 'none',
      letterSpacing: '-0.05em',
    }}>{n}</div>
  );
}

// ---------- Toast ----------
function Toast({ msg, show }) {
  return (
    <div style={{
      position: 'absolute', left: '50%', bottom: 110,
      transform: `translateX(-50%) translateY(${show ? 0 : 20}px)`,
      opacity: show ? 1 : 0,
      transition: 'opacity 200ms ease, transform 200ms ease',
      background: T.vertElevated,
      border: `1px solid ${T.vertBorder}`,
      borderRadius: 100,
      padding: '12px 18px',
      color: T.creme,
      fontFamily: T.body, fontSize: 12, fontWeight: 500,
      letterSpacing: '0.04em',
      display: 'flex', alignItems: 'center', gap: 8,
      zIndex: 200,
      pointerEvents: 'none',
      boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: '50%',
        background: T.accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="check" size={10} color={T.creme} strokeWidth={2.5}/>
      </div>
      {msg}
    </div>
  );
}

Object.assign(window, { Icon, Eyebrow, Btn, Tag, Thumb, BgNumeral, Toast });
