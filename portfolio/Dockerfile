# ============================================================
# Spyfie — Dockerfile multi-stage
# Runtime: Playwright (Chromium) + sharp pour les captures.
# ============================================================

# ---- Stage 1 : build ----
# bookworm-slim et jammy partagent glibc 2.35 → binaires natifs compatibles.
FROM node:22-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
# S'assurer que /app/public existe même si le dossier est absent du repo
RUN mkdir -p /app/public
RUN npx prisma generate
RUN NEXT_TELEMETRY_DISABLED=1 npm run build

# ---- Stage 2 : deps production (même base que le runtime) ----
FROM node:22-bookworm-slim AS prod-deps
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

# ---- Stage 3 : runtime avec Playwright/Chromium ----
FROM mcr.microsoft.com/playwright:v1.56.0-jammy AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3100
# Chromium pré-installé par l'image Playwright
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Utilisateur non-root (même UID/GID que la convention Next.js)
RUN groupadd --system --gid 1001 nodejs 2>/dev/null || true && \
    useradd --system --uid 1001 --gid 1001 --comment "" nextjs 2>/dev/null || true

# Build standalone + statiques + publics
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# node_modules production (sharp, playwright, pg, prisma…)
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Prisma : client généré + fichiers de migration
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Répertoire de stockage (écrasé par volume en prod, utile en dev sans volume)
RUN mkdir -p /app/data/shots && chown nextjs:nodejs /app/data/shots

COPY --chown=nextjs:nodejs entrypoint.sh ./
RUN chmod +x entrypoint.sh

USER nextjs

EXPOSE 3100

# Migrations au démarrage, puis serveur Next.js standalone
ENTRYPOINT ["./entrypoint.sh"]
