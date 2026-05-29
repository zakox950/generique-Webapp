"use client";

import { useState } from "react";
import { PRODUCTS } from "@/data/mock";

const stockProducts = PRODUCTS.filter((p) => p.mode === "make_to_stock");

function stockColor(qty: number): string {
  if (qty > 10) return "#1a6b3c";
  if (qty >= 4) return "#c9954f";
  return "#c45a5a";
}

export default function StockPage() {
  const [stocks, setStocks] = useState<Record<string, number>>(
    Object.fromEntries(
      stockProducts.map((p) => [p.id, p.stock ?? 0])
    )
  );
  const [inputs, setInputs] = useState<Record<string, string>>(
    Object.fromEntries(stockProducts.map((p) => [p.id, ""]))
  );

  const adjust = (id: string, delta: number) => {
    setStocks((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));
  };

  const setFromInput = (id: string) => {
    const val = parseInt(inputs[id]);
    if (!isNaN(val) && val >= 0) {
      setStocks((prev) => ({ ...prev, [id]: val }));
    }
    setInputs((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div style={{ padding: "24px", color: "#122b18" }}>
      <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "32px", fontWeight: 500, margin: "0 0 6px" }}>
        Gestion du stock
      </h1>
      <p style={{ fontSize: "13px", color: "#6e7691", fontFamily: "var(--font-manrope)", margin: "0 0 24px" }}>
        {stockProducts.length} produits · Mise à jour en temps réel (local)
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {stockProducts.map((p) => {
          const qty = stocks[p.id] ?? 0;
          const color = stockColor(qty);
          const maxBar = 50;
          const pct = Math.min((qty / maxBar) * 100, 100);

          return (
            <div
              key={p.id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "0 2px 8px rgba(18,43,24,0.07)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#122b18", fontFamily: "var(--font-manrope)" }}>{p.name}</div>
                  <div style={{ fontSize: "12px", color: "#888", fontFamily: "var(--font-manrope)" }}>{p.price.toFixed(2)} €</div>
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: color,
                    fontFamily: "var(--font-cormorant)",
                    minWidth: "40px",
                    textAlign: "right",
                  }}
                >
                  {qty}
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: "6px", background: "#f0f0f0", borderRadius: "3px", marginBottom: "12px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: color,
                    borderRadius: "3px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              {/* Controls */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  onClick={() => adjust(p.id, -1)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    border: "1.5px solid rgba(18,43,24,0.15)",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "#122b18",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  −
                </button>
                <button
                  onClick={() => adjust(p.id, 1)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    border: "1.5px solid rgba(18,43,24,0.15)",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "#122b18",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </button>
                <input
                  type="number"
                  placeholder="Saisir…"
                  value={inputs[p.id]}
                  onChange={(e) => setInputs((prev) => ({ ...prev, [p.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && setFromInput(p.id)}
                  style={{
                    flex: 1,
                    padding: "7px 10px",
                    borderRadius: "8px",
                    border: "1.5px solid rgba(18,43,24,0.15)",
                    background: "#f6fbf8",
                    fontSize: "13px",
                    fontFamily: "var(--font-manrope)",
                    color: "#122b18",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => setFromInput(p.id)}
                  style={{
                    background: "#1a6b3c",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "7px 12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-manrope)",
                  }}
                >
                  OK
                </button>
              </div>

              {qty <= 3 && qty > 0 && (
                <div style={{ marginTop: "8px", fontSize: "12px", color: "#c45a5a", fontFamily: "var(--font-manrope)", fontWeight: 600 }}>
                  ⚠ Stock critique — réapprovisionner
                </div>
              )}
              {qty === 0 && (
                <div style={{ marginTop: "8px", fontSize: "12px", color: "#c45a5a", fontFamily: "var(--font-manrope)", fontWeight: 700 }}>
                  ❌ Rupture de stock
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
