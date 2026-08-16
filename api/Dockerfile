FROM node:24-alpine AS base
# Creamos la carpeta y le damos permisos al usuario node
RUN mkdir -p /app/api/node_modules /app/api/.angular && chown -R node:node /app/api
# Obligamos a que inicie con usuario node
WORKDIR /app/api

FROM base AS development
ENV NODE_ENV=development
RUN apk add --no-cache git && npm install fastify-cli --global 
USER node