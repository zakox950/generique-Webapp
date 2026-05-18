// src/__tests__/catalogue.service.test.ts
import {
  getProduitActifs,
  getProduitById,
  getTousProduits,
  creerProduit,
  modifierProduit,
  toggleActif,
  ajouterPhoto,
  supprimerPhoto,
} from "../lib/services/catalogue.service";
import prisma from "../lib/prisma";

const prismaMock = prisma as jest.Mocked<typeof prisma>;

// =========================================
// DONNÉES DE TEST
// =========================================

const produitMock = {
  id: 1,
  nom: "Croissant",
  prix: 1.5,
  ingredient: "Beurre, farine",
  description: "Croissant artisanal",
  isActif: true,
  modeVente: "make_to_order",
  stockDisponible: 0,
  dateDebutActif: null,
  dateFinActif: null,
  prixOptions: null,
};

const photoMock = {
  id: 1,
  idCatalogue: 1,
  photoUrl: "https://example.com/photo.jpg",
};

// =========================================
// TESTS getProduitActifs
// =========================================

describe("getProduitActifs", () => {
  it("retourne les produits actifs avec leurs photos", async () => {
    const produitAvecPhotos = { ...produitMock, photos: [photoMock] };
    (prismaMock.catalogue.findMany as jest.Mock).mockResolvedValue([
      produitAvecPhotos,
    ]);

    const result = await getProduitActifs();

    expect(prismaMock.catalogue.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.catalogue.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActif: true }),
        include: { photos: true },
      }),
    );
    expect(result).toHaveLength(1);
    expect(result[0].nom).toBe("Croissant");
  });

  it("retourne un tableau vide si aucun produit actif", async () => {
    (prismaMock.catalogue.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getProduitActifs();

    expect(result).toHaveLength(0);
  });
});

// =========================================
// TESTS getProduitById
// =========================================

describe("getProduitById", () => {
  it("retourne un produit par son id", async () => {
    const produitAvecPhotos = { ...produitMock, photos: [photoMock] };
    (prismaMock.catalogue.findUnique as jest.Mock).mockResolvedValue(
      produitAvecPhotos,
    );

    const result = await getProduitById(1);

    expect(prismaMock.catalogue.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { photos: true },
    });
    expect(result?.nom).toBe("Croissant");
  });

  it("retourne null si le produit n'existe pas", async () => {
    (prismaMock.catalogue.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await getProduitById(999);

    expect(result).toBeNull();
  });
});

// =========================================
// TESTS getTousProduits
// =========================================

describe("getTousProduits", () => {
  it("retourne tous les produits avec photos et limites", async () => {
    const produitComplet = {
      ...produitMock,
      photos: [],
      dayLimits: [],
      weekLimits: [],
    };
    (prismaMock.catalogue.findMany as jest.Mock).mockResolvedValue([
      produitComplet,
    ]);

    const result = await getTousProduits();

    expect(prismaMock.catalogue.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          photos: true,
          dayLimits: expect.any(Object),
          weekLimits: expect.any(Object),
        }),
      }),
    );
    expect(result).toHaveLength(1);
  });
});

// =========================================
// TESTS creerProduit
// =========================================

describe("creerProduit", () => {
  it("crée un produit avec les données fournies", async () => {
    (prismaMock.catalogue.create as jest.Mock).mockResolvedValue(produitMock);

    const data = {
      nom: "Croissant",
      prix: 1.5,
      ingredient: "Beurre, farine",
    };

    const result = await creerProduit(data);

    expect(prismaMock.catalogue.create).toHaveBeenCalledTimes(1);
    expect(result.nom).toBe("Croissant");
  });
});

// =========================================
// TESTS modifierProduit
// =========================================

describe("modifierProduit", () => {
  it("modifie un produit existant", async () => {
    const produitModifie = { ...produitMock, prix: 2.0 };
    (prismaMock.catalogue.update as jest.Mock).mockResolvedValue(
      produitModifie,
    );

    const result = await modifierProduit(1, { prix: 2.0 });

    expect(prismaMock.catalogue.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } }),
    );
    expect(result.prix).toBe(2.0);
  });
});

// =========================================
// TESTS toggleActif
// =========================================

describe("toggleActif", () => {
  it("désactive un produit actif", async () => {
    (prismaMock.catalogue.findUnique as jest.Mock).mockResolvedValue(
      produitMock,
    );
    (prismaMock.catalogue.update as jest.Mock).mockResolvedValue({
      ...produitMock,
      isActif: false,
    });

    const result = await toggleActif(1);

    expect(prismaMock.catalogue.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isActif: false },
    });
    expect(result.isActif).toBe(false);
  });

  it("active un produit inactif", async () => {
    const produitInactif = { ...produitMock, isActif: false };
    (prismaMock.catalogue.findUnique as jest.Mock).mockResolvedValue(
      produitInactif,
    );
    (prismaMock.catalogue.update as jest.Mock).mockResolvedValue({
      ...produitMock,
      isActif: true,
    });

    const result = await toggleActif(1);

    expect(prismaMock.catalogue.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isActif: true },
    });
    expect(result.isActif).toBe(true);
  });

  it("throw une erreur si le produit n'existe pas", async () => {
    (prismaMock.catalogue.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(toggleActif(999)).rejects.toThrow("Produit 999 introuvable");
  });
});

// =========================================
// TESTS photos
// =========================================

describe("ajouterPhoto", () => {
  it("ajoute une photo à un produit", async () => {
    (prismaMock.photo.create as jest.Mock).mockResolvedValue(photoMock);

    const result = await ajouterPhoto(1, "https://example.com/photo.jpg");

    expect(prismaMock.photo.create).toHaveBeenCalledWith({
      data: { idCatalogue: 1, photoUrl: "https://example.com/photo.jpg" },
    });
    expect(result.id).toBe(1);
  });
});

describe("supprimerPhoto", () => {
  it("supprime une photo par son id", async () => {
    (prismaMock.photo.delete as jest.Mock).mockResolvedValue(photoMock);

    await supprimerPhoto(1);

    expect(prismaMock.photo.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
