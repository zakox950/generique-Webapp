import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const count = await prisma.admin.count();
    return NextResponse.json({ setupDisponible: count === 0 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const existingAdmin = await prisma.admin.count();
    if (existingAdmin > 0) {
      return NextResponse.json(
        { error: "Un compte administrateur existe déjà.", redirect: "/admin/already-exists" },
        { status: 409 }
      );
    }
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.admin.create({ data: { email, passwordHash } });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
