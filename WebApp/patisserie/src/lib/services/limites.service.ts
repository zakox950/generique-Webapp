import prisma from "../prisma";

// =========================================
// VÉRIFICATION DES LIMITES DE PRODUCTION
// Les totaux sont calculés via SUM à la volée
// jamais stockés en base pour éviter les incohérences
// =========================================

export async function verifierLimiteJour(
  idCatalogue: number,
  quantiteDemandee: number,
  dateRetrait: Date,
): Promise<{ ok: boolean; message?: string }> {
  const limite = await prisma.dayLimit.findFirst({
    where: { idCatalogue, isActif: true, dayStart: dateRetrait },
  });

  if (!limite) return { ok: true };

  // Deux requêtes séparées — pas de .then() imbriqué dans un where
  const commandeIds = await prisma.commandeDirect.findMany({
    where: { dateRetrait },
    select: { id: true },
  });

  const dejaCommande = await prisma.catalogueItem.aggregate({
    where: {
      idCatalogue,
      idCommande: { in: commandeIds.map((c) => c.id) },
    },
    _sum: { quantite: true },
  });

  const totalDejaCommande = Number(dejaCommande._sum?.quantite ?? 0);
  const totalApresCommande = totalDejaCommande + quantiteDemandee;

  if (totalApresCommande > limite.limitPerDay) {
    return {
      ok: false,
      message: `Limite journalière atteinte pour ce produit. Disponible : ${limite.limitPerDay - totalDejaCommande} pièces`,
    };
  }

  return { ok: true };
}

export async function verifierLimiteSemaine(
  idCatalogue: number,
  quantiteDemandee: number,
  dateRetrait: Date,
): Promise<{ ok: boolean; message?: string }> {
  const debutSemaine = new Date(dateRetrait);
  const jour = debutSemaine.getDay();
  const diff = debutSemaine.getDate() - jour + (jour === 0 ? -6 : 1);
  debutSemaine.setDate(diff);
  debutSemaine.setHours(0, 0, 0, 0);

  const finSemaine = new Date(debutSemaine);
  finSemaine.setDate(debutSemaine.getDate() + 6);
  finSemaine.setHours(23, 59, 59, 999);

  const limite = await prisma.weekLimit.findFirst({
    where: { idCatalogue, isActif: true, weekStart: debutSemaine },
  });

  if (!limite) return { ok: true };

  // Deux requêtes séparées — pas de .then() imbriqué dans un where
  const commandeIds = await prisma.commandeDirect.findMany({
    where: {
      dateRetrait: { gte: debutSemaine, lte: finSemaine },
    },
    select: { id: true },
  });

  const dejaCommande = await prisma.catalogueItem.aggregate({
    where: {
      idCatalogue,
      idCommande: { in: commandeIds.map((c) => c.id) },
    },
    _sum: { quantite: true },
  });

  const totalDejaCommande = Number(dejaCommande._sum?.quantite ?? 0);
  const totalApresCommande = totalDejaCommande + quantiteDemandee;

  if (totalApresCommande > limite.limitPerWeek) {
    return {
      ok: false,
      message: `Limite hebdomadaire atteinte pour ce produit. Disponible : ${limite.limitPerWeek - totalDejaCommande} pièces`,
    };
  }

  return { ok: true };
}

export async function verifierLimites(
  idCatalogue: number,
  quantiteDemandee: number,
  dateRetrait: Date,
): Promise<{ ok: boolean; message?: string }> {
  const limiteJour = await verifierLimiteJour(
    idCatalogue,
    quantiteDemandee,
    dateRetrait,
  );
  if (!limiteJour.ok) return limiteJour;

  const limiteSemaine = await verifierLimiteSemaine(
    idCatalogue,
    quantiteDemandee,
    dateRetrait,
  );
  if (!limiteSemaine.ok) return limiteSemaine;

  return { ok: true };
}

// =========================================
// GESTION DES LIMITES — côté admin
// =========================================

export async function setLimiteJour(
  idCatalogue: number,
  limitPerDay: number,
  dayStart: Date,
) {
  const existing = await prisma.dayLimit.findFirst({
    where: { idCatalogue, dayStart },
  });

  return await prisma.dayLimit.upsert({
    where: { id: existing?.id ?? 0 },
    update: { limitPerDay, isActif: true },
    create: { idCatalogue, limitPerDay, dayStart, isActif: true },
  });
}

export async function setLimiteSemaine(
  idCatalogue: number,
  limitPerWeek: number,
  weekStart: Date,
) {
  const existing = await prisma.weekLimit.findFirst({
    where: { idCatalogue, weekStart },
  });

  return await prisma.weekLimit.upsert({
    where: { id: existing?.id ?? 0 },
    update: { limitPerWeek, isActif: true },
    create: { idCatalogue, limitPerWeek, weekStart, isActif: true },
  });
}

export async function desactiverLimiteJour(id: number) {
  return await prisma.dayLimit.update({
    where: { id },
    data: { isActif: false },
  });
}

export async function desactiverLimiteSemaine(id: number) {
  return await prisma.weekLimit.update({
    where: { id },
    data: { isActif: false },
  });
}
