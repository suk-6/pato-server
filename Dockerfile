FROM oven/bun

LABEL maintainer="https://suk.kr"

WORKDIR /app

ENV NODE_ENV production

COPY src src
COPY tsconfig.json .
COPY .env .

COPY package.json .
COPY bun.lockb .

RUN bun install --production

CMD ["bun", "src/index.ts"]

EXPOSE 3000