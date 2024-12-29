FROM node:20-alpine AS builder

WORKDIR /hospitalizacao-ui

COPY package*.json /hospitalizacao-ui/

RUN npm ci

COPY . /hospitalizacao-ui/

ARG VITE_SERVER_URL
ARG VITE_WS_URL

RUN echo "VITE_SERVER_URL=$VITE_SERVER_URL" >> .env.production
RUN echo "VITE_WS_URL=$VITE_WS_URL" >> .env.production
RUN npm run build

FROM nginx:alpine

EXPOSE 80

COPY default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /hospitalizacao-ui/dist /usr/share/nginx/html

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
