FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

ENV RABBITMQ_URL=amqp://rabbitmq:5672
ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379
ENV JWT_SECRET=TEST

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm install --only=production --legacy-peer-deps

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/.env ./

EXPOSE 3005

CMD ["node", "dist/main.js"]
