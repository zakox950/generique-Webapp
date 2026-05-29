"use client";

import { useState } from "react";
import { PRODUCTS } from "@/data/mock";
import { useCart } from "@/store/cart";

type Product = (typeof PRODUCTS)[number];

function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  const optionKeys = Object.keys(product.options || {});
  const extraPrice = optionKeys.reduce((sum, key) => {
    const val = selectedOptions[key];
    if (!val) return sum;
    const opts = (product.options as Record<string, Record<string, number>>)[key];
    return sum + (opts[val] || 0);
  }, 0);
  const finalPrice = product.price + extraPrice;

  const handleAdd = () => {
    const optionStr = Object.entries(selectedOptions)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    add({
      id: product.id + (optionStr ? `-${optionStr}` : ""),
      name: product.name,
      price: finalPrice,
      qty,
      option: optionStr || undefined,
    });
    setAdded(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#f7ece6",
          borderRadius: "24px 24px 0 0",
          padding: "0 0 32px",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={product.photo}
          alt={product.name}
          style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "24px 24px 0 0" }}
        />
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "28px",
                fontWeight: 500,
                color: "#38161b",
                margin: 0,
              }}
            >
              {product.name}
            </h2>
            {product.badge && (
              <span
                style={{
                  background: "#f0d5c0",
                  color: "#8a4a1f",
                  fontSize: "10px",
                  fontWeight: 700,
                  borderRadius: "999px",
                  padding: "3px 9px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontFamily: "var(--font-manrope)",
                  flexShrink: 0,
                  marginLeft: "8px",
                }}
              >
                {product.badge}
              </span>
            )}
          </div>
          <p style={{ fontSize: "14px", color: "rgba(56,22,27,0.72)", lineHeight: 1.6, margin: "0 0 16px", fontFamily: "var(--font-manrope)" }}>
            {product.short}
          </p>

          {/* Options */}
          {optionKeys.map((key) => {
            const opts = (product.options as Record<string, Record<string, number>>)[key];
            return (
              <div key={key} style={{ marginBottom: "14px" }}>
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "rgba(56,22,27,0.6)",
                    fontFamily: "var(--font-manrope)",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  {key}
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {Object.entries(opts).map(([label, extra]) => (
                    <button
                      key={label}
                      onClick={() => setSelectedOptions((prev) => ({ ...prev, [key]: label }))}
                      style={{
                        borderRadius: "999px",
                        padding: "7px 14px",
                        fontSize: "13px",
                        fontFamily: "var(--font-manrope)",
                        fontWeight: 500,
                        cursor: "pointer",
                        border: selectedOptions[key] === label ? "2px solid #911f23" : "1.5px solid rgba(56,22,27,0.2)",
                        background: selectedOptions[key] === label ? "#f0d5c0" : "transparent",
                        color: "#38161b",
                        transition: "all 0.15s",
                      }}
                    >
                      {label}
                      {extra > 0 && <span style={{ color: "#911f23", marginLeft: "4px" }}>+{extra}€</span>}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Qty + prix */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "1.5px solid rgba(56,22,27,0.25)",
                  background: "transparent",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#38161b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                −
              </button>
              <span style={{ fontSize: "16px", fontWeight: 600, minWidth: "20px", textAlign: "center", fontFamily: "var(--font-manrope)" }}>
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "1.5px solid rgba(56,22,27,0.25)",
                  background: "transparent",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#38161b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </button>
            </div>
            <div style={{ marginLeft: "auto", fontSize: "22px", fontWeight: 700, color: "#911f23", fontFamily: "var(--font-cormorant)" }}>
              {(finalPrice * qty).toFixed(2)} €
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.active}
            style={{
              width: "100%",
              background: added ? "#38161b" : product.active ? "#911f23" : "#aaa",
              color: "#fff",
              borderRadius: "999px",
              padding: "14px",
              fontSize: "15px",
              fontWeight: 600,
              border: "none",
              cursor: product.active ? "pointer" : "not-allowed",
              fontFamily: "var(--font-manrope)",
              transition: "background 0.2s",
            }}
          >
            {added ? "✓ Ajouté au panier" : product.active ? "Ajouter au panier" : "Indisponible"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CataloguePage() {
  const [selected, setSelected] = useState<Product | null>(null);

  const activeProducts = PRODUCTS.filter((p) => p.active);
  const inactiveProducts = PRODUCTS.filter((p) => !p.active);

  return (
    <div style={{ padding: "24px 16px", color: "#38161b" }}>
      <h1
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "34px",
          fontWeight: 400,
          margin: "0 0 4px",
        }}
      >
        La carte
      </h1>
      <p style={{ fontSize: "13px", color: "rgba(56,22,27,0.6)", margin: "0 0 20px", fontFamily: "var(--font-manrope)" }}>
        {activeProducts.length} créations disponibles
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {activeProducts.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            style={{
              background: "#fff",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(56,22,27,0.08)",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              padding: 0,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
          >
            <img
              src={p.photo}
              alt={p.name}
              style={{ width: "100%", height: "120px", objectFit: "cover" }}
            />
            <div style={{ padding: "10px 12px 12px" }}>
              {p.badge && (
                <span
                  style={{
                    background: "#f0d5c0",
                    color: "#8a4a1f",
                    fontSize: "9px",
                    fontWeight: 700,
                    borderRadius: "999px",
                    padding: "2px 7px",
                    marginBottom: "4px",
                    display: "inline-block",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontFamily: "var(--font-manrope)",
                  }}
                >
                  {p.badge}
                </span>
              )}
              {p.mode === "make_to_stock" && p.stock !== null && p.stock <= 5 && (
                <span
                  style={{
                    background: "#fde8e8",
                    color: "#c45a5a",
                    fontSize: "9px",
                    fontWeight: 700,
                    borderRadius: "999px",
                    padding: "2px 7px",
                    marginBottom: "4px",
                    display: "inline-block",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontFamily: "var(--font-manrope)",
                  }}
                >
                  Presque épuisé
                </span>
              )}
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#38161b",
                  fontFamily: "var(--font-manrope)",
                  lineHeight: 1.3,
                }}
              >
                {p.name}
              </div>
              <div style={{ fontSize: "13px", color: "#911f23", fontWeight: 700, fontFamily: "var(--font-manrope)", marginTop: "2px" }}>
                {p.price.toFixed(2)} €
              </div>
            </div>
          </button>
        ))}
      </div>

      {inactiveProducts.length > 0 && (
        <div style={{ marginTop: "28px" }}>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "22px",
              fontWeight: 400,
              margin: "0 0 12px",
              color: "rgba(56,22,27,0.5)",
            }}
          >
            Hors saison
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {inactiveProducts.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  overflow: "hidden",
                  opacity: 0.55,
                  border: "1px solid rgba(56,22,27,0.1)",
                }}
              >
                <img
                  src={p.photo}
                  alt={p.name}
                  style={{ width: "100%", height: "100px", objectFit: "cover", filter: "grayscale(0.5)" }}
                />
                <div style={{ padding: "10px 12px 12px" }}>
                  {p.badge && (
                    <span
                      style={{
                        background: "#e8e8e8",
                        color: "#666",
                        fontSize: "9px",
                        fontWeight: 700,
                        borderRadius: "999px",
                        padding: "2px 7px",
                        marginBottom: "4px",
                        display: "inline-block",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontFamily: "var(--font-manrope)",
                      }}
                    >
                      {p.badge}
                    </span>
                  )}
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#38161b", fontFamily: "var(--font-manrope)" }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#999", fontFamily: "var(--font-manrope)" }}>
                    {p.price.toFixed(2)} €
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
