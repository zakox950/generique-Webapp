import type { NextAuthConfig } from "next-auth";

// Lightweight auth config — no Prisma import, safe for Edge Runtime (middleware)
export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // This callback is not used directly — middleware handles routing logic
      return !!auth?.user;
    },
  },
};
