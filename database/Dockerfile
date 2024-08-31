FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./dist ./dist

RUN npm run build

EXPOSE 3005

CMD ["npm", "run", "start:dev"]
