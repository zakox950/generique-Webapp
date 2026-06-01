"use client";
import { useState, useEffect } from "react";

interface DevisItem {
  id: number;
  idCatalogue: number;
  quantite: number;
  catalogue?: { nom: string };
}

interface Devis {
  id: number;
  nom: string;
  mail: string;
  numeroTel?: string;
  typeEvenement?: string;
  statutEnum: string;
  dateRetrait: string;
  dateSouhaitee?: string;
  noteClient?: string;
  prixTotal?: number;
  dateCommande?: string;
  items: DevisItem[];
}

const STATUTS = [
  { value: "all", label: "Tous" },
  { value: "en_attente", label: "En attente" },
  { value: "valide", label: "Validés" },
  { value: "acompte_paye", label: "Acompte payé" },
  { value: "pret", label: "Prêts" },
  { value: "annule", label: "Annulés" },
  { value: "expire", label: "Expirés" },
];

const STATUT_MAP: Record<string, { cls: string; label: string }> = {
  en_attente: { cls: "badge-warn", label: "En attente" },
  valide: { cls: "badge-ok", label: "Validé" },
  acompte_paye: { cls: "badge-ok", label: "Acompte payé" },
  pret: { cls: "badge-ok", label: "Prêt" },
  annule: { cls: "badge-err", label: "Annulé" },
  expire: { cls: "badge-err", label: "Expiré" },
};

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function eur(cents: number) {
  return Number(cents).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export default function DevisPage() {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Devis | null>(null);
  const [filterStatut, setFilterStatut] = useState("all");
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchDevis();
  }, []);

  function fetchDevis() {
    setLoading(true);
    fetch("/api/admin/devis")
      .then((r) => r.json())
      .then((data) => { setDevis(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  // Mappe une action vers le payload attendu par l'API workflow devis
  async function runAction(d: Devis, action: string) {
    const body: Record<string, unknown> = { action };
    if (action === "acompte_paye") {
      // L'acompte n'a de sens que si un prix a été fixé
      if (!d.prixTotal) { showToast("Fixez d'abord un prix au devis"); return; }
      body.montant = d.prixTotal;
    }
    const res = await fetch(`/api/admin/devis/${d.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) { showToast("Devis mis à jour"); fetchDevis(); setSelected(null); }
    else { const e = await res.json(); showToast(e.error || "Erreur"); }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  const filtered = filterStatut === "all" ? devis : devis.filter((d) => d.statutEnum === filterStatut);

  return (
    <main className="content">
      <div className="page-head-row">
        <div>
          <h1 className="page-title">Devis</h1>
          <p className="page-sub">{devis.length} demande{devis.length !== 1 ? "s" : ""} au total</p>
        </div>
      </div>

      {/* Filtre statut */}
      <div className="chips-wrap-admin">
        {STATUTS.map((s) => (
          <button
            key={s.value}
            className={`chip-admin${filterStatut === s.value ? " active" : ""}`}
            onClick={() => setFilterStatut(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <section className="glass-base panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Evenement</th>
                <th>Date souhaitée</th>
                <th>Statut</th>
                <th className="num">Montant</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "24px", opacity: 0.5 }}>Chargement…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "24px", opacity: 0.5 }}>Aucun devis</td></tr>
              ) : (
                filtered.map((d) => {
                  const s = STATUT_MAP[d.statutEnum] || { cls: "badge-warn", label: d.statutEnum };
                  return (
                    <tr key={d.id} style={{ cursor: "pointer" }} onClick={() => setSelected(d)}>
                      <td className="muted">#{d.id}</td>
                      <td className="client">{d.nom}</td>
                      <td>{d.typeEvenement || "—"}</td>
                      <td>{fmtDate(d.dateSouhaitee || d.dateRetrait)}</td>
                      <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      <td className="num amount">{d.prixTotal ? eur(d.prixTotal) : "—"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal détail */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="modal-title">Devis <span className="id">#{selected.id}</span></div>
                {selected.dateCommande && <div className="modal-sub">Reçu le {fmtDate(selected.dateCommande)}</div>}
              </div>
              <button className="modal-x" onClick={() => setSelected(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-divider" />

            <div className="detail-row"><span className="k">Client</span><span className="v">{selected.nom}</span></div>
            <div className="detail-row"><span className="k">Email</span><span className="v">{selected.mail}</span></div>
            {selected.numeroTel && <div className="detail-row"><span className="k">Téléphone</span><span className="v">{selected.numeroTel}</span></div>}
            {selected.typeEvenement && <div className="detail-row"><span className="k">Evénement</span><span className="v">{selected.typeEvenement}</span></div>}
            <div className="detail-row"><span className="k">Date souhaitée</span><span className="v">{fmtDate(selected.dateSouhaitee || selected.dateRetrait)}</span></div>
            <div className="detail-row">
              <span className="k">Statut</span>
              <span className={`badge ${(STATUT_MAP[selected.statutEnum] || { cls: "badge-warn" }).cls} no-dot`}>
                {(STATUT_MAP[selected.statutEnum] || { label: selected.statutEnum }).label}
              </span>
            </div>
            {selected.noteClient && (
              <div className="detail-row"><span className="k">Note client</span><span className="v">{selected.noteClient}</span></div>
            )}

            {selected.items.length > 0 && (
              <>
                <div className="modal-section-label">Articles demandés</div>
                {selected.items.map((item) => (
                  <div key={item.id} className="item-line">
                    <span>{item.catalogue?.nom || `Produit #${item.idCatalogue}`} <span className="q">×{item.quantite}</span></span>
                  </div>
                ))}
              </>
            )}

            {selected.prixTotal && (
              <div className="detail-row" style={{ borderTop: "1px solid var(--color-border)", marginTop: 8, paddingTop: 12 }}>
                <span className="k">Total estimé</span><span className="v amount">{eur(selected.prixTotal)}</span>
              </div>
            )}

            {/* Actions workflow */}
            <div className="modal-section-label">Actions</div>
            <div className="statut-actions">
              {[
                { action: "valider", cls: "badge-ok", label: "Valider" },
                { action: "acompte_paye", cls: "badge-ok", label: "Acompte payé" },
                { action: "marquer_pret", cls: "badge-ok", label: "Marquer prêt" },
                { action: "refuser", cls: "badge-err", label: "Refuser" },
              ].map((a) => (
                <button
                  key={a.action}
                  className={`badge ${a.cls} no-dot statut-btn`}
                  onClick={() => runAction(selected, a.action)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="admin-toast">{toast}</div>}
    </main>
  );
}
