import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

// POST — relance la capture : repasse la cible en PENDING (le worker la reprend).
export async function POST(_req: Request, { params }: Params) {
  const { id } = await params;

  try {
    const target = await prisma.target.update({
      where: { id },
      data: { status: "PENDING" },
    });
    return NextResponse.json(target);
  } catch {
    return NextResponse.json({ error: "Cible introuvable" }, { status: 404 });
  }
}
