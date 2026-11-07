#!/usr/bin/env bash
set -euo pipefail

# A failed workflow retry can leave the previous dev server alive. Stop only
# this app's tsx entrypoint before starting a replacement instance.
mapfile -t stale_pids < <(pgrep -f '[t]sx server/index.ts' || true)
for pid in "${stale_pids[@]}"; do
  kill -TERM "$pid" 2>/dev/null || true
done

for _ in {1..20}; do
  if ! pgrep -f '[t]sx server/index.ts' >/dev/null; then
    break
  fi
  sleep 0.25
done

exec npm run dev
