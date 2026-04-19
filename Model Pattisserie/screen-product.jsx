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
