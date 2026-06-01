import Link from "next/link";

export default function ContactPage() {
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
        Contact
      </h1>
      <p style={{ fontSize: "13px", color: "rgba(56,22,27,0.6)", margin: "0 0 24px", fontFamily: "var(--font-manrope)" }}>
        Atelier Hélène · Paris 5e
      </p>

      {/* Map placeholder */}
      <div
        style={{
          width: "100%",
          height: "180px",
          borderRadius: "20px",
          overflow: "hidden",
          marginBottom: "20px",
          background: "linear-gradient(135deg, #f0e2db, #ead9d0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(56,22,27,0.1)",
        }}
      >
        <div style={{ textAlign: "center", color: "rgba(56,22,27,0.5)" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>🗺️</div>
          <div style={{ fontSize: "13px", fontFamily: "var(--font-manrope)", fontWeight: 600 }}>
            12 rue Monge, Paris 5e
          </div>
          <div style={{ fontSize: "11px", fontFamily: "var(--font-manrope)", marginTop: "2px" }}>
            Métro Place Monge (ligne 7)
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        {[
          {
            icon: "📍",
            title: "Adresse",
            lines: ["12 rue Monge", "75005 Paris", "Métro Place Monge · Ligne 7"],
          },
          {
            icon: "🕐",
            title: "Horaires",
            lines: [
              "Mardi — Vendredi : 8h30–19h30",
              "Samedi — Dimanche : 8h00–20h00",
              "Lundi : Fermé",
            ],
          },
          {
            icon: "📞",
            title: "Téléphone",
            lines: ["01 43 29 88 12"],
          },
          {
            icon: "📧",
            title: "Email",
            lines: ["contact@atelier-helene.fr"],
          },
        ].map((card) => (
          <div
            key={card.title}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "16px",
              boxShadow: "0 2px 8px rgba(56,22,27,0.07)",
              display: "flex",
              gap: "14px",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "22px", flexShrink: 0, marginTop: "2px" }}>{card.icon}</span>
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#911f23",
                  fontFamily: "var(--font-manrope)",
                  marginBottom: "4px",
                }}
              >
                {card.title}
              </div>
              {card.lines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "13px",
                    color: "rgba(56,22,27,0.75)",
                    fontFamily: "var(--font-manrope)",
                    lineHeight: 1.6,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/client/devis"
        style={{
          display: "block",
          background: "#911f23",
          color: "#fff",
          borderRadius: "999px",
          padding: "14px",
          fontSize: "15px",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-manrope)",
          textAlign: "center",
          textDecoration: "none",
        }}
      >
        Demander un devis
      </Link>

      <p
        style={{
          fontSize: "12px",
          color: "rgba(56,22,27,0.4)",
          textAlign: "center",
          marginTop: "16px",
          fontFamily: "var(--font-manrope)",
          lineHeight: 1.6,
        }}
      >
        Pour toute commande de mariage ou événement,<br />
        un rendez-vous de dégustation peut être organisé sur place.
      </p>
    </div>
  );
}
