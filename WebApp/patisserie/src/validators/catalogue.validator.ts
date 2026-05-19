import { z } from "zod";

// =========================================
// SCHÉMA DE BASE — champs partagés
// =========================================

// Les options de prix ont un format précis :
// { "taille": { "6 personnes": 0, "10 personnes": 15.00 } }
const PrixOptionsSchema = z.record(
  z.string(),
  z.record(
    z.string(),
    z.number().min(0, "Le surcoût ne peut pas être négatif"),
  ),
);

// =========================================
// CRÉATION D'UN PRODUIT
// POST /api/admin/catalogue
// =========================================

export const CreateCatalogueSchema = z
  .object({
    nom: z
      .string()
      .min(1, "Le nom est obligatoire")
      .max(255, "Le nom ne peut pas dépasser 255 caractères"),

    prix: z
      .number()
      .positive("Le prix doit être positif")
      .multipleOf(0.01, "Le prix ne peut pas avoir plus de 2 décimales"),

    ingredient: z.string().max(5000).optional(),

    description: z.string().max(5000).optional(),

    modeVente: z
      .enum(["make_to_order", "make_to_stock"], {
        error: () => ({
          message: "Mode de vente invalide — make_to_order ou make_to_stock",
        }),
      })
      .default("make_to_order"),

    // Uniquement pertinent si modeVente = make_to_stock
    stockDisponible: z
      .number()
      .int("Le stock doit être un entier")
      .min(0, "Le stock ne peut pas être négatif")
      .default(0),

    // Produits saisonniers — les deux sont optionnels
    dateDebutActif: z.coerce.date().optional(),
    dateFinActif: z.coerce.date().optional(),

    // Variantes produit — optionnel
    prixOptions: PrixOptionsSchema.optional(),
  })
  .refine(
    (data) => {
      // Si les deux dates sont renseignées, dateDebut doit être avant dateFin
      if (data.dateDebutActif && data.dateFinActif) {
        return data.dateDebutActif < data.dateFinActif;
      }
      return true;
    },
    {
      message: "La date de début doit être antérieure à la date de fin",
      path: ["dateDebutActif"],
    },
  );

export type CreateCatalogueInput = z.infer<typeof CreateCatalogueSchema>;

// =========================================
// MODIFICATION D'UN PRODUIT
// PATCH /api/admin/catalogue/[id]
// Tous les champs sont optionnels — on ne modifie que ce qu'on envoie
// =========================================

export const UpdateCatalogueSchema = z
  .object({
    nom: z.string().min(1, "Le nom ne peut pas être vide").max(255).optional(),

    prix: z
      .number()
      .positive("Le prix doit être positif")
      .multipleOf(0.01)
      .optional(),

    ingredient: z.string().max(5000).optional(),

    description: z.string().max(5000).optional(),

    modeVente: z.enum(["make_to_order", "make_to_stock"]).optional(),

    stockDisponible: z
      .number()
      .int("Le stock doit être un entier")
      .min(0, "Le stock ne peut pas être négatif")
      .optional(),

    // nullable — on peut supprimer les dates saisonnières
    dateDebutActif: z.coerce.date().nullable().optional(),
    dateFinActif: z.coerce.date().nullable().optional(),

    // nullable — on peut supprimer les options
    prixOptions: PrixOptionsSchema.nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.dateDebutActif && data.dateFinActif) {
        return data.dateDebutActif < data.dateFinActif;
      }
      return true;
    },
    {
      message: "La date de début doit être antérieure à la date de fin",
      path: ["dateDebutActif"],
    },
  );

export type UpdateCatalogueInput = z.infer<typeof UpdateCatalogueSchema>;

// =========================================
// PHOTO
// POST /api/admin/catalogue/[id]/photos
// =========================================

export const AddPhotoSchema = z.object({
  photoUrl: z
    .string()
    .url("L'URL de la photo est invalide")
    .min(1, "L'URL est obligatoire"),
});

export type AddPhotoInput = z.infer<typeof AddPhotoSchema>;
