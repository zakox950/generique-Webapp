"use client";

import { useState } from "react";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "999px",
        border: "none",
        background: value ? "#1a6b3c" : "#ccc",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: "3px",
          left: value ? "23px" : "3px",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

function SectionCard({ title, children, onSave }: { title: string; children: React.ReactNode; onSave: () => void }) {
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "18px",
        boxShadow: "0 2px 8px rgba(18,43,24,0.07)",
        marginBottom: "14px",
      }}
    >
      <h3 style={{ fontFamily: "var(--font-manrope)", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#1a6b3c", margin: "0 0 14px" }}>
        {title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "16px" }}>
        {children}
      </div>
      <button
        onClick={handleSave}
        style={{
          background: saved ? "#1a6b3c" : "rgba(18,43,24,0.08)",
          color: saved ? "#fff" : "#1a6b3c",
          borderRadius: "999px",
          padding: "8px 20px",
          fontSize: "13px",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-manrope)",
          transition: "all 0.2s",
        }}
      >
        {saved ? "✓ Sauvegardé !" : "Sauvegarder"}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
      <label style={{ fontSize: "13px", fontFamily: "var(--font-manrope)", color: "#122b18", fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  );
}

export default function ConfigPage() {
  const [modeCmd, setModeCmd] = useState("immediat");
  const [delaiRetrait, setDelaiRetrait] = useState("24");
  const [limitePieces, setLimitePieces] = useState("5");
  const [paiementCB, setPaiementCB] = useState(true);
  const [paiementEspeces, setPaiementEspeces] = useState(true);
  const [productionMax, setProductionMax] = useState("30");
  const [boutiqueOuverte, setBoutiqueOuverte] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);

  const inputStyle: React.CSSProperties = {
    padding: "7px 10px",
    borderRadius: "8px",
    border: "1.5px solid rgba(18,43,24,0.15)",
    background: "#f6fbf8",
    fontSize: "13px",
    fontFamily: "var(--font-manrope)",
    color: "#122b18",
    outline: "none",
    width: "80px",
    textAlign: "right",
  };

  return (
    <div style={{ padding: "24px", color: "#122b18", maxWidth: "640px" }}>
      <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "32px", fontWeight: 500, margin: "0 0 24px" }}>
        Configuration
      </h1>

      <SectionCard title="Mode commande" onSave={() => {}}>
        <Field label="Mode de commande">
          <select
            value={modeCmd}
            onChange={(e) => setModeCmd(e.target.value)}
            style={{ ...inputStyle, width: "auto" }}
          >
            <option value="immediat">Immédiat</option>
            <option value="precommande">Pré-commande</option>
            <option value="devis_only">Devis uniquement</option>
          </select>
        </Field>
        <Field label="Délai minimum retrait (h)">
          <input
            type="number"
            value={delaiRetrait}
            onChange={(e) => setDelaiRetrait(e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Limite pièces par commande">
          <input
            type="number"
            value={limitePieces}
            onChange={(e) => setLimitePieces(e.target.value)}
            style={inputStyle}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Paiement" onSave={() => {}}>
        <Field label="Carte bancaire">
          <Toggle value={paiementCB} onChange={setPaiementCB} />
        </Field>
        <Field label="Espèces en boutique">
          <Toggle value={paiementEspeces} onChange={setPaiementEspeces} />
        </Field>
      </SectionCard>

      <SectionCard title="Production" onSave={() => {}}>
        <Field label="Capacité max. journalière (pièces)">
          <input
            type="number"
            value={productionMax}
            onChange={(e) => setProductionMax(e.target.value)}
            style={inputStyle}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Boutique" onSave={() => {}}>
        <Field label="Boutique ouverte aux commandes">
          <Toggle value={boutiqueOuverte} onChange={setBoutiqueOuverte} />
        </Field>
        {!boutiqueOuverte && (
          <div style={{ background: "#fff5f5", borderRadius: "10px", padding: "10px 12px", fontSize: "12px", color: "#c45a5a", fontFamily: "var(--font-manrope)" }}>
            ⚠ Les nouvelles commandes sont désactivées.
          </div>
        )}
      </SectionCard>

      <SectionCard title="Notifications" onSave={() => {}}>
        <Field label="Notifications par email">
          <Toggle value={notifEmail} onChange={setNotifEmail} />
        </Field>
        <Field label="Notifications SMS">
          <Toggle value={notifSMS} onChange={setNotifSMS} />
        </Field>
      </SectionCard>
    </div>
  );
}
