// src/__tests__/validators.test.ts
import {
  CreateCommandeSchema,
  PanierSchema,
} from "../validators/commande.validator";
import { CreateDevisSchema } from "../validators/devis.validator";
import {
  CreateCatalogueSchema,
  UpdateCatalogueSchema,
  AddPhotoSchema,
} from "../validators/catalogue.validator";
import {
  PatchCommandeSchema,
  PatchDevisSchema,
  PatchConfigSchema,
  PatchStockSchema,
  SetLimiteSchema,
} from "../validators/admin.validator";

// =========================================
// COMMANDE VALIDATOR
// =========================================

describe("CreateCommandeSchema", () => {
  const itemValide = { idCatalogue: 1, quantite: 2 };
  const dateValide = new Date(Date.now() + 86400000 * 3); // dans 3 jours

  it("accepte une commande valide", () => {
    const result = CreateCommandeSchema.safeParse({
      nom: "Anass",
      mail: "anass@test.be",
      dateRetrait: dateValide.toISOString(),
      items: [itemValide],
    });
    expect(result.success).toBe(true);
  });

  it("rejette un nom vide", () => {
    const result = CreateCommandeSchema.safeParse({
      nom: "",
      mail: "anass@test.be",
      dateRetrait: dateValide.toISOString(),
      items: [itemValide],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("nom");
    }
  });

  it("rejette un email invalide", () => {
    const result = CreateCommandeSchema.safeParse({
      nom: "Anass",
      mail: "pasunemail",
      dateRetrait: dateValide.toISOString(),
      items: [itemValide],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("mail");
    }
  });

  it("rejette une date dans le passé", () => {
    const datePassee = new Date(Date.now() - 86400000); // hier
    const result = CreateCommandeSchema.safeParse({
      nom: "Anass",
      mail: "anass@test.be",
      dateRetrait: datePassee.toISOString(),
      items: [itemValide],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("dateRetrait");
    }
  });

  it("rejette un panier vide", () => {
    const result = CreateCommandeSchema.safeParse({
      nom: "Anass",
      mail: "anass@test.be",
      dateRetrait: dateValide.toISOString(),
      items: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("items");
    }
  });

  it("rejette une quantité à 0", () => {
    const result = CreateCommandeSchema.safeParse({
      nom: "Anass",
      mail: "anass@test.be",
      dateRetrait: dateValide.toISOString(),
      items: [{ idCatalogue: 1, quantite: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it("accepte un paiementChoisi valide", () => {
    const result = CreateCommandeSchema.safeParse({
      nom: "Anass",
      mail: "anass@test.be",
      dateRetrait: dateValide.toISOString(),
      items: [itemValide],
      paiementChoisi: "en_ligne",
    });
    expect(result.success).toBe(true);
  });

  it("rejette un paiementChoisi invalide", () => {
    const result = CreateCommandeSchema.safeParse({
      nom: "Anass",
      mail: "anass@test.be",
      dateRetrait: dateValide.toISOString(),
      items: [itemValide],
      paiementChoisi: "bitcoin",
    });
    expect(result.success).toBe(false);
  });
});

describe("PanierSchema", () => {
  it("accepte un panier valide", () => {
    const result = PanierSchema.safeParse({
      items: [{ idCatalogue: 1, quantite: 3 }],
    });
    expect(result.success).toBe(true);
  });

  it("rejette un panier vide", () => {
    const result = PanierSchema.safeParse({ items: [] });
    expect(result.success).toBe(false);
  });
});

// =========================================
// DEVIS VALIDATOR
// =========================================

describe("CreateDevisSchema", () => {
  const dateValide = new Date(Date.now() + 86400000 * 5); // dans 5 jours
  const dateSouhaiteeValide = new Date(Date.now() + 86400000 * 4); // dans 4 jours

  const devisValide = {
    nom: "Anass",
    mail: "anass@test.be",
    numeroTel: "+32 478 12 34 56",
    dateRetrait: dateValide.toISOString(),
    dateSouhaitee: dateSouhaiteeValide.toISOString(),
    items: [{ idCatalogue: 1, quantite: 5 }],
  };

  it("accepte un devis valide", () => {
    const result = CreateDevisSchema.safeParse(devisValide);
    expect(result.success).toBe(true);
  });

  it("rejette un numéro de téléphone invalide", () => {
    const result = CreateDevisSchema.safeParse({
      ...devisValide,
      numeroTel: "abc",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("numeroTel");
    }
  });

  it("rejette une dateSouhaitee dans le passé", () => {
    const result = CreateDevisSchema.safeParse({
      ...devisValide,
      dateSouhaitee: new Date(Date.now() - 86400000).toISOString(),
    });
    expect(result.success).toBe(false);
  });

  it("rejette si dateRetrait avant dateSouhaitee", () => {
    const result = CreateDevisSchema.safeParse({
      ...devisValide,
      dateRetrait: dateSouhaiteeValide.toISOString(),
      dateSouhaitee: dateValide.toISOString(),
    });
    expect(result.success).toBe(false);
  });

  it("accepte un typeEvenement optionnel", () => {
    const result = CreateDevisSchema.safeParse({
      ...devisValide,
      typeEvenement: "Mariage",
    });
    expect(result.success).toBe(true);
  });

  it("accepte des options sur un item", () => {
    const result = CreateDevisSchema.safeParse({
      ...devisValide,
      items: [
        { idCatalogue: 1, quantite: 5, options: { taille: "10 personnes" } },
      ],
    });
    expect(result.success).toBe(true);
  });
});

// =========================================
// CATALOGUE VALIDATOR
// =========================================

describe("CreateCatalogueSchema", () => {
  const produitValide = {
    nom: "Croissant",
    prix: 1.5,
  };

  it("accepte un produit valide", () => {
    const result = CreateCatalogueSchema.safeParse(produitValide);
    expect(result.success).toBe(true);
  });

  it("rejette un nom vide", () => {
    const result = CreateCatalogueSchema.safeParse({
      ...produitValide,
      nom: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejette un prix négatif", () => {
    const result = CreateCatalogueSchema.safeParse({
      ...produitValide,
      prix: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejette un prix à 0", () => {
    const result = CreateCatalogueSchema.safeParse({
      ...produitValide,
      prix: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejette un modeVente invalide", () => {
    const result = CreateCatalogueSchema.safeParse({
      ...produitValide,
      modeVente: "livraison_express",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si dateDebutActif après dateFinActif", () => {
    const debut = new Date(Date.now() + 86400000 * 10);
    const fin = new Date(Date.now() + 86400000 * 5);
    const result = CreateCatalogueSchema.safeParse({
      ...produitValide,
      dateDebutActif: debut.toISOString(),
      dateFinActif: fin.toISOString(),
    });
    expect(result.success).toBe(false);
  });

  it("accepte un stockDisponible à 0", () => {
    const result = CreateCatalogueSchema.safeParse({
      ...produitValide,
      modeVente: "make_to_stock",
      stockDisponible: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rejette un stockDisponible négatif", () => {
    const result = CreateCatalogueSchema.safeParse({
      ...produitValide,
      stockDisponible: -5,
    });
    expect(result.success).toBe(false);
  });
});

describe("UpdateCatalogueSchema", () => {
  it("accepte une modification partielle", () => {
    const result = UpdateCatalogueSchema.safeParse({ prix: 2.5 });
    expect(result.success).toBe(true);
  });

  it("accepte prixOptions à null pour supprimer les variantes", () => {
    const result = UpdateCatalogueSchema.safeParse({ prixOptions: null });
    expect(result.success).toBe(true);
  });

  it("rejette un prix négatif", () => {
    const result = UpdateCatalogueSchema.safeParse({ prix: -1 });
    expect(result.success).toBe(false);
  });
});

describe("AddPhotoSchema", () => {
  it("accepte une URL valide", () => {
    const result = AddPhotoSchema.safeParse({
      photoUrl: "https://example.com/photo.jpg",
    });
    expect(result.success).toBe(true);
  });

  it("rejette une URL invalide", () => {
    const result = AddPhotoSchema.safeParse({ photoUrl: "pasuneurl" });
    expect(result.success).toBe(false);
  });
});

// =========================================
// ADMIN VALIDATOR
// =========================================

describe("PatchCommandeSchema", () => {
  it("accepte l'action marquer_prete", () => {
    const result = PatchCommandeSchema.safeParse({ action: "marquer_prete" });
    expect(result.success).toBe(true);
  });

  it("rejette une action invalide", () => {
    const result = PatchCommandeSchema.safeParse({ action: "supprimer" });
    expect(result.success).toBe(false);
  });
});

describe("PatchDevisSchema", () => {
  it("accepte l'action valider sans note", () => {
    const result = PatchDevisSchema.safeParse({ action: "valider" });
    expect(result.success).toBe(true);
  });

  it("accepte l'action valider avec note", () => {
    const result = PatchDevisSchema.safeParse({
      action: "valider",
      noteAdmin: "Devis accepté",
    });
    expect(result.success).toBe(true);
  });

  it("accepte l'action refuser avec note", () => {
    const result = PatchDevisSchema.safeParse({
      action: "refuser",
      noteAdmin: "Impossible pour cette date",
    });
    expect(result.success).toBe(true);
  });

  it("accepte l'action acompte_paye avec montant", () => {
    const result = PatchDevisSchema.safeParse({
      action: "acompte_paye",
      montant: 150,
    });
    expect(result.success).toBe(true);
  });

  it("rejette acompte_paye sans montant", () => {
    const result = PatchDevisSchema.safeParse({ action: "acompte_paye" });
    expect(result.success).toBe(false);
  });

  it("rejette acompte_paye avec montant négatif", () => {
    const result = PatchDevisSchema.safeParse({
      action: "acompte_paye",
      montant: -50,
    });
    expect(result.success).toBe(false);
  });

  it("accepte l'action modifier_prix", () => {
    const result = PatchDevisSchema.safeParse({
      action: "modifier_prix",
      nouveauPrix: 350,
    });
    expect(result.success).toBe(true);
  });

  it("rejette modifier_prix sans nouveauPrix", () => {
    const result = PatchDevisSchema.safeParse({ action: "modifier_prix" });
    expect(result.success).toBe(false);
  });

  it("accepte l'action modifier_date_retrait", () => {
    const result = PatchDevisSchema.safeParse({
      action: "modifier_date_retrait",
      dateRetrait: new Date(Date.now() + 86400000 * 7).toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it("rejette une action invalide", () => {
    const result = PatchDevisSchema.safeParse({ action: "annuler_tout" });
    expect(result.success).toBe(false);
  });
});

describe("PatchConfigSchema", () => {
  it("accepte une variable valide", () => {
    const result = PatchConfigSchema.safeParse({
      nameVariable: "seuil_devis",
      valeur: "15",
    });
    expect(result.success).toBe(true);
  });

  it("rejette un nameVariable vide", () => {
    const result = PatchConfigSchema.safeParse({
      nameVariable: "",
      valeur: "15",
    });
    expect(result.success).toBe(false);
  });

  it("accepte une valeur vide string", () => {
    const result = PatchConfigSchema.safeParse({
      nameVariable: "boutique_nom",
      valeur: "",
    });
    expect(result.success).toBe(true);
  });
});

describe("PatchStockSchema", () => {
  it("accepte reapprovisionner avec quantite positive", () => {
    const result = PatchStockSchema.safeParse({
      action: "reapprovisionner",
      quantite: 10,
    });
    expect(result.success).toBe(true);
  });

  it("rejette reapprovisionner avec quantite à 0", () => {
    const result = PatchStockSchema.safeParse({
      action: "reapprovisionner",
      quantite: 0,
    });
    expect(result.success).toBe(false);
  });

  it("accepte set_stock avec quantite à 0", () => {
    const result = PatchStockSchema.safeParse({
      action: "set_stock",
      quantite: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rejette set_stock avec quantite négative", () => {
    const result = PatchStockSchema.safeParse({
      action: "set_stock",
      quantite: -5,
    });
    expect(result.success).toBe(false);
  });
});

describe("SetLimiteSchema", () => {
  it("accepte une limite journalière valide", () => {
    const result = SetLimiteSchema.safeParse({
      type: "jour",
      valeur: 20,
      date: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it("accepte une limite hebdomadaire valide", () => {
    const result = SetLimiteSchema.safeParse({
      type: "semaine",
      valeur: 100,
      date: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it("rejette un type invalide", () => {
    const result = SetLimiteSchema.safeParse({
      type: "mois",
      valeur: 100,
      date: new Date().toISOString(),
    });
    expect(result.success).toBe(false);
  });

  it("rejette une valeur à 0", () => {
    const result = SetLimiteSchema.safeParse({
      type: "jour",
      valeur: 0,
      date: new Date().toISOString(),
    });
    expect(result.success).toBe(false);
  });
});
