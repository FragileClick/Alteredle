#!/bin/bash
docker stop alteredle_dev
git pull
docker compose build alteredle_dev --no-cache
docker compose up alteredle_dev --force-recreate
