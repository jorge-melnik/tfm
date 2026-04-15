import fp from 'fastify-plugin';
import type { FastifyCookieOptions } from '@fastify/cookie';
import cookie from '@fastify/cookie';
import type { FastifyInstance } from 'fastify';
import { DeAcaInternal } from '@errors/response.errors.js';

const apiCookieSecret = process.env.API_COOKIE_SECRET;
/**
 * Plugin para generar y leer cookies
 */
export default fp(async (fastify: FastifyInstance) => {
  if (!apiCookieSecret) throw new DeAcaInternal('No se especificó un API_COOKIE_SECRET adecuado.');
  const options: FastifyCookieOptions = {
    secret: 'my-secret',
    parseOptions: {},
  };

  fastify.register(cookie, options);
});
