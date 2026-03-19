# --- build: Vue SPA → dist/ ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock* ./
RUN corepack enable && corepack prepare yarn@1.22.22 --activate \
  && yarn install --frozen-lockfile

COPY . .
RUN yarn build

# --- run: Express serves dist/ + auth for content/ ---
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Runtime: set SITE_PASSWORD (required for login + /content/*). Cloud Run injects PORT.
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/content ./content
COPY --from=builder /app/server ./server
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

RUN yarn install --production --frozen-lockfile \
  && yarn cache clean \
  && chown -R node:node /app

USER node

EXPOSE 8080

CMD ["node", "server/index.js"]
