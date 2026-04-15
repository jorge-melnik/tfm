import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DeAcaUnAuthenticated } from '@errors/response.errors.js';

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      fastify.log.warn('No se encontró Authorization Header');
      throw new DeAcaUnAuthenticated('No se encontró Authorization Header');
    }
    await request.jwtVerify();
  });
});
