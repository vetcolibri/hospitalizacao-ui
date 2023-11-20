FROM node:18-alpine

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm ci

COPY . /app

RUN npm run build

EXPOSE 8080

CMD ["npx", "http-server", "dist"]
