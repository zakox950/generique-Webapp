import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const EXEMPT_PATHS = ["/admin/login", "/admin/setup", "/admin/already-exists"];

export default auth(function middleware(req) {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const path = nextUrl.pathname;

  const isExempt = EXEMPT_PATHS.some(
    p => path === p || path.startsWith(p + "/")
  );

  if (isExempt) {
    if (isLoggedIn && path.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (path.startsWith("/api/admin") && !isLoggedIn) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (path.startsWith("/admin") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
