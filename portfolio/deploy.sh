#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-3100}"

cd "$SCRIPT_DIR"

echo "→ git pull..."
git pull --ff-only

echo "→ npm ci..."
npm ci

echo "→ Build..."
rm -rf .next
npm run build

echo "→ Start..."
if command -v pm2 &>/dev/null; then
  pm2 restart portfolio 2>/dev/null \
    || pm2 start npm --name portfolio -- start -- -p "$PORT"
  echo ""
  echo "✓ Spyfie : http://localhost:${PORT}"
else
  # Fallback: plain node in background
  nohup npm start -- -p "$PORT" > /tmp/spyfie.log 2>&1 &
  echo ""
  echo "✓ Spyfie : http://localhost:${PORT}  (logs: /tmp/spyfie.log)"
fi
