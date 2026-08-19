import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { comprasRepository } from '@repositories/compras.respository.js';
import { pedidosRepository } from '@repositories/pedidos.respository.js';
import { Compra, Pedido } from '@schemas/compras.schema.js';
import { Consumidor } from '@schemas/consumidores.schema.js';
import { DeAcaErrorResponse, DeAcaListResponse } from '@schemas/core.schemas.js';

const rutasPedidosCompra: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Consumidores'],
      summary: 'READ pedidos compra consumidor',
      description: `
        Devuelve el listado completo de pedidos de la compra indicada.
      `,
      params: Type.Object({
        username: Consumidor.properties.username,
        id_compra: Compra.properties.id_compra,
      }),
      response: {
        // 200: Type.Array(Pedido, { description: 'Listado de pedidos.' }),
        200: DeAcaListResponse(Pedido),
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    preHandler: async function (req, rep) {
      await comprasRepository.getOneBy({
        id_compra: req.params.id_compra,
        id_consumidor: req.user.id_usuario,
      });
    },
    handler: async function (req, reply) {
      return pedidosRepository.getBy({ id_compra: req.params.id_compra });
    },
  });
};

export default rutasPedidosCompra;
