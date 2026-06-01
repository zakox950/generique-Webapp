import type { NextAuthConfig } from "next-auth";

// Lightweight auth config — no Prisma import, safe for Edge Runtime (middleware)
export const authConfig: NextAuthConfig = {
  // L'app est servie derrière une IP/host personnalisé (Tailscale, reverse proxy…)
  // et non localhost — il faut autoriser explicitement l'hôte sinon next-auth v5
  // renvoie UntrustedHost. Équivalent à AUTH_TRUST_HOST=true.
  trustHost: true,
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
