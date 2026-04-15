import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';

const API_HOST = process.env.API_HOST || 'localhost';
const API_PREFIX = process.env.API_PREFIX || 'api';

export default fp(async (fastify: FastifyInstance) => {
  if (process.env.NODE_ENV !== 'development') return; //docs de api solo development

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'De Acá - API Documentation',
        description: 'Endpoints para productores y consumidores de productos orgánicos',
        version: '1.0.0',
      },
      servers: [
        {
          url: `/${API_PREFIX}`,
          description: 'Fastify server',
        },
      ],
      tags: ['auth'],
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

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });
});
