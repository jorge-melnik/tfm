import * as path from 'node:path';
import AutoLoad, { type AutoloadPluginOptions } from '@fastify/autoload';
import { type FastifyPluginAsync } from 'fastify';
import { fileURLToPath } from 'node:url';
import cookiePlugin from '@plugins/cookie.plugin.js';
import jwtPlugin from '@plugins/jwt.plugin.js';
import swagger from '@plugins/swagger.js';
import { PostgresError, transformarErrorPostgres } from '@errors/response.errors.js';
import websocket from '@fastify/websocket';

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

  fastify.register(websocket, {
    options: { maxPayload: 100000 },
  });

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

  fastify.setErrorHandler((error: PostgresError, request, reply) => {
    fastify.log.info({ error });
    if (error.schema === 'public') {
      error = transformarErrorPostgres(error);
    }
    throw error;
  });
};

export default app;
export { app, options };
