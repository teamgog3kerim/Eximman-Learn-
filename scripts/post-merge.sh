#!/usr/bin/env bash
set -euo pipefail

npm install --no-audit --no-fund
for migration in server/migrations/*.sql; do
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$migration"
done
npm run lint
npm run build
