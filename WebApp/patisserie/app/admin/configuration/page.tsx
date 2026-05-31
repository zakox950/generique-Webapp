"use client";
import { useState, useEffect, useCallback } from "react";

interface ConfigRow {
  nameVariable: string;
  valeur: string;
  description?: string;
}

const CONFIG_META: Record<string, { label: string; type: "text" | "number" | "select" | "boolean"; options?: string[]; description: string }> = {
  mode_commande: {
    label: "Mode de commande",
    type: "select",
    options: ["direct_only", "seuil", "devis_only"],
    description: "Contrôle si les clients peuvent passer des commandes directes ou devis",
  },
  seuil_devis: {
    label: "Seuil devis (pièces)",
    type: "number",
    description: "Nombre minimum de pièces pour basculer en devis",
  },
  mode_paiement: {
    label: "Mode de paiement",
    type: "select",
    options: ["en_ligne", "sur_place", "au_choix_client"],
    description: "Méthode de paiement acceptée",
  },
  mode_retrait: {
    label: "Mode de retrait",
    type: "select",
    options: ["boutique", "livraison", "au_choix_client"],
    description: "Mode de retrait disponible pour les clients",
  },
  frais_livraison: {
    label: "Frais de livraison (€)",
    type: "number",
    description: "Montant des frais de livraison en centimes",
  },
  zone_livraison: {
    label: "Zone de livraison",
    type: "text",
    description: "Description de la zone de livraison",
  },
  delai_retrait_jours: {
    label: "Délai minimum retrait (jours)",
    type: "number",
    description: "Nombre de jours minimum avant retrait",
  },
  limite_par_commande: {
    label: "Limite par commande (pièces)",
    type: "number",
    description: "Nombre maximum de pièces par commande directe",
  },
  mode_production_global: {
    label: "Mode de production",
    type: "select",
    options: ["ouvert", "ferme", "vacances"],
    description: "Etat global de la production",
  },
  devis_expire_days: {
    label: "Expiration devis (jours)",
    type: "number",
    description: "Durée de validité d'un devis en jours",
  },
  acompte_mode: {
    label: "Mode d'acompte",
    type: "select",
    options: ["aucun", "pourcentage", "montant_fixe"],
    description: "Mode de calcul de l'acompte pour les devis",
  },
  acompte_valeur: {
    label: "Valeur de l'acompte",
    type: "number",
    description: "Valeur de l'acompte (% ou montant en centimes selon le mode)",
  },
  notif_admin_email: {
    label: "Email notifications admin",
    type: "text",
    description: "Adresse email pour les notifications admin",
  },
  notif_client_statut: {
    label: "Notifier le client",
    type: "boolean",
    description: "Envoyer un email au client lors du changement de statut",
  },
  notif_admin_commande: {
    label: "Notifier admin (commande)",
    type: "boolean",
    description: "Envoyer un email admin lors d'une nouvelle commande",
  },
  notif_admin_devis: {
    label: "Notifier admin (devis)",
    type: "boolean",
    description: "Envoyer un email admin lors d'une nouvelle demande de devis",
  },
  boutique_nom: {
    label: "Nom de la boutique",
    type: "text",
    description: "Nom affiché sur le site",
  },
  boutique_adresse: {
    label: "Adresse",
    type: "text",
    description: "Adresse physique de la boutique",
  },
  boutique_tel: {
    label: "Téléphone",
    type: "text",
    description: "Numéro de téléphone",
  },
  boutique_horaires: {
    label: "Horaires",
    type: "text",
    description: "Horaires d'ouverture",
  },
};

const SECTIONS = [
  { title: "Commandes", keys: ["mode_commande", "seuil_devis", "delai_retrait_jours", "limite_par_commande"] },
  { title: "Paiement & Retrait", keys: ["mode_paiement", "mode_retrait", "frais_livraison", "zone_livraison"] },
  { title: "Devis & Acompte", keys: ["devis_expire_days", "acompte_mode", "acompte_valeur"] },
  { title: "Production", keys: ["mode_production_global"] },
  { title: "Notifications", keys: ["notif_admin_email", "notif_client_statut", "notif_admin_commande", "notif_admin_devis"] },
  { title: "Boutique", keys: ["boutique_nom", "boutique_adresse", "boutique_tel", "boutique_horaires"] },
];

