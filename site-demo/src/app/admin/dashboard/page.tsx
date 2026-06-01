"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SERIES_7D, COMMANDES, DEVIS, STATUTS_CMD, STATUTS_DEV } from "@/data/mock";

const PERIODS = ["7j", "30j", "3m", "1an"] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

type CommandeType = (typeof COMMANDES)[number];
type DevisType = (typeof DEVIS)[number];

const INK = "#4a1f24";
const ACCENT = "#6a2828";
const BG = "#ece1de";
const SHEET_BG = "#f2e7e4";

function CommandeSheet({ cmd, onClose }: { cmd: CommandeType; onClose: () => void }) {
  const st = STATUTS_CMD[cmd.status] || { label: cmd.status, color: "#888" };
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
        style={{ width: "100%", maxWidth: "600px", borderRadius: "24px 24px 0 0", padding: "24px 24px 40px", maxHeight: "80vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "rgba(74,31,36,0.2)", margin: "0 auto 20px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)", marginBottom: "2px" }}>{cmd.id}</div>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "28px", fontWeight: 500, margin: "0 0 2px", color: INK }}>{cmd.client}</h2>
            <div style={{ fontSize: "13px", color: "var(--a-ink-2)", fontFamily: "var(--font-manrope)" }}>{cmd.email}</div>
          </div>
          <span className="badge" style={{ background: st.color + "20", color: st.color }}>
            <span className="badge-dot" style={{ background: st.color }} />
            {st.label}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "Date commande", value: cmd.date },
            { label: "Retrait", value: cmd.retrait },
            { label: "Total", value: `${cmd.total.toFixed(2)} €` },
          ].map((r) => (
            <div key={r.label} className="neu-out-sm" style={{ padding: "12px" }}>
              <label className="fld-lbl" style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)", display: "block", marginBottom: "4px" }}>{r.label}</label>
              <div style={{ fontSize: "14px", fontWeight: 600, color: INK, fontFamily: "var(--font-manrope)" }}>{r.value}</div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)", margin: "0 0 8px", fontWeight: 700 }}>Articles</h3>
        {cmd.items.map((it, i) => (
          <div key={i} className="a-tr">
            <span style={{ flex: 1, fontSize: "13px", fontFamily: "var(--font-manrope)", color: INK }}>{it.name} × {it.qty}</span>
            <span style={{ fontSize: "13px", fontFamily: "var(--font-manrope)", color: ACCENT, fontWeight: 600 }}>{(it.price * it.qty).toFixed(2)} €</span>
          </div>
        ))}

        {cmd.note && (
          <div style={{ marginTop: "16px", background: "rgba(255,250,248,0.7)", borderRadius: "12px", padding: "12px", border: "1px solid rgba(74,31,36,0.12)" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)", marginBottom: "4px" }}>Note client</div>
            <p style={{ fontSize: "13px", color: "var(--a-ink-2)", fontFamily: "var(--font-manrope)", margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>&ldquo;{cmd.note}&rdquo;</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

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
        style={{ width: "100%", maxWidth: "600px", borderRadius: "24px 24px 0 0", padding: "24px 24px 40px", maxHeight: "80vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "rgba(74,31,36,0.2)", margin: "0 auto 20px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)", marginBottom: "2px", textTransform: "capitalize" }}>{dev.id} · {dev.event}</div>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "28px", fontWeight: 500, margin: "0 0 2px", color: INK }}>{dev.client}</h2>
            <div style={{ fontSize: "12px", color: "var(--a-ink-2)", fontFamily: "var(--font-manrope)" }}>{dev.email} · {dev.tel}</div>
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
            { label: "Solde", value: `${solde} €` },
          ].map((r) => (
            <div key={r.label} className="neu-out-sm" style={{ padding: "12px" }}>
              <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)", display: "block", marginBottom: "4px" }}>{r.label}</label>
              <div style={{ fontSize: "14px", fontWeight: 600, color: INK, fontFamily: "var(--font-manrope)" }}>{r.value}</div>
            </div>
          ))}
        </div>

        {dev.noteClient && (
          <div style={{ marginBottom: "10px", background: "rgba(255,250,248,0.7)", borderRadius: "12px", padding: "12px", border: "1px solid rgba(74,31,36,0.12)" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)", marginBottom: "4px" }}>Note client</div>
            <p style={{ fontSize: "13px", color: "var(--a-ink-2)", fontFamily: "var(--font-manrope)", margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>&ldquo;{dev.noteClient}&rdquo;</p>
          </div>
        )}
        {dev.noteAdmin && (
          <div style={{ background: "rgba(106,40,40,0.08)", borderRadius: "12px", padding: "12px", border: "1px solid rgba(106,40,40,0.18)" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: ACCENT, fontFamily: "var(--font-manrope)", marginBottom: "4px" }}>Note interne</div>
            <p style={{ fontSize: "13px", color: INK, fontFamily: "var(--font-manrope)", margin: 0, lineHeight: 1.6 }}>{dev.noteAdmin}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("7j");
  const [activeTab, setActiveTab] = useState<"commandes" | "devis">("commandes");
  const [selectedCmd, setSelectedCmd] = useState<CommandeType | null>(null);
  const [selectedDev, setSelectedDev] = useState<DevisType | null>(null);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={{ padding: "24px", color: INK, maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <p style={{ fontSize: "12px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)", margin: "0 0 2px", textTransform: "capitalize" }}>{today}</p>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "30px", fontWeight: 500, margin: 0, color: INK }}>
            Bonjour Hélène 👋
          </h1>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            className="neu-out-sm"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: BG,
            }}
          >
            🔔
          </button>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6a2828, #8a2a3e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f5ede8",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "var(--font-manrope)",
            }}
          >
            HS
          </div>
        </div>
      </div>

      {/* Period tabs */}
      <div
        className="neu-in-sm"
        style={{
          display: "flex",
          gap: "4px",
          padding: "5px",
          marginBottom: "20px",
          width: "fit-content",
        }}
      >
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`period-tab${period === p ? " active" : ""}`}
            style={{ minWidth: "50px" }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Hero KPI card (dark bordeaux) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="a-card-dark"
        style={{ padding: "20px 20px 8px", marginBottom: "16px", overflow: "hidden" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(245,237,232,0.5)", fontFamily: "var(--font-manrope)", marginBottom: "6px" }}>
              Chiffre d&apos;affaires
            </div>
            <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "42px", fontWeight: 500, color: "#f5ede8", lineHeight: 1 }}>
              1 284 €
            </div>
          </div>
          <span
            className="badge"
            style={{
              background: "rgba(94,201,154,0.2)",
              color: "#5ec99a",
              marginTop: "4px",
            }}
          >
            ↑ 12%
          </span>
        </div>

        <ResponsiveContainer width="100%" height={110}>
          <AreaChart data={SERIES_7D} margin={{ top: 5, right: 5, bottom: 0, left: -30 }}>
            <defs>
              <linearGradient id="gradCA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5ec99a" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#5ec99a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 5" stroke="rgba(245,237,232,0.07)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: "rgba(245,237,232,0.45)", fontSize: 9, fontFamily: "var(--font-manrope)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: "#221013",
                border: "1px solid rgba(192,96,96,0.2)",
                borderRadius: 8,
                color: "#f5ede8",
                fontSize: 12,
                fontFamily: "var(--font-manrope)",
              }}
              cursor={{ stroke: "rgba(192,96,96,0.2)" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#5ec99a"
              strokeWidth={2}
              fill="url(#gradCA)"
              dot={false}
              activeDot={{ r: 4, fill: "#5ec99a" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}
      >
        {[
          { label: "Commandes", value: "8", trend: "↑ 1,7%", trendColor: "#6a9a6a", accent: ACCENT },
          { label: "Devis", value: "5", trend: "stable", trendColor: "#c9954f", accent: "#c9954f" },
          { label: "Ruptures", value: "1", trend: "↓ 0,9%", trendColor: "#c45a5a", accent: "#c45a5a" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemAnim}
            whileHover={{ boxShadow: "0 0 24px rgba(106,40,40,0.18)" }}
            className="a-card"
            style={{
              padding: "14px",
              borderLeft: `3px solid ${stat.accent}`,
              cursor: "default",
            }}
          >
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)", marginBottom: "6px" }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "28px", fontWeight: 500, color: INK }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "11px", color: stat.trendColor, fontFamily: "var(--font-manrope)", fontWeight: 600, marginTop: "2px" }}>
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabbed table */}
      <div className="a-card" style={{ overflow: "hidden", padding: 0 }}>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(196,201,212,0.22)", position: "relative", padding: "0 4px" }}>
          {(["commandes", "devis"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "14px 20px",
                fontSize: "13px",
                fontFamily: "var(--font-manrope)",
                fontWeight: activeTab === tab ? 700 : 400,
                color: activeTab === tab ? ACCENT : "var(--a-ink-3)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                position: "relative",
                textTransform: "capitalize",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: ACCENT,
                    borderRadius: "2px 2px 0 0",
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Table header */}
        <div className="a-th" style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "12px" }}>
          {["Client", "Montant", "Statut"].map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        <AnimatePresence mode="wait">
          {activeTab === "commandes" ? (
            <motion.div key="commandes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {COMMANDES.slice(0, 5).map((cmd) => {
                const st = STATUTS_CMD[cmd.status] || { label: cmd.status, color: "#888" };
                return (
                  <div
                    key={cmd.id}
                    onClick={() => setSelectedCmd(cmd)}
                    className="a-tr"
                    style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "12px" }}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: INK, fontFamily: "var(--font-manrope)" }}>{cmd.client}</div>
                      <div style={{ fontSize: "11px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)" }}>{cmd.retrait}</div>
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: ACCENT, fontFamily: "var(--font-manrope)", textAlign: "right", alignSelf: "center" }}>
                      {cmd.total.toFixed(2)} €
                    </div>
                    <span className="badge" style={{ background: st.color + "18", color: st.color, alignSelf: "center" }}>
                      <span className="badge-dot" style={{ background: st.color }} />
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div key="devis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {DEVIS.map((dev) => {
                const st = STATUTS_DEV[dev.status] || { label: dev.status, color: "#888" };
                return (
                  <div
                    key={dev.id}
                    onClick={() => setSelectedDev(dev)}
                    className="a-tr"
                    style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "12px" }}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: INK, fontFamily: "var(--font-manrope)" }}>{dev.client}</div>
                      <div style={{ fontSize: "11px", color: "var(--a-ink-3)", fontFamily: "var(--font-manrope)", textTransform: "capitalize" }}>{dev.event} · {dev.dateEvent}</div>
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: ACCENT, fontFamily: "var(--font-manrope)", textAlign: "right", alignSelf: "center" }}>
                      {dev.prixTotal} €
                    </div>
                    <span className="badge" style={{ background: st.color + "18", color: st.color, alignSelf: "center" }}>
                      <span className="badge-dot" style={{ background: st.color }} />
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedCmd && <CommandeSheet cmd={selectedCmd} onClose={() => setSelectedCmd(null)} />}
        {selectedDev && <DevisSheet dev={selectedDev} onClose={() => setSelectedDev(null)} />}
      </AnimatePresence>
    </div>
  );
}
