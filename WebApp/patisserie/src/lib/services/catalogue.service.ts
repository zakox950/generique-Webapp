import prisma from "../prisma";
import { Prisma } from "../../../app/generated/prisma/client";

// =========================================
// LECTURE — côté public
// =========================================

// Tous les produits visibles avec leurs photos
// Filtre aussi les produits saisonniers selon la date du jour
export async function getProduitActifs() {
  const aujourd_hui = new Date();

  return await prisma.catalogue.findMany({
    where: {
      isActif: true,
      OR: [{ dateDebutActif: null }, { dateDebutActif: { lte: aujourd_hui } }],
      AND: [
        {
          OR: [{ dateFinActif: null }, { dateFinActif: { gte: aujourd_hui } }],
        },
      ],
    },
    include: { photos: true },
  });
}

// Un seul produit par son id avec ses photos
export async function getProduitById(id: number) {
  return await prisma.catalogue.findUnique({
    where: { id },
    include: { photos: true },
  });
}

// =========================================
// LECTURE — côté admin
// =========================================

// Tous les produits (actifs et inactifs) pour le dashboard admin
export async function getTousProduits() {
  return await prisma.catalogue.findMany({
    include: {
      photos: true,
      dayLimits: { where: { isActif: true } },
      weekLimits: { where: { isActif: true } },
    },
    orderBy: { id: "asc" },
  });
}

// =========================================
// ÉCRITURE — côté admin
// =========================================

// Créer un nouveau produit
export async function creerProduit(data: {
  nom: string;
  prix: number;
  ingredient?: string;
  description?: string;
  modeVente?: string;
  dateDebutActif?: Date;
  dateFinActif?: Date;
  prixOptions?: object;
}) {
  return await prisma.catalogue.create({ data });
}

export async function modifierProduit(
  id: number,
  data: {
    nom?: string;
    prix?: number;
    ingredient?: string;
    description?: string;
    modeVente?: string;
    stockDisponible?: number;
    dateDebutActif?: Date | null;
    dateFinActif?: Date | null;
    prixOptions?: object | null;
  },
) {
  return await prisma.catalogue.update({
    where: { id },
    data: {
      ...data,
      prixOptions:
        data.prixOptions === null ? Prisma.JsonNull : data.prixOptions,
    },
  });
}

// Activer ou désactiver un produit
export async function toggleActif(id: number) {
  const produit = await prisma.catalogue.findUnique({ where: { id } });
  if (!produit) throw new Error(`Produit ${id} introuvable`);

  return await prisma.catalogue.update({
    where: { id },
    data: { isActif: !produit.isActif },
  });
}

// Ajouter une photo à un produit
export async function ajouterPhoto(idCatalogue: number, photoUrl: string) {
  return await prisma.photo.create({
    data: { idCatalogue, photoUrl },
  });
}

// Supprimer une photo
export async function supprimerPhoto(id: number) {
  return await prisma.photo.delete({ where: { id } });
}
