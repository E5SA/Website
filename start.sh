#!/bin/sh
# Simple helper to launch a local HTTP server for the static site
# Usage: ./start.sh [port]
# Defaults to 8000 if no port is provided.

PORT=${1:-8000}

# change to project root (script lives there already)
cd "$(dirname "$0")" || exit 1

echo "Starting HTTP server on port $PORT..."
python3 -m http.server "$PORT"