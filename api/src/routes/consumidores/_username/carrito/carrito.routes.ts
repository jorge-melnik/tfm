import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { consumidorRepository } from '@repositories/consumidor.repository.js';
import { Carrito, Consumidor, ItemCarrito } from '@schemas/consumidores.schema.js';
import { ErrorResponse } from '@schemas/core.schemas.js';
import { Producto } from '@schemas/producto.schema.js';

const rutasCarrito: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Consumidores'],
      summary: 'READ carrito',
      description: `
        Devuelve el resumen del carrito.. 
      `,
      params: Type.Object({ username: Consumidor.properties.username }),
      response: {
        200: Carrito,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('CONSUMIDOR')],
    handler: async function (req, reply) {
      return consumidorRepository.getCarrito(req.user.id_usuario);
    },
  });

  fastify.get('/productos', {
    schema: {
      tags: ['Consumidores'],
      summary: 'READ carrito',
      description: `
        Devuelve el listado completo de productos y cantidades en el carrito. 
      `,
      params: Type.Object({ username: Consumidor.properties.username }),
      response: {
        200: Type.Array(ItemCarrito, { description: 'Listado de ItemCarrito.' }),
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('CONSUMIDOR')],
    handler: async function (req, reply) {
      return consumidorRepository.getProductosCarrito(req.user.id_usuario);
    },
  });

  fastify.post('/productos', {
    schema: {
      tags: ['Consumidores'],
      summary: 'CREATE item carrito',
      description: `
        Permite agregar un nuevo item al carrito asociado al consumidor. 
      `,
      params: Type.Object({
        username: Consumidor.properties.username,
      }),
      body: Type.Object({
        id_producto: ItemCarrito.properties.id_producto,
        id_consumidor: ItemCarrito.properties.id_consumidor,
        cantidad: ItemCarrito.properties.cantidad,
      }),
      response: {
        204: Type.Null(),
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('CONSUMIDOR')],
    //preHandler: Coincide params con body y con usuario logueado
    handler: async function (req, reply) {
      reply.code(204);
      const item = req.body;
      await consumidorRepository.addItemCarrito(item);
    },
  });

  fastify.put('/productos/:id_producto', {
    schema: {
      tags: ['Consumidores'],
      summary: 'UPDATE item carrito',
      description: `
        Permite cambiar la cantidad de un item del carrito asociado al consumidor autenticado. 
      `,
      params: Type.Object({
        username: Consumidor.properties.username,
        id_producto: Producto.properties.id_producto,
      }),
      // body: Type.Pick(ItemCarrito, ['id_productor', 'id_producto', 'id_consumidor', 'cantidad']),
      body: Type.Object({
        id_producto: ItemCarrito.properties.id_producto,
        id_consumidor: ItemCarrito.properties.id_consumidor,
        cantidad: ItemCarrito.properties.cantidad,
      }),
      response: {
        204: Type.Null(),
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('CONSUMIDOR')],
    //preHandler: Coincide params con body y con usuario logueado
    handler: async function (req, reply) {
      reply.code(204);
      await consumidorRepository.updateItemCarrito(req.body);
    },
  });

  fastify.delete('/productos/:id_producto', {
    schema: {
      tags: ['Consumidores'],
      summary: 'DELETE item carrito',
      description: `
        Permite eliminar un item del carrito asociado al consumidor autenticado. 
      `,
      params: Type.Object({
        username: Consumidor.properties.username,
        id_producto: Producto.properties.id_producto,
      }),
      response: {
        204: Type.Null(),
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('CONSUMIDOR')],
    //preHandler: Coincide params con body y con usuario logueado
    handler: async function (req, reply) {
      reply.code(204);
      await consumidorRepository.removeItemCarrito({
        id_consumidor: req.user.id_usuario,
        id_producto: req.params.id_producto,
      });
    },
  });
};

export default rutasCarrito;
