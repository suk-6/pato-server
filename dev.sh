#!/bin/sh

docker-compose up -d postgres
docker-compose up -d redis

bun dev