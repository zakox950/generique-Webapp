"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";

export default function PanierPage() {
  const { items, update, remove, total, clear } = useCart();

  if (items.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: "32px 24px",
          textAlign: "center",
          color: "#38161b",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🧺</div>
        <h2
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "28px",
            fontWeight: 400,
            margin: "0 0 10px",
          }}
        >
          Votre panier est vide
        </h2>
        <p style={{ fontSize: "14px", color: "rgba(56,22,27,0.6)", margin: "0 0 24px", fontFamily: "var(--font-manrope)" }}>
          Découvrez nos créations et ajoutez vos coups de cœur.
        </p>
        <Link
          href="/client/catalogue"
          style={{
            background: "#911f23",
            color: "#fff",
            borderRadius: "999px",
            padding: "12px 28px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "var(--font-manrope)",
          }}
        >
          Voir la carte
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 16px", color: "#38161b" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "34px",
            fontWeight: 400,
            margin: 0,
          }}
        >
          Mon panier
        </h1>
        <button
          onClick={clear}
          style={{
            background: "none",
            border: "none",
            color: "rgba(56,22,27,0.5)",
            fontSize: "13px",
            cursor: "pointer",
            fontFamily: "var(--font-manrope)",
          }}
        >
          Vider
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "14px 16px",
              boxShadow: "0 2px 8px rgba(56,22,27,0.07)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#38161b", fontFamily: "var(--font-manrope)" }}>
                  {item.name}
                </div>
                {item.option && (
                  <div style={{ fontSize: "12px", color: "rgba(56,22,27,0.55)", fontFamily: "var(--font-manrope)", marginTop: "2px" }}>
                    {item.option}
                  </div>
                )}
                <div style={{ fontSize: "13px", color: "#911f23", fontWeight: 700, fontFamily: "var(--font-manrope)", marginTop: "2px" }}>
                  {item.price.toFixed(2)} €
                </div>
              </div>
              <button
                onClick={() => remove(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(56,22,27,0.4)",
                  fontSize: "18px",
                  cursor: "pointer",
                  padding: "0 4px",
                }}
              >
                ×
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                onClick={() => item.qty > 1 ? update(item.id, item.qty - 1) : remove(item.id)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: "1.5px solid rgba(56,22,27,0.2)",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#38161b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                −
              </button>
              <span style={{ fontWeight: 600, fontSize: "15px", fontFamily: "var(--font-manrope)" }}>{item.qty}</span>
              <button
                onClick={() => update(item.id, item.qty + 1)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: "1.5px solid rgba(56,22,27,0.2)",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#38161b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </button>
              <span style={{ marginLeft: "auto", fontWeight: 700, color: "#38161b", fontSize: "14px", fontFamily: "var(--font-manrope)" }}>
                {(item.price * item.qty).toFixed(2)} €
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div
        style={{
          background: "rgba(145,31,35,0.06)",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "16px",
          border: "1px solid rgba(145,31,35,0.15)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span style={{ fontSize: "13px", color: "rgba(56,22,27,0.6)", fontFamily: "var(--font-manrope)" }}>Sous-total</span>
          <span style={{ fontSize: "13px", fontFamily: "var(--font-manrope)" }}>{total().toFixed(2)} €</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span style={{ fontSize: "13px", color: "rgba(56,22,27,0.6)", fontFamily: "var(--font-manrope)" }}>Retrait boutique</span>
          <span style={{ fontSize: "13px", color: "var(--c-ink-2)", fontFamily: "var(--font-manrope)" }}>Gratuit</span>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(56,22,27,0.1)",
            paddingTop: "10px",
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-manrope)" }}>Total</span>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "#911f23", fontFamily: "var(--font-cormorant)" }}>
            {total().toFixed(2)} €
          </span>
        </div>
      </div>

      <button
        style={{
          width: "100%",
          background: "#911f23",
          color: "#fff",
          borderRadius: "999px",
          padding: "14px",
          fontSize: "15px",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-manrope)",
          marginBottom: "10px",
        }}
        onClick={() => alert("Commande passée ! (démo)")}
      >
        Passer commande
      </button>
      <Link
        href="/client/devis"
        style={{
          display: "block",
          width: "100%",
          background: "transparent",
          color: "#911f23",
          borderRadius: "999px",
          padding: "13px",
          fontSize: "14px",
          fontWeight: 600,
          border: "1.5px solid #911f23",
          cursor: "pointer",
          fontFamily: "var(--font-manrope)",
          textAlign: "center",
          textDecoration: "none",
        }}
      >
        Demander un devis
      </Link>
    </div>
  );
}
