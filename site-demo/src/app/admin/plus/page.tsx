"use client";

import Link from "next/link";

const INK = "#4a1f24";
const ACCENT = "#6a2828";

const TILES = [
  { href: "/admin/stock", icon: "📦", label: "Stock", desc: "Gérer les niveaux de stock" },
  { href: "/admin/config", icon: "⚙️", label: "Configuration", desc: "Paramètres de la boutique" },
  { href: "/admin/catalogue", icon: "🧁", label: "Catalogue", desc: "Produits et prix" },
  { href: "/admin/login", icon: "⏻", label: "Déconnexion", desc: "Quitter l'espace admin", danger: true },
];

export default function PlusPage() {
  return (
    <div style={{ padding: "24px", color: INK }}>
      <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "32px", fontWeight: 500, margin: "0 0 8px", color: INK }}>
        Plus
      </h1>
      <p style={{ fontSize: "13px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)", margin: "0 0 24px" }}>
        Accès rapide aux outils
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {TILES.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            style={{ textDecoration: "none", display: "block" }}
          >
            <div
              className="a-card"
              style={{
                padding: "20px 16px",
                border: tile.danger ? "1.5px solid rgba(196,90,90,0.2)" : undefined,
                background: tile.danger ? "rgba(196,90,90,0.06)" : undefined,
                transition: "box-shadow 0.15s, transform 0.15s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(106,40,40,0.14)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 14px rgba(74,31,36,0.07), 0 1px 3px rgba(74,31,36,0.04)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>{tile.icon}</div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: tile.danger ? "#c45a5a" : INK,
                  fontFamily: "var(--font-manrope)",
                  marginBottom: "4px",
                }}
              >
                {tile.label}
              </div>
              <div style={{ fontSize: "12px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)", lineHeight: 1.4 }}>
                {tile.desc}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
