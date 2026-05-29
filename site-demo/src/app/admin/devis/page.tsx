"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DEVIS, STATUTS_DEV } from "@/data/mock";

type DevisType = (typeof DEVIS)[number];

const FILTRES = ["Tous", "en_attente", "valide", "acompte_paye", "pret", "annule"] as const;

const INK = "#4a1f24";
const ACCENT = "#6a2828";

function DevisSheet({ dev, onClose }: { dev: DevisType; onClose: () => void }) {
  const st = STATUTS_DEV[dev.status] || { label: dev.status, color: "#888" };
  const solde = dev.prixTotal - dev.deja;
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(34,16,19,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="a-card"
        style={{ width: "100%", maxWidth: "640px", borderRadius: "24px 24px 0 0", padding: "24px 24px 40px", maxHeight: "85vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "rgba(74,31,36,0.2)", margin: "0 auto 20px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)", marginBottom: "2px", textTransform: "capitalize" }}>
              {dev.id} · {dev.event}
            </div>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "28px", fontWeight: 500, margin: "0 0 2px", color: INK }}>{dev.client}</h2>
            <div style={{ fontSize: "12px", color: "var(--a-ink-2)", fontFamily: "var(--font-manrope)" }}>
              {dev.email} · {dev.tel}
            </div>
          </div>
          <span className="badge" style={{ background: st.color + "20", color: st.color }}>
            <span className="badge-dot" style={{ background: st.color }} />
            {st.label}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "Total", value: `${dev.prixTotal} €` },
            { label: "Acompte", value: `${dev.acompte} €` },
            { label: "Encaissé", value: `${dev.deja} €` },
            { label: "Solde", value: `${solde} €` },
            { label: "Date évé.", value: dev.dateEvent },
            { label: "Retrait", value: dev.retrait },
          ].map((r) => (
            <div key={r.label} className="neu-out-sm" style={{ padding: "12px 14px" }}>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)", marginBottom: "4px" }}>{r.label}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: INK, fontFamily: "var(--font-manrope)" }}>{r.value}</div>
            </div>
          ))}
        </div>

        <h3 className="eyebrow" style={{ margin: "0 0 8px", color: "var(--a-ink-3)" }}>Articles</h3>
        <div className="a-card" style={{ overflow: "hidden", padding: 0, marginBottom: "14px" }}>
          {dev.items.map((it, i) => (
            <div key={i} className="a-tr">
              <span style={{ flex: 1, fontSize: "13px", fontFamily: "var(--font-manrope)", color: INK }}>{it.name} × {it.qty}</span>
              <span style={{ fontSize: "13px", fontFamily: "var(--font-manrope)", color: ACCENT, fontWeight: 600 }}>{(it.price * it.qty).toFixed(2)} €</span>
            </div>
          ))}
        </div>

        {dev.noteClient && (
          <div style={{ marginBottom: "10px", background: "rgba(255,250,248,0.7)", borderRadius: "12px", padding: "12px 14px", border: "1px solid rgba(74,31,36,0.12)" }}>
            <div className="eyebrow" style={{ marginBottom: "4px", color: "var(--a-ink-3)" }}>Note client</div>
            <p style={{ fontSize: "13px", color: "var(--a-ink-2)", fontFamily: "var(--font-manrope)", margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>&ldquo;{dev.noteClient}&rdquo;</p>
          </div>
        )}
        {dev.noteAdmin && (
          <div style={{ background: "rgba(106,40,40,0.08)", borderRadius: "12px", padding: "12px 14px", border: "1px solid rgba(106,40,40,0.18)" }}>
            <div className="eyebrow" style={{ marginBottom: "4px", color: ACCENT }}>Note interne</div>
            <p style={{ fontSize: "13px", color: INK, fontFamily: "var(--font-manrope)", margin: 0, lineHeight: 1.6 }}>{dev.noteAdmin}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function DevisPage() {
  const [filtre, setFiltre] = useState<string>("Tous");
  const [selected, setSelected] = useState<DevisType | null>(null);

  const filtered = filtre === "Tous"
    ? DEVIS
    : DEVIS.filter((d) => d.status === filtre);

  return (
    <div style={{ padding: "24px", color: INK }}>
      <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "32px", fontWeight: 500, margin: "0 0 20px", color: INK }}>
        Devis
      </h1>

      {/* Filtres */}
      <div
        className="neu-in-sm"
        style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "20px", padding: "5px", width: "fit-content" }}
      >
        {FILTRES.map((f) => {
          const st = STATUTS_DEV[f];
          const isActive = filtre === f;
          return (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`period-tab${isActive ? " active" : ""}`}
              style={{ minWidth: "70px", paddingLeft: "12px", paddingRight: "12px" }}
            >
              {st ? st.label : "Tous"}
              <span style={{ marginLeft: "5px", fontSize: "10px", opacity: 0.65 }}>
                {f === "Tous" ? DEVIS.length : DEVIS.filter((d) => d.status === f).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map((dev) => {
          const st = STATUTS_DEV[dev.status] || { label: dev.status, color: "#888" };
          return (
            <div
              key={dev.id}
              onClick={() => setSelected(dev)}
              className="a-card"
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
                transition: "box-shadow 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(106,40,40,0.14)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 14px rgba(74,31,36,0.07), 0 1px 3px rgba(74,31,36,0.04)")}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: INK, fontFamily: "var(--font-manrope)" }}>{dev.client}</span>
                  <span style={{ fontSize: "11px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)" }}>· {dev.id}</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)", textTransform: "capitalize" }}>
                  {dev.event} · {dev.dateEvent}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: ACCENT, fontFamily: "var(--font-cormorant)", marginBottom: "4px" }}>
                  {dev.prixTotal} €
                </div>
                <span className="badge" style={{ background: st.color + "18", color: st.color }}>
                  <span className="badge-dot" style={{ background: st.color }} />
                  {st.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && <DevisSheet dev={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
