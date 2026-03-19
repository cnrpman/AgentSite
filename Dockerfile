# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn install

COPY . .
RUN yarn build

# Run stage: serve static files with Node (reads PORT from Cloud Run)
FROM node:20-alpine

ENV PORT=8080

COPY --from=builder /app/dist /app

RUN npm install -g serve

CMD ["sh", "-c", "serve -s /app -l $PORT"]
