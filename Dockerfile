# syntax=docker/dockerfile:1.4

FROM denoland/deno:alpine
LABEL org.opencontainers.image.source="https://github.com/riipandi/trusty"

ARG APP_BASE_URL
ARG APP_SECRET_KEY
ARG DATABASE_URL
ARG DATABASE_TOKEN

ENV APP_BASE_URL $APP_BASE_URL
ENV APP_SECRET_KEY $APP_SECRET_KEY
ENV DATABASE_URL $DATABASE_URL
ENV DATABASE_TOKEN $DATABASE_TOKEN

WORKDIR /app
ADD . /app

RUN apk update && apk add --no-cache tini
RUN deno cache src/server.ts

ENV HOSTNAME 0.0.0.0
ENV PORT 3080
EXPOSE 3080

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/bin/deno", "task", "start"]
