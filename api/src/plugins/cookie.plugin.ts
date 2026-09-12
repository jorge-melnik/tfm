import fp from 'fastify-plugin';
import type { FastifyCookieOptions } from '@fastify/cookie';
import cookie from '@fastify/cookie';
import type { FastifyInstance } from 'fastify';

const apiCookieSecret = process.env.API_COOKIE_SECRET;
/**
 * Plugin para generar y leer cookies
 */
export default fp(async (fastify: FastifyInstance) => {
  // if (!apiCookieSecret) throw new InternalError('No se especificó un API_COOKIE_SECRET adecuado.');
  const options: FastifyCookieOptions = {
    secret: apiCookieSecret,
    parseOptions: {},
  };

  fastify.register(cookie, options);
});
