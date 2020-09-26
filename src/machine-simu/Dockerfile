FROM node:10-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production
COPY build/machine-simu/. .

CMD ["node", "index.js"]
