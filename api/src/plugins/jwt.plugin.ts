import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import type { FastifyJWTOptions } from '@fastify/jwt';
import type { FastifyInstance } from 'fastify';
import { InternalError } from '@errors/response.errors.js';

const apiJwtSecret = process.env.API_JWT_SECRET;
/**
 * Este plugin permite firmar y verificar tokens JWT
 */
export default fp(async (fastify: FastifyInstance) => {
  if (!apiJwtSecret) throw new InternalError('No se especificó un API_JWT_SECRET adecuado.');
  const options: FastifyJWTOptions = {
    secret: apiJwtSecret,
    sign: {
      expiresIn: '1d',
    },
    cookie: {
      cookieName: 'refreshToken',
      signed: false, // O true si quieres firmar la cookie además del JWT
    },
  };

  fastify.register(jwt, options);
});
