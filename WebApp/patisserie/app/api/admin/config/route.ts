import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAllConfigPublic, setConfig } from "@/lib/config";
import { PatchConfigSchema } from "@/validators/admin.validator";

// GET /api/admin/config
// Retourne toutes les variables de configuration pour le dashboard admin
export async function GET() {
  try {
    const config = await getAllConfigPublic();
    return NextResponse.json(config);
  } catch (error) {
    console.error("GET /api/admin/config", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la configuration" },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/config
// Modifier une variable de configuration
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const data = PatchConfigSchema.parse(body);

    const config = await setConfig(data.nameVariable, data.valeur);
    return NextResponse.json(config);
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

    console.error("PATCH /api/admin/config", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification de la configuration" },
      { status: 500 },
    );
  }
}
