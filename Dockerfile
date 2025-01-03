FROM node:22.1-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.15-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html
# COPY ./out /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]