import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  modifierProduit,
  toggleActif,
  ajouterPhoto,
  supprimerPhoto,
} from "@/lib/services/catalogue.service";
import {
  UpdateCatalogueSchema,
  AddPhotoSchema,
} from "@/validators/catalogue.validator";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/admin/catalogue/[id]
// Modifier un produit, toggle actif, ou ajouter/supprimer une photo
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const body = await req.json();
    const { action, ...rest } = body;

    // Toggle actif/inactif
    if (action === "toggle_actif") {
      const produit = await toggleActif(idNum);
      return NextResponse.json(produit);
    }

    // Ajouter une photo
    if (action === "ajouter_photo") {
      const data = AddPhotoSchema.parse(rest);
      const photo = await ajouterPhoto(idNum, data.photoUrl);
      return NextResponse.json(photo, { status: 201 });
    }

    // Supprimer une photo
    if (action === "supprimer_photo") {
      const { photoId } = rest;
      if (!photoId || isNaN(parseInt(photoId))) {
        return NextResponse.json(
          { error: "photoId invalide" },
          { status: 400 },
        );
      }
      await supprimerPhoto(parseInt(photoId));
      return NextResponse.json({ success: true });
    }

    // Modifier les champs du produit
    const data = UpdateCatalogueSchema.parse(rest);
    const produit = await modifierProduit(idNum, data);
    return NextResponse.json(produit);
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

    console.error("PATCH /api/admin/catalogue/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification du produit" },
      { status: 500 },
    );
  }
}
