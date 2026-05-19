import { NextResponse } from "next/server";
import { getCommandes } from "@/lib/services/commande.service";

// GET /api/admin/commandes
// Retourne toutes les commandes avec leurs items pour le dashboard admin
export async function GET() {
  try {
    const commandes = await getCommandes();
    return NextResponse.json(commandes);
  } catch (error) {
    console.error("GET /api/admin/commandes", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes" },
      { status: 500 },
    );
  }
}
