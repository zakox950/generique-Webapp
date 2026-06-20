import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { deleteTargetDir } from "@/lib/storage";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

const PatchBody = z.object({
  title: z.string().max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  tags: z.array(z.string().max(40)).max(12).optional(),
  order: z.number().int().min(0).optional(),
});

// PATCH — édition des champs d'une cible.
export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;

  let body;
  try {
    body = PatchBody.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  try {
    const target = await prisma.target.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.description !== undefined
          ? { description: body.description }
          : {}),
        ...(body.tags !== undefined ? { tags: body.tags } : {}),
        ...(body.order !== undefined ? { order: body.order } : {}),
      },
    });
    return NextResponse.json(target);
  } catch {
    return NextResponse.json({ error: "Cible introuvable" }, { status: 404 });
  }
}

// DELETE — supprime la cible + ses fichiers de capture.
export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;

  const target = await prisma.target.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "Cible introuvable" }, { status: 404 });
  }

  await prisma.target.delete({ where: { id } });
  await deleteTargetDir(target.slug).catch(() => {});

  return NextResponse.json({ ok: true });
}
