FROM node:24-alpine AS development
# git y librerías necesarias para levantar vscode dentro del contenedor.
RUN apk update && apk add --no-cache bash git openssh shadow curl wget unzip libstdc++ libc6-compat gcompat icu-libs
RUN npm install --global @angular/cli@latest
# Creamos la carpeta y le damos permisos al usuario node
RUN mkdir -p /app/front/node_modules /app/front/.angular && chown -R node:node /app/front

# Obligamos a que inicie con usuario node
USER node
WORKDIR /app/front

# TODO: Despues ver como hacer las otras stages.
