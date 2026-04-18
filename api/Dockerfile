FROM node:24-alpine AS base
# Creamos la carpeta y le damos permisos al usuario node
RUN mkdir -p /deaca/api/node_modules /deaca/api/.angular && chown -R node:node /deaca/api
# Obligamos a que inicie con usuario node
WORKDIR /deaca/api

FROM base AS development
RUN apk add --no-cache git
USER node