// Atelier Kern — Product bottom sheet

function ProductSheet({ product, onClose, onAdd }) {
  const T = window.AK_T;
  const [qty, setQty] = React.useState(1);
  const [visible, setVisible] = React.useState(false);
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    if (product) {
      setQty(1);
      setClosing(false);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [product]);

  const close = () => {
    setClosing(true);
    setVisible(false);
    setTimeout(onClose, 260);
  };

  if (!product) return null;

  const tint = window.AK_DATA.TINTS[
    parseInt(product.id.replace('p', '')) % 3
  ];

  return (
    <>
      {/* backdrop */}
      <div
        onClick={close}
        style={{
          position: 'absolute', inset: 0,
          background: T.overlay,
          opacity: visible ? 1 : 0,
          transition: 'opacity 240ms ease',
          zIndex: 150,
        }}
      />
      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'rgba(26,48,40,0.96)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        borderTopLeftRadius: 16, borderTopRightRadius: 16,
        borderTop: `2px solid rgba(212,96,58,0.30)`,
        transform: `translateY(${visible ? 0 : 100}%)`,
        transition: closing
          ? 'transform 260ms ease-in'
          : 'transform 320ms cubic-bezier(0.32,0.72,0,1)',
        zIndex: 160,
        maxHeight: '88%',
        overflow: 'auto',
        paddingBottom: 20,
      }}>
        {/* handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 2 }}>
          <div style={{ width: 38, height: 4, borderRadius: 100, background: T.vertBorder }}/>
        </div>

        {/* close */}
        <button
          onClick={close}
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 2,
            width: 32, height: 32, borderRadius: 100,
            background: T.vertElevated, border: `1px solid ${T.vertBorder}`,
            cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="x" size={14} color={T.creme} strokeWidth={1.8}/>
        </button>

        {/* image zone */}
        <div style={{
          margin: '14px 16px 0',
          height: 200, borderRadius: 12,
          background: tint,
          border: `1px solid ${T.vertBorder}`,
          position: 'relative', overflow: 'hidden',
        }}>
          <Thumb tint={tint} product={product} big/>
          {product.tag && (
            <div style={{ position: 'absolute', left: 14, top: 14 }}>
              <Tag>{product.tag}</Tag>
            </div>
          )}
        </div>

        {/* body */}
        <div style={{ padding: '22px 22px 0' }}>
          <div style={{
            fontFamily: T.body, fontSize: 10, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.2em',
            color: T.accent,
          }}>{product.catLabel}</div>

          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: 16, marginTop: 6,
          }}>
            <h2 style={{
              fontFamily: T.display, fontWeight: 600, fontSize: 28,
              color: T.creme, margin: 0,
              lineHeight: 1.05, letterSpacing: '-0.02em',
            }}>{product.name}</h2>
            <div style={{
              fontFamily: T.display, fontWeight: 700, fontSize: 26,
              color: T.accent, lineHeight: 1,
              whiteSpace: 'nowrap',
            }}>{product.price.toFixed(2)} €</div>
          </div>

          <p style={{
            fontFamily: T.body, fontSize: 13, fontWeight: 300,
            color: T.cremeDim, lineHeight: 1.6,
            marginTop: 18, marginBottom: 0,
          }}>{product.detail}</p>

          {/* meta grid */}
          <div style={{
            marginTop: 22,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
            background: T.vertBorder,
            border: `1px solid ${T.vertBorder}`,
            borderRadius: 10, overflow: 'hidden',
          }}>
            {[
              ['Allergènes', 'Gluten · Œufs · Lait'],
              ['Conservation', '24h · à 4°C'],
              ['Poids', '~110 g'],
              ['Disponibilité', 'Dès 08h30'],
            ].map(([k, v]) => (
              <div key={k} style={{
                background: T.vertSurface, padding: '12px 14px',
              }}>
                <div style={{
                  fontFamily: T.body, fontSize: 9, fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.18em',
                  color: T.cremeDim, marginBottom: 4,
                }}>{k}</div>
                <div style={{
                  fontFamily: T.body, fontSize: 12, fontWeight: 500,
                  color: T.creme,
                }}>{v}</div>
              </div>
            ))}
          </div>

          {/* footer: qty + add */}
          <div style={{
            marginTop: 24,
            display: 'flex', gap: 10, alignItems: 'stretch',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              height: 52, borderRadius: 100,
              background: T.vertElevated,
              border: `1px solid ${T.vertBorder}`,
              overflow: 'hidden',
            }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ ...qtyBtn, width: 44, height: 52 }}>
                <Icon name="minus" size={16} color={T.creme} strokeWidth={1.8}/>
              </button>
              <div style={{
                minWidth: 20, textAlign: 'center',
                fontFamily: T.display, fontSize: 18, fontWeight: 700,
                color: T.creme, padding: '0 6px',
              }}>{qty}</div>
              <button onClick={() => setQty(qty + 1)} style={{ ...qtyBtn, width: 44, height: 52 }}>
                <Icon name="plus" size={16} color={T.creme} strokeWidth={1.8}/>
              </button>
            </div>
            <button
              onClick={() => { onAdd(product, qty); close(); }}
              style={{
                flex: 1, height: 52,
                background: T.accent, color: T.creme,
                border: 'none', borderRadius: 10,
                fontFamily: T.body, fontSize: 12, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.16em',
                cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'transform 120ms ease, filter 120ms ease',
              }}
              onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.96)'; e.currentTarget.style.filter = 'brightness(1.08)'; }}
              onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none'; }}
              onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none'; }}
            >
              <Icon name="plus" size={14} color={T.creme} strokeWidth={2}/>
              Ajouter au panier · {(product.price * qty).toFixed(2)} €
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

window.ProductSheet = ProductSheet;
