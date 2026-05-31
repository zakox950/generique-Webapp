"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LineChart from "@/components/LineChart";

interface Commande {
  id: number;
  nom: string;
  prixTotal: number;
  dateRetrait: string;
  prete: boolean;
  items: { quantite?: number; catalogue?: { nom?: string } }[];
  dateCommande?: string;
}

interface Devis {
  id: number;
  nom: string;
  typeEvenement?: string;
  statutEnum: string;
  dateRetrait: string;
  prixTotal?: number;
  createdAt?: string;
}

function eur(cents: number) {
  return Number(cents).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

const STATUT_MAP: Record<string, { cls: string; label: string }> = {
  en_attente: { cls: "badge-warn", label: "En attente" },
  valide: { cls: "badge-ok", label: "Validé" },
  acompte_paye: { cls: "badge-ok", label: "Acompte payé" },
  pret: { cls: "badge-ok", label: "Prêt" },
  annule: { cls: "badge-err", label: "Annulé" },
  expire: { cls: "badge-err", label: "Expiré" },
};

// Simulated weekly revenue data
function buildWeekData() {
  const days = ["L", "Ma", "Me", "J", "V", "S", "D"];
  return days.map((label, i) => ({
    label,
    value: Math.floor(200 + Math.random() * 300 + i * 30),
  }));
}

export default function DashboardPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekData] = useState(buildWeekData);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/commandes").then((r) => r.json()),
      fetch("/api/admin/devis").then((r) => r.json()),
    ])
      .then(([cmd, dvs]) => {
        setCommandes(Array.isArray(cmd) ? cmd : []);
        setDevis(Array.isArray(dvs) ? dvs : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const today = new Date().toDateString();
  const commandesToday = commandes.filter((c) => c.dateCommande && new Date(c.dateCommande).toDateString() === today);
  const revenuToday = commandesToday.reduce((acc, c) => acc + Number(c.prixTotal || 0), 0);
  const devisEnAttente = devis.filter((d) => d.statutEnum === "en_attente");

  return (
    <main className="content">
      <div>
        <h1 className="page-title">Bonjour, Françoise.</h1>
        <p className="page-sub">Tableau de bord — {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* KPIs */}
      <section className="kpi-grid">
        <div className="glass-base kpi">
          <div className="kpi-head">
            <span className="kpi-label">Commandes aujourd&rsquo;hui</span>
            <span className="kpi-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M5 4h14l-1 16H6L5 4Z"/><path d="M9 4a3 3 0 0 1 6 0"/>
              </svg>
            </span>
          </div>
          <div className="kpi-value">{loading ? "—" : commandesToday.length}</div>
          <div className="kpi-trend"><span className="muted">Du jour</span></div>
        </div>

        <div className="glass-base kpi">
          <div className="kpi-head">
            <span className="kpi-label">Revenus du jour</span>
            <span className="kpi-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </span>
          </div>
          <div className="kpi-value">{loading ? "—" : eur(revenuToday)}</div>
          <div className="kpi-trend up">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <path d="M5 12l7-7 7 7M12 5v15"/>
            </svg>
            <span className="muted">Estimé</span>
          </div>
        </div>

        <div className="glass-base kpi">
          <div className="kpi-head">
            <span className="kpi-label">Commandes total</span>
            <span className="kpi-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M3 9l1-5h16l1 5"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/>
              </svg>
            </span>
          </div>
          <div className="kpi-value">{loading ? "—" : commandes.length}</div>
          <div className="kpi-trend"><span className="muted">Historique</span></div>
        </div>

        <div className="glass-base kpi">
          <div className="kpi-head">
            <span className="kpi-label">Devis en attente</span>
            <span className="kpi-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M6 2h9l5 5v15H6Z"/><path d="M14 2v6h6"/>
              </svg>
            </span>
          </div>
          <div className="kpi-value">{loading ? "—" : devisEnAttente.length}</div>
          <div className="kpi-trend">
            {devisEnAttente.length > 0 ? (
              <span className="badge badge-warn no-dot">A traiter</span>
            ) : (
              <span className="muted">Aucun</span>
            )}
          </div>
        </div>
      </section>

      {/* Chart + Devis récents */}
      <div className="dash-grid">
        <section className="glass-base panel">
          <div className="panel-head">
            <div className="panel-title">
              Revenus
              <div className="sub">7 derniers jours (estimation)</div>
            </div>
          </div>
          <div className="chart-wrap">
            <LineChart data={weekData} unit="€" height={160} />
          </div>
        </section>

        <section className="glass-base panel">
          <div className="panel-head">
            <div className="panel-title">Derniers devis<div className="sub">Demandes récentes</div></div>
          </div>
          <div className="devis-list">
            {loading ? (
              <div className="loading-row">Chargement…</div>
            ) : devis.length === 0 ? (
              <div className="empty-row">Aucun devis</div>
            ) : (
              devis.slice(0, 3).map((d) => {
                const s = STATUT_MAP[d.statutEnum] || { cls: "badge-warn", label: d.statutEnum };
                return (
                  <div key={d.id} className="glass-base devis-item">
                    <div className="devis-top">
                      <div>
                        <div className="devis-client">{d.nom}</div>
                        <div className="devis-event">{d.typeEvenement || "—"}</div>
                      </div>
                      <span className={`badge ${s.cls} no-dot`}>{s.label}</span>
                    </div>
                    <div className="devis-foot">
                      <span className="devis-date">Retrait {fmtDate(d.dateRetrait)}</span>
                      {d.prixTotal && <span className="devis-amount">{eur(d.prixTotal)}</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="panel-foot">
            <Link href="/admin/devis" className="btn-ghost">Voir tous les devis</Link>
          </div>
        </section>
      </div>

      {/* Table commandes récentes */}
      <section className="glass-base panel mt">
        <div className="panel-head">
          <div className="panel-title">Dernières commandes<div className="sub">Cliquez une ligne pour le détail</div></div>
          <Link href="/admin/commandes" className="btn-ghost">Tout voir</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Produits</th>
                <th>Retrait</th>
                <th>Statut</th>
                <th className="num">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "20px", opacity: 0.5 }}>Chargement…</td></tr>
              ) : commandes.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "20px", opacity: 0.5 }}>Aucune commande</td></tr>
              ) : (
                commandes.slice(0, 5).map((o) => {
                  const prodNoms = o.items?.map((i) => i.catalogue?.nom).filter(Boolean).join(", ") || "—";
                  return (
                    <tr key={o.id}>
                      <td className="muted">#{o.id}</td>
                      <td className="client">{o.nom}</td>
                      <td className="prod">{prodNoms}</td>
                      <td>{fmtDate(o.dateRetrait)}</td>
                      <td>
                        <span className={`badge ${o.prete ? "badge-ok" : "badge-warn"}`}>
                          {o.prete ? "Prête" : "A préparer"}
                        </span>
                      </td>
                      <td className="num amount">{eur(o.prixTotal || 0)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
