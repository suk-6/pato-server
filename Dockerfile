FROM oven/bun:canary-alpine

LABEL maintainer="https://suk.kr"

WORKDIR /app

ENV NODE_ENV production

COPY src src
COPY prisma prisma
COPY tsconfig.json .
COPY .env .
COPY node_modules node_modules

COPY package.json .
COPY bun.lockb .

RUN apk update
RUN apk add nodejs

RUN bun install --production
RUN bun add prisma
RUN node_modules/.bin/prisma generate
RUN bun run build

CMD ["bunx", "prisma", "migrate", "deploy", "&&", "bun", "run", "start"]

EXPOSE 3000