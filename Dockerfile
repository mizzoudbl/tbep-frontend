# FROM node:22.1-alpine AS builder
# WORKDIR /app

# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

FROM nginx:1.15-alpine
# Install apache2-utils for htpasswd
RUN apk add --no-cache apache2-utils

RUN rm /etc/nginx/conf.d/default.conf
# COPY --from=builder /app/out /usr/share/nginx/html
COPY ./out /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Create the .htpasswd file for Basic Auth using args
ARG BASIC_AUTH_USERNAME
ARG BASIC_AUTH_PASSWORD
RUN htpasswd -cb /etc/nginx/.htpasswd $BASIC_AUTH_USERNAME $BASIC_AUTH_PASSWORD

CMD ["nginx", "-g", "daemon off;"]