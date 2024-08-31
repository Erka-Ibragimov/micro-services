FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

ENV RABBITMQ_URL=amqp://rabbitmq:5672
ENV REDIS_URL=redis://redis:6379
ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm install --only=production --legacy-peer-deps

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/.env ./

EXPOSE 3006

CMD ["node", "dist/main.js"]
