import { NextResponse } from "next/server";
import { getProduitActifs } from "@/lib/services/catalogue.service";

// GET /api/catalogue
// Route publique — retourne tous les produits actifs avec leurs photos
// Accessible sans authentification
export async function GET() {
  try {
    const produits = await getProduitActifs();
    return NextResponse.json(produits);
  } catch (error) {
    console.error("GET /api/catalogue", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du catalogue" },
      { status: 500 },
    );
  }
}
