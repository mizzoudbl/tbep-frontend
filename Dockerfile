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
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=builder /app/out /usr/share/nginx/html

RUN mkdir -p /usr/share/nginx/html/{image,video,docs,_next}
COPY ./out/video /usr/share/nginx/html/video
COPY ./out/image /usr/share/nginx/html/image
COPY ./out/*.csv /usr/share/nginx/html/
COPY ./out/docs /usr/share/nginx/html/docs
COPY ./out/_next /usr/share/nginx/html/_next
COPY ./out/*.txt /usr/share/nginx/html/
COPY ./out/*.html /usr/share/nginx/html/
COPY ./out/*.xml /usr/share/nginx/html/
COPY ./out/favicon.ico /usr/share/nginx/html/

# Create the .htpasswd file for Basic Auth using args
ARG BASIC_AUTH_USERNAME
ARG BASIC_AUTH_PASSWORD
RUN htpasswd -cb /etc/nginx/.htpasswd $BASIC_AUTH_USERNAME $BASIC_AUTH_PASSWORD

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]