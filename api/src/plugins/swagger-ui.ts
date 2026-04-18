import fp from 'fastify-plugin';
import swaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';

export default fp(async (fastify: FastifyInstance) => {
  if (process.env.NODE_ENV !== 'development') return; //docs de api solo development

  await fastify.register(swaggerUi, {
    // routePrefix: '/docs',
    // // transformStaticCSP: (header) => header,
    // uiConfig: {
    //   docExpansion: 'none',
    //   deepLinking: false,
    // },
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
});
