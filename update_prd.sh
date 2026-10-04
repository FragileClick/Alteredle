#!/bin/bash
docker stop alteredle
git pull
docker compose build alteredle --no-cache
docker compose up -d alteredle --force-recreate
