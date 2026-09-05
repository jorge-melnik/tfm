import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { consumidorRepository } from '@repositories/consumidor.repository.js';
import { Consumidor } from '@schemas/consumidores.schema.js';

import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { Producto } from '@schemas/producto.schema.js';

const rutasConsumidorPorUsername: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.post('/', {
    schema: {
      tags: ['Consumidores'],
      summary: 'ADD favorito',
      description: `
        Agrega un producto como favorito del consumidor. 
      `,
      params: Type.Object({ username: Consumidor.properties.username }),
      body: Type.Object({
        id_consumidor: Consumidor.properties.id_consumidor,
        id_producto: Producto.properties.id_producto,
      }),
      response: {
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    // preHandler : //FIXME: fastify.seModificaASiMismo
    handler: async function (req, reply) {
      reply.code(204);
      await consumidorRepository.addFavorito(req.body.id_consumidor, req.body.id_producto);
    },
  });

  fastify.delete('/:id_producto', {
    schema: {
      tags: ['Consumidores'],
      summary: 'DELETE favorito',
      description: `
        Borra un producto como favorito del consumidor.
      `,
      params: Type.Object({
        username: Consumidor.properties.username,
        id_producto: Producto.properties.id_producto,
      }),
      response: {
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    // preHandler : //FIXME: fastify.seModificaASiMismo.
    handler: async function (req, reply) {
      reply.code(204);
      await consumidorRepository.removeFavorito(req.user.id_usuario, req.params.id_producto);
    },
  });
};

export default rutasConsumidorPorUsername;
//TODO: Necesario esta ruta?
//Mejor hacer un /admin/usuarios y ya.