function OptionLabel(v: string) {
  const map: Record<string, string> = {
    direct_only: "Commandes directes uniquement",
    seuil: "Par seuil",
    devis_only: "Devis uniquement",
    en_ligne: "En ligne",
    sur_place: "Sur place",
    au_choix_client: "Au choix du client",
    boutique: "Retrait en boutique",
    livraison: "Livraison",
    ouvert: "Ouvert",
    ferme: "Fermé",
    vacances: "Vacances",
    aucun: "Aucun",
    pourcentage: "Pourcentage",
    montant_fixe: "Montant fixe",
  };
  return map[v] || v;
}

export default function ConfigurationPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/admin/config")
      .then((r) => r.json())
      .then((rows: ConfigRow[]) => {
        const map: Record<string, string> = {};
        (Array.isArray(rows) ? rows : []).forEach((r) => { map[r.nameVariable] = r.valeur; });
        setConfig(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);

  const save = useCallback(
    async (key: string, value: string) => {
      setSaving(key);
      try {
        const res = await fetch("/api/admin/config", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nameVariable: key, valeur: value }),
        });
        if (res.ok) {
          setConfig((prev) => ({ ...prev, [key]: value }));
          showToast("Enregistré");
        } else {
          showToast("Erreur lors de l'enregistrement");
        }
      } catch {
        showToast("Erreur réseau");
      } finally {
        setSaving(null);
      }
    },
    [showToast],
  );

  if (loading) {
    return (
      <main className="content">
        <h1 className="page-title">Configuration</h1>
        <div className="loading-state"><div className="spinner-admin" /></div>
      </main>
    );
  }

  return (
    <main className="content">
      <div>
        <h1 className="page-title">Configuration</h1>
        <p className="page-sub">Paramètres généraux de la boutique</p>
      </div>

      {SECTIONS.map((section) => (
        <section key={section.title} className="glass-base panel" style={{ marginBottom: 20 }}>
          <div className="panel-head">
            <div className="panel-title">{section.title}</div>
          </div>

          {section.keys.map((key) => {
            const meta = CONFIG_META[key];
            if (!meta) return null;
            const value = config[key] ?? "";

            return (
              <div key={key} className="config-row">
                <div className="config-info">
                  <div className="config-label">{meta.label}</div>
                  <div className="config-desc">{meta.description}</div>
                </div>
                <div className="config-control">
                  {meta.type === "boolean" ? (
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={value === "true"}
                        onChange={(e) => save(key, String(e.target.checked))}
                        disabled={saving === key}
                      />
                      <span className="toggle-track" />
                    </label>
                  ) : meta.type === "select" ? (
                    <select
                      className="form-input-admin select-sm"
                      value={value}
                      onChange={(e) => save(key, e.target.value)}
                      disabled={saving === key}
                    >
                      {(meta.options || []).map((opt) => (
                        <option key={opt} value={opt}>{OptionLabel(opt)}</option>
                      ))}
                    </select>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const input = e.currentTarget.querySelector("input") as HTMLInputElement;
                        save(key, input.value);
                      }}
                      style={{ display: "flex", gap: 8 }}
                    >
                      <input
                        className="form-input-admin input-sm"
                        type={meta.type === "number" ? "number" : "text"}
                        defaultValue={value}
                        key={value}
                        step={meta.type === "number" ? "any" : undefined}
                      />
                      <button type="submit" className="btn-ghost-sm" disabled={saving === key}>
                        {saving === key ? "…" : "Ok"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      ))}

      {toast && <div className="admin-toast">{toast}</div>}
    </main>
  );
}
