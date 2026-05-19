import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  getCommandeById,
  supprimerCommande,
} from "@/lib/services/commande.service";
import { PatchCommandeSchema } from "@/validators/admin.validator";

type Params = { params: Promise<{ id: string }> };

// GET /api/admin/commandes/[id]
// Retourne une commande spécifique avec ses items
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const commande = await getCommandeById(idNum);

    if (!commande) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 },
      );
    }

    return NextResponse.json(commande);
  } catch (error) {
    console.error("GET /api/admin/commandes/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la commande" },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/commandes/[id]
// Marquer une commande comme prête
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const body = await req.json();
    const data = PatchCommandeSchema.parse(body);

    // Seule action disponible pour les commandes directes
    if (data.action === "marquer_prete") {
      const commande = await getCommandeById(idNum);

      if (!commande) {
        return NextResponse.json(
          { error: "Commande introuvable" },
          { status: 404 },
        );
      }

      // TODO: envoyer email "commande prête" au client
      // Pour l'instant on retourne juste la commande
      return NextResponse.json(commande);
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
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

    console.error("PATCH /api/admin/commandes/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification de la commande" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/commandes/[id]
// Supprimer une commande
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await supprimerCommande(idNum);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    console.error("DELETE /api/admin/commandes/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la commande" },
      { status: 500 },
    );
  }
}
