// src/__tests__/limites.service.test.ts
import {
  verifierLimiteJour,
  verifierLimiteSemaine,
  verifierLimites,
} from "../lib/services/limites.service";
import prisma from "../lib/prisma";

const prismaMock = prisma as jest.Mocked<typeof prisma>;

const dateRetrait = new Date("2025-06-15");

const limiteMock = {
  id: 1,
  idCatalogue: 1,
  limitPerDay: 10,
  isActif: true,
  dayStart: dateRetrait,
};

const limiteSemaineMock = {
  id: 1,
  idCatalogue: 1,
  limitPerWeek: 50,
  isActif: true,
  weekStart: new Date("2025-06-09"),
};

// Remet le mock de findMany avant chaque test
// car jest.clearAllMocks() dans setup.ts l'efface
beforeEach(() => {
  (prismaMock.commandeDirect.findMany as jest.Mock).mockResolvedValue([]);
});

// =========================================
// TESTS verifierLimiteJour
// =========================================

describe("verifierLimiteJour", () => {
  it("retourne ok si pas de limite active", async () => {
    (prismaMock.dayLimit.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await verifierLimiteJour(1, 5, dateRetrait);

    expect(result.ok).toBe(true);
  });

  it("retourne ok si la limite n'est pas atteinte", async () => {
    (prismaMock.dayLimit.findFirst as jest.Mock).mockResolvedValue(limiteMock);
    (prismaMock.commandeDirect.findMany as jest.Mock).mockResolvedValue([
      { id: 1 },
    ]);
    (prismaMock.catalogueItem.aggregate as jest.Mock).mockResolvedValue({
      _sum: { quantite: 3 },
    });

    const result = await verifierLimiteJour(1, 5, dateRetrait);

    expect(result.ok).toBe(true);
  });

  it("retourne une erreur si la limite est dépassée", async () => {
    (prismaMock.dayLimit.findFirst as jest.Mock).mockResolvedValue(limiteMock);
    (prismaMock.commandeDirect.findMany as jest.Mock).mockResolvedValue([
      { id: 1 },
      { id: 2 },
    ]);
    (prismaMock.catalogueItem.aggregate as jest.Mock).mockResolvedValue({
      _sum: { quantite: 8 },
    });

    const result = await verifierLimiteJour(1, 5, dateRetrait);

    expect(result.ok).toBe(false);
    expect(result.message).toContain("journalière");
    expect(result.message).toContain("2");
  });

  it("gère le cas où aucune commande n'existe encore", async () => {
    (prismaMock.dayLimit.findFirst as jest.Mock).mockResolvedValue(limiteMock);
    (prismaMock.commandeDirect.findMany as jest.Mock).mockResolvedValue([]);
    (prismaMock.catalogueItem.aggregate as jest.Mock).mockResolvedValue({
      _sum: { quantite: null },
    });

    const result = await verifierLimiteJour(1, 5, dateRetrait);

    expect(result.ok).toBe(true);
  });
});

// =========================================
// TESTS verifierLimiteSemaine
// =========================================

describe("verifierLimiteSemaine", () => {
  it("retourne ok si pas de limite active", async () => {
    (prismaMock.weekLimit.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await verifierLimiteSemaine(1, 5, dateRetrait);

    expect(result.ok).toBe(true);
  });

  it("retourne ok si la limite hebdomadaire n'est pas atteinte", async () => {
    (prismaMock.weekLimit.findFirst as jest.Mock).mockResolvedValue(
      limiteSemaineMock,
    );
    (prismaMock.commandeDirect.findMany as jest.Mock).mockResolvedValue([
      { id: 1 },
      { id: 2 },
    ]);
    (prismaMock.catalogueItem.aggregate as jest.Mock).mockResolvedValue({
      _sum: { quantite: 20 },
    });

    const result = await verifierLimiteSemaine(1, 10, dateRetrait);

    expect(result.ok).toBe(true);
  });

  it("retourne une erreur si la limite hebdomadaire est dépassée", async () => {
    (prismaMock.weekLimit.findFirst as jest.Mock).mockResolvedValue(
      limiteSemaineMock,
    );
    (prismaMock.commandeDirect.findMany as jest.Mock).mockResolvedValue([
      { id: 1 },
    ]);
    (prismaMock.catalogueItem.aggregate as jest.Mock).mockResolvedValue({
      _sum: { quantite: 45 },
    });

    const result = await verifierLimiteSemaine(1, 10, dateRetrait);

    expect(result.ok).toBe(false);
    expect(result.message).toContain("hebdomadaire");
  });
});

// =========================================
// TESTS verifierLimites (combiné)
// =========================================

describe("verifierLimites", () => {
  it("retourne ok si les deux limites sont respectées", async () => {
    (prismaMock.dayLimit.findFirst as jest.Mock).mockResolvedValue(null);
    (prismaMock.weekLimit.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await verifierLimites(1, 5, dateRetrait);

    expect(result.ok).toBe(true);
  });

  it("retourne l'erreur de la limite journalière en premier", async () => {
    (prismaMock.dayLimit.findFirst as jest.Mock).mockResolvedValue(limiteMock);
    (prismaMock.commandeDirect.findMany as jest.Mock).mockResolvedValue([
      { id: 1 },
      { id: 2 },
    ]);
    (prismaMock.catalogueItem.aggregate as jest.Mock).mockResolvedValue({
      _sum: { quantite: 9 },
    });

    const result = await verifierLimites(1, 5, dateRetrait);

    expect(result.ok).toBe(false);
    expect(result.message).toContain("journalière");
  });
});
