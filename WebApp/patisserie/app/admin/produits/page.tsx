"use client";
import { useState, useEffect } from "react";

interface Produit {
  id: number;
  nom: string;
  prix: number;
  description?: string;
  ingredient?: string;
  modeVente?: string;
  isActif: boolean;
  stockDisponible?: number;
  photos: { id: number; photoUrl: string }[];
}

function eur(cents: number) {
  return Number(cents).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

const UNSPLASH_FALLBACK = "photo-1612203985729-70726954388c";

export default function ProduitsPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Produit | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  // Form state
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [description, setDescription] = useState("");
  const [ingredient, setIngredient] = useState("");

  useEffect(() => {
    fetchProduits();
  }, []);

  function fetchProduits() {
    setLoading(true);
    fetch("/api/admin/catalogue")
      .then((r) => r.json())
      .then((data) => { setProduits(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  function openCreate() {
    setSelected(null);
    setCreating(true);
    setNom(""); setPrix(""); setDescription(""); setIngredient("");
    setModalOpen(true);
  }

  function openEdit(p: Produit) {
    setSelected(p);
    setCreating(false);
    setNom(p.nom);
    setPrix(String(Number(p.prix)));
    setDescription(p.description || "");
    setIngredient(p.ingredient || "");
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const body = {
      nom,
      prix: parseFloat(prix),
      description: description || undefined,
      ingredient: ingredient || undefined,
    };
    try {
      const url = creating ? "/api/admin/catalogue" : `/api/admin/catalogue/${selected!.id}`;
      const method = creating ? "POST" : "PATCH";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        showToast(creating ? "Produit créé" : "Produit modifié");
        setModalOpen(false);
        fetchProduits();
      } else {
        const data = await res.json();
        showToast(data.error || "Erreur");
      }
    } catch {
      showToast("Erreur réseau");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(p: Produit) {
    const res = await fetch(`/api/admin/catalogue/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle_actif" }),
    });
    if (res.ok) { showToast(p.isActif ? "Produit désactivé" : "Produit activé"); fetchProduits(); }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  return (
    <main className="content">
      <div className="page-head-row">
        <div>
          <h1 className="page-title">Produits</h1>
          <p className="page-sub">{produits.length} produit{produits.length !== 1 ? "s" : ""} au catalogue</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouveau produit
        </button>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner-admin" /></div>
      ) : (
        <div className="prod-grid-admin">
          {produits.map((p) => (
            <div key={p.id} className={`glass-base prod-card-admin${!p.isActif ? " inactive" : ""}`}>
              <div className="prod-img-admin">
                <img
                  src={p.photos[0]?.photoUrl || `https://images.unsplash.com/${UNSPLASH_FALLBACK}?w=300&q=80`}
                  alt={p.nom}
                />
                {!p.isActif && <div className="prod-overlay">Inactif</div>}
              </div>
              <div className="prod-body-admin">
                <div className="prod-name-admin">{p.nom}</div>
                <div className="prod-price-admin">{eur(p.prix)}</div>
                {p.description && <div className="prod-desc-admin">{p.description}</div>}
                <div className="prod-actions-admin">
                  <button className="btn-ghost-sm" onClick={() => openEdit(p)}>Modifier</button>
                  <button
                    className={`btn-ghost-sm ${p.isActif ? "btn-warn" : "btn-ok"}`}
                    onClick={() => handleToggle(p)}
                  >
                    {p.isActif ? "Désactiver" : "Activer"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="modal-title">{creating ? "Nouveau produit" : `Modifier ${selected?.nom}`}</div>
              </div>
              <button className="modal-x" onClick={() => setModalOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-divider" />

            <div className="form-field" style={{ marginBottom: 16 }}>
              <label className="form-label-admin">Nom du produit *</label>
              <input className="form-input-admin" type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Croissant au beurre" />
            </div>
            <div className="form-field" style={{ marginBottom: 16 }}>
              <label className="form-label-admin">Prix (€) *</label>
              <input className="form-input-admin" type="number" step="0.01" min="0" value={prix} onChange={(e) => setPrix(e.target.value)} placeholder="1.80" />
            </div>
            <div className="form-field" style={{ marginBottom: 16 }}>
              <label className="form-label-admin">Description</label>
              <textarea className="form-input-admin" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description courte…" />
            </div>
            <div className="form-field" style={{ marginBottom: 24 }}>
              <label className="form-label-admin">Ingrédients</label>
              <input className="form-input-admin" type="text" value={ingredient} onChange={(e) => setIngredient(e.target.value)} placeholder="Farine, beurre, oeufs…" />
            </div>

            <div className="modal-actions">
              <button className="btn-primary grow" onClick={handleSave} disabled={saving || !nom || !prix}>
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button className="btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="admin-toast">{toast}</div>}
    </main>
  );
}
