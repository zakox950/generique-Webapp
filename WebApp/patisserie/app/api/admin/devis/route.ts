import { NextResponse } from "next/server";
import { getDevis, getDevisByStatut } from "@/lib/services/devis.service";
import { StatutTypeDevis } from "@/app/generated/prisma/client";

// GET /api/admin/devis
// Retourne tous les devis ou filtrés par statut
// Exemple : GET /api/admin/devis?statut=en_attente
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statut = searchParams.get("statut");

    // Si un statut est passé en query param, filtrer par statut
    if (statut) {
      const statutsValides: StatutTypeDevis[] = [
        "en_attente",
        "valide",
        "acompte_paye",
        "pret",
        "annule",
        "expire",
      ];

      if (!statutsValides.includes(statut as StatutTypeDevis)) {
        return NextResponse.json(
          {
            error: `Statut invalide. Valeurs possibles : ${statutsValides.join(", ")}`,
          },
          { status: 400 },
        );
      }

      const devis = await getDevisByStatut(statut as StatutTypeDevis);
      return NextResponse.json(devis);
    }

    // Sinon retourne tous les devis
    const devis = await getDevis();
    return NextResponse.json(devis);
  } catch (error) {
    console.error("GET /api/admin/devis", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des devis" },
      { status: 500 },
    );
  }
}
