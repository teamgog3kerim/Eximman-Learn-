#!/usr/bin/env bash
set -euo pipefail

npm install --no-audit --no-fund
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f server/migrations/0001_learner_progress.sql
npm run lint
npm run build
