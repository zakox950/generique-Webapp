"use client";
import { useState, useEffect } from "react";

interface CommandeItem {
  id: number;
  idCatalogue: number;
  quantite: number;
  prixUnite?: string;
  catalogue?: { nom: string };
}

interface Commande {
  id: number;
  nom: string;
  mail: string;
  dateRetrait: string;
  dateCommande?: string;
  prete: boolean;
  prixTotal: number;
  paiementChoisi?: string;
  noteClient?: string;
  items: CommandeItem[];
}

function eur(cents: number) {
  return Number(cents).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function fmtDateTime(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Commande | null>(null);
  const [toast, setToast] = useState("");
  const [filterPrete, setFilterPrete] = useState<"all" | "false" | "true">("all");

  useEffect(() => {
    // fetchCommandes est hoistée (déclaration de fonction) — appel au montage.
    // eslint-disable-next-line react-hooks/immutability
    fetchCommandes();
  }, []);

  function fetchCommandes() {
    setLoading(true);
    fetch("/api/admin/commandes")
      .then((r) => r.json())
      .then((data) => { setCommandes(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  async function markReady(id: number) {
    const res = await fetch(`/api/admin/commandes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "marquer_prete" }),
    });
    if (res.ok) { showToast("Commande marquée prête"); fetchCommandes(); setSelected(null); }
  }

  async function deleteCommande(id: number) {
    if (!confirm("Supprimer cette commande ?")) return;
    const res = await fetch(`/api/admin/commandes/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Commande supprimée"); fetchCommandes(); setSelected(null); }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  const filtered = commandes.filter((c) => {
    if (filterPrete === "false") return !c.prete;
    if (filterPrete === "true") return c.prete;
    return true;
  });

  return (
    <main className="content">
      <div className="page-head-row">
        <div>
          <h1 className="page-title">Commandes</h1>
          <p className="page-sub">{commandes.length} commande{commandes.length !== 1 ? "s" : ""} au total</p>
        </div>
        <div className="segment">
          <button className={filterPrete === "all" ? "active" : ""} onClick={() => setFilterPrete("all")}>Toutes</button>
          <button className={filterPrete === "false" ? "active" : ""} onClick={() => setFilterPrete("false")}>A préparer</button>
          <button className={filterPrete === "true" ? "active" : ""} onClick={() => setFilterPrete("true")}>Prêtes</button>
        </div>
      </div>

      <section className="glass-base panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Email</th>
                <th>Retrait</th>
                <th>Statut</th>
                <th>Paiement</th>
                <th className="num">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "24px", opacity: 0.5 }}>Chargement…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "24px", opacity: 0.5 }}>Aucune commande</td></tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} style={{ cursor: "pointer" }} onClick={() => setSelected(o)}>
                    <td className="muted">#{o.id}</td>
                    <td className="client">{o.nom}</td>
                    <td className="muted">{o.mail}</td>
                    <td>{fmtDateTime(o.dateRetrait)}</td>
                    <td>
                      <span className={`badge ${o.prete ? "badge-ok" : "badge-warn"}`}>
                        {o.prete ? "Prête" : "A préparer"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${o.paiementChoisi === "en_ligne" ? "badge-ok" : "badge-warn"} no-dot`}>
                        {o.paiementChoisi === "en_ligne" ? "En ligne" : "Sur place"}
                      </span>
                    </td>
                    <td className="num amount">{eur(o.prixTotal || 0)}</td>
                  </tr>
                ))
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
                <div className="modal-title">Commande <span className="id">#{selected.id}</span></div>
                {selected.dateCommande && <div className="modal-sub">Reçue le {fmtDate(selected.dateCommande)}</div>}
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
            <div className="detail-row"><span className="k">Retrait</span><span className="v">{fmtDateTime(selected.dateRetrait)}</span></div>
            <div className="detail-row">
              <span className="k">Paiement</span>
              <span className="v">{selected.paiementChoisi === "en_ligne" ? "En ligne (payé)" : "Sur place"}</span>
            </div>
            {selected.noteClient && (
              <div className="detail-row"><span className="k">Note</span><span className="v">{selected.noteClient}</span></div>
            )}

            <div className="modal-section-label">Articles</div>
            {selected.items.map((item) => (
              <div key={item.id} className="item-line">
                <span>{item.catalogue?.nom || `Produit #${item.idCatalogue}`} <span className="q">×{item.quantite}</span></span>
                {item.prixUnite && <span className="amount">{eur(Number(item.prixUnite) * item.quantite)}</span>}
              </div>
            ))}
            <div className="detail-row" style={{ borderTop: "1px solid var(--color-border)", marginTop: 8, paddingTop: 12 }}>
              <span className="k">Total</span>
              <span className="v amount">{eur(selected.prixTotal || 0)}</span>
            </div>

            <div className="modal-actions">
              {!selected.prete && (
                <button className="btn-primary grow" onClick={() => markReady(selected.id)}>
                  Marquer prête
                </button>
              )}
              <button className="btn-danger" onClick={() => deleteCommande(selected.id)}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="admin-toast">{toast}</div>}
    </main>
  );
}
