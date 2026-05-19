import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  getStocks,
  reapprovisionner,
  setStock,
} from "@/lib/services/stock.service";
import { PatchStockSchema } from "@/validators/admin.validator";

// GET /api/admin/stock
// Retourne le stock actuel de tous les produits make_to_stock
export async function GET() {
  try {
    const stocks = await getStocks();
    return NextResponse.json(stocks);
  } catch (error) {
    console.error("GET /api/admin/stock", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des stocks" },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/stock
// Réapprovisionner ou corriger le stock d'un produit
// Body : { action: "reapprovisionner" | "set_stock", idCatalogue: number, quantite: number }
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { idCatalogue, ...rest } = body;

    if (!idCatalogue || isNaN(parseInt(idCatalogue))) {
      return NextResponse.json(
        { error: "idCatalogue invalide" },
        { status: 400 },
      );
    }

    const idNum = parseInt(idCatalogue);
    const data = PatchStockSchema.parse(rest);

    switch (data.action) {
      case "reapprovisionner": {
        const produit = await reapprovisionner(idNum, data.quantite);
        return NextResponse.json(produit);
      }

      case "set_stock": {
        const produit = await setStock(idNum, data.quantite);
        return NextResponse.json(produit);
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

    console.error("PATCH /api/admin/stock", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification du stock" },
      { status: 500 },
    );
  }
}
