#!/usr/bin/env bash

# Blue Upgrade Technology dev-up: one command to run backend + frontend with optional Influx Cloud
# - Safe to run multiple times; installs deps if needed
# - Non-fatal (no-echec): logs errors and keeps going when possible
# - Requires: bash, node>=20, npm, curl

set -o pipefail
# Do not set -e to honor "no-echec" preference; we continue on non-critical errors

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
SERVER_DIR="$ROOT_DIR/server"
FRONTEND_DIR="$ROOT_DIR"
VITE_PORT="5173"
SERVER_PORT="4000"
OPEN_BROWSER="false"

log() { echo -e "[dev-up] $*"; }
warn() { echo -e "[dev-up][warn] $*" 1>&2; }
err() { echo -e "[dev-up][error] $*" 1>&2; }

usage() {
  cat <<EOF
Usage: scripts/dev-up.sh [options]

Options:
  --open               Open browser to frontend after start (default: off)
  --vite-port <port>   Frontend dev server port (default: 5173)
  --server-port <port> Backend port (default: 4000)
  --frontend-only      Only start frontend
  --backend-only       Only start backend
  -h, --help           Show this help

Environment:
  Influx (server/.env via dotenv): INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET
  Frontend (.env.local): VITE_API_BASE_URL (defaults to http://localhost:4000)
EOF
}

FRONTEND_ONLY="false"
BACKEND_ONLY="false"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --open) OPEN_BROWSER="true"; shift ;;
    --vite-port) VITE_PORT="$2"; shift 2 ;;
    --server-port) SERVER_PORT="$2"; shift 2 ;;
    --frontend-only) FRONTEND_ONLY="true"; shift ;;
    --backend-only) BACKEND_ONLY="true"; shift ;;
    -h|--help) usage; exit 0 ;;
    *) warn "Unknown arg: $1"; shift ;;
  esac
done

# 1) Basic checks
if ! command -v node >/dev/null 2>&1; then err "Node.js not found. Install Node 20+"; fi
if ! command -v npm >/dev/null 2>&1; then err "npm not found. Install Node 20+ (includes npm)."; fi
if ! command -v curl >/dev/null 2>&1; then warn "curl not found; health checks will be skipped."; fi

NODE_VER_RAW=$(node -v 2>/dev/null | sed 's/^v//')
NODE_MAJOR=${NODE_VER_RAW%%.*}
if [[ -n "$NODE_MAJOR" && "$NODE_MAJOR" -lt 20 ]]; then
  warn "Detected Node $NODE_VER_RAW. Project recommends Node 20+. Proceeding anyway."
fi

# 2) Ensure env templates exist (do not write secrets)
if [[ ! -f "$SERVER_DIR/.env" && ! -f "$SERVER_DIR/.env.example" ]]; then
  cat > "$SERVER_DIR/.env.example" <<'ENV_EXAMPLE'
# Copy to .env and fill with your Influx Cloud values
# INFLUX_URL=https://eu-central-1-1.aws.cloud2.influxdata.com
# INFLUX_TOKEN=***
# INFLUX_ORG=ed3d2d5f9c4dd72d
# INFLUX_BUCKET=my_data
ENV_EXAMPLE
  log "Created server/.env.example (placeholders)."
fi

if [[ ! -f "$FRONTEND_DIR/.env.local" ]]; then
  echo "VITE_API_BASE_URL=http://localhost:$SERVER_PORT" > "$FRONTEND_DIR/.env.local"
  log "Created .env.local with VITE_API_BASE_URL=http://localhost:$SERVER_PORT"
fi

# 3) Install dependencies (continue even if some optional deps warn)
log "Installing frontend deps..."
(cd "$FRONTEND_DIR" && npm install) || warn "Frontend install had issues; continuing."

log "Installing backend deps..."
(cd "$SERVER_DIR" && npm install) || warn "Backend install had issues; continuing."

# 4) Start backend (unless frontend-only)
BACKEND_PID=""
if [[ "$FRONTEND_ONLY" != "true" ]]; then
  log "Starting backend on port $SERVER_PORT..."
  # The server reads .env via dotenv/config inside server; port is taken from process.env.PORT or default
  (cd "$SERVER_DIR" && PORT="$SERVER_PORT" npm run dev) &
  BACKEND_PID=$!
  log "Backend PID: $BACKEND_PID"

  # Health check if curl is available
  if command -v curl >/dev/null 2>&1; then
    ATTEMPTS=0
    until curl -sf "http://localhost:$SERVER_PORT/health" >/dev/null 2>&1; do
      ATTEMPTS=$((ATTEMPTS+1))
      if [[ $ATTEMPTS -gt 60 ]]; then
        warn "Backend health check timed out; continuing (stubs will still work)."
        break
      fi
      sleep 1
    done
    if [[ $ATTEMPTS -le 60 ]]; then log "Backend is healthy."; fi
  fi
fi

# 5) Start frontend (unless backend-only)
FRONTEND_PID=""
if [[ "$BACKEND_ONLY" != "true" ]]; then
  log "Starting frontend (Vite) on port $VITE_PORT..."
  (cd "$FRONTEND_DIR" && PORT="$VITE_PORT" npm run dev) &
  FRONTEND_PID=$!
  log "Frontend PID: $FRONTEND_PID"

  if [[ "$OPEN_BROWSER" == "true" ]]; then
    URL="http://localhost:$VITE_PORT"
    if command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL"; fi
    if command -v open >/dev/null 2>&1; then open "$URL"; fi
    # On Windows Git Bash, 'start' may open browser
    command -v start >/dev/null 2>&1 && start "$URL" || true
  fi
fi

cleanup() {
  log "Shutting down..."
  if [[ -n "$FRONTEND_PID" ]]; then kill "$FRONTEND_PID" >/dev/null 2>&1 || true; fi
  if [[ -n "$BACKEND_PID" ]]; then kill "$BACKEND_PID" >/dev/null 2>&1 || true; fi
}
trap cleanup INT TERM EXIT

# 6) Wait for background jobs
wait
