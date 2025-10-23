FROM node:20-alpine

WORKDIR /developer/nodejs/api-gateway

RUN apk add --no-cache bash

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm run dev"]