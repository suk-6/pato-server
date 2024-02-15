FROM oven/bun

LABEL maintainer="https://suk.kr"

WORKDIR /app

ENV NODE_ENV production

COPY src src
COPY prisma prisma
COPY tsconfig.json .
COPY .env .

COPY package.json .
COPY bun.lockb .

RUN bun install --production

RUN bun add prisma
RUN node_modules/.bin/prisma generate
RUN bunx prisma migrate deploy
RUN bun build

CMD ["bun", "start"]

EXPOSE 3000