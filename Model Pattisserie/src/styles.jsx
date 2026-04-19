// Style token helpers for Atelier Kern
// All tokens are read from CSS vars so Tweaks can override at runtime.

const tokens = {
  vert: 'var(--vert)',
  vertSurface: 'var(--vert-surface)',
  vertElevated: 'var(--vert-elevated)',
  vertBorder: 'var(--vert-border)',
  creme: 'var(--creme)',
  cremeDim: 'var(--creme-dim)',
  cremeGhost: 'var(--creme-ghost)',
  accent: 'var(--accent)',
  accentDim: 'var(--accent-dim)',
  accentBorder: 'var(--accent-border)',
  sable: 'var(--sable)',
  overlay: 'var(--overlay-bg)',
  display: 'var(--font-display)',
  body: 'var(--font-body)',
};

window.AK_T = tokens;

// Eyebrow (label) preset
window.AK_eyebrow = (extra = {}) => ({
  fontFamily: tokens.body,
  fontSize: 10,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: tokens.accent,
  ...extra,
});

window.AK_micro = (extra = {}) => ({
  fontFamily: tokens.body,
  fontSize: 9,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  ...extra,
});

// Grain SVG — full-page subtle noise
window.AK_GRAIN_URL = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0.3  0 0 0 0 0.3  0 0 0 0 0.3  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>")`;
