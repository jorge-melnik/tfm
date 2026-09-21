import { FastifyPluginAsync } from 'fastify';

const rootRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  //   fastify.addHook('onRequest', async (request, reply) => {
  //     await fastify.authenticate(request, reply);
  //   });

  fastify.get('/', { websocket: true }, (socket, req) => {
    fastify.log.info(' ---- ALGUIEN CONECTO al socket ');
    socket.send(JSON.stringify({ message: 'Holaina' }));
    socket.on('message', (message) => {
      console.log({ message });
      socket.send(JSON.stringify({ message: 'hi from server' }));
    });
  });
};

export default rootRoutes;
