import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isVariant, readVariant } from "@/lib/storage";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string; variant: string }> };

// GET /api/shots/<id>/<variant> — sert une capture WebP.
// Le chemin est dérivé du slug en base + d'une allowlist de variantes
// (jamais du param brut → pas de path traversal).
export async function GET(req: Request, { params }: Params) {
  const { id, variant } = await params;

  if (!isVariant(variant)) {
    return NextResponse.json({ error: "Variante inconnue" }, { status: 400 });
  }

  const target = await prisma.target.findUnique({
    where: { id },
    select: { slug: true, capturedAt: true },
  });
  if (!target) {
    return NextResponse.json({ error: "Cible introuvable" }, { status: 404 });
  }

  // ETag basé sur captured_at : change après une recapture, donc le cache
  // se rafraîchit automatiquement.
  const etag = `"${id}-${variant}-${target.capturedAt?.getTime() ?? 0}"`;
  if (req.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304 });
  }

  const buf = await readVariant(target.slug, variant);
  if (!buf) {
    return NextResponse.json({ error: "Capture absente" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=3600, must-revalidate",
      ETag: etag,
    },
  });
}
