import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DeAcaBadRequest } from '@errors/response.errors.js';

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate('matchParamsWithBody', async (req: FastifyRequest, reply: FastifyReply) => {
    const params = req.params as Record<string, unknown> | undefined;
    const body = req.body as Record<string, unknown> | undefined;

    if (!params || !body) {
      fastify.log.warn('Faltan los parámetros o el cuerpo de la petición para realizar la validación');
      throw new DeAcaBadRequest('Petición inválida: faltan datos de validación');
    }

    // Recorremos los campos obligatorios usando for...of
    for (const field of Object.keys(params)) {
      const paramValue = String(params[field]).toLowerCase();
      const bodyValue = String(body[field]).toLowerCase();

      if (paramValue !== bodyValue) {
        fastify.log.warn(`Conflicto de datos: ${paramValue} !== ${bodyValue}`);
        throw new DeAcaBadRequest(`El valor de '${field}' en la URL no coincide con el del cuerpo`);
      }
    }
  });
});
