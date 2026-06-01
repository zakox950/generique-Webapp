import Link from "next/link";
import { PRODUCTS } from "@/data/mock";

const featured = PRODUCTS.filter((p) => p.active).slice(0, 4);

export default function AccueilPage() {
  return (
    <div style={{ color: "var(--c-ink)" }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          height: "480px",
          overflow: "hidden",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1200&q=80"
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
              "linear-gradient(180deg, rgba(56,22,27,0.15) 0%, rgba(56,22,27,0.78) 100%)",
          }}
        />
        {/* Logo area */}
        <div style={{ position: "absolute", top: "18px", left: "20px", right: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "20px", fontWeight: 500, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.01em" }}>
            Spyfie
          </div>
          <span style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-manrope)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: "999px" }}>
            Atelier
          </span>
        </div>
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
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.65)", marginBottom: "10px" }}>
            Paris 5e · Pâtisserie de saison
          </p>
          <h1
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "50px",
              fontWeight: 400,
              color: "#fff",
              lineHeight: 1.05,
              margin: "0 0 24px",
              letterSpacing: "-0.01em",
            }}
          >
            La pâtisserie<br />
            <em>comme un geste.</em>
          </h1>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              href="/client/catalogue"
              style={{
                background: "var(--c-signature)",
                color: "#fff",
                borderRadius: "999px",
                padding: "12px 22px",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: "var(--font-manrope)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Explorer le shop
            </Link>
            <Link
              href="/client/devis"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(14px)",
                color: "#fff",
                borderRadius: "999px",
                padding: "12px 22px",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 500,
                fontFamily: "var(--font-manrope)",
                border: "1px solid rgba(255,255,255,0.3)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Devis
            </Link>
          </div>
        </div>
      </section>

      {/* Réassurance */}
      <section style={{ padding: "24px 16px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          {[
            { emoji: "🧁", title: "Fait maison", desc: "Chaque pièce travaillée à la main" },
            { emoji: "🏪", title: "Retrait boutique", desc: "Commandez en ligne, récupérez rue Monge" },
            { emoji: "✨", title: "Sur mesure", desc: "Mariage, anniversaire — devis gratuit" },
          ].map((item) => (
            <div
              key={item.title}
              className="glass"
              style={{
                padding: "14px 10px",
                textAlign: "center",
                borderRadius: "18px",
              }}
            >
              <div style={{ fontSize: "22px", marginBottom: "6px" }}>{item.emoji}</div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--c-ink)",
                  fontFamily: "var(--font-manrope)",
                  marginBottom: "4px",
                }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: "10px", color: "var(--c-ink-3)", lineHeight: 1.4, fontFamily: "var(--font-manrope)" }}>
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
            marginBottom: "4px",
            color: "var(--c-ink)",
            letterSpacing: "-0.01em",
          }}
        >
          Nos vedettes du moment
        </h2>
        <p className="eyebrow" style={{ margin: "0 0 16px" }}>Sélection de la semaine</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {featured.map((p) => (
            <Link
              key={p.id}
              href="/client/catalogue"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  background: "rgba(255,250,248,0.92)",
                  border: "1px solid rgba(255,255,255,0.82)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 2px 14px rgba(56,22,27,0.08)",
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
                      className="badge"
                      style={{
                        background: "var(--c-signature-soft)",
                        color: "var(--c-signature)",
                        marginBottom: "6px",
                      }}
                    >
                      {p.badge}
                    </span>
                  )}
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--c-ink)",
                      fontFamily: "var(--font-manrope)",
                    }}
                  >
                    {p.name}
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--c-signature)", fontWeight: 700, fontFamily: "var(--font-cormorant)", marginTop: "2px" }}>
                    {p.price.toFixed(2)} €
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Événements — bordeaux éditorial */}
      <section style={{ padding: "20px 16px 8px" }}>
        <div
          style={{
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            minHeight: "160px",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1600&q=80"
            alt="Événement"
            style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(34,16,19,0.88) 0%, rgba(106,40,40,0.82) 100%)",
            }}
          />
          <div style={{ position: "relative", padding: "24px 20px" }}>
            <p className="eyebrow" style={{ color: "rgba(245,220,210,0.7)", marginBottom: "6px" }}>
              Commandes événementielles
            </p>
            <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "26px", fontWeight: 400, margin: "0 0 8px", color: "#f5ede8" }}>
              Un événement à célébrer ?
            </h3>
            <p style={{ fontSize: "13px", color: "rgba(245,237,232,0.8)", margin: "0 0 16px", lineHeight: 1.6, fontFamily: "var(--font-manrope)" }}>
              Mariage, baptême, anniversaire… Nous créons la pièce qui couronnera votre moment.
            </p>
            <Link
              href="/client/devis"
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.14)",
                backdropFilter: "blur(12px)",
                color: "#f5ede8",
                borderRadius: "999px",
                padding: "10px 20px",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.28)",
                fontFamily: "var(--font-manrope)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Demander un devis →
            </Link>
          </div>
        </div>
      </section>

      {/* Contact rapide */}
      <section style={{ padding: "20px 16px 32px" }}>
        <div
          className="glass"
          style={{ padding: "20px", borderRadius: "18px" }}
        >
          <h3
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "22px",
              fontWeight: 400,
              margin: "0 0 12px",
              color: "var(--c-ink)",
              letterSpacing: "-0.01em",
            }}
          >
            Nous rendre visite
          </h3>
          <div style={{ fontSize: "13px", color: "var(--c-ink-2)", lineHeight: 1.8, fontFamily: "var(--font-manrope)" }}>
            <p style={{ margin: "0 0 2px" }}>📍 27 rue des Carmes, 75005 Paris</p>
            <p style={{ margin: "0 0 2px" }}>📞 +33 1 42 16 09 84</p>
            <p style={{ margin: "0 0 2px" }}>🕐 Mar–Ven 8h–19h30 · Sam–Dim 9h–20h</p>
            <p style={{ margin: 0, color: "var(--c-signature)" }}>● Fermé le lundi</p>
          </div>
        </div>
      </section>
    </div>
  );
}
