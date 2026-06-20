#!/bin/sh
set -e
# Applique les migrations avant de démarrer (idempotent).
node node_modules/.bin/prisma migrate deploy
exec node server.js
