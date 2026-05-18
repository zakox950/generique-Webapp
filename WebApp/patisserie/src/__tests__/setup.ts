// src/__tests__/setup.ts
// Mock global de Prisma pour tous les tests
// Evite les vraies connexions à la base de données

jest.mock("../lib/prisma", () => ({
  __esModule: true,
  default: {
    catalogue: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    photo: {
      create: jest.fn(),
      delete: jest.fn(),
    },
    commandeDirect: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    catalogueItem: {
      deleteMany: jest.fn(),
      aggregate: jest.fn(),
    },
    devis: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    dayLimit: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
    weekLimit: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
    config: {
      findMany: jest.fn(),
      update: jest.fn(),
    },

    $transaction: jest.fn(),
  },
}));

// Mock de Resend pour les tests mail
jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: "mock-email-id" }),
    },
  })),
}));

// Reset tous les mocks avant chaque test
beforeEach(() => {
  jest.clearAllMocks();
});
