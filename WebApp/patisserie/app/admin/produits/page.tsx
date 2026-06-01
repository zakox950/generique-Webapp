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

function eur(val: number) {
  return Number(val).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

const FALLBACK = "photo-1612203985729-70726954388c";

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

  // Photo state
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [addingPhoto, setAddingPhoto] = useState(false);

  useEffect(() => { fetchProduits(); }, []);

  async function fetchProduits(): Promise<Produit[]> {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/catalogue");
      const data = await r.json();
      const list: Produit[] = Array.isArray(data) ? data : [];
      setProduits(list);
      return list;
    } catch {
      return [];
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setSelected(null);
    setCreating(true);
    setNom(""); setPrix(""); setDescription(""); setIngredient("");
    setNewPhotoUrl("");
    setModalOpen(true);
  }

  function openEdit(p: Produit) {
    setSelected(p);
    setCreating(false);
    setNom(p.nom);
    setPrix(String(Number(p.prix)));
    setDescription(p.description || "");
    setIngredient(p.ingredient || "");
    setNewPhotoUrl("");
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

  async function handleAddPhoto(prodId: number) {
    if (!newPhotoUrl.trim()) return;
    setAddingPhoto(true);
    try {
      const res = await fetch(`/api/admin/catalogue/${prodId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ajouter_photo", photoUrl: newPhotoUrl.trim() }),
      });
      if (res.ok) {
        showToast("Photo ajoutée");
        setNewPhotoUrl("");
        const list = await fetchProduits();
        const updated = list.find((p) => p.id === prodId);
        if (updated) setSelected(updated);
      } else {
        showToast("URL invalide");
      }
    } catch {
      showToast("Erreur réseau");
    } finally {
      setAddingPhoto(false);
    }
  }

  async function handleDeletePhoto(prodId: number, photoId: number) {
    const res = await fetch(`/api/admin/catalogue/${prodId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "supprimer_photo", photoId }),
    });
    if (res.ok) {
      showToast("Photo supprimée");
      const list = await fetchProduits();
      const updated = list.find((p) => p.id === prodId);
      if (updated) setSelected(updated);
    }
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
                  src={p.photos[0]?.photoUrl || `https://images.unsplash.com/${FALLBACK}?w=300&q=80`}
                  alt={p.nom}
                />
                {!p.isActif && <div className="prod-overlay">Inactif</div>}
              </div>
              <div className="prod-body-admin">
                <div className="prod-name-admin">{p.nom}</div>
                <div className="prod-price-admin">{eur(p.prix)}</div>
                {p.description && <div className="prod-desc-admin">{p.description}</div>}
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)", marginTop: 4 }}>
                  {p.photos.length} photo{p.photos.length !== 1 ? "s" : ""}
                </div>
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
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <div className="modal-head">
              <div className="modal-title">{creating ? "Nouveau produit" : `Modifier ${selected?.nom}`}</div>
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
            <div className="form-field" style={{ marginBottom: 16 }}>
              <label className="form-label-admin">Ingrédients</label>
              <input className="form-input-admin" type="text" value={ingredient} onChange={(e) => setIngredient(e.target.value)} placeholder="Farine, beurre, oeufs…" />
            </div>

            {/* Photos — uniquement en mode édition */}
            {!creating && selected && (
              <div className="form-field" style={{ marginBottom: 24 }}>
                <label className="form-label-admin">Photos</label>
                {selected.photos.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                    {selected.photos.map((photo) => (
                      <div key={photo.id} style={{ position: "relative" }}>
                        <img
                          src={photo.photoUrl}
                          alt=""
                          style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1px solid var(--color-glass-border, rgba(255,255,255,0.1))", display: "block" }}
                        />
                        <button
                          onClick={() => handleDeletePhoto(selected.id, photo.id)}
                          title="Supprimer cette photo"
                          style={{
                            position: "absolute", top: -6, right: -6,
                            width: 20, height: 20, borderRadius: "50%",
                            background: "rgba(220,38,38,0.9)", color: "#fff",
                            border: "none", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            padding: 0,
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" width="10" height="10">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)", marginTop: 6 }}>Aucune photo — ajoutez une URL ci-dessous.</p>
                )}
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <input
                    className="form-input-admin"
                    type="url"
                    placeholder="https://images.unsplash.com/photo-…"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    className="btn-primary"
                    onClick={() => handleAddPhoto(selected.id)}
                    disabled={!newPhotoUrl.trim() || addingPhoto}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {addingPhoto ? "…" : "Ajouter"}
                  </button>
                </div>
              </div>
            )}

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
