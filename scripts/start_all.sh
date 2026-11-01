#!/usr/bin/env bash
# Start all local dev servers in the background with full detachment so they
# survive this terminal session.
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT" || exit 1

mkdir -p logs

start_bg() {
  local name="$1"; shift
  nohup "$@" > "logs/${name}.out" 2> "logs/${name}.err" < /dev/null &
  echo "$! $name"
}

echo "== Starting backend (uvicorn) =="
start_bg "backend" python3 -m uvicorn main:app --host 0.0.0.0 --port 9000

echo "== Starting mobile metro (expo start) =="
start_bg "mobile-metro" npx expo start --port 8082

echo "== Starting frontend vite =="
start_bg "frontend-vite" node node_modules/.bin/vite --host 0.0.0.0 --port 5273

echo "== PIDs =="
sleep 2
for f in logs/*.out; do
  echo "--- $f ---"
  tail -5 "$f" 2>/dev/null
done
