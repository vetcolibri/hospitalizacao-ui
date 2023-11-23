FROM node:18-alpine

WORKDIR /app

COPY package*.json /app

RUN npm ci

COPY . /app

ARG VITE_SERVER_URL
ARG VITE_WS_URL

RUN echo "VITE_SERVER_URL=$VITE_SERVER_URL" >> .env.production
RUN echo "VITE_WS_URL=$VITE_WS_URL" >> .env.production

RUN npm run build

EXPOSE 8080

CMD ["npx", "http-server", "dist"]
