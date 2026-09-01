#!/usr/bin/env bash
# Build and start the Prelegal container.
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose up -d --build
echo "Prelegal is running at http://localhost:8000"
