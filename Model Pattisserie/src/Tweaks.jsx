// Atelier Kern — Tweaks panel
function TweaksPanel({ state, setState, onClose }) {
  const T = window.AK_T;

  const accents = [
    { id: 'terracotta', name: 'Terracotta', color: '#D4603A' },
    { id: 'ocre',       name: 'Ocre',       color: '#C9A24B' },
    { id: 'rouille',    name: 'Rouille',    color: '#A8452C' },
    { id: 'sable',      name: 'Sable',      color: '#C8B89A' },
  ];
  const bgs = [
    { id: 'vert',    name: 'Vert bouteille', color: '#1A3028' },
    { id: 'noir',    name: 'Noir profond',   color: '#0F1410' },
    { id: 'encre',   name: 'Bleu encre',     color: '#16253A' },
    { id: 'brique',  name: 'Brique',         color: '#2B1A18' },
  ];
  const displays = ['Syne', 'Space Grotesk', 'Archivo', 'DM Serif Display'];

  const row = (label, children) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: T.body, fontSize: 9, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.2em',
        color: 'rgba(245,240,232,0.5)', marginBottom: 8,
      }}>{label}</div>
      {children}
    </div>
  );

  const chipRow = (items, current, setter, field = 'id') => (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {items.map(it => {
        const id = typeof it === 'string' ? it : it[field];
        const active = current === id;
        return (
          <button key={id} onClick={() => setter(id)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 10px',
            borderRadius: 6,
            background: active ? T.accent : T.vertSurface,
            border: `1px solid ${active ? T.accent : T.vertBorder}`,
            color: active ? T.creme : 'rgba(245,240,232,0.75)',
            fontFamily: T.body, fontSize: 10, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            cursor: 'pointer',
          }}>
            {typeof it !== 'string' && it.color && (
              <span style={{
                width: 10, height: 10, borderRadius: 2,
                background: it.color,
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)',
              }}/>
            )}
            {typeof it === 'string' ? it : it.name}
          </button>
        );
      })}
    </div>
  );

  return (
    <div style={{
      position: 'absolute', right: 16, bottom: 100,
      width: 260,
      background: 'rgba(26,48,40,0.97)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: `1px solid ${T.vertBorder}`,
      borderTop: `2px solid ${T.accent}`,
      borderRadius: 12,
      padding: 18,
      zIndex: 400,
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 14,
      }}>
        <div>
          <div style={{
            fontFamily: T.body, fontSize: 9, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.22em',
            color: T.accent,
          }}>Tweaks</div>
          <div style={{
            fontFamily: T.display, fontWeight: 600, fontSize: 18,
            color: T.creme, letterSpacing: '-0.01em', marginTop: 2,
          }}>Studio Sucré</div>
        </div>
        <button onClick={onClose} style={{
          width: 28, height: 28, borderRadius: 100,
          background: T.vertElevated, border: `1px solid ${T.vertBorder}`,
          cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="x" size={12} color={T.creme} strokeWidth={1.8}/>
        </button>
      </div>

      {row('Accent', chipRow(accents, state.accent, v => setState({ accent: v })))}
      {row('Fond', chipRow(bgs, state.bg, v => setState({ bg: v })))}
      {row('Display font', chipRow(displays, state.display, v => setState({ display: v })))}

      {row('Grain', (
        <input
          type="range" min={0} max={12} step={1}
          value={state.grain}
          onChange={e => setState({ grain: +e.target.value })}
          style={{ width: '100%', accentColor: '#D4603A' }}
        />
      ))}

      {row('Options', (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            ['numerals', 'Gros numéros de section'],
            ['heroLine', 'Ligne éditoriale hero'],
          ].map(([k, l]) => (
            <label key={k} style={{
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              fontFamily: T.body, fontSize: 11, color: T.creme,
            }}>
              <input
                type="checkbox"
                checked={state[k]}
                onChange={e => setState({ [k]: e.target.checked })}
                style={{ accentColor: '#D4603A' }}
              />
              {l}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

window.TweaksPanel = TweaksPanel;
