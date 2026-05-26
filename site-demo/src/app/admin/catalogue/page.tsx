"use client";

import { useState } from "react";
import { PRODUCTS } from "@/data/mock";

type Product = (typeof PRODUCTS)[number];

function EditModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [desc, setDesc] = useState(product.short);
  const [active, setActive] = useState(product.active);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1.5px solid rgba(18,43,24,0.2)",
    background: "#fff",
    fontSize: "14px",
    fontFamily: "var(--font-manrope)",
    color: "#122b18",
    boxSizing: "border-box",
    outline: "none",
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
      onClick={onClose}
    >
      <div
        style={{ width: "100%", maxWidth: "480px", background: "#f0f7f2", borderRadius: "20px", padding: "24px", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "26px", fontWeight: 500, margin: "0 0 20px", color: "#122b18" }}>
          Modifier — {product.name}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#666", fontFamily: "var(--font-manrope)", display: "block", marginBottom: "5px" }}>
              Nom
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#666", fontFamily: "var(--font-manrope)", display: "block", marginBottom: "5px" }}>
              Prix (€)
            </label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} step="0.5" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#666", fontFamily: "var(--font-manrope)", display: "block", marginBottom: "5px" }}>
              Description
            </label>
            <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-manrope)", color: "#122b18" }}>
              Produit actif
            </label>
            <button
              onClick={() => setActive(!active)}
              style={{
                width: "44px",
                height: "24px",
                borderRadius: "999px",
                border: "none",
                background: active ? "#1a6b3c" : "#ccc",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: "3px",
                  left: active ? "23px" : "3px",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: "transparent",
              border: "1.5px solid rgba(18,43,24,0.2)",
              borderRadius: "999px",
              padding: "11px",
              fontSize: "14px",
              fontFamily: "var(--font-manrope)",
              fontWeight: 600,
              cursor: "pointer",
              color: "#122b18",
            }}
          >
            Annuler
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 2,
              background: "#1a6b3c",
              border: "none",
              borderRadius: "999px",
              padding: "11px",
              fontSize: "14px",
              fontFamily: "var(--font-manrope)",
              fontWeight: 600,
              cursor: "pointer",
              color: "#fff",
            }}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CataloguePage() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [actifs, setActifs] = useState<Record<string, boolean>>(
    Object.fromEntries(PRODUCTS.map((p) => [p.id, p.active]))
  );

  return (
    <div style={{ padding: "24px", color: "#122b18" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "32px", fontWeight: 500, margin: 0 }}>
          Catalogue
        </h1>
        <button
          style={{
            background: "#1a6b3c",
            color: "#fff",
            borderRadius: "999px",
            padding: "9px 18px",
            fontSize: "13px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-manrope)",
          }}
          onClick={() => alert("Formulaire nouveau produit (démo)")}
        >
          + Nouveau
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {PRODUCTS.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(18,43,24,0.07)",
              opacity: actifs[p.id] ? 1 : 0.55,
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={p.photo}
                alt={p.name}
                style={{ width: "100%", height: "100px", objectFit: "cover" }}
              />
              {p.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    background: "#f0d5c0",
                    color: "#8a4a1f",
                    fontSize: "9px",
                    fontWeight: 700,
                    borderRadius: "999px",
                    padding: "2px 7px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontFamily: "var(--font-manrope)",
                  }}
                >
                  {p.badge}
                </span>
              )}
            </div>

            <div style={{ padding: "10px 12px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#122b18", fontFamily: "var(--font-manrope)" }}>{p.name}</div>
                  <div style={{ fontSize: "13px", color: "#1a6b3c", fontWeight: 700, fontFamily: "var(--font-manrope)" }}>{p.price.toFixed(2)} €</div>
                </div>
                <button
                  onClick={() => setActifs((prev) => ({ ...prev, [p.id]: !prev[p.id] }))}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "999px",
                    border: "none",
                    background: actifs[p.id] ? "#1a6b3c" : "#ccc",
                    cursor: "pointer",
                    position: "relative",
                    flexShrink: 0,
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: "#fff",
                      position: "absolute",
                      top: "3px",
                      left: actifs[p.id] ? "19px" : "3px",
                      transition: "left 0.2s",
                    }}
                  />
                </button>
              </div>
              <button
                onClick={() => setSelected(p)}
                style={{
                  width: "100%",
                  background: "rgba(18,43,24,0.07)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px",
                  fontSize: "12px",
                  fontFamily: "var(--font-manrope)",
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#1a6b3c",
                }}
              >
                Modifier
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && <EditModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
