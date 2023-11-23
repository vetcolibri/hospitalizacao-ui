FROM node:18-alpine

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm ci

COPY . /app

RUN npm install -g http-server@14.1.1

ARG VITE_SERVER_URL
ARG VITE_WS_URL

RUN echo "VITE_SERVER_URL=$VITE_SERVER_URL" >> .env.production
RUN echo "VITE_WS_URL=$VITE_WS_URL" >> .env.production

# ENV NODE_ENV=production \
#     VITE_SERVER_URL=$VITE_SERVER_URL \
#     VITE_WS_URL=$VITE_WS_URL

RUN npm run build

EXPOSE 8080

CMD ["npx", "http-server", "dist"]
