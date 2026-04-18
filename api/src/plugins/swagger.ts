import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import type { FastifyInstance } from 'fastify';

const API_PREFIX = process.env.API_PREFIX || 'api';

export default fp(async (fastify: FastifyInstance) => {
  if (process.env.NODE_ENV !== 'development') return; //docs de api solo development

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'De Acá - API Documentation',
        description: `
## Endpoints para productores y consumidores de productos orgánicos. 

## Responses

- Recuersos que devuelven colecciones que necesitan paginación, usan el esquema DeAcaListResponse
- Recuersos que devuelven colecciones que NO necesitan paginación, usan el esquema Type.Array(miTipo). Sin perjuicio de usar ref.
- Recursos que devuelven objeto usan el esquema de los datos.

## Requests

- Recuersos que devuelven colecciones que necesitan paginación deben especificar queryString de forma obligatoria.

## Slugs
- Entidades que tienen un atributo slug_entidad, usarán dicho slug para los GET. Para los demás métodos se seguirá usando el id_entidad.
        `,
        version: '1.0.0',
      },
      servers: [
        {
          url: `/${API_PREFIX}`,
          description: 'Fastify server',
        },
      ],

      tags: [
        {
          name: 'auth',
          description: 'Operaciones de autenticación, login y gestión de tokens.',
        },
        {
          name: 'Etiquetas',
          description: 'Etiquetas genéricas.',
        },
        {
          name: 'categorias',
          description:
            'Gestión de categorías, subcategorías de categorías y etiquetas permitidas en cada categoria.',
        },
        {
          name: 'productos',
          description: 'Catálogo de productos orgánicos y regenerativos.',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'refreshToken',
          },
        },
      },
    },
  });
});
