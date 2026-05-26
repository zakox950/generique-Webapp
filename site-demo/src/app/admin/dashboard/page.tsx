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

function CommandeSheet({ cmd, onClose }: { cmd: CommandeType; onClose: () => void }) {
  const st = STATUTS_CMD[cmd.status] || { label: cmd.status, color: "#888" };
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
        style={{ width: "100%", maxWidth: "600px", background: "#f0f7f2", borderRadius: "24px 24px 0 0", padding: "24px 24px 40px", maxHeight: "80vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#666", fontFamily: "var(--font-manrope)", marginBottom: "2px" }}>{cmd.id}</div>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "26px", fontWeight: 500, margin: 0, color: "#122b18" }}>{cmd.client}</h2>
            <div style={{ fontSize: "12px", color: "#666", fontFamily: "var(--font-manrope)", marginTop: "2px" }}>{cmd.email}</div>
          </div>
          <span style={{ background: st.color + "22", color: st.color, borderRadius: "999px", padding: "4px 12px", fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-manrope)" }}>
            {st.label}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "Date commande", value: cmd.date },
            { label: "Retrait", value: cmd.retrait },
            { label: "Total", value: `${cmd.total.toFixed(2)} €` },
          ].map((r) => (
            <div key={r.label} style={{ background: "#fff", borderRadius: "12px", padding: "12px" }}>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#666", fontFamily: "var(--font-manrope)", marginBottom: "4px" }}>{r.label}</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#122b18", fontFamily: "var(--font-manrope)" }}>{r.value}</div>
            </div>
          ))}
        </div>

        <h3 style={{ fontFamily: "var(--font-manrope)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "#666", margin: "0 0 8px" }}>Articles</h3>
        {cmd.items.map((it, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
            <span style={{ fontSize: "13px", fontFamily: "var(--font-manrope)", color: "#122b18" }}>{it.name} × {it.qty}</span>
            <span style={{ fontSize: "13px", fontFamily: "var(--font-manrope)", color: "#1a6b3c", fontWeight: 600 }}>{(it.price * it.qty).toFixed(2)} €</span>
          </div>
        ))}

        {cmd.note && (
          <div style={{ marginTop: "16px", background: "#fffde8", borderRadius: "12px", padding: "12px", border: "1px solid #f0e0a0" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#888", fontFamily: "var(--font-manrope)", marginBottom: "4px" }}>Note client</div>
            <p style={{ fontSize: "13px", color: "#555", fontFamily: "var(--font-manrope)", margin: 0, lineHeight: 1.6 }}>{cmd.note}</p>
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
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        style={{ width: "100%", maxWidth: "600px", background: "#f0f7f2", borderRadius: "24px 24px 0 0", padding: "24px 24px 40px", maxHeight: "80vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#666", fontFamily: "var(--font-manrope)", marginBottom: "2px" }}>{dev.id} · {dev.event}</div>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "26px", fontWeight: 500, margin: 0, color: "#122b18" }}>{dev.client}</h2>
            <div style={{ fontSize: "12px", color: "#666", fontFamily: "var(--font-manrope)", marginTop: "2px" }}>{dev.email} · {dev.tel}</div>
          </div>
          <span style={{ background: st.color + "22", color: st.color, borderRadius: "999px", padding: "4px 12px", fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-manrope)" }}>
            {st.label}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "Total", value: `${dev.prixTotal} €` },
            { label: "Acompte", value: `${dev.acompte} €` },
            { label: "Solde", value: `${solde} €` },
          ].map((r) => (
            <div key={r.label} style={{ background: "#fff", borderRadius: "12px", padding: "12px" }}>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#666", fontFamily: "var(--font-manrope)", marginBottom: "4px" }}>{r.label}</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#122b18", fontFamily: "var(--font-manrope)" }}>{r.value}</div>
            </div>
          ))}
        </div>

        {dev.noteClient && (
          <div style={{ marginBottom: "12px", background: "#fffde8", borderRadius: "12px", padding: "12px", border: "1px solid #f0e0a0" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#888", fontFamily: "var(--font-manrope)", marginBottom: "4px" }}>Note client</div>
            <p style={{ fontSize: "13px", color: "#555", fontFamily: "var(--font-manrope)", margin: 0, lineHeight: 1.6 }}>{dev.noteClient}</p>
          </div>
        )}
        {dev.noteAdmin && (
          <div style={{ background: "#e8f5ec", borderRadius: "12px", padding: "12px", border: "1px solid rgba(26,107,60,0.2)" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#1a6b3c", fontFamily: "var(--font-manrope)", marginBottom: "4px" }}>Note interne</div>
            <p style={{ fontSize: "13px", color: "#122b18", fontFamily: "var(--font-manrope)", margin: 0, lineHeight: 1.6 }}>{dev.noteAdmin}</p>
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
    <div style={{ padding: "24px", color: "#122b18", maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <p style={{ fontSize: "12px", color: "#6e7691", fontFamily: "var(--font-manrope)", margin: "0 0 2px", textTransform: "capitalize" }}>{today}</p>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "30px", fontWeight: 500, margin: 0 }}>
            Bonjour Hélène 👋
          </h1>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1.5px solid rgba(18,43,24,0.2)",
              background: "#fff",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            🔔
          </button>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1a6b3c, #2d9b5c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "var(--font-manrope)",
            }}
          >
            HS
          </div>
        </div>
      </div>

      {/* Period pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              borderRadius: "999px",
              padding: "6px 14px",
              fontSize: "12px",
              fontFamily: "var(--font-manrope)",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: period === p ? "#1a6b3c" : "rgba(18,43,24,0.1)",
              color: period === p ? "#fff" : "#1a6b3c",
              transition: "all 0.15s",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Hero KPI card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          background: "#0d2218",
          borderRadius: "20px",
          padding: "20px 20px 8px",
          marginBottom: "16px",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(232,245,236,0.5)", fontFamily: "var(--font-manrope)", marginBottom: "6px" }}>
              Chiffre d&apos;affaires
            </div>
            <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "42px", fontWeight: 500, color: "#e8f5ec", lineHeight: 1 }}>
              1 284 €
            </div>
          </div>
          <span
            style={{
              background: "rgba(94,201,154,0.2)",
              color: "#5ec99a",
              borderRadius: "999px",
              padding: "4px 10px",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "var(--font-manrope)",
              marginTop: "4px",
            }}
          >
            ↑ 12%
          </span>
        </div>

        <ResponsiveContainer width="100%" height={110}>
          <AreaChart data={SERIES_7D} margin={{ top: 5, right: 5, bottom: 0, left: -30 }}>
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5ec99a" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#5ec99a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 5" stroke="rgba(232,245,236,0.08)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: "rgba(232,245,236,0.45)", fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: "#0d2218",
                border: "1px solid rgba(94,201,154,0.2)",
                borderRadius: 8,
                color: "#e8f5ec",
                fontSize: 12,
                fontFamily: "var(--font-manrope)",
              }}
              cursor={{ stroke: "rgba(94,201,154,0.2)" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#5ec99a"
              strokeWidth={2}
              fill="url(#greenGrad)"
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
          { label: "Commandes", value: "8", trend: "↑ 1,7%", trendColor: "#1a6b3c", accent: "#1a6b3c" },
          { label: "Devis", value: "5", trend: "stable", trendColor: "#c9954f", accent: "#c9954f" },
          { label: "Ruptures", value: "1", trend: "↓ 0,9%", trendColor: "#c45a5a", accent: "#c45a5a" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemAnim}
            whileHover={{ boxShadow: "0 0 24px rgba(94,201,154,0.3)" }}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "14px",
              borderLeft: `3px solid ${stat.accent}`,
              cursor: "default",
            }}
          >
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#6e7691", fontFamily: "var(--font-manrope)", marginBottom: "6px" }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "28px", fontWeight: 500, color: "#122b18" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "11px", color: stat.trendColor, fontFamily: "var(--font-manrope)", fontWeight: 600, marginTop: "2px" }}>
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabbed table */}
      <div style={{ background: "#fff", borderRadius: "20px", overflow: "hidden" }}>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(18,43,24,0.1)", position: "relative" }}>
          {(["commandes", "devis"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "14px 20px",
                fontSize: "13px",
                fontFamily: "var(--font-manrope)",
                fontWeight: activeTab === tab ? 700 : 400,
                color: activeTab === tab ? "#1a6b3c" : "#888",
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
                    background: "#1a6b3c",
                    borderRadius: "2px 2px 0 0",
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto",
            gap: "12px",
            padding: "10px 16px",
            background: "#f6fbf8",
          }}
        >
          {["Client", "Montant", "Statut"].map((h) => (
            <div key={h} style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#888", fontFamily: "var(--font-manrope)", fontWeight: 700 }}>
              {h}
            </div>
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
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto",
                      gap: "12px",
                      padding: "12px 16px",
                      borderBottom: "1px solid rgba(18,43,24,0.05)",
                      cursor: "pointer",
                      alignItems: "center",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f6fbf8")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#122b18", fontFamily: "var(--font-manrope)" }}>{cmd.client}</div>
                      <div style={{ fontSize: "11px", color: "#888", fontFamily: "var(--font-manrope)" }}>{cmd.retrait}</div>
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a6b3c", fontFamily: "var(--font-manrope)", textAlign: "right" }}>
                      {cmd.total.toFixed(2)} €
                    </div>
                    <span
                      style={{
                        background: st.color + "18",
                        color: st.color,
                        borderRadius: "999px",
                        padding: "3px 10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        fontFamily: "var(--font-manrope)",
                        whiteSpace: "nowrap",
                      }}
                    >
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
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto",
                      gap: "12px",
                      padding: "12px 16px",
                      borderBottom: "1px solid rgba(18,43,24,0.05)",
                      cursor: "pointer",
                      alignItems: "center",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f6fbf8")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#122b18", fontFamily: "var(--font-manrope)" }}>{dev.client}</div>
                      <div style={{ fontSize: "11px", color: "#888", fontFamily: "var(--font-manrope)", textTransform: "capitalize" }}>{dev.event} · {dev.dateEvent}</div>
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a6b3c", fontFamily: "var(--font-manrope)", textAlign: "right" }}>
                      {dev.prixTotal} €
                    </div>
                    <span
                      style={{
                        background: st.color + "18",
                        color: st.color,
                        borderRadius: "999px",
                        padding: "3px 10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        fontFamily: "var(--font-manrope)",
                        whiteSpace: "nowrap",
                      }}
                    >
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
