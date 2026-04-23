import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productoRepository } from '@repositories/producto.repository.js';

import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { POSTProducto, Producto } from '@schemas/producto.schema.js';
import { Productor } from '@schemas/productores.schema.js';

const productorIdUsuarioProductosRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.post('/', {
    schema: {
      tags: ['Productores'],
      summary: 'ADD producto',
      description: `Permite al PRODUCTOR agregar un producto a su catálogo.`,
      params: Type.Object({ id_productor: Productor.properties.id_productor }),
      body: POSTProducto,
      response: {
        200: Producto,
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo y el coincide id_productor en body y params
    handler: async function (req, reply) {
      return productoRepository.add(req.body);
    },
  });

  //GET .../id_producto es con username
  fastify.put('/:id_producto', {
    schema: {
      tags: ['Productores'],
      summary: 'UPDATE producto',
      description: `Permite al PRODUCTOR modificar un producto a su catálogo.`,
      params: Type.Object({
        id_productor: Type.String(),
        id_producto: Type.Integer(),
      }),
      body: Producto, //FIXME: Con fotos y video?
      response: {
        200: Producto,
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo y el coincide id_productor en body y params
    handler: async function (req, reply) {
      return productoRepository.update(req.params.id_producto, req.body);
    },
  });

  fastify.delete('/:id_producto', {
    schema: {
      tags: ['Productores'],
      summary: 'DELETE producto',
      description: `Permite al PRODUCTOR borrar (si nunca fue vendido) un producto a su catálogo.`,
      params: Type.Object({
        id_productor: Type.String(),
        id_producto: Type.Integer(),
      }),
      response: {
        200: Producto,
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo y el coincide id_productor en body y params
    handler: async function (req, reply) {
      return productoRepository.remove(req.params.id_producto);
    },
  });

  fastify.patch('/:id_producto', {
    schema: {
      tags: ['Productores'],
      summary: 'ACTIVAR/DESACTIVAR producto',
      description: `Permite al PRODUCTOR activar o desactivar`,
      params: Type.Object({
        id_productor: Type.String(),
        id_producto: Type.Integer(),
      }),
      body: Type.Object({ activo: Type.Boolean() }), //FIXME: Con fotos y video?
      response: {
        200: Producto,
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo y el coincide id_productor en body y params
    handler: async function (req, reply) {
      if (req.body.activo) return productoRepository.activate(req.params.id_producto);
      return productoRepository.deactivate(req.params.id_producto);
    },
  });
};

export default productorIdUsuarioProductosRoutes;
