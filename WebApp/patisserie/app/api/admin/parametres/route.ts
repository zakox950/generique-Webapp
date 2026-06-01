import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { auth } from "@/lib/auth";
import {
  getAdminById,
  updateAdminEmail,
  updateAdminPassword,
} from "@/lib/services/admin.service";

// Schéma de mise à jour des paramètres du compte admin.
// Soit un changement d'email, soit un changement de mot de passe.
const UpdateParametresSchema = z
  .object({
    email: z.string().email("Email invalide").max(255).optional(),
    currentPassword: z.string().min(1).optional(),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit faire au moins 8 caractères")
      .max(255)
      .optional(),
  })
  .refine(
    (data) =>
      data.email !== undefined ||
      (data.currentPassword !== undefined && data.newPassword !== undefined),
    { message: "Aucune modification fournie." },
  );

// GET /api/admin/parametres
// Retourne les infos du compte admin connecté (sans le hash)
export async function GET() {
  try {
    const session = await auth();
    const id = session?.user?.id ? parseInt(session.user.id) : null;
    if (!id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const admin = await getAdminById(id);
    if (!admin) {
      return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });
    }
    return NextResponse.json(admin);
  } catch (error) {
    console.error("GET /api/admin/parametres", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du compte" },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/parametres
// Met à jour l'email ou le mot de passe du compte admin connecté
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    const id = session?.user?.id ? parseInt(session.user.id) : null;
    if (!id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const data = UpdateParametresSchema.parse(body);

    // Changement d'email
    if (data.email) {
      const admin = await updateAdminEmail(id, data.email);
      return NextResponse.json(admin);
    }

    // Changement de mot de passe
    if (data.currentPassword && data.newPassword) {
      const result = await updateAdminPassword(
        id,
        data.currentPassword,
        data.newPassword,
      );
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Aucune modification" }, { status: 400 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 },
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    console.error("PATCH /api/admin/parametres", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du compte" },
      { status: 500 },
    );
  }
}
