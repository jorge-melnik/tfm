import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { consumidorRepository } from '@repositories/consumidor.repository.js';
import { Consumidor, ItemCarrito } from '@schemas/consumidores.schema.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { Producto } from '@schemas/producto.schema.js';
import { Productor } from '@schemas/productores.schema.js';

const rutasCarrito: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Consumidores'],
      summary: 'READ carrito',
      description: `
        Devuelve el listado completo de productos y cantidades en el carrito. 
      `,
      params: Type.Object({ id_consumidor: Consumidor.properties.id_consumidor }),
      response: {
        200: Type.Array(ItemCarrito, { description: 'Listado de ItemCarrito.' }),
        500: DeAcaErrorResponse,
      },
    },
    // onRequest : //FIXME: Solo para admin.
    handler: async function (req, reply) {
      return consumidorRepository.getCarrito(req.params.id_consumidor);
    },
  });

  fastify.post('/productores/:id_productor/producto', {
    schema: {
      tags: ['Consumidores'],
      summary: 'CREATE item carrito',
      description: `
        Permite agregar un nuevo item al carrito asociado al consumidor. 
      `,
      params: Type.Object({
        id_consumidor: Consumidor.properties.id_consumidor,
        id_productor: Productor.properties.id_productor,
      }),
      body: ItemCarrito,
      response: {
        201: ItemCarrito,
        500: DeAcaErrorResponse,
      },
    },
    // onRequest : //FIXME: Solo para consumidor autenticado.
    //preHandler: Coincide params con body y con usuario logueado
    handler: async function (req, reply) {
      reply.code(201);
      return consumidorRepository.addItemCarrito(req.body);
    },
  });

  fastify.put('/productores/:id_productor/producto/:id_producto', {
    schema: {
      tags: ['Consumidores'],
      summary: 'UPDATE item carrito',
      description: `
        Permite cambiar la cantidad de un item del carrito asociado al consumidor autenticado. 
      `,
      params: Type.Object({
        id_consumidor: Consumidor.properties.id_consumidor,
        id_productor: Productor.properties.id_productor,
        id_producto: Producto.properties.id_producto,
      }),
      body: ItemCarrito,
      response: {
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    // onRequest : //FIXME: Solo para consumidor autenticado.
    //preHandler: Coincide params con body y con usuario logueado
    handler: async function (req, reply) {
      reply.code(204);
      await consumidorRepository.updateItemCarrito(req.body);
    },
  });

  fastify.delete('/productores/:id_productor/producto/:id_producto', {
    schema: {
      tags: ['Consumidores'],
      summary: 'DELETE item carrito',
      description: `
        Permite eliminar un item del carrito asociado al consumidor autenticado. 
      `,
      params: Type.Object({
        id_consumidor: Consumidor.properties.id_consumidor,
        id_productor: Productor.properties.id_productor,
        id_producto: Producto.properties.id_producto,
      }),
      response: {
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    // onRequest : //FIXME: Solo para consumidor autenticado.
    //preHandler: Coincide params con body y con usuario logueado
    handler: async function (req, reply) {
      reply.code(204);
      await consumidorRepository.removeItemCarrito(req.params);
    },
  });
};

export default rutasCarrito;
