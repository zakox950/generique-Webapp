import prisma from "../prisma";
import {
  getDelaiRetrait,
  getModePaiement,
  getLimiteParCommande,
} from "../config";
import { verifierLimites } from "./limites.service";
import { verifierStock, decrementerStock } from "./stock.service";
import {
  sendConfirmationCommande,
  sendNouvelleCommandeAdmin,
} from "./mail.service";

// =========================================
// TYPES
// =========================================

type ItemCommande = {
  idCatalogue: number;
  quantite: number;
  options?: object;
};

type CreerCommandeData = {
  nom: string;
  mail: string;
  dateRetrait: Date;
  noteClient?: string;
  paiementChoisi?: string;
  items: ItemCommande[];
};

// =========================================
// LECTURE — côté admin
// =========================================

// Toutes les commandes avec leurs items pour le dashboard admin
export async function getCommandes() {
  return await prisma.commandeDirect.findMany({
    include: {
      items: {
        include: { catalogue: true },
      },
    },
    orderBy: { dateCommande: "desc" },
  });
}

// Une commande par son id avec ses items
export async function getCommandeById(id: number) {
  return await prisma.commandeDirect.findUnique({
    where: { id },
    include: {
      items: {
        include: { catalogue: { include: { photos: true } } },
      },
    },
  });
}

// Commandes d'une date de retrait précise
export async function getCommandesByDateRetrait(dateRetrait: Date) {
  return await prisma.commandeDirect.findMany({
    where: { dateRetrait },
    include: {
      items: {
        include: { catalogue: true },
      },
    },
  });
}

// =========================================
// CRÉATION — logique métier complète
// =========================================

export async function creerCommande(data: CreerCommandeData) {
  // 1. Vérifier le délai minimum de retrait
  const delaiJours = await getDelaiRetrait();
  const dateMinRetrait = new Date();
  dateMinRetrait.setDate(dateMinRetrait.getDate() + delaiJours);
  dateMinRetrait.setHours(0, 0, 0, 0);

  if (data.dateRetrait < dateMinRetrait) {
    throw new Error(
      `La date de retrait doit être au minimum dans ${delaiJours} jours`,
    );
  }

  // 2. Vérifier la limite de pièces par commande
  const limiteParCommande = await getLimiteParCommande();
  const totalPieces = data.items.reduce((acc, item) => acc + item.quantite, 0);

  if (limiteParCommande > 0 && totalPieces > limiteParCommande) {
    throw new Error(
      `Nombre de pièces maximum par commande : ${limiteParCommande}`,
    );
  }

  // 3. Récupérer les produits et calculer le prix total
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

    // 4. Vérifier les limites de production (jour + semaine)
    const limites = await verifierLimites(
      item.idCatalogue,
      item.quantite,
      data.dateRetrait,
    );
    if (!limites.ok) throw new Error(limites.message);

    // 5. Vérifier le stock si make_to_stock
    const stock = await verifierStock(item.idCatalogue, item.quantite);
    if (!stock.ok) throw new Error(stock.message);

    // Calcul du prix unitaire avec options
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

  // 6. Récupérer le mode de paiement
  const modePaiement = await getModePaiement();
  const paiementChoisi =
    data.paiementChoisi ??
    (modePaiement === "en_ligne" ? "en_ligne" : "sur_place");

  // 7. Créer la commande et ses items en une seule transaction
  const commande = await prisma.$transaction(async (tx) => {
    const nouvelleCommande = await tx.commandeDirect.create({
      data: {
        nom: data.nom,
        mail: data.mail,
        dateRetrait: data.dateRetrait,
        prixTotal,
        noteClient: data.noteClient,
        paiementChoisi,
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

    // 8. Décrémenter le stock pour les produits make_to_stock
    for (const item of itemsAvecPrix) {
      await decrementerStock(item.idCatalogue, item.quantite);
    }

    return nouvelleCommande;
  });

  // 9. Envoyer les emails de confirmation
  await sendConfirmationCommande(commande);
  await sendNouvelleCommandeAdmin(commande);

  return commande;
}

// =========================================
// SUPPRESSION — côté admin
// =========================================

export async function supprimerCommande(id: number) {
  // Supprime d'abord les items liés
  await prisma.catalogueItem.deleteMany({ where: { idCommande: id } });
  return await prisma.commandeDirect.delete({ where: { id } });
}
