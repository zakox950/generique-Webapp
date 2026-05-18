import { Resend } from "resend";
import {
  getNotifAdminEmail,
  getBoutiqueNom,
  getBoutiqueAdresse,
} from "../config";
import type {
  CommandeDirect,
  CatalogueItem,
  Catalogue,
  Devis,
  CatalogueDevisItem,
} from "../../../app/generated/prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

// =========================================
// TYPES
// =========================================

type CommandeAvecItems = CommandeDirect & {
  items: (CatalogueItem & { catalogue: Catalogue })[];
};

type DevisAvecItems = Devis & {
  items: (CatalogueDevisItem & { catalogue: Catalogue })[];
};

// =========================================
// HELPERS
// =========================================

async function getFromEmail(): Promise<string> {
  const nom = await getBoutiqueNom();
  return `${nom || "La Pâtisserie"} <commandes@${process.env.DOMAINE_EMAIL}>`;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("fr-BE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrix(
  prix: number | string | { toNumber: () => number },
): string {
  const valeur = typeof prix === "object" ? prix.toNumber() : Number(prix);
  return valeur.toFixed(2) + " €";
}

// =========================================
// EMAILS COMMANDE DIRECTE
// =========================================

export async function sendConfirmationCommande(commande: CommandeAvecItems) {
  const notifActif = process.env.NOTIF_CLIENT_STATUT !== "false";
  if (!notifActif) return;

  const from = await getFromEmail();
  const adresse = await getBoutiqueAdresse();

  const itemsHtml = commande.items
    .map(
      (item) => `
    <tr>
      <td>${item.catalogue.nom}</td>
      <td>${item.quantite}</td>
      <td>${formatPrix(item.prixUnite)}</td>
      <td>${formatPrix(Number(item.prixUnite) * (item.quantite ?? 1))}</td>
    </tr>
  `,
    )
    .join("");

  await resend.emails.send({
    from,
    replyTo: process.env.REPLY_TO_EMAIL,
    to: commande.mail,
    subject: `Confirmation de votre commande #${commande.id}`,
    html: `
      <h2>Merci pour votre commande, ${commande.nom} !</h2>
      <p>Votre commande <strong>#${commande.id}</strong> a bien été enregistrée.</p>

      <h3>Récapitulatif</h3>
      <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Prix unitaire</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <p><strong>Total : ${formatPrix(commande.prixTotal)}</strong></p>
      <p><strong>Date de retrait : ${formatDate(commande.dateRetrait)}</strong></p>
      ${adresse ? `<p>Adresse : ${adresse}</p>` : ""}
      ${commande.noteClient ? `<p>Votre note : ${commande.noteClient}</p>` : ""}

      <p>À bientôt !</p>
    `,
  });
}

export async function sendNouvelleCommandeAdmin(commande: CommandeAvecItems) {
  const adminEmail = await getNotifAdminEmail();
  if (!adminEmail) return;

  const from = await getFromEmail();

  const itemsHtml = commande.items
    .map(
      (item) => `
    <tr>
      <td>${item.catalogue.nom}</td>
      <td>${item.quantite}</td>
      <td>${formatPrix(item.prixUnite)}</td>
    </tr>
  `,
    )
    .join("");

  await resend.emails.send({
    from,
    to: adminEmail,
    subject: `Nouvelle commande #${commande.id} — ${commande.nom}`,
    html: `
      <h2>Nouvelle commande reçue</h2>
      <p><strong>Client :</strong> ${commande.nom} (${commande.mail})</p>
      <p><strong>Date de retrait :</strong> ${formatDate(commande.dateRetrait)}</p>
      <p><strong>Total :</strong> ${formatPrix(commande.prixTotal)}</p>
      <p><strong>Paiement :</strong> ${commande.paiementChoisi}</p>

      <h3>Articles commandés</h3>
      <table border="1" cellpadding="8" style="border-collapse: collapse;">
        <thead>
          <tr><th>Produit</th><th>Quantité</th><th>Prix unitaire</th></tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      ${commande.noteClient ? `<p><strong>Note du client :</strong> ${commande.noteClient}</p>` : ""}
    `,
  });
}

// =========================================
// EMAILS DEVIS
// =========================================

export async function sendNouveauDevisClient(devis: DevisAvecItems) {
  const from = await getFromEmail();

  await resend.emails.send({
    from,
    replyTo: process.env.REPLY_TO_EMAIL,
    to: devis.mail,
    subject: `Votre demande de devis #${devis.id} a bien été reçue`,
    html: `
      <h2>Merci pour votre demande, ${devis.nom} !</h2>
      <p>Votre demande de devis <strong>#${devis.id}</strong> a bien été reçue.</p>
      <p>Nous allons l'étudier et vous recontacterons dans les plus brefs délais.</p>

      <h3>Récapitulatif de votre demande</h3>
      <p><strong>Date souhaitée :</strong> ${formatDate(devis.dateSouhaitee)}</p>
      ${devis.typeEvenement ? `<p><strong>Événement :</strong> ${devis.typeEvenement}</p>` : ""}
      <p><strong>Montant estimé :</strong> ${formatPrix(devis.prixTotal)}</p>
      ${Number(devis.acompte) > 0 ? `<p><strong>Acompte prévu :</strong> ${formatPrix(devis.acompte)}</p>` : ""}
      <p><strong>Devis valable jusqu'au :</strong> ${devis.expireAt ? formatDate(devis.expireAt) : "Non défini"}</p>

      ${devis.noteClient ? `<p><strong>Votre note :</strong> ${devis.noteClient}</p>` : ""}

      <p>À bientôt !</p>
    `,
  });
}

export async function sendNouveauDevisAdmin(devis: DevisAvecItems) {
  const adminEmail = await getNotifAdminEmail();
  if (!adminEmail) return;

  const from = await getFromEmail();

  const itemsHtml = devis.items
    .map(
      (item) => `
    <tr>
      <td>${item.catalogue.nom}</td>
      <td>${item.quantite}</td>
      <td>${formatPrix(item.prixUnite)}</td>
    </tr>
  `,
    )
    .join("");

  await resend.emails.send({
    from,
    to: adminEmail,
    subject: `Nouveau devis #${devis.id} — ${devis.nom}`,
    html: `
      <h2>Nouvelle demande de devis</h2>
      <p><strong>Client :</strong> ${devis.nom} (${devis.mail})</p>
      <p><strong>Téléphone :</strong> ${devis.numeroTel}</p>
      <p><strong>Date souhaitée :</strong> ${formatDate(devis.dateSouhaitee)}</p>
      ${devis.typeEvenement ? `<p><strong>Événement :</strong> ${devis.typeEvenement}</p>` : ""}
      <p><strong>Total estimé :</strong> ${formatPrix(devis.prixTotal)}</p>
      <p><strong>Acompte :</strong> ${formatPrix(devis.acompte)}</p>

      <h3>Articles demandés</h3>
      <table border="1" cellpadding="8" style="border-collapse: collapse;">
        <thead>
          <tr><th>Produit</th><th>Quantité</th><th>Prix unitaire</th></tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      ${devis.noteClient ? `<p><strong>Note du client :</strong> ${devis.noteClient}</p>` : ""}
    `,
  });
}

export async function sendDevisValide(devis: DevisAvecItems) {
  const from = await getFromEmail();

  await resend.emails.send({
    from,
    replyTo: process.env.REPLY_TO_EMAIL,
    to: devis.mail,
    subject: `Votre devis #${devis.id} a été accepté`,
    html: `
      <h2>Bonne nouvelle, ${devis.nom} !</h2>
      <p>Votre devis <strong>#${devis.id}</strong> a été accepté.</p>

      <p><strong>Total :</strong> ${formatPrix(devis.prixTotal)}</p>
      ${
        Number(devis.acompte) > 0
          ? `
        <p><strong>Acompte à régler :</strong> ${formatPrix(devis.acompte)}</p>
        <p>Veuillez procéder au règlement de l'acompte pour confirmer votre commande.</p>
      `
          : ""
      }
      <p><strong>Date de retrait confirmée :</strong> ${formatDate(devis.dateRetrait)}</p>

      ${devis.noteAdmin ? `<p><strong>Message :</strong> ${devis.noteAdmin}</p>` : ""}

      <p>À bientôt !</p>
    `,
  });
}

export async function sendDevisRefuse(devis: DevisAvecItems) {
  const from = await getFromEmail();

  await resend.emails.send({
    from,
    replyTo: process.env.REPLY_TO_EMAIL,
    to: devis.mail,
    subject: `Votre demande de devis #${devis.id}`,
    html: `
      <h2>Bonjour ${devis.nom},</h2>
      <p>Nous avons bien étudié votre demande de devis <strong>#${devis.id}</strong>.</p>
      <p>Malheureusement, nous ne sommes pas en mesure de donner suite à votre demande pour le moment.</p>

      ${devis.noteAdmin ? `<p><strong>Motif :</strong> ${devis.noteAdmin}</p>` : ""}

      <p>N'hésitez pas à nous recontacter pour toute autre demande.</p>
      <p>Cordialement</p>
    `,
  });
}

export async function sendDevisPret(devis: DevisAvecItems) {
  const from = await getFromEmail();
  const adresse = await getBoutiqueAdresse();

  await resend.emails.send({
    from,
    replyTo: process.env.REPLY_TO_EMAIL,
    to: devis.mail,
    subject: `Votre commande #${devis.id} est prête !`,
    html: `
      <h2>Votre commande est prête, ${devis.nom} !</h2>
      <p>Votre commande <strong>#${devis.id}</strong> est prête à être retirée.</p>

      <p><strong>Date de retrait :</strong> ${formatDate(devis.dateRetrait)}</p>
      ${adresse ? `<p><strong>Adresse :</strong> ${adresse}</p>` : ""}

      ${
        Number(devis.dejaPaye) > 0
          ? `
        <p><strong>Acompte déjà réglé :</strong> ${formatPrix(devis.dejaPaye ?? 0)}</p>
        <p><strong>Solde restant à régler :</strong> ${formatPrix(Number(devis.prixTotal) - Number(devis.dejaPaye))}</p>
      `
          : `
        <p><strong>Montant à régler :</strong> ${formatPrix(devis.prixTotal)}</p>
      `
      }

      <p>À très bientôt !</p>
    `,
  });
}
