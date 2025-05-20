#!/bin/bash

set -a
source .env
set +a

echo "Starting development environment..."
echo "NODE_ENV=$NODE_ENV"
echo "Backend port: $BACKEND_PORT"
echo "Frontend port: $FRONTEND_PORT"

docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up -d