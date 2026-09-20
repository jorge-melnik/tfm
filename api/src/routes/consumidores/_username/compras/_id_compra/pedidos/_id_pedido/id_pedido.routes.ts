import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { mensajesRepository } from '@repositories/mensajes.repository.js';
import { pedidosRepository } from '@repositories/pedidos.respository.js';
import { Mensaje, Pedido } from '@schemas/compras.schema.js';
import { Consumidor } from '@schemas/consumidores.schema.js';
import { ErrorResponse } from '@schemas/core.schemas.js';

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
        id_compra: Pedido.properties.id_compra,
        id_pedido: Pedido.properties.id_pedido,
      }),
      response: {
        200: Pedido,
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    preHandler: async function (req, rep) {
      fastify.selfWithRole('CONSUMIDOR');
      await pedidosRepository.getBy({
        id_compra: req.params.id_compra,
        id_consumidor: req.user.id_usuario,
      });
    },
    handler: async function (req, reply) {
      return pedidosRepository.getOneBy({ id_compra: req.params.id_compra, id_pedido: req.params.id_pedido });
    },
  });

  fastify.get('/mensajes', {
    schema: {
      tags: ['Consumidores'],
      summary: 'READ mensajes pedido',
      description: `
        Devuelve el listado completo de mensajes en un pedido.
      `,
      params: Type.Object({
        username: Consumidor.properties.username,
        id_compra: Pedido.properties.id_compra,
        id_pedido: Pedido.properties.id_pedido,
      }),
      response: {
        // 200: Type.Array(Pedido, { description: 'Listado de pedidos.' }),
        200: Type.Array(Mensaje),
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    preHandler: async function (req, rep) {
      fastify.selfWithRole('CONSUMIDOR');
      await pedidosRepository.getOneBy({
        id_compra: req.params.id_compra,
        id_pedido: req.params.id_pedido,
        id_consumidor: req.user.id_usuario,
      });
    },
    handler: async function (req, reply) {
      const res = await mensajesRepository.getBy({
        id_pedido: req.params.id_pedido,
        sort_direction: 'DESC',
        sort: 'id_mensaje',
      });
      await pedidosRepository.consumidorLeyoMensajes(req.params.id_pedido);
      return res.data;
    },
  });

  fastify.post('/mensajes', {
    schema: {
      tags: ['Consumidores'],
      summary: 'READ mensajes pedido',
      description: `
        Devuelve el listado completo de mensajes en un pedido.
      `,
      params: Type.Object({
        username: Consumidor.properties.username,
        id_compra: Pedido.properties.id_compra,
        id_pedido: Pedido.properties.id_pedido,
      }),
      body: Type.Object({
        mensaje: Mensaje.properties.mensaje,
      }),
      response: {
        200: Mensaje,
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('CONSUMIDOR')],
    preHandler: async function (req, rep) {
      await pedidosRepository.getOneBy({
        id_compra: req.params.id_compra,
        id_pedido: req.params.id_pedido,
        id_consumidor: req.user.id_usuario,
      });
    },
    handler: async function (req, reply) {
      const mensaje = await mensajesRepository.add({
        id_pedido: req.params.id_pedido,
        id_emisor: req.user.id_usuario,
        mensaje: req.body.mensaje,
      });
      const loenviado = JSON.stringify(mensaje);
      fastify.log.warn('Consumidor envió mensaje a: ' + fastify.websocketServer?.clients?.size + ' clientes');
      fastify.websocketServer?.clients?.forEach((cliente) => {
        cliente.send(loenviado);
      });
      return mensaje;
    },
  });

  fastify.delete('/mensajes/:id_mensaje', {
    schema: {
      tags: ['Consumidores'],
      summary: 'READ mensajes pedido',
      description: `
        Devuelve el listado completo de mensajes en un pedido.
      `,
      params: Type.Object({
        username: Consumidor.properties.username,
        id_compra: Pedido.properties.id_compra,
        id_pedido: Pedido.properties.id_pedido,
        id_mensaje: Mensaje.properties.id_mensaje,
      }),
      response: {
        204: Type.Null(),
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('CONSUMIDOR')],
    handler: async function (req, reply) {
      return mensajesRepository.remove(req.params.id_mensaje);
    },
  });
};

export default rutasPedidosCompra;
