import { NextResponse } from "next/server";
import { z } from "zod";
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  checkPassword,
  createSessionToken,
} from "@/lib/auth";

export const runtime = "nodejs";

const Body = z.object({ password: z.string().min(1) });

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  if (!checkPassword(parsed.password)) {
    return NextResponse.json(
      { error: "ACCESS DENIED — mot de passe incorrect" },
      { status: 401 },
    );
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return res;
}
