FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY src ./src
COPY server.js .

EXPOSE 5000

CMD ["node", "server.js"]