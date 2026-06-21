#!/usr/bin/env bash
# deploy.sh — déploiement Spyfie en 1 commande.
# Usage : ./deploy.sh [--pull]  (--pull = git pull avant de builder)
set -euo pipefail
cd "$(dirname "$0")"

PULL=0
for arg in "$@"; do
  [ "$arg" = "--pull" ] && PULL=1
done

# ── 1. Mise à jour du code (optionnelle) ─────────────────────────────────
if [ "$PULL" = "1" ]; then
  echo "→ git pull..."
  git -C .. pull --ff-only
fi

# ── 2. Génération des secrets au premier déploiement ─────────────────────
ENV_FILE=".env.prod"

if [ ! -f "$ENV_FILE" ]; then
  PG_PASS=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
  ADMIN_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 16)
  SESSION_SEC=$(openssl rand -base64 64 | tr -dc 'a-zA-Z0-9' | head -c 64)

  cat > "$ENV_FILE" <<EOF
POSTGRES_PASSWORD=${PG_PASS}
ADMIN_PASSWORD=${ADMIN_PASS}
SESSION_SECRET=${SESSION_SEC}
EOF

  echo ""
  echo "┌──────────────────────────────────────────────┐"
  echo "│   PREMIÈRE INSTALLATION — secrets générés    │"
  echo "│                                              │"
  printf "│   ADMIN_PASSWORD = %-28s │\n" "${ADMIN_PASS}"
  echo "│   → noter ce mot de passe avant de fermer   │"
  echo "│   → modifiable dans .env.prod à tout moment │"
  echo "└──────────────────────────────────────────────┘"
  echo ""
fi

# ── 3. Build + démarrage ──────────────────────────────────────────────────
echo "→ build + démarrage des conteneurs..."
docker compose --env-file "$ENV_FILE" -f docker-compose.prod.yml up --build -d

# ── 4. Résumé ─────────────────────────────────────────────────────────────
LOCAL_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "localhost")
echo ""
echo "✓  Spyfie déployé"
echo "   Public → http://${LOCAL_IP}:3101"
echo "   Admin  → http://${LOCAL_IP}:3101/admin"
echo "   Logs   → docker compose -f docker-compose.prod.yml logs -f app"
echo "   Stop   → docker compose -f docker-compose.prod.yml down"
