import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { pedidosRepository } from '@repositories/pedidos.respository.js';
import { Pedido } from '@schemas/compras.schema.js';
import { ErrorResponse, DeAcaListResponse, DeAcaQueryString } from '@schemas/core.schemas.js';
import { Productor } from '@schemas/productores.schema.js';

const rutasProductorPedidos: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Productores'],
      summary: 'READ pedidos productor',
      description: `
        Devuelve el listado completo de pedidos del productor.
      `,
      params: Type.Object({
        productor: Productor.properties.username,
      }),
      querystring: Type.Intersect([
        DeAcaQueryString,
        Type.Object({
          estado_pedido: Type.Optional(Type.String()),
          consumidor: Type.Optional(Type.String()),
        }),
      ]),
      response: {
        200: DeAcaListResponse(Pedido),
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (req, reply) {
      return pedidosRepository.getBy({ productor: req.params.productor, ...req.query });
    },
  });
};

export default rutasProductorPedidos;
