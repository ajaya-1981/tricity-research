#!/bin/bash

set -a
source .env
set +a

echo "Starting production environment..."
echo "NODE_ENV=production"
echo "Backend port: $BACKEND_PORT"
echo "Frontend port: $FRONTEND_PORT"

docker compose --env-file .env build --no-cache && docker compose --env-file .env up -d
