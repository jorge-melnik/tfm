import * as path from 'node:path';
import AutoLoad, { type AutoloadPluginOptions } from '@fastify/autoload';
import { type FastifyPluginAsync } from 'fastify';
import { fileURLToPath } from 'node:url';
import cookiePlugin from '@plugins/cookie.plugin.js';
import jwtPlugin from '@plugins/jwt.plugin.js';
import swagger from '@plugins/swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'decorators'),
    options: opts,
    forceESM: true,
  });

  //Cargar plugins
  await fastify.register(cookiePlugin);
  await fastify.register(jwtPlugin);
  await fastify.register(swagger);
  // await fastify.register(swaggerUi);
  await fastify.register(import('@scalar/fastify-api-reference'), {
    routePrefix: '/docs',
  });

  //Cargar rutas
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: opts,
    forceESM: true,
    routeParams: true,
  });
};

export default app;
export { app, options };
