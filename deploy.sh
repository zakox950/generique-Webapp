#!/bin/bash
set -e
cd "$(dirname "$0")/WebApp/patisserie"

echo "==> Pull des dernières modifications"
git -C ../.. pull

echo "==> Build et redémarrage des conteneurs"
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

echo "==> Attente que la base de données soit prête..."
sleep 8

echo "==> Application des migrations SQL"
docker exec patisserie_db psql \
  -U "${POSTGRES_USER:-patisserie}" \
  -d "${POSTGRES_DB:-patisserie}" \
  -f /docker-entrypoint-initdb.d/migrations/001_add_prete_commandedirect.sql \
  && echo "  Migration 001 appliquée" \
  || echo "  Migration 001 déjà appliquée ou ignorée"

echo "==> Deploy terminé"
docker compose -f docker-compose.prod.yml ps
