import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Prisma + le moteur de capture doivent rester en require() Node natif,
  // jamais inlinés dans le bundle.
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "playwright",
    "sharp",
  ],
};

export default nextConfig;
