FROM oven/bun:latest

LABEL maintainer="https://suk.kr"


WORKDIR /app

ENV NODE_ENV production

COPY .env .
COPY src src
COPY prisma prisma
COPY package.json .
COPY bun.lockb .

RUN bun install --production

RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

RUN /app/node_modules/.bin/prisma generate

RUN bun run build

CMD ["bun", "run", "build/index.js"]

EXPOSE 3000