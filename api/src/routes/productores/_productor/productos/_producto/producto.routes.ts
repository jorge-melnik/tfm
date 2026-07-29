import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productoRepository } from '@repositories/producto.repository.js';

import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { POSTProducto, Producto } from '@schemas/producto.schema.js';

const productorIdUsuarioProductosRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  //GET .../id_producto es con productor
  fastify.get('/', {
    schema: {
      tags: ['Productos'],
      summary: 'READ productos',
      description: `
          Devuelve el producto con el producto especificado. 
        `,
      params: Type.Object({
        productor: Producto.properties.productor,
        producto: Producto.properties.producto,
      }),
      response: {
        200: Producto,
        500: DeAcaErrorResponse,
      },
    },
    // onRequest: [fastify.authenticate], //FIXME descomentar y chequear que es su producto.
    handler: async (req, reply) => {
      return productoRepository.getOneBy({ productor: req.params.productor, producto: req.params.producto });
    },
  });

  fastify.put('/', {
    schema: {
      tags: ['Productos'],
      summary: 'UPDATE producto',
      description: `Permite al PRODUCTOR modificar un producto a su catálogo.`,
      params: Type.Object({
        productor: Producto.properties.productor,
        producto: Producto.properties.producto,
      }),
      body: POSTProducto, //Sin fotos ni videos.
      response: {
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    // preHandler : //FIXME: fastify.seModificaASiMismo y el coincide id_productor en body y params
    handler: async function (req, reply) {
      reply.code(204);
      const producto = await productoRepository.getOneBy({
        productor: req.params.productor,
        producto: req.params.producto,
      });
      await productoRepository.update(producto.id_producto, req.body);
    },
  });

  fastify.delete('/', {
    schema: {
      tags: ['Productos'],
      summary: 'DELETE producto',
      description: `Permite al PRODUCTOR borrar (si nunca fue vendido) un producto a su catálogo.`,
      params: Type.Object({
        productor: Producto.properties.productor,
        producto: Producto.properties.producto,
      }),
      response: {
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo y el coincide id_productor en body y params
    handler: async function (req, reply) {
      reply.code(204);
      const producto = await productoRepository.getOneBy({ producto: req.params.producto });
      await productoRepository.remove(producto.id_producto);
    },
  });

  fastify.patch('/', {
    schema: {
      tags: ['Productos'],
      summary: 'ACTIVAR/DESACTIVAR producto',
      description: `Permite al PRODUCTOR activar o desactivar`,
      params: Type.Object({
        productor: Producto.properties.productor,
        producto: Producto.properties.producto,
      }),
      body: Type.Object({ activo: Type.Boolean() }), //FIXME: Con fotos y video?
      response: {
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo y el coincide id_productor en body y params
    handler: async function (req, reply) {
      reply.code(204);
      const producto = await productoRepository.getOneBy({ producto: req.params.producto });

      if (req.body.activo) await productoRepository.activate(producto.id_producto);
      if (!req.body.activo) await productoRepository.deactivate(producto.id_producto);
      console.log('PATCH Prodcuto');
    },
  });
};

export default productorIdUsuarioProductosRoutes;
