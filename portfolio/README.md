# Spyfie — Portfolio

Portfolio d'agence de dev web. Geste signature : on saisit l'URL d'un projet,
le serveur **capture** automatiquement des screenshots desktop + mobile via
Playwright, et la cible apparaît dans un **deck de cartes empilées** (console de
reconnaissance). Lecture seule pour les visiteurs ; un mode admin protégé par mot
de passe gère l'ajout, la recapture, le réordonnancement et la suppression.

Projet **autonome** dans le monorepo `generique-Webapp` : ses propres dépendances,
`node_modules`, `.env` et base de données. Rien d'autre dans le repo n'en dépend.

- Spec design + fonctionnelle : [`DA_SPYFIE.md`](./DA_SPYFIE.md)
- Tokens implémentés : [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)

## Stack

Next.js 16 (App Router) · TypeScript · Prisma 7 + PostgreSQL · Playwright
(Chromium headless) · sharp (WebP). Pas de NextAuth, pas de S3, pas de queue
distribuée — gate mot de passe simple + cookie signé, volume local, worker
in-process.

## Développement

```bash
# 1. Base de données dédiée (port distinct)
docker compose up -d db

# 2. Dépendances + Chromium
npm install
npx playwright install chromium

# 3. Variables d'environnement
cp .env.example .env   # puis renseigner ADMIN_PASSWORD, SESSION_SECRET…

# 4. Schéma
npx prisma migrate dev

# 5. Serveur de dev (port 3100)
npm run dev
```

App publique : http://localhost:3100 — Admin : http://localhost:3100/admin

## Captures

- Stockées sur **volume local** (`STORAGE_DIR`, défaut `./data/shots`). Seul le
  **chemin** est en base, jamais l'image.
- Déclenchées **à l'ajout** d'une cible et via le bouton **recapture**. Pas de
  refresh planifié.
- Deux viewports : desktop `1440×900`, mobile `390×844`. Le visiteur voit le shot
  correspondant à son propre viewport.

## Production

Voir `docker-compose.prod.yml` et `Dockerfile` (image basée Playwright/Chromium,
volume nommé pour les captures). Notes de déploiement Coolify en fin de
`DA_SPYFIE.md` / phase 8.
