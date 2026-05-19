import { z } from "zod";

// =========================================
// SCHÉMA ITEM COMMANDE
// =========================================

const ItemCommandeSchema = z.object({
  idCatalogue: z
    .number()
    .int("L'id du produit doit être un entier")
    .positive("L'id du produit doit être positif"),

  quantite: z
    .number()
    .int("La quantité doit être un entier")
    .min(1, "La quantité doit être au moins 1")
    .max(500, "La quantité ne peut pas dépasser 500 pièces par produit"),

  // Options choisies par le client ex: { "taille": "10 personnes", "parfum": "Framboise" }
  options: z.record(z.string(), z.string()).optional(),
});

// =========================================
// CRÉATION D'UNE COMMANDE DIRECTE
// POST /api/commande
// =========================================

export const CreateCommandeSchema = z.object({
  nom: z
    .string()
    .min(1, "Le nom est obligatoire")
    .max(255, "Le nom ne peut pas dépasser 255 caractères"),

  mail: z.string().email("L'adresse email est invalide").max(255),

  // La date de retrait est envoyée en string ISO depuis le frontend
  // z.coerce.date() la convertit automatiquement en objet Date
  dateRetrait: z.coerce.date().refine((date) => {
    // La date de retrait doit être aujourd'hui ou dans le futur
    // Le délai minimum réel est vérifié dans le service
    const aujourd_hui = new Date();
    aujourd_hui.setHours(0, 0, 0, 0);
    return date >= aujourd_hui;
  }, "La date de retrait ne peut pas être dans le passé"),

  noteClient: z
    .string()
    .max(2000, "La note ne peut pas dépasser 2000 caractères")
    .optional(),

  // Choix du mode de paiement par le client
  // Uniquement pertinent si mode_paiement = 'au_choix_client' dans Config
  paiementChoisi: z
    .enum(["en_ligne", "sur_place"], {
      error: () => ({
        message: "Mode de paiement invalide — en_ligne ou sur_place",
      }),
    })
    .optional(),

  items: z
    .array(ItemCommandeSchema)
    .min(1, "La commande doit contenir au moins un produit")
    .max(50, "La commande ne peut pas contenir plus de 50 produits différents"),
});

export type CreateCommandeInput = z.infer<typeof CreateCommandeSchema>;

// =========================================
// VALIDATION DU PANIER CÔTÉ CLIENT
// Utilisé pour vérifier le seuil devis avant soumission
// =========================================

export const PanierSchema = z.object({
  items: z
    .array(ItemCommandeSchema)
    .min(1, "Le panier doit contenir au moins un produit"),
});

export type PanierInput = z.infer<typeof PanierSchema>;
