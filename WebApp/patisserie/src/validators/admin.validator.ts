import { z } from "zod";

// =========================================
// COMMANDES — admin
// =========================================

// PATCH /api/admin/commandes/[id]
// L'admin ne peut que marquer une commande comme prête
export const PatchCommandeSchema = z.object({
  action: z.enum(["marquer_prete"]),
});

export type PatchCommandeInput = z.infer<typeof PatchCommandeSchema>;

// =========================================
// DEVIS — admin
// =========================================

// PATCH /api/admin/devis/[id]
// L'admin peut valider, refuser, modifier le prix,
// modifier la date de retrait, ou marquer comme prêt
export const PatchDevisSchema = z.discriminatedUnion("action", [
  // Valider un devis
  z.object({
    action: z.literal("valider"),
    noteAdmin: z.string().optional(),
  }),

  // Refuser un devis
  z.object({
    action: z.literal("refuser"),
    noteAdmin: z.string().optional(),
  }),

  // Marquer l'acompte comme payé
  z.object({
    action: z.literal("acompte_paye"),
    montant: z.number().positive("Le montant doit être positif"),
  }),

  // Marquer la commande comme prête
  z.object({
    action: z.literal("marquer_pret"),
  }),

  // Modifier le prix total
  z.object({
    action: z.literal("modifier_prix"),
    nouveauPrix: z.number().positive("Le prix doit être positif"),
  }),

  // Modifier la date de retrait
  z.object({
    action: z.literal("modifier_date_retrait"),
    dateRetrait: z.coerce.date(),
  }),
]);

export type PatchDevisInput = z.infer<typeof PatchDevisSchema>;

// =========================================
// CATALOGUE — admin
// =========================================

// POST /api/admin/catalogue — créer un produit
export const CreateCatalogueSchema = z.object({
  nom: z.string().min(1, "Le nom est obligatoire").max(255),
  prix: z.number().positive("Le prix doit être positif"),
  ingredient: z.string().optional(),
  description: z.string().optional(),
  modeVente: z
    .enum(["make_to_order", "make_to_stock"])
    .default("make_to_order"),
  dateDebutActif: z.coerce.date().optional(),
  dateFinActif: z.coerce.date().optional(),
  prixOptions: z
    .record(z.string(), z.record(z.string(), z.number()))
    .optional(),
});

export type CreateCatalogueInput = z.infer<typeof CreateCatalogueSchema>;

// PATCH /api/admin/catalogue/[id] — modifier un produit
// Tous les champs sont optionnels — on ne modifie que ce qu'on envoie
export const UpdateCatalogueSchema = z.object({
  nom: z.string().min(1).max(255).optional(),
  prix: z.number().positive().optional(),
  ingredient: z.string().optional(),
  description: z.string().optional(),
  modeVente: z.enum(["make_to_order", "make_to_stock"]).optional(),
  stockDisponible: z.number().int().min(0).optional(),
  dateDebutActif: z.coerce.date().nullable().optional(),
  dateFinActif: z.coerce.date().nullable().optional(),
  prixOptions: z
    .record(z.string(), z.record(z.string(), z.number()))
    .nullable()
    .optional(),
});

export type UpdateCatalogueInput = z.infer<typeof UpdateCatalogueSchema>;

// =========================================
// CONFIG — admin
// =========================================

// PATCH /api/admin/config — modifier une variable de configuration
export const PatchConfigSchema = z.object({
  nameVariable: z.string().min(1, "Le nom de la variable est obligatoire"),
  valeur: z.string().min(0, "La valeur est obligatoire"),
});

export type PatchConfigInput = z.infer<typeof PatchConfigSchema>;

// =========================================
// STOCK — admin
// =========================================

// PATCH /api/admin/stock/[id] — réapprovisionner ou corriger le stock
export const PatchStockSchema = z.discriminatedUnion("action", [
  // Ajouter au stock existant
  z.object({
    action: z.literal("reapprovisionner"),
    quantite: z
      .number()
      .int()
      .positive("La quantité doit être un entier positif"),
  }),

  // Définir le stock à une valeur précise
  z.object({
    action: z.literal("set_stock"),
    quantite: z.number().int().min(0, "Le stock ne peut pas être négatif"),
  }),
]);

export type PatchStockInput = z.infer<typeof PatchStockSchema>;

// =========================================
// LIMITES — admin
// =========================================

// POST /api/admin/catalogue/[id]/limites — définir une limite de production
export const SetLimiteSchema = z.object({
  type: z.enum(["jour", "semaine"]),
  valeur: z.number().int().positive("La limite doit être un entier positif"),
  date: z.coerce.date(),
});

export type SetLimiteInput = z.infer<typeof SetLimiteSchema>;
