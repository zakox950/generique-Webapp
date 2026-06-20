import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

// GET public — uniquement les cibles capturées (CACHED), dans l'ordre du deck.
export async function GET() {
  const targets = await prisma.target.findMany({
    where: { status: "CACHED" },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      url: true,
      slug: true,
      desktopShot: true,
      mobileShot: true,
      capturedAt: true,
      tags: true,
      description: true,
      order: true,
    },
  });
  return NextResponse.json(targets);
}
