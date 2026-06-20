import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { slugFromUrl, normalizeUrl } from "@/lib/slug";

export const runtime = "nodejs";

const CreateBody = z.object({
  url: z.string().min(1),
  title: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  tags: z.array(z.string().max(40)).max(12).optional(),
});

// Réordonnancement atomique : la liste d'ids fixe l'ordre du deck.
const ReorderBody = z.object({
  ids: z.array(z.string()).min(1),
});

// GET — liste complète (admin), tous statuts, ordre du deck.
export async function GET() {
  const targets = await prisma.target.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(targets);
}

// POST — ajoute une cible en PENDING (le worker la capturera). Réponse immédiate.
export async function POST(req: Request) {
  let body;
  try {
    body = CreateBody.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const url = normalizeUrl(body.url);
  const parsed = z.string().url().safeParse(url);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "URL invalide — vérifier la cible" },
      { status: 400 },
    );
  }

  // Slug unique (suffixe -2, -3… si collision).
  const baseSlug = slugFromUrl(url);
  let slug = baseSlug;
  for (let i = 2; await prisma.target.findUnique({ where: { slug } }); i++) {
    slug = `${baseSlug}-${i}`;
  }

  const agg = await prisma.target.aggregate({ _max: { order: true } });
  const nextOrder = (agg._max.order ?? -1) + 1;

  const title =
    body.title?.trim() || new URL(url).hostname.replace(/^www\./, "");

  const target = await prisma.target.create({
    data: {
      url,
      slug,
      title,
      description: body.description?.trim() || null,
      tags: body.tags ?? [],
      order: nextOrder,
      status: "PENDING",
    },
  });

  return NextResponse.json(target, { status: 201 });
}

// PATCH — réordonnancement du deck (liste d'ids → order = index).
export async function PATCH(req: Request) {
  let body;
  try {
    body = ReorderBody.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  await prisma.$transaction(
    body.ids.map((id, index) =>
      prisma.target.update({ where: { id }, data: { order: index } }),
    ),
  );

  return NextResponse.json({ ok: true });
}
