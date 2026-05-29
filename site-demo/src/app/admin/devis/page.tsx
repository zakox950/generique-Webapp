"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DEVIS, STATUTS_DEV } from "@/data/mock";

type DevisType = (typeof DEVIS)[number];

const FILTRES = ["Tous", "en_attente", "valide", "acompte_paye", "pret", "annule"] as const;

function DevisSheet({ dev, onClose }: { dev: DevisType; onClose: () => void }) {
  const st = STATUTS_DEV[dev.status] || { label: dev.status, color: "#888" };
  const solde = dev.prixTotal - dev.deja;
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        style={{ width: "100%", maxWidth: "640px", background: "#f0f7f2", borderRadius: "24px 24px 0 0", padding: "24px 24px 40px", maxHeight: "85vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "#ccc", margin: "0 auto 20px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "#888", fontFamily: "var(--font-manrope)", marginBottom: "2px", textTransform: "capitalize" }}>
              {dev.id} · {dev.event}
            </div>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "26px", fontWeight: 500, margin: "0 0 2px", color: "#122b18" }}>{dev.client}</h2>
            <div style={{ fontSize: "12px", color: "#666", fontFamily: "var(--font-manrope)" }}>
              {dev.email} · {dev.tel}
            </div>
          </div>
          <span style={{ background: st.color + "20", color: st.color, borderRadius: "999px", padding: "5px 14px", fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-manrope)" }}>
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
            <div key={r.label} style={{ background: "#fff", borderRadius: "12px", padding: "12px 14px" }}>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#888", fontFamily: "var(--font-manrope)", marginBottom: "4px" }}>{r.label}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#122b18", fontFamily: "var(--font-manrope)" }}>{r.value}</div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#888", fontFamily: "var(--font-manrope)", margin: "0 0 8px" }}>Articles</h3>
        <div style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", marginBottom: "14px" }}>
          {dev.items.map((it, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderBottom: i < dev.items.length - 1 ? "1px solid rgba(18,43,24,0.06)" : "none",
              }}
            >
              <span style={{ fontSize: "13px", fontFamily: "var(--font-manrope)", color: "#122b18" }}>{it.name} × {it.qty}</span>
              <span style={{ fontSize: "13px", fontFamily: "var(--font-manrope)", color: "#1a6b3c", fontWeight: 600 }}>{(it.price * it.qty).toFixed(2)} €</span>
            </div>
          ))}
        </div>

        {dev.noteClient && (
          <div style={{ marginBottom: "10px", background: "#fffde8", borderRadius: "12px", padding: "12px 14px", border: "1px solid #f0e0a0" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#999", fontFamily: "var(--font-manrope)", marginBottom: "4px" }}>Note client</div>
            <p style={{ fontSize: "13px", color: "#555", fontFamily: "var(--font-manrope)", margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>&ldquo;{dev.noteClient}&rdquo;</p>
          </div>
        )}
        {dev.noteAdmin && (
          <div style={{ background: "#e8f5ec", borderRadius: "12px", padding: "12px 14px", border: "1px solid rgba(26,107,60,0.2)" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#1a6b3c", fontFamily: "var(--font-manrope)", marginBottom: "4px" }}>Note interne</div>
            <p style={{ fontSize: "13px", color: "#122b18", fontFamily: "var(--font-manrope)", margin: 0, lineHeight: 1.6 }}>{dev.noteAdmin}</p>
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
    <div style={{ padding: "24px", color: "#122b18" }}>
      <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "32px", fontWeight: 500, margin: "0 0 20px" }}>
        Devis
      </h1>

      {/* Filtres */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        {FILTRES.map((f) => {
          const st = STATUTS_DEV[f];
          const isActive = filtre === f;
          return (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              style={{
                borderRadius: "999px",
                padding: "6px 14px",
                fontSize: "12px",
                fontFamily: "var(--font-manrope)",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: isActive ? (st ? st.color : "#1a6b3c") : "rgba(18,43,24,0.08)",
                color: isActive ? "#fff" : "#122b18",
                transition: "all 0.15s",
              }}
            >
              {st ? st.label : "Tous"}
              <span style={{ marginLeft: "6px", opacity: 0.7 }}>
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
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "14px 16px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(18,43,24,0.07)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
                transition: "box-shadow 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,107,60,0.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(18,43,24,0.07)")}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#122b18", fontFamily: "var(--font-manrope)" }}>{dev.client}</span>
                  <span style={{ fontSize: "11px", color: "#aaa", fontFamily: "var(--font-manrope)" }}>· {dev.id}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#888", fontFamily: "var(--font-manrope)", textTransform: "capitalize" }}>
                  {dev.event} · {dev.dateEvent}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a6b3c", fontFamily: "var(--font-cormorant)", marginBottom: "4px" }}>
                  {dev.prixTotal} €
                </div>
                <span
                  style={{
                    background: st.color + "18",
                    color: st.color,
                    borderRadius: "999px",
                    padding: "2px 9px",
                    fontSize: "11px",
                    fontWeight: 700,
                    fontFamily: "var(--font-manrope)",
                  }}
                >
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
