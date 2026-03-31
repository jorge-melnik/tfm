FROM node:24-alpine AS development

# git y librerías necesarias para levantar vscode dentro del contenedor.
RUN apk update && apk add --no-cache bash git openssh shadow curl wget unzip libstdc++ libc6-compat gcompat icu-libs

# Creamos la carpeta y le damos permisos al usuario node
RUN mkdir -p /zonavet/frontend/node_modules /zonavet/frontend/.angular && chown -R node:node /zonavet

# Obligamos a que inicie con usuario node
USER node
WORKDIR /zonavet/frontend

# TODO: Despues ver como hacer las otras stages.
