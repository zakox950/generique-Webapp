"use client";
import { useState } from "react";

export default function ParametresPage() {
  const [email, setEmail] = useState("");
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/parametres", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) showToast("Email mis à jour");
      else showToast("Erreur lors de la mise à jour");
    } catch { showToast("Erreur réseau"); }
    finally { setSaving(false); }
  }

  async function handlePwdChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPwd !== confirmPwd) { showToast("Les mots de passe ne correspondent pas"); return; }
    if (newPwd.length < 8) { showToast("Mot de passe trop court (minimum 8 caractères)"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/parametres", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      if (res.ok) { showToast("Mot de passe modifié"); setCurrentPwd(""); setNewPwd(""); setConfirmPwd(""); }
      else { const d = await res.json(); showToast(d.error || "Erreur"); }
    } catch { showToast("Erreur réseau"); }
    finally { setSaving(false); }
  }

  return (
    <main className="content">
      <div>
        <h1 className="page-title">Paramètres</h1>
        <p className="page-sub">Gestion du compte administrateur</p>
      </div>

      {/* Modifier email */}
      <section className="glass-base panel" style={{ marginBottom: 20 }}>
        <div className="panel-head">
          <div className="panel-title">Adresse email</div>
        </div>
        <form onSubmit={handleEmailChange} style={{ padding: "0 20px 20px" }}>
          <div className="form-field" style={{ marginBottom: 16 }}>
            <label className="form-label-admin">Nouvel email</label>
            <input
              className="form-input-admin"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@patisserie.fr"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={saving || !email}>
            {saving ? "Enregistrement…" : "Mettre à jour"}
          </button>
        </form>
      </section>

      {/* Modifier mot de passe */}
      <section className="glass-base panel">
        <div className="panel-head">
          <div className="panel-title">Mot de passe</div>
        </div>
        <form onSubmit={handlePwdChange} style={{ padding: "0 20px 20px" }}>
          <div className="form-field" style={{ marginBottom: 16 }}>
            <label className="form-label-admin">Mot de passe actuel</label>
            <input
              className="form-input-admin"
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <div className="form-field" style={{ marginBottom: 16 }}>
            <label className="form-label-admin">Nouveau mot de passe</label>
            <input
              className="form-input-admin"
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              required
              minLength={8}
              placeholder="••••••••"
            />
          </div>
          <div className="form-field" style={{ marginBottom: 24 }}>
            <label className="form-label-admin">Confirmer le nouveau mot de passe</label>
            <input
              className="form-input-admin"
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={saving || !currentPwd || !newPwd || !confirmPwd}>
            {saving ? "Modification…" : "Changer le mot de passe"}
          </button>
        </form>
      </section>

      {toast && <div className="admin-toast">{toast}</div>}
    </main>
  );
}
