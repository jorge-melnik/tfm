import { NotFoundError } from '@errors/response.errors.js';
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { mensajesRepository } from '@repositories/mensajes.repository.js';
import { pedidosRepository } from '@repositories/pedidos.respository.js';
import { EstadoPedido, Mensaje, Pedido } from '@schemas/compras.schema.js';
import { ErrorResponse, ListResponse } from '@schemas/core.schemas.js';
import { Productor } from '@schemas/productores.schema.js';

const rutasPedidosCompra: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Consumidores'],
      summary: 'READ pedido',
      description: `
          Devuelve un pedido en particular para el productor.
        `,
      params: Type.Object({
        productor: Productor.properties.username,
        id_compra: Pedido.properties.id_compra,
        id_pedido: Pedido.properties.id_pedido,
      }),
      response: {
        200: Pedido,
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('PRODUCTOR')],
    preHandler: async function (req, rep) {
      await pedidosRepository.getBy({
        id_compra: req.params.id_compra,
        id_consumidor: req.user.id_usuario,
      });
    },
    handler: async function (req, reply) {
      return pedidosRepository.getOneBy({ id_compra: req.params.id_compra, id_pedido: req.params.id_pedido });
    },
  });

  fastify.patch('/', {
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
        200: ListResponse(Pedido),
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('PRODUCTOR')],
    preHandler: async function (req: any, rep) {
      const { productor, id_pedido } = req.params;
      const pedido: Pedido = await pedidosRepository.getOneBy({ productor, id_pedido });
      req.pedido = pedido;
      if (!pedido) throw new NotFoundError();
    },
    handler: async function (req: any, reply) {
      const pedido: Pedido = req.pedido;
      const { id_productor, id_pedido } = pedido;
      const { estado_pedido } = req.body;
      await pedidosRepository.cambiarEstado(id_productor, id_pedido, estado_pedido);
    },
  });

  fastify.get('/mensajes', {
    schema: {
      tags: ['Productores'],
      summary: 'READ mensajes pedido',
      description: `
        Devuelve el listado completo de mensajes en un pedido.
      `,
      params: Type.Object({
        productor: Productor.properties.username,
        id_pedido: Pedido.properties.id_pedido,
      }),
      response: {
        200: Type.Array(Mensaje),
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('PRODUCTOR')],
    preHandler: async function (req, rep) {
      await pedidosRepository.getOneBy({
        id_pedido: req.params.id_pedido,
        id_productor: req.user.id_usuario,
      });
    },
    handler: async function (req, reply) {
      const res = await mensajesRepository.getBy({ id_pedido: req.params.id_pedido });
      //El productor marca como leido cada vez que responde.
      return res.data;
    },
  });

  fastify.post('/mensajes', {
    schema: {
      tags: ['Productores'],
      summary: 'READ mensajes pedido',
      description: `
        Devuelve el listado completo de mensajes en un pedido.
      `,
      params: Type.Object({
        productor: Productor.properties.username,
        id_pedido: Pedido.properties.id_pedido,
      }),
      body: Type.Object({
        mensaje: Mensaje.properties.mensaje,
      }),
      response: {
        201: Mensaje,
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('PRODUCTOR')],
    preHandler: async function (req, rep) {
      await pedidosRepository.getOneBy({
        id_pedido: req.params.id_pedido,
        id_productor: req.user.id_usuario,
      });
    },
    handler: async function (req, reply) {
      reply.code(201);
      const mensaje = await mensajesRepository.add({
        id_pedido: req.params.id_pedido,
        id_emisor: req.user.id_usuario,
        mensaje: req.body.mensaje,
      });

      await pedidosRepository.productorLeyoMensajes(req.params.id_pedido);
      return mensaje;
    },
  });

  fastify.delete('/mensajes/:id_mensaje', {
    schema: {
      tags: ['Productores'],
      summary: 'DELETE mensajes pedido',
      description: `
        Elimina un mensaje en particular de un pedido.
      `,
      params: Type.Object({
        productor: Productor.properties.username,
        id_pedido: Pedido.properties.id_pedido,
        id_mensaje: Mensaje.properties.id_mensaje,
      }),
      response: {
        204: Type.Null(),
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('PRODUCTOR')],
    handler: async function (req, reply) {
      return mensajesRepository.remove(req.params.id_mensaje);
    },
  });
};

export default rutasPedidosCompra;
