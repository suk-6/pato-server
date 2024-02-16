FROM oven/bun:latest

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

RUN bun install --production

RUN apt update
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -E -
RUN apt install -y nodejs

RUN bun add prisma
RUN node_modules/.bin/prisma generate
# RUN bun run build

CMD ["/app/start.sh"]

EXPOSE 3000