import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { CreateCommandeSchema } from "@/validators/commande.validator";
import { creerCommande } from "@/lib/services/commande.service";
import { getModeCommande, getSeuilDevis } from "@/lib/config";

// POST /api/commande
// Route publique — crée une commande directe
// Appelée uniquement après confirmation du paiement Stripe
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Valider les données entrantes avec Zod
    const data = CreateCommandeSchema.parse(body);

    // 2. Vérifier le mode de commande et le seuil devis
    const modeCommande = await getModeCommande();

    // Si le mode est devis_only, aucune commande directe n'est acceptée
    if (modeCommande === "devis_only") {
      return NextResponse.json(
        {
          error:
            "Les commandes directes ne sont pas disponibles. Veuillez soumettre un devis.",
        },
        { status: 403 },
      );
    }

    // Si le mode est seuil, vérifier si le panier dépasse le seuil devis
    if (modeCommande === "seuil") {
      const seuilDevis = await getSeuilDevis();
      const totalPieces = data.items.reduce(
        (acc, item) => acc + item.quantite,
        0,
      );

      if (totalPieces >= seuilDevis) {
        return NextResponse.json(
          {
            error: "Votre panier dépasse le seuil de commande directe.",
            redirect: "devis",
            totalPieces,
            seuilDevis,
          },
          { status: 422 },
        );
      }
    }

    // 3. Créer la commande via le service
    const commande = await creerCommande({
      nom: data.nom,
      mail: data.mail,
      dateRetrait: data.dateRetrait,
      noteClient: data.noteClient,
      paiementChoisi: data.paiementChoisi,
      items: data.items.map((item) => ({
        idCatalogue: item.idCatalogue,
        quantite: item.quantite,
        options: item.options,
      })),
    });

    return NextResponse.json(commande, { status: 201 });
  } catch (error) {
    // Erreur de validation Zod — données mal formées
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 },
      );
    }

    // Erreur métier — limite atteinte, produit indisponible, délai non respecté...
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    console.error("POST /api/commande", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 },
    );
  }
}
