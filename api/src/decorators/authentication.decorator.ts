import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { UnAuthenticatedError } from '@errors/response.errors.js';

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      fastify.log.warn('No se encontró Authorization Header');
      throw new UnAuthenticatedError('No se encontró Authorization Header');
    }
    await req.jwtVerify();
  });
});
