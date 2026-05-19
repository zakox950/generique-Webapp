import { z } from "zod";

// =========================================
// SCHÉMA ITEM DEVIS
// Partagé avec commande.validator.ts
// =========================================

const ItemDevisSchema = z.object({
  idCatalogue: z
    .number()
    .int("L'id du produit doit être un entier")
    .positive("L'id du produit doit être positif"),

  quantite: z
    .number()
    .int("La quantité doit être un entier")
    .min(1, "La quantité doit être au moins 1"),

  // Options choisies par le client ex: { "taille": "10 personnes", "parfum": "Framboise" }
  options: z.record(z.string(), z.string()).optional(),
});

// =========================================
// CRÉATION D'UN DEVIS
// POST /api/devis
// =========================================

export const CreateDevisSchema = z
  .object({
    nom: z
      .string()
      .min(1, "Le nom est obligatoire")
      .max(255, "Le nom ne peut pas dépasser 255 caractères"),

    mail: z.string().email("L'adresse email est invalide").max(255),

    numeroTel: z
      .string()
      .min(6, "Le numéro de téléphone est trop court")
      .max(20, "Le numéro de téléphone est trop long")
      .regex(
        /^[+\d\s\-().]+$/,
        "Le numéro de téléphone contient des caractères invalides",
      ),

    // Date idéale souhaitée par le client
    dateSouhaitee: z.coerce
      .date()
      .refine(
        (date) => date > new Date(),
        "La date souhaitée doit être dans le futur",
      ),

    // Date de retrait — peut différer de dateSouhaitee après validation admin
    dateRetrait: z.coerce
      .date()
      .refine(
        (date) => date > new Date(),
        "La date de retrait doit être dans le futur",
      ),

    typeEvenement: z
      .string()
      .max(255, "Le type d'événement ne peut pas dépasser 255 caractères")
      .optional(),

    noteClient: z
      .string()
      .max(2000, "La note ne peut pas dépasser 2000 caractères")
      .optional(),

    items: z
      .array(ItemDevisSchema)
      .min(1, "Le devis doit contenir au moins un produit")
      .max(50, "Le devis ne peut pas contenir plus de 50 produits différents"),
  })
  .refine((data) => data.dateRetrait >= data.dateSouhaitee, {
    message: "La date de retrait ne peut pas être avant la date souhaitée",
    path: ["dateRetrait"],
  });

export type CreateDevisInput = z.infer<typeof CreateDevisSchema>;
