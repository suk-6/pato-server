#!/bin/sh

bunx prisma migrate deploy
bun run start
