import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { CreateDevisSchema } from "@/validators/devis.validator";
import { creerDevis } from "@/lib/services/devis.service";
import { getModeCommande } from "@/lib/config";

// POST /api/devis
// Route publique — soumet une demande de devis
// Le devis passe ensuite par une validation admin avant confirmation
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Valider les données entrantes avec Zod
    const data = CreateDevisSchema.parse(body);

    // 2. Vérifier le mode de commande
    const modeCommande = await getModeCommande();

    // Si le mode est direct_only, les devis ne sont pas acceptés
    if (modeCommande === "direct_only") {
      return NextResponse.json(
        { error: "Les demandes de devis ne sont pas disponibles." },
        { status: 403 },
      );
    }

    // 3. Créer le devis via le service
    const devis = await creerDevis({
      nom: data.nom,
      mail: data.mail,
      numeroTel: data.numeroTel,
      dateRetrait: data.dateRetrait,
      dateSouhaitee: data.dateSouhaitee,
      typeEvenement: data.typeEvenement,
      noteClient: data.noteClient,
      items: data.items.map((item) => ({
        idCatalogue: item.idCatalogue,
        quantite: item.quantite,
        options: item.options,
      })),
    });

    return NextResponse.json(devis, { status: 201 });
  } catch (error) {
    // Erreur de validation Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 },
      );
    }

    // Erreur métier — produit indisponible, date invalide...
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    console.error("POST /api/devis", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du devis" },
      { status: 500 },
    );
  }
}
