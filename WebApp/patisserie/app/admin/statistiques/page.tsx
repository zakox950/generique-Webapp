"use client";
import { useState, useEffect } from "react";
import LineChart from "@/components/LineChart";

interface Commande {
  id: number;
  prixTotal: number;
  dateCommande?: string;
  dateRetrait: string;
  items: { idCatalogue: number; quantite: number; catalogue?: { nom: string } }[];
}

function eur(cents: number) {
  return Number(cents).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function getWeek(d: Date) {
  const day = d.getDay() || 7;
  const mon = new Date(d);
  mon.setDate(d.getDate() - day + 1);
  return mon.toISOString().split("T")[0];
}

function buildDayData(commandes: Commande[]) {
  const map: Record<string, number> = {};
  const labels = ["L", "Ma", "Me", "J", "V", "S", "D"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const label = labels[(d.getDay() + 6) % 7];
    map[key] = 0;
    commandes.forEach((c) => {
      const cd = c.dateCommande ? c.dateCommande.split("T")[0] : c.dateRetrait.split("T")[0];
      if (cd === key) map[key] += Number(c.prixTotal || 0);
    });
    return { label, value: map[key] };
  }
  return [];
}

function buildWeekData(commandes: Commande[]) {
  const weeks: Record<string, number> = {};
  commandes.forEach((c) => {
    const d = new Date(c.dateCommande || c.dateRetrait);
    const wk = getWeek(d);
    weeks[wk] = (weeks[wk] || 0) + Number(c.prixTotal || 0);
  });
  return Object.entries(weeks)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([key, value]) => ({
      label: new Date(key).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
      value,
    }));
}

function buildTopProduits(commandes: Commande[]) {
  const map: Record<string, { nom: string; quantite: number }> = {};
  commandes.forEach((c) => {
    (c.items || []).forEach((item) => {
      const key = String(item.idCatalogue);
      if (!map[key]) map[key] = { nom: item.catalogue?.nom || `Produit #${item.idCatalogue}`, quantite: 0 };
      map[key].quantite += item.quantite;
    });
  });
  return Object.values(map).sort((a, b) => b.quantite - a.quantite).slice(0, 5);
}

export default function StatistiquesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"week" | "month">("week");

  useEffect(() => {
    fetch("/api/admin/commandes")
      .then((r) => r.json())
      .then((data) => { setCommandes(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalRevenu = commandes.reduce((acc, c) => acc + Number(c.prixTotal || 0), 0);
  const totalCommandes = commandes.length;
  const panierMoyen = totalCommandes > 0 ? totalRevenu / totalCommandes : 0;

  const chartData = range === "week"
    ? (() => {
        const data: { label: string; value: number }[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = d.toISOString().split("T")[0];
          const labels = ["L", "Ma", "Me", "J", "V", "S", "D"];
          const label = labels[(d.getDay() + 6) % 7];
          const value = commandes
            .filter((c) => (c.dateCommande || c.dateRetrait).split("T")[0] === key)
            .reduce((acc, c) => acc + Number(c.prixTotal || 0), 0);
          data.push({ label, value });
        }
        return data;
      })()
    : buildWeekData(commandes);

  const topProduits = buildTopProduits(commandes);
  const maxQte = topProduits[0]?.quantite || 1;

  return (
    <main className="content">
      <div>
        <h1 className="page-title">Statistiques</h1>
        <p className="page-sub">Analyse des ventes et performances</p>
      </div>

      {/* KPIs */}
      <section className="kpi-grid">
        <div className="glass-base kpi">
          <div className="kpi-head"><span className="kpi-label">Revenu total</span></div>
          <div className="kpi-value">{loading ? "—" : eur(totalRevenu)}</div>
          <div className="kpi-trend"><span className="muted">Toutes périodes</span></div>
        </div>
        <div className="glass-base kpi">
          <div className="kpi-head"><span className="kpi-label">Commandes</span></div>
          <div className="kpi-value">{loading ? "—" : totalCommandes}</div>
          <div className="kpi-trend"><span className="muted">Total</span></div>
        </div>
        <div className="glass-base kpi">
          <div className="kpi-head"><span className="kpi-label">Panier moyen</span></div>
          <div className="kpi-value">{loading ? "—" : eur(panierMoyen)}</div>
          <div className="kpi-trend"><span className="muted">Par commande</span></div>
        </div>
      </section>

      {/* Chart revenus */}
      <section className="glass-base panel">
        <div className="panel-head">
          <div className="panel-title">
            Revenus
            <div className="sub">{range === "week" ? "7 derniers jours" : "Par semaine"}</div>
          </div>
          <div className="segment" id="chartSeg">
            <button className={range === "week" ? "active" : ""} onClick={() => setRange("week")}>Semaine</button>
            <button className={range === "month" ? "active" : ""} onClick={() => setRange("month")}>Mensuel</button>
          </div>
        </div>
        <div className="chart-wrap">
          {loading ? (
            <div className="loading-state"><div className="spinner-admin" /></div>
          ) : (
            <LineChart data={chartData} unit="€" height={180} />
          )}
        </div>
      </section>

      {/* Top produits */}
      <section className="glass-base panel">
        <div className="panel-head">
          <div className="panel-title">Top produits<div className="sub">Par quantité vendue</div></div>
        </div>
        {loading ? (
          <div className="loading-state"><div className="spinner-admin" /></div>
        ) : topProduits.length === 0 ? (
          <div className="empty-row">Aucune donnée</div>
        ) : (
          <div className="rank-list">
            {topProduits.map((p, i) => (
              <div key={i} className="rank-item">
                <span className="rank-pos">{i + 1}</span>
                <div className="rank-bar-wrap">
                  <div className="rank-name">{p.nom}</div>
                  <div className="rank-bar">
                    <div className="rank-fill" style={{ width: `${(p.quantite / maxQte) * 100}%` }} />
                  </div>
                </div>
                <span className="rank-val">{p.quantite} pcs</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
