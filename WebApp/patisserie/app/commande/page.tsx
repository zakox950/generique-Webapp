"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ClientLayout from "@/components/ClientLayout";
import { useCart } from "@/hooks/useCart";

interface SiteConfig {
  mode_commande?: string;
  seuil_devis?: string;
  mode_paiement?: string;
  mode_retrait?: string;
  delai_retrait_jours?: string;
  boutique_nom?: string;
  boutique_adresse?: string;
  boutique_tel?: string;
  boutique_horaires?: string;
}

function eur(cents: number) {
  return Number(cents).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function minDate(delai: number) {
  const d = new Date();
  d.setDate(d.getDate() + delai);
  return d.toISOString().split("T")[0];
}

const HEURES = [
  "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00", "17:30",
];

// Simulated payment card — pre-filled static data
const FAKE_CARD = {
  number: "4242 4242 4242 4242",
  expiry: "12/26",
  cvc: "123",
  name: "FRANÇOISE TEST",
};

export default function CommandePage() {
  const router = useRouter();
  const { items, total, count, mounted, clearCart } = useCart();
  const [config, setConfig] = useState<SiteConfig>({});
  const [step, setStep] = useState<"form" | "payment" | "devis">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [dateRetrait, setDateRetrait] = useState("");
  const [heure, setHeure] = useState("10:00");
  const [note, setNote] = useState("");
  const [paiement, setPaiement] = useState<"en_ligne" | "sur_place">("en_ligne");
  const [typeEvenement, setTypeEvenement] = useState("");

  // Payment simulation
  const [payProcessing, setPayProcessing] = useState(false);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => {});
  }, []);

  const delai = parseInt(config.delai_retrait_jours || "2");
  const seuilDevis = parseInt(config.seuil_devis || "10");
  const modeCommande = config.mode_commande || "seuil";
  const modePaiement = config.mode_paiement || "au_choix_client";

  // Determine if should go to devis
  const isDevis =
    modeCommande === "devis_only" ||
    (modeCommande === "seuil" && count >= seuilDevis);

  useEffect(() => {
    if (!mounted) return;
    // Aligne le mode de paiement par défaut sur la Config chargée (source externe)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (modePaiement === "sur_place") setPaiement("sur_place");
    else if (modePaiement === "en_ligne") setPaiement("en_ligne");
  }, [modePaiement, mounted]);

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (isDevis) {
        setStep("devis");
        return;
      }

      if (modePaiement === "en_ligne" || (modePaiement === "au_choix_client" && paiement === "en_ligne")) {
        setStep("payment");
        return;
      }

      // Sur place → soumettre directement
      await submitCommande("sur_place");
    },
    [isDevis, modePaiement, paiement, nom, email, tel, dateRetrait, heure, note, items],
  );

  async function submitCommande(payMode: "en_ligne" | "sur_place") {
    setLoading(true);
    setError("");
    try {
      const body = {
        nom: `${nom}`,
        mail: email,
        dateRetrait: new Date(`${dateRetrait}T${heure}:00`).toISOString(),
        noteClient: note || undefined,
        paiementChoisi: payMode,
        items: items.map((i) => ({ idCatalogue: i.id, quantite: i.quantite })),
      };
      const res = await fetch("/api/commande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        if (data.redirect === "devis") {
          setStep("devis");
          return;
        }
        throw new Error(data.error || "Erreur lors de la commande");
      }
      const data = await res.json();
      clearCart();
      router.push(`/confirmation?id=${data.id}&type=commande`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
      setLoading(false);
    }
  }

  async function submitDevis() {
    setLoading(true);
    setError("");
    try {
      const body = {
        nom,
        mail: email,
        numeroTel: tel,
        dateSouhaitee: new Date(`${dateRetrait}T${heure}:00`).toISOString(),
        dateRetrait: new Date(`${dateRetrait}T${heure}:00`).toISOString(),
        typeEvenement: typeEvenement || undefined,
        noteClient: note || undefined,
        items: items.map((i) => ({ idCatalogue: i.id, quantite: i.quantite })),
      };
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'envoi du devis");
      }
      const data = await res.json();
      clearCart();
      router.push(`/confirmation?id=${data.id}&type=devis`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
      setLoading(false);
    }
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    setPayProcessing(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 1800));
    setPayProcessing(false);
    await submitCommande("en_ligne");
  }

  if (!mounted) return null;

  if (count === 0 && step === "form") {
    return (
      <ClientLayout>
        <section className="page-hero">
          <h1 className="page-title">Click &amp; Collect</h1>
          <p className="page-sub">Commandez, on prépare.</p>
        </section>
        <div className="section" style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="trust-section" style={{ marginBottom: 40 }}>
            <div className="trust-item">
              <div className="trust-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </div>
              <div className="trust-title">1. Choisissez</div>
              <div className="trust-sub">Parcourez notre catalogue et ajoutez vos créations au panier</div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                  <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
              <div className="trust-title">2. Réglez</div>
              <div className="trust-sub">Confirmez votre commande et choisissez votre date de retrait</div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                  <path d="M3 9l1-5h16l1 5"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/>
                </svg>
              </div>
              <div className="trust-title">3. Récupérez</div>
              <div className="trust-sub">Votre commande fraîche du matin vous attend en boutique</div>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <a href="/catalogue" className="btn-primary">Découvrir nos créations</a>
          </div>
          {config.boutique_adresse && (
            <div className="surface-card" style={{ marginTop: 40 }}>
              <div className="summary-title">La boutique</div>
              <div className="boutique-info">
                <div className="boutique-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{config.boutique_adresse}</span>
                </div>
                {config.boutique_tel && (
                  <div className="boutique-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 012 1.18 2 2 0 014 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                    <span>{config.boutique_tel}</span>
                  </div>
                )}
                {config.boutique_horaires && (
                  <div className="boutique-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                    <span>{config.boutique_horaires}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <section className="page-hero">
        <h1 className="page-title">{isDevis ? "Demande de devis" : "Commander"}</h1>
        <p className="page-sub">
          {isDevis
            ? "Pour votre commande, nous vous contactons pour valider les détails."
            : "Finalisez votre commande. Retrait en boutique."}
        </p>
      </section>

      {/* Étapes */}
      <div className="steps-row">
        <div className={`step ${step === "form" ? "active" : (step === "payment" || step === "devis") ? "done" : ""}`}>
          <div className="step-num">1</div>
          <span>Vos informations</span>
        </div>
        <div className="step-sep" />
        <div className={`step ${step === "payment" || step === "devis" ? "active" : ""}`}>
          <div className="step-num">2</div>
          <span>{isDevis ? "Votre demande" : "Paiement"}</span>
        </div>
      </div>

      <div className="commande-layout">
        {/* Formulaire principal */}
        {step === "form" && (
          <form className="commande-form surface-card" onSubmit={handleFormSubmit}>
            <div className="form-section-title">Vos informations</div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Nom complet *</label>
                <input
                  className="form-input"
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                  placeholder="Marie Martin"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Email *</label>
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="marie@exemple.fr"
                />
              </div>
            </div>

            {(isDevis || modeCommande === "seuil") && (
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Téléphone {isDevis ? "*" : ""}</label>
                  <input
                    className="form-input"
                    type="tel"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    required={isDevis}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>
            )}

            {isDevis && (
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Type d&rsquo;événement</label>
                  <input
                    className="form-input"
                    type="text"
                    value={typeEvenement}
                    onChange={(e) => setTypeEvenement(e.target.value)}
                    placeholder="Anniversaire, mariage, baptême…"
                  />
                </div>
              </div>
            )}

            <div className="form-section-title" style={{ marginTop: 24 }}>Date de retrait</div>

            <div className="form-row two-col">
              <div className="form-field">
                <label className="form-label">Date *</label>
                <input
                  className="form-input"
                  type="date"
                  value={dateRetrait}
                  onChange={(e) => setDateRetrait(e.target.value)}
                  min={minDate(delai)}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">Heure *</label>
                <select className="form-input" value={heure} onChange={(e) => setHeure(e.target.value)}>
                  {HEURES.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>

            {modePaiement === "au_choix_client" && !isDevis && (
              <>
                <div className="form-section-title" style={{ marginTop: 24 }}>Mode de paiement</div>
                <div className="radio-group">
                  <label className={`radio-opt${paiement === "en_ligne" ? " active" : ""}`}>
                    <input type="radio" name="paiement" value="en_ligne" checked={paiement === "en_ligne"} onChange={() => setPaiement("en_ligne")} />
                    <span>En ligne (carte)</span>
                  </label>
                  <label className={`radio-opt${paiement === "sur_place" ? " active" : ""}`}>
                    <input type="radio" name="paiement" value="sur_place" checked={paiement === "sur_place"} onChange={() => setPaiement("sur_place")} />
                    <span>Sur place</span>
                  </label>
                </div>
              </>
            )}

            <div className="form-row" style={{ marginTop: 24 }}>
              <div className="form-field">
                <label className="form-label">Message / instructions</label>
                <textarea
                  className="form-input form-textarea"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Personnalisation, allergies, instructions particulières…"
                  rows={3}
                />
              </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn-primary full-width" style={{ marginTop: 24 }} disabled={loading}>
              {loading ? "Traitement…" : isDevis ? "Envoyer ma demande" : "Continuer"}
            </button>
          </form>
        )}

        {/* Paiement simulé */}
        {step === "payment" && (
          <form className="commande-form surface-card" onSubmit={handlePayment}>
            <div className="form-section-title">Paiement sécurisé</div>

            {/* Carte visuelle */}
            <div className="payment-card">
              <div className="pay-card-chip" />
              <div className="pay-card-number">{FAKE_CARD.number}</div>
              <div className="pay-card-foot">
                <div>
                  <div className="pay-card-label">Titulaire</div>
                  <div className="pay-card-val">{FAKE_CARD.name}</div>
                </div>
                <div>
                  <div className="pay-card-label">Expiration</div>
                  <div className="pay-card-val">{FAKE_CARD.expiry}</div>
                </div>
              </div>
            </div>

            <div className="pay-note">
              Environnement de démonstration — aucun débit réel ne sera effectué.
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Numéro de carte</label>
                <input className="form-input" type="text" defaultValue={FAKE_CARD.number} readOnly />
              </div>
            </div>
            <div className="form-row two-col">
              <div className="form-field">
                <label className="form-label">Expiration</label>
                <input className="form-input" type="text" defaultValue={FAKE_CARD.expiry} readOnly />
              </div>
              <div className="form-field">
                <label className="form-label">CVC</label>
                <input className="form-input" type="text" defaultValue={FAKE_CARD.cvc} readOnly />
              </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn-primary full-width" style={{ marginTop: 24 }} disabled={payProcessing || loading}>
              {payProcessing ? "Traitement en cours…" : `Payer ${eur(total)}`}
            </button>
            <button type="button" className="btn-ghost full-width" style={{ marginTop: 10 }} onClick={() => setStep("form")}>
              Retour
            </button>
          </form>
        )}

        {/* Formulaire devis */}
        {step === "devis" && (
          <div className="commande-form surface-card">
            <div className="form-section-title">Votre demande de devis</div>
            <p className="form-helper">
              {modeCommande === "devis_only"
                ? "Nous traitons toutes les commandes sur devis. Nous vous contacterons rapidement."
                : `Votre panier dépasse ${seuilDevis} articles. Nous vous contacterons pour finaliser votre commande.`}
            </p>

            {!tel && (
              <div className="form-row" style={{ marginTop: 16 }}>
                <div className="form-field">
                  <label className="form-label">Téléphone *</label>
                  <input
                    className="form-input"
                    type="tel"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    required
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>
            )}

            {error && <div className="form-error">{error}</div>}

            <button
              className="btn-primary full-width"
              style={{ marginTop: 24 }}
              onClick={submitDevis}
              disabled={loading || (!tel && !tel)}
            >
              {loading ? "Envoi…" : "Envoyer ma demande de devis"}
            </button>
            <button type="button" className="btn-ghost full-width" style={{ marginTop: 10 }} onClick={() => setStep("form")}>
              Retour
            </button>
          </div>
        )}

        {/* Récap commande */}
        <div className="commande-recap">
          <div className="surface-card">
            <div className="summary-title">Votre commande</div>
            {items.map((item) => (
              <div key={item.id} className="recap-line">
                <span>{item.nom} × {item.quantite}</span>
                <span>{eur(item.prix * item.quantite)}</span>
              </div>
            ))}
            <div className="summary-total" style={{ marginTop: 12 }}>
              <span>Total</span>
              <span>{eur(total)}</span>
            </div>
          </div>

          {/* Infos boutique */}
          <div className="surface-card" style={{ marginTop: 16 }}>
            <div className="summary-title">La boutique</div>
            <div className="boutique-info">
              <div className="boutique-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{config.boutique_adresse || "12 rue de la Paix, Paris"}</span>
              </div>
              <div className="boutique-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 012 1.18 2 2 0 014 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <span>{config.boutique_tel || "01 23 45 67 89"}</span>
              </div>
              {config.boutique_horaires && (
                <div className="boutique-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                  <span>{config.boutique_horaires}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
