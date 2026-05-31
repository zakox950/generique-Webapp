import prisma from "../prisma";
import bcrypt from "bcryptjs";

// =========================================
// COMPTE ADMINISTRATEUR
// Service dédié à la page Paramètres
// =========================================

// Récupère un admin par son id
export async function getAdminById(id: number) {
  return await prisma.admin.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, createdAt: true },
  });
}

// Met à jour l'adresse email de l'admin
export async function updateAdminEmail(id: number, email: string) {
  // Vérifie qu'aucun autre admin n'utilise déjà cet email
  const existant = await prisma.admin.findUnique({ where: { email } });
  if (existant && existant.id !== id) {
    throw new Error("Cet email est déjà utilisé.");
  }
  return await prisma.admin.update({
    where: { id },
    data: { email },
    select: { id: true, email: true, role: true },
  });
}

// Change le mot de passe après vérification du mot de passe actuel
export async function updateAdminPassword(
  id: number,
  currentPassword: string,
  newPassword: string,
) {
  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) throw new Error("Compte introuvable.");

  const ok = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!ok) throw new Error("Le mot de passe actuel est incorrect.");

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.admin.update({ where: { id }, data: { passwordHash } });
  return { success: true };
}
