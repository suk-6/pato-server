#!/bin/sh

docker-compose down

docker-compose up -d postgres
docker-compose up -d redis

bun install
bun run prisma:generate
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/db?schema=public" bunx prisma migrate deploy

docker-compose up -d --build