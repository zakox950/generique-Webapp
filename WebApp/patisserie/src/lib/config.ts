import prisma from "./prisma";

// Charge toutes les variables Config depuis la base en une seule requête
// et les transforme en objet clé/valeur
// Résultat : { seuil_devis: '10', mode_commande: 'seuil', ... }
async function getAllConfig(): Promise<Record<string, string>> {
  const rows = await prisma.config.findMany();
  return Object.fromEntries(rows.map((r) => [r.nameVariable, r.valeur]));
}

// Retourne le seuil de pièces qui déclenche un devis
// La valeur en base est une string '10', on la convertit en nombre
export async function getSeuilDevis(): Promise<number> {
  const config = await getAllConfig();
  return parseInt(config.seuil_devis);
}

// Retourne le mode de commande : 'direct_only' | 'devis_only' | 'seuil'
export async function getModeCommande(): Promise<string> {
  const config = await getAllConfig();
  return config.mode_commande;
}

// Retourne le délai minimum en jours avant retrait
export async function getDelaiRetrait(): Promise<number> {
  const config = await getAllConfig();
  return parseInt(config.delai_retrait_jours);
}

// Retourne le mode de production global
export async function getModeProduction(): Promise<string> {
  const config = await getAllConfig();
  return config.mode_production_global;
}

// Retourne le nombre de jours avant expiration d'un devis
export async function getDevisExpireDays(): Promise<number> {
  const config = await getAllConfig();
  return parseInt(config.devis_expire_days);
}

// Retourne le mode de paiement : 'en_ligne' | 'sur_place' | 'acompte' | 'au_choix_client'
export async function getModePaiement(): Promise<string> {
  const config = await getAllConfig();
  return config.mode_paiement;
}

// Retourne le mode de l'acompte : 'desactive' | 'pourcentage' | 'montant_fixe'
export async function getAcompteMode(): Promise<string> {
  const config = await getAllConfig();
  return config.acompte_mode;
}

// Retourne la valeur de l'acompte (% ou montant fixe selon le mode)
export async function getAcompteValeur(): Promise<number> {
  const config = await getAllConfig();
  return parseFloat(config.acompte_valeur);
}

// Retourne l'email de notification admin
export async function getNotifAdminEmail(): Promise<string> {
  const config = await getAllConfig();
  return config.notif_admin_email;
}
