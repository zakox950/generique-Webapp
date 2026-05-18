import prisma from "./prisma";

// Charge toutes les variables Config depuis la base en une seule requête
// et les transforme en objet clé/valeur
// Résultat : { seuil_devis: '10', mode_commande: 'seuil', ... }
async function getAllConfig(): Promise<Record<string, string>> {
  const rows = await prisma.config.findMany();
  return Object.fromEntries(rows.map((r) => [r.nameVariable, r.valeur]));
}

// =========================================
// COMMANDES
// =========================================

export async function getSeuilDevis(): Promise<number> {
  const config = await getAllConfig();
  return parseInt(config.seuil_devis);
}

export async function getModeCommande(): Promise<string> {
  const config = await getAllConfig();
  return config.mode_commande;
}

export async function getDelaiRetrait(): Promise<number> {
  const config = await getAllConfig();
  return parseInt(config.delai_retrait_jours);
}

export async function getLimiteParCommande(): Promise<number> {
  const config = await getAllConfig();
  return parseInt(config.limite_par_commande);
}

// =========================================
// PRODUCTION
// =========================================

export async function getModeProduction(): Promise<string> {
  const config = await getAllConfig();
  return config.mode_production_global;
}

// =========================================
// DEVIS
// =========================================

export async function getDevisExpireDays(): Promise<number> {
  const config = await getAllConfig();
  return parseInt(config.devis_expire_days);
}

// =========================================
// ACOMPTE
// =========================================

export async function getAcompteMode(): Promise<string> {
  const config = await getAllConfig();
  return config.acompte_mode;
}

export async function getAcompteValeur(): Promise<number> {
  const config = await getAllConfig();
  return parseFloat(config.acompte_valeur);
}

// =========================================
// PAIEMENT
// =========================================

export async function getModePaiement(): Promise<string> {
  const config = await getAllConfig();
  return config.mode_paiement;
}

// =========================================
// RETRAIT
// =========================================

export async function getModeRetrait(): Promise<string> {
  const config = await getAllConfig();
  return config.mode_retrait;
}

export async function getFraisLivraison(): Promise<number> {
  const config = await getAllConfig();
  return parseFloat(config.frais_livraison);
}

export async function getZoneLivraison(): Promise<string> {
  const config = await getAllConfig();
  return config.zone_livraison;
}

// =========================================
// NOTIFICATIONS
// =========================================

export async function getNotifAdminEmail(): Promise<string> {
  const config = await getAllConfig();
  return config.notif_admin_email;
}

export async function getNotifClientStatut(): Promise<boolean> {
  const config = await getAllConfig();
  return config.notif_client_statut === "true";
}

export async function getNotifAdminCommande(): Promise<boolean> {
  const config = await getAllConfig();
  return config.notif_admin_commande === "true";
}

export async function getNotifAdminDevis(): Promise<boolean> {
  const config = await getAllConfig();
  return config.notif_admin_devis === "true";
}

// =========================================
// BOUTIQUE
// =========================================

export async function getBoutiqueNom(): Promise<string> {
  const config = await getAllConfig();
  return config.boutique_nom;
}

export async function getBoutiqueAdresse(): Promise<string> {
  const config = await getAllConfig();
  return config.boutique_adresse;
}

export async function getBoutiqueTel(): Promise<string> {
  const config = await getAllConfig();
  return config.boutique_tel;
}

export async function getBoutiqueHoraires(): Promise<string> {
  const config = await getAllConfig();
  return config.boutique_horaires;
}

// =========================================
// MISE À JOUR — côté admin
// =========================================

// Modifier une variable de config depuis le dashboard admin
export async function setConfig(nameVariable: string, valeur: string) {
  return await prisma.config.update({
    where: { nameVariable },
    data: { valeur },
  });
}

// Récupérer toutes les variables pour l'affichage dans le dashboard admin
export async function getAllConfigPublic() {
  return await prisma.config.findMany({
    orderBy: { nameVariable: "asc" },
  });
}
