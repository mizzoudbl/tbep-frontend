### STAGE 1: Build ###
FROM node:22.15-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.28-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/out /usr/share/nginx/html

# USE THESE LAYERS TO BUILD LOCALLY FASTER USING already built `out` folder in your workspace
# COMMENT OUT THE STAGE 1 (builder), and ABOVE COMMAND [COPY --from=builder /app/out /usr/share/nginx/html]
# UNCOMMENT THE BELOW COMMANDS
#################################################
# RUN mkdir -p /usr/share/nginx/html/{image,video,docs,_next}
# COPY ./out/video /usr/share/nginx/html/video
# COPY ./out/image /usr/share/nginx/html/image
# COPY ./out/*.csv /usr/share/nginx/html/
# COPY ./out/docs /usr/share/nginx/html/docs
# COPY ./out/_next /usr/share/nginx/html/_next
# COPY ./out/*.txt /usr/share/nginx/html/
# COPY ./out/*.html /usr/share/nginx/html/
# COPY ./out/*.xml /usr/share/nginx/html/
# COPY ./out/favicon.ico /usr/share/nginx/html/
##################################################

EXPOSE 80

LABEL org.opencontainers.image.source="https://github.com/mizzoudbl/tbep"

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]