FROM oven/bun:slim

LABEL maintainer="https://suk.kr"

WORKDIR /app

ENV NODE_ENV production

COPY src src
COPY prisma prisma
COPY tsconfig.json .
COPY .env .
# COPY node_modules node_modules

COPY package.json .
COPY bun.lockb .
COPY start.sh .

RUN chmod +x start.sh

RUN apt update
RUN apt install -y nodejs

RUN bun install --production
RUN bun add prisma
RUN node_modules/.bin/prisma generate
# RUN bun run build

CMD ["/app/start.sh"]

EXPOSE 3000