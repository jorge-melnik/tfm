import { DeAcaNotFound } from '@errors/response.errors.js';
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { pedidosRepository } from '@repositories/pedidos.respository.js';
import { EstadoPedido, Pedido } from '@schemas/compras.schema.js';
import { DeAcaErrorResponse, DeAcaListResponse } from '@schemas/core.schemas.js';
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
      response: {
        200: DeAcaListResponse(Pedido),
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    preHandler: async function (req, rep) {},
    handler: async function (req, reply) {
      return pedidosRepository.getBy({ productor: req.params.productor });
    },
  });

  fastify.patch('/:id_pedido', {
    schema: {
      tags: ['Productores'],
      summary: 'READ pedidos productor',
      description: `
        Devuelve el listado completo de pedidos del productor.
      `,
      params: Type.Object({
        productor: Productor.properties.username,
        id_pedido: Pedido.properties.id_pedido,
      }),
      body: Type.Object({
        estado_pedido: EstadoPedido,
      }),
      response: {
        200: DeAcaListResponse(Pedido),
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    preHandler: async function (req: any, rep) {
      const { productor, id_pedido } = req.params;
      const pedido: Pedido = await pedidosRepository.getOneBy({ productor, id_pedido });
      req.pedido = pedido;
      if (!pedido) throw new DeAcaNotFound();
    },
    handler: async function (req: any, reply) {
      const pedido: Pedido = req.pedido;
      const { id_productor, id_pedido } = pedido;
      const { estado_pedido } = req.body;
      await pedidosRepository.cambiarEstado(id_productor, id_pedido, estado_pedido);
    },
  });
};

export default rutasProductorPedidos;
