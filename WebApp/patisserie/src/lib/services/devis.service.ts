import prisma from "../prisma";
import {
  getDevisExpireDays,
  getAcompteMode,
  getAcompteValeur,
} from "../config";
import {
  sendNouveauDevisClient,
  sendNouveauDevisAdmin,
  sendDevisValide,
  sendDevisRefuse,
  sendDevisPret,
} from "./mail.service";
import { StatutTypeDevis } from "../../../app/generated/prisma/client";

// =========================================
// TYPES
// =========================================

type ItemDevis = {
  idCatalogue: number;
  quantite: number;
  options?: object;
};

type CreerDevisData = {
  nom: string;
  mail: string;
  numeroTel: string;
  dateRetrait: Date;
  dateSouhaitee: Date;
  typeEvenement?: string;
  noteClient?: string;
  items: ItemDevis[];
};

// =========================================
// LECTURE — côté admin
// =========================================

// Tous les devis avec leurs items
export async function getDevis() {
  return await prisma.devis.findMany({
    include: {
      items: {
        include: { catalogue: true },
      },
    },
    orderBy: { dateCommande: "desc" },
  });
}

// Devis par statut
export async function getDevisByStatut(statut: StatutTypeDevis) {
  return await prisma.devis.findMany({
    where: { statutEnum: statut },
    include: {
      items: {
        include: { catalogue: true },
      },
    },
    orderBy: { dateCommande: "desc" },
  });
}

// Un devis par son id
export async function getDevisById(id: number) {
  return await prisma.devis.findUnique({
    where: { id },
    include: {
      items: {
        include: { catalogue: { include: { photos: true } } },
      },
    },
  });
}

// =========================================
// CRÉATION — logique métier complète
// =========================================

export async function creerDevis(data: CreerDevisData) {
  // 1. Calculer le prix total depuis les items
  let prixTotal = 0;
  type ItemAvecPrix = {
    idCatalogue: number;
    quantite: number;
    prixUnite: number;
    options?: object;
  };
  const itemsAvecPrix: ItemAvecPrix[] = [];

  for (const item of data.items) {
    const produit = await prisma.catalogue.findUnique({
      where: { id: item.idCatalogue },
    });

    if (!produit || !produit.isActif) {
      throw new Error(`Produit ${item.idCatalogue} indisponible`);
    }

    let prixUnite = Number(produit.prix);
    if (item.options && produit.prixOptions) {
      const options = produit.prixOptions as Record<
        string,
        Record<string, number>
      >;
      const choix = item.options as Record<string, string>;
      for (const [cle, valeur] of Object.entries(choix)) {
        if (options[cle]?.[valeur]) {
          prixUnite += options[cle][valeur];
        }
      }
    }

    prixTotal += prixUnite * item.quantite;
    itemsAvecPrix.push({ ...item, prixUnite });
  }

  // 2. Calculer l'acompte selon la config
  const acompteMode = await getAcompteMode();
  const acompteValeur = await getAcompteValeur();

  let acompte = 0;
  if (acompteMode === "pourcentage") {
    acompte = (prixTotal * acompteValeur) / 100;
  } else if (acompteMode === "montant_fixe") {
    acompte = acompteValeur;
  }
  // si 'desactive', acompte reste 0

  // 3. Calculer expireAt
  const expireDays = await getDevisExpireDays();
  const expireAt = new Date();
  expireAt.setDate(expireAt.getDate() + expireDays);

  // 4. Créer le devis et ses items en transaction
  const devis = await prisma.$transaction(async (tx) => {
    return await tx.devis.create({
      data: {
        nom: data.nom,
        mail: data.mail,
        numeroTel: data.numeroTel,
        dateRetrait: data.dateRetrait,
        dateSouhaitee: data.dateSouhaitee,
        typeEvenement: data.typeEvenement,
        noteClient: data.noteClient,
        prixTotal,
        acompte,
        dejaPaye: 0,
        expireAt,
        statutEnum: "en_attente",
        items: {
          create: itemsAvecPrix.map((item) => ({
            idCatalogue: item.idCatalogue,
            quantite: item.quantite,
            prixUnite: item.prixUnite,
            options: item.options ?? undefined,
          })),
        },
      },
      include: {
        items: { include: { catalogue: true } },
      },
    });
  });

  // 5. Envoyer les emails
  await sendNouveauDevisClient(devis);
  await sendNouveauDevisAdmin(devis);

  return devis;
}

// =========================================
// WORKFLOW STATUTS — côté admin
// =========================================

// Valider un devis — passe à 'valide'
export async function validerDevis(id: number, noteAdmin?: string) {
  const devis = await prisma.devis.update({
    where: { id },
    data: {
      statutEnum: "valide",
      noteAdmin: noteAdmin ?? undefined,
    },
    include: { items: { include: { catalogue: true } } },
  });

  await sendDevisValide(devis);
  return devis;
}

// Refuser un devis — passe à 'annule'
export async function refuserDevis(id: number, noteAdmin?: string) {
  const devis = await prisma.devis.update({
    where: { id },
    data: {
      statutEnum: "annule",
      noteAdmin: noteAdmin ?? undefined,
    },
    include: { items: { include: { catalogue: true } } },
  });

  await sendDevisRefuse(devis);
  return devis;
}

// Marquer l'acompte comme payé — passe à 'acompte_paye'
export async function marquerAcomptePaye(id: number, montant: number) {
  return await prisma.devis.update({
    where: { id },
    data: {
      statutEnum: "acompte_paye",
      dejaPaye: montant,
    },
  });
}

// Marquer la commande comme prête — passe à 'pret'
export async function marquerDevisPret(id: number) {
  const devis = await prisma.devis.update({
    where: { id },
    data: { statutEnum: "pret" },
    include: { items: { include: { catalogue: true } } },
  });

  await sendDevisPret(devis);
  return devis;
}

// Modifier le prix total d'un devis avant validation
export async function modifierPrixDevis(id: number, nouveauPrix: number) {
  const acompteMode = await getAcompteMode();
  const acompteValeur = await getAcompteValeur();

  let acompte = 0;
  if (acompteMode === "pourcentage") {
    acompte = (nouveauPrix * acompteValeur) / 100;
  } else if (acompteMode === "montant_fixe") {
    acompte = acompteValeur;
  }

  return await prisma.devis.update({
    where: { id },
    data: { prixTotal: nouveauPrix, acompte },
  });
}

// Modifier la date de retrait d'un devis — réservé à l'admin
export async function modifierDateRetrait(id: number, dateRetrait: Date) {
  return await prisma.devis.update({
    where: { id },
    data: { dateRetrait },
  });
}

// Expirer les devis dont la date expireAt est dépassée
// À appeler via un cron job ou au démarrage du serveur
export async function expireDevisObsoletes() {
  const maintenant = new Date();

  return await prisma.devis.updateMany({
    where: {
      statutEnum: { in: ["en_attente", "valide"] },
      expireAt: { lt: maintenant },
    },
    data: { statutEnum: "expire" },
  });
}
