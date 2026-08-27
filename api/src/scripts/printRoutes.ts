import Fastify from 'fastify';
import app from '../app.js';

const fastify = Fastify();

await fastify.register(app);

await fastify.ready();

console.log(fastify.printRoutes({ commonPrefix: false }));

await fastify.close();
