import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  getTousProduits,
  creerProduit,
} from "@/lib/services/catalogue.service";
import { CreateCatalogueSchema } from "@/validators/catalogue.validator";

// GET /api/admin/catalogue
// Retourne tous les produits (actifs et inactifs) avec photos et limites
export async function GET() {
  try {
    const produits = await getTousProduits();
    return NextResponse.json(produits);
  } catch (error) {
    console.error("GET /api/admin/catalogue", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du catalogue" },
      { status: 500 },
    );
  }
}

// POST /api/admin/catalogue
// Crée un nouveau produit
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = CreateCatalogueSchema.parse(body);

    const produit = await creerProduit(data);
    return NextResponse.json(produit, { status: 201 });
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

    console.error("POST /api/admin/catalogue", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du produit" },
      { status: 500 },
    );
  }
}
