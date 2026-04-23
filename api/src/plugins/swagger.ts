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
Endpoints para productores y consumidores de productos orgánicos.   

Responses  

- Recuersos que devuelven colecciones que necesitan paginación, usan el esquema DeAcaListResponse
- Recuersos que devuelven colecciones que NO necesitan paginación, usan el esquema Type.Array(miTipo). Sin perjuicio de usar ref.
- Recursos que devuelven objeto usan el esquema de los datos.

Requests  

- Recuersos que devuelven colecciones que necesitan paginación deben especificar queryString de forma obligatoria.

Slugs  
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
          name: 'Admin: Categorias',
          description: 'Rutas de categorias solo para el administrador.',
        },
        {
          name: 'Admin: Subcategorias',
          description: 'Rutas de subcategorias solo para el administrador.',
        },
        {
          name: 'Admin: Etiquetas',
          description: 'Rutas de etiquetas solo para el administrador.',
        },
        {
          name: 'Auth',
          description: 'Operaciones de autenticación, login y gestión de tokens.',
        },
        {
          name: 'Categorias',
          description:
            'Gestión de categorías, subcategorías de categorías y etiquetas permitidas en cada subcategoria para usuarios.',
        },
        {
          name: 'Productores',
          description: `
Endpoint para que los productores administren sus productos y para que los consumidores vean la info del productor.
No se puede hacer POST de productores, ya que se corresponde con el registro o con activar productor.  
## Endpoints disponibles:
- Obtener todos los productores: ADMIN
- Obtener un productor por su username: Cualquier usuario autenticado.
- Modificar un productor. Solo el propio productor.
- 
          `,
        },
        {
          name: 'productos',
          description: 'Catálogo de productos orgánicos y regenerativos de todos los productores.',
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
