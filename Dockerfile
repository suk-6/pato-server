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
COPY start.sh .

RUN chmod +x start.sh

RUN apk update
RUN apk add nodejs

RUN bun install --production
RUN bun add prisma
RUN node_modules/.bin/prisma generate
# RUN bun run build

CMD ["/app/start.sh"]

EXPOSE 3000