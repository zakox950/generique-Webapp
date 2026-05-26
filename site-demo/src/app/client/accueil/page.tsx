import Link from "next/link";
import { PRODUCTS } from "@/data/mock";

const featured = PRODUCTS.filter((p) => p.active).slice(0, 4);

export default function AccueilPage() {
  return (
    <div style={{ color: "#38161b" }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          height: "480px",
          overflow: "hidden",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&q=80"
          alt="Pâtisserie"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(56,22,27,0.2) 0%, rgba(56,22,27,0.75) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "32px 24px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "12px",
              fontFamily: "var(--font-manrope)",
            }}
          >
            Atelier Hélène · Paris 5e
          </div>
          <h1
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "52px",
              fontWeight: 400,
              color: "#fff",
              lineHeight: 1.05,
              margin: "0 0 24px",
            }}
          >
            La pâtisserie<br />
            <em>comme un geste.</em>
          </h1>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/client/catalogue"
              style={{
                background: "#911f23",
                color: "#fff",
                borderRadius: "999px",
                padding: "12px 24px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "var(--font-manrope)",
                letterSpacing: "0.5px",
              }}
            >
              Explorer le shop
            </Link>
            <Link
              href="/client/devis"
              style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                borderRadius: "999px",
                padding: "12px 24px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "var(--font-manrope)",
                border: "1px solid rgba(255,255,255,0.35)",
              }}
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      {/* Réassurance */}
      <section style={{ padding: "28px 16px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          {[
            { emoji: "🧁", title: "Fait maison", desc: "Chaque pièce travaillée à la main dans notre atelier" },
            { emoji: "🏪", title: "Retrait boutique", desc: "Commandez en ligne, récupérez rue Monge" },
            { emoji: "✨", title: "Sur mesure", desc: "Mariage, anniversaire, entreprise — devis gratuit" },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: "rgba(145,31,35,0.07)",
                borderRadius: "16px",
                padding: "14px 10px",
                textAlign: "center",
                border: "1px solid rgba(145,31,35,0.12)",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>{item.emoji}</div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#38161b",
                  fontFamily: "var(--font-manrope)",
                  marginBottom: "4px",
                }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: "10px", color: "rgba(56,22,27,0.6)", lineHeight: 1.4, fontFamily: "var(--font-manrope)" }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vedettes */}
      <section style={{ padding: "24px 16px 8px" }}>
        <h2
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "28px",
            fontWeight: 400,
            marginBottom: "16px",
            color: "#38161b",
          }}
        >
          Nos vedettes du moment
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {featured.map((p) => (
            <Link
              key={p.id}
              href="/client/catalogue"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(56,22,27,0.08)",
                }}
              >
                <img
                  src={p.photo}
                  alt={p.name}
                  style={{ width: "100%", height: "110px", objectFit: "cover" }}
                />
                <div style={{ padding: "10px 12px" }}>
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
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#38161b",
                      fontFamily: "var(--font-manrope)",
                    }}
                  >
                    {p.name}
                  </div>
                  <div style={{ fontSize: "13px", color: "#911f23", fontWeight: 700, fontFamily: "var(--font-manrope)" }}>
                    {p.price.toFixed(2)} €
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Événements */}
      <section style={{ padding: "20px 16px 8px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #1a6b3c, #2d9b5c)",
            borderRadius: "20px",
            padding: "20px",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.8, marginBottom: "6px", fontFamily: "var(--font-manrope)" }}>
            Commandes événementielles
          </div>
          <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "26px", fontWeight: 400, margin: "0 0 8px" }}>
            Un événement à célébrer ?
          </h3>
          <p style={{ fontSize: "13px", opacity: 0.85, margin: "0 0 16px", lineHeight: 1.6, fontFamily: "var(--font-manrope)" }}>
            Mariage, baptême, anniversaire… Nous créons la pièce qui couronnera votre moment.
          </p>
          <Link
            href="/client/devis"
            style={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              borderRadius: "999px",
              padding: "10px 20px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.35)",
              display: "inline-block",
              fontFamily: "var(--font-manrope)",
            }}
          >
            Demander un devis →
          </Link>
        </div>
      </section>

      {/* Contact rapide */}
      <section style={{ padding: "20px 16px 8px" }}>
        <div
          style={{
            background: "rgba(56,22,27,0.05)",
            borderRadius: "16px",
            padding: "18px",
            border: "1px solid rgba(56,22,27,0.1)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "22px",
              fontWeight: 400,
              margin: "0 0 10px",
              color: "#38161b",
            }}
          >
            Nous rendre visite
          </h3>
          <div style={{ fontSize: "13px", color: "rgba(56,22,27,0.75)", lineHeight: 1.7, fontFamily: "var(--font-manrope)" }}>
            <p style={{ margin: "0 0 4px" }}>📍 12 rue Monge, 75005 Paris</p>
            <p style={{ margin: "0 0 4px" }}>📞 01 43 29 88 12</p>
            <p style={{ margin: "0 0 4px" }}>🕐 Mar–Ven 8h30–19h30 · Sam–Dim 8h–20h</p>
            <p style={{ margin: 0 }}>🔴 Fermé le lundi</p>
          </div>
        </div>
      </section>
    </div>
  );
}
