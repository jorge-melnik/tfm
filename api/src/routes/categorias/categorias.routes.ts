import { type FastifyPluginAsync } from 'fastify';

const categoriasRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    handler: async function (req, reply) {
      return 'this is an example';
    },
  });
};

export default categoriasRoutes;
