import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

// Routes accessibles sans session (sinon on ne pourrait jamais se connecter).
const EXEMPT = ["/admin/login", "/api/admin/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (EXEMPT.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const authed = await verifySessionToken(token);

  if (authed) return NextResponse.next();

  // API admin : 401 JSON. Pages admin : redirection vers le login.
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json(
      { error: "UNAUTHORIZED — session requise" },
      { status: 401 },
    );
  }

  const loginUrl = new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
