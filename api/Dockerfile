FROM node:24-alpine AS base
# Creamos la carpeta y le damos permisos al usuario node
RUN mkdir -p /api/node_modules /api/.angular && chown -R node:node /api
# Obligamos a que inicie con usuario node
WORKDIR /api

FROM base as development
RUN apk add --no-cache git
USER node