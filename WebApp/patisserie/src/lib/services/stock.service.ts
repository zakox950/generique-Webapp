import prisma from "../prisma";

// =========================================
// GESTION DU STOCK PHYSIQUE
// Utilisé uniquement si modeVente = 'make_to_stock'
// =========================================

// Vérifie si le stock est suffisant pour une quantité demandée
export async function verifierStock(
  idCatalogue: number,
  quantiteDemandee: number,
): Promise<{ ok: boolean; message?: string }> {
  const produit = await prisma.catalogue.findUnique({
    where: { id: idCatalogue },
    select: { modeVente: true, stockDisponible: true, nom: true },
  });

  if (!produit) {
    return { ok: false, message: `Produit ${idCatalogue} introuvable` };
  }

  // Si le produit est en make_to_order, pas de vérification de stock
  if (produit.modeVente !== "make_to_stock") return { ok: true };

  const stock = produit.stockDisponible ?? 0;

  if (stock < quantiteDemandee) {
    return {
      ok: false,
      message: `Stock insuffisant pour ${produit.nom}. Disponible : ${stock} pièces`,
    };
  }

  return { ok: true };
}

// Décrémente le stock après une commande confirmée
export async function decrementerStock(idCatalogue: number, quantite: number) {
  const produit = await prisma.catalogue.findUnique({
    where: { id: idCatalogue },
    select: { stockDisponible: true, modeVente: true },
  });

  if (!produit || produit.modeVente !== "make_to_stock") return;

  const nouveauStock = Math.max(0, (produit.stockDisponible ?? 0) - quantite);

  return await prisma.catalogue.update({
    where: { id: idCatalogue },
    data: { stockDisponible: nouveauStock },
  });
}

// Réapprovisionne le stock — appelé par l'admin depuis le dashboard
export async function reapprovisionner(idCatalogue: number, quantite: number) {
  const produit = await prisma.catalogue.findUnique({
    where: { id: idCatalogue },
    select: { stockDisponible: true },
  });

  if (!produit) throw new Error(`Produit ${idCatalogue} introuvable`);

  return await prisma.catalogue.update({
    where: { id: idCatalogue },
    data: { stockDisponible: (produit.stockDisponible ?? 0) + quantite },
  });
}

// Définit le stock à une valeur précise — pour correction manuelle
export async function setStock(idCatalogue: number, quantite: number) {
  return await prisma.catalogue.update({
    where: { id: idCatalogue },
    data: { stockDisponible: quantite },
  });
}

// Récupère le stock actuel de tous les produits make_to_stock
export async function getStocks() {
  return await prisma.catalogue.findMany({
    where: { modeVente: "make_to_stock" },
    select: {
      id: true,
      nom: true,
      stockDisponible: true,
      isActif: true,
    },
    orderBy: { nom: "asc" },
  });
}
