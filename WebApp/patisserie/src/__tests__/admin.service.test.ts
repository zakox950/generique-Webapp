// src/__tests__/admin.service.test.ts
// Tests du service compte administrateur (page Paramètres)

// On mock bcryptjs pour contrôler la comparaison/hash sans coût CPU
jest.mock("bcryptjs", () => ({
  __esModule: true,
  default: {
    compare: jest.fn(),
    hash: jest.fn(),
  },
}));

import {
  getAdminById,
  updateAdminEmail,
  updateAdminPassword,
} from "../lib/services/admin.service";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

const prismaMock = prisma as jest.Mocked<typeof prisma>;
const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;

const adminMock = {
  id: 1,
  email: "admin@patisserie.fr",
  passwordHash: "$2a$12$hashexistant",
  role: "admin",
  createdAt: new Date(),
};

// =========================================
// getAdminById
// =========================================
describe("getAdminById", () => {
  it("retourne l'admin sans le hash de mot de passe", async () => {
    (prismaMock.admin.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: "admin@patisserie.fr",
      role: "admin",
      createdAt: adminMock.createdAt,
    });

    const result = await getAdminById(1);

    expect(prismaMock.admin.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { id: true, email: true, role: true, createdAt: true },
    });
    expect(result).not.toHaveProperty("passwordHash");
    expect(result?.email).toBe("admin@patisserie.fr");
  });
});

// =========================================
// updateAdminEmail
// =========================================
describe("updateAdminEmail", () => {
  it("met à jour l'email quand il est libre", async () => {
    (prismaMock.admin.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaMock.admin.update as jest.Mock).mockResolvedValue({
      id: 1,
      email: "nouveau@patisserie.fr",
      role: "admin",
    });

    const result = await updateAdminEmail(1, "nouveau@patisserie.fr");

    expect(prismaMock.admin.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { email: "nouveau@patisserie.fr" },
      select: { id: true, email: true, role: true },
    });
    expect(result.email).toBe("nouveau@patisserie.fr");
  });

  it("autorise la mise à jour si l'email appartient déjà au même admin", async () => {
    (prismaMock.admin.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prismaMock.admin.update as jest.Mock).mockResolvedValue({
      id: 1,
      email: "admin@patisserie.fr",
      role: "admin",
    });

    await expect(
      updateAdminEmail(1, "admin@patisserie.fr"),
    ).resolves.toBeDefined();
  });

  it("refuse un email déjà utilisé par un autre admin", async () => {
    (prismaMock.admin.findUnique as jest.Mock).mockResolvedValue({ id: 2 });

    await expect(updateAdminEmail(1, "pris@patisserie.fr")).rejects.toThrow(
      "Cet email est déjà utilisé.",
    );
    expect(prismaMock.admin.update).not.toHaveBeenCalled();
  });
});

// =========================================
// updateAdminPassword
// =========================================
describe("updateAdminPassword", () => {
  it("change le mot de passe quand l'actuel est correct", async () => {
    (prismaMock.admin.findUnique as jest.Mock).mockResolvedValue(adminMock);
    (bcryptMock.compare as jest.Mock).mockResolvedValue(true);
    (bcryptMock.hash as jest.Mock).mockResolvedValue("$2a$12$nouveauhash");
    (prismaMock.admin.update as jest.Mock).mockResolvedValue(adminMock);

    const result = await updateAdminPassword(1, "ancienMDP", "nouveauMDP123");

    expect(bcryptMock.compare).toHaveBeenCalledWith(
      "ancienMDP",
      adminMock.passwordHash,
    );
    expect(bcryptMock.hash).toHaveBeenCalledWith("nouveauMDP123", 12);
    expect(prismaMock.admin.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { passwordHash: "$2a$12$nouveauhash" },
    });
    expect(result).toEqual({ success: true });
  });

  it("rejette si le mot de passe actuel est incorrect", async () => {
    (prismaMock.admin.findUnique as jest.Mock).mockResolvedValue(adminMock);
    (bcryptMock.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      updateAdminPassword(1, "mauvais", "nouveauMDP123"),
    ).rejects.toThrow("Le mot de passe actuel est incorrect.");
    expect(prismaMock.admin.update).not.toHaveBeenCalled();
  });

  it("rejette si le compte est introuvable", async () => {
    (prismaMock.admin.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      updateAdminPassword(99, "x", "nouveauMDP123"),
    ).rejects.toThrow("Compte introuvable.");
  });
});
