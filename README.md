# Agroeco

Agroeco pretende ser una plataforma web de tipo marketplace para compraventa directa entre productores agroecológicos o en transición y sus consumidores. Actualmente es una SPA.

## Configurar

Una vez clonado el proyecto localmente, en la raíz del proyecto debemos crear un archivo .env copiando el contenido de .env.example y corrigiendo o completando los valores necesarios.

Cabe aclarar, que para las funcionalidades que requieren subir imágenes es necesario tener configurado un bucket S3 y un CDN de cloudfront. Una vez creados dichos servicios en el .env debemos asociar los datos de configuración de AWS.

El proyecto está preparado para ejecutarse con docker compose. Por lo que recomendamos tener docker instalado localmente.

También existen datos de prueba que se cargarán automáticamente en la base de datos creada con docker.

## Ejecutar

Para ejecutar el proyecto, simplemente debemos levantar el archivo docker-compose.yaml ejecutando ` docker compose up -d`.

## Detener

Para detener el proyecto ejecutar `docker compose down -v` si queremos también borrar los volúmenes creados y los datos generados (no borra el bucket ni el contenido) o sin el parámetro `-v` para que no borre los volúmenes ni los datos.

# Proyectos

Este repositorio consta de varios "proyectos".

- api: Proyecto fastify para la api restful con documentación swagger
- db: Script iniciales para crear la base de datos y para cargar datos de prueba.
- front: Proyecto con angular y primeng para el frontend.
- proxy: Configuración de un reverse proxy. Entre otros nos permite evitar los problemas de cors.
- terraform: Proyecto terraform con las configuraciones utilizadas para construir el bucket S3 y el CDN de cloudfront. Se puede usar este proyecto (configurando las credenciales de aws en consola) para crear la infra de aws necesaria.
