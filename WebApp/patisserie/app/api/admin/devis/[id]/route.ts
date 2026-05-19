import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  getDevisById,
  validerDevis,
  refuserDevis,
  marquerAcomptePaye,
  marquerDevisPret,
  modifierPrixDevis,
  modifierDateRetrait,
} from "@/lib/services/devis.service";
import { PatchDevisSchema } from "@/validators/admin.validator";

type Params = { params: Promise<{ id: string }> };

// GET /api/admin/devis/[id]
// Retourne un devis spécifique avec ses items
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const devis = await getDevisById(idNum);

    if (!devis) {
      return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
    }

    return NextResponse.json(devis);
  } catch (error) {
    console.error("GET /api/admin/devis/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du devis" },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/devis/[id]
// Gérer le workflow du devis selon l'action envoyée
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const body = await req.json();

    // Validation avec discriminatedUnion — Zod sait quels champs
    // sont requis selon la valeur de "action"
    const data = PatchDevisSchema.parse(body);

    switch (data.action) {
      case "valider": {
        const devis = await validerDevis(idNum, data.noteAdmin);
        return NextResponse.json(devis);
      }

      case "refuser": {
        const devis = await refuserDevis(idNum, data.noteAdmin);
        return NextResponse.json(devis);
      }

      case "acompte_paye": {
        const devis = await marquerAcomptePaye(idNum, data.montant);
        return NextResponse.json(devis);
      }

      case "marquer_pret": {
        const devis = await marquerDevisPret(idNum);
        return NextResponse.json(devis);
      }

      case "modifier_prix": {
        const devis = await modifierPrixDevis(idNum, data.nouveauPrix);
        return NextResponse.json(devis);
      }

      case "modifier_date_retrait": {
        const devis = await modifierDateRetrait(idNum, data.dateRetrait);
        return NextResponse.json(devis);
      }

      default:
        return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }
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

    console.error("PATCH /api/admin/devis/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification du devis" },
      { status: 500 },
    );
  }
}
