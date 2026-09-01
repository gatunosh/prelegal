#!/usr/bin/env bash
# Stop and remove the Prelegal container.
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose down
