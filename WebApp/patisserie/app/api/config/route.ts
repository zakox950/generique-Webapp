import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/config
// Route publique — expose les variables de config nécessaires au frontend client
// Ne retourne que les champs non-sensibles
const PUBLIC_KEYS = [
  "mode_commande",
  "seuil_devis",
  "mode_paiement",
  "mode_retrait",
  "frais_livraison",
  "zone_livraison",
  "delai_retrait_jours",
  "limite_par_commande",
  "boutique_nom",
  "boutique_adresse",
  "boutique_tel",
  "boutique_horaires",
] as const;

export async function GET() {
  try {
    const rows = await prisma.config.findMany({
      where: { nameVariable: { in: [...PUBLIC_KEYS] } },
    });
    const config = Object.fromEntries(rows.map((r) => [r.nameVariable, r.valeur]));
    return NextResponse.json(config, {
      headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("GET /api/config", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la configuration" },
      { status: 500 },
    );
  }
}
