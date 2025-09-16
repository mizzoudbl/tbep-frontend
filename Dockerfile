### STAGE 1: Build ###
FROM node:22.15-alpine AS builder
WORKDIR /app

ARG GIT_BRANCH=saipuram

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

### STAGE 2: Run ###
FROM nginx:1.29-alpine
# Install apache2-utils for htpasswd
RUN apk add --no-cache apache2-utils

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/out/video /usr/share/nginx/html/video
COPY --from=builder /app/out/image /usr/share/nginx/html/image
COPY --from=builder /app/out/*.csv /usr/share/nginx/html/
COPY --from=builder /app/out/favicon.ico /usr/share/nginx/html/
COPY --from=builder /app/out/docs /usr/share/nginx/html/docs
COPY --from=builder /app/out/_next /usr/share/nginx/html/_next
COPY --from=builder /app/out/_pagefind /usr/share/nginx/html/_pagefind
COPY --from=builder /app/out/*.txt /usr/share/nginx/html/
COPY --from=builder /app/out/*.html /usr/share/nginx/html/
COPY --from=builder /app/out/*.xml /usr/share/nginx/html/

# USE THESE LAYERS TO BUILD LOCALLY FASTER USING already built `out` folder in your workspace
# COMMENT OUT THE STAGE 1 (builder), and ABOVE COPY COMMANDs
# UNCOMMENT THE BELOW COMMANDS
#################################################
# RUN mkdir -p /usr/share/nginx/html/{image,video,docs,_next}
# COPY ./out/video /usr/share/nginx/html/video
# COPY ./out/image /usr/share/nginx/html/image
# COPY ./out/*.csv /usr/share/nginx/html/
# COPY ./out/docs /usr/share/nginx/html/docs
# COPY ./out/_next /usr/share/nginx/html/_next
# COPY ./out/_pagefind /usr/share/nginx/html/_pagefind
# COPY ./out/*.txt /usr/share/nginx/html/
# COPY ./out/*.html /usr/share/nginx/html/
# COPY ./out/*.xml /usr/share/nginx/html/
# COPY ./out/favicon.ico /usr/share/nginx/html/
##################################################

# Create the .htpasswd file for Basic Auth
# Use environment variables with a format like:
# AUTH_MAP='user1=password1;user2=password2'
COPY ./nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT [ "/entrypoint.sh" ]