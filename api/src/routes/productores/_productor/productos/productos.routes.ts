import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productoRepository } from '@repositories/producto.repository.js';

import { DeAcaErrorResponse, DeAcaListResponse, DeAcaQueryString } from '@schemas/core.schemas.js';
import { POSTProducto, Producto } from '@schemas/producto.schema.js';
import { Productor } from '@schemas/productores.schema.js';

const productosRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Productores', 'Productos'],
      summary: 'READ productos',
      description: `
        Devuelve el listado completo de productos registrados. 
      `,
      params: Type.Object({ productor: Productor.properties.username }),
      querystring: Type.Intersect([
        DeAcaQueryString,
        Type.Object({
          productor: Type.Optional(Type.String()),
          id_productor: Type.Optional(Type.String()),
          etiquetas: Type.Optional(Type.Array(Type.String())),
          categoria: Type.Optional(Type.String()),
          subcategoria: Type.Optional(Type.String()),
          busqueda: Type.Optional(Type.String()),
        }),
      ]),
      response: {
        200: DeAcaListResponse(Producto),
        500: DeAcaErrorResponse,
      },
    },
    // onRequest: [fastify.authenticate], //FIXME descomentar.
    handler: async (req, reply) => {
      return productoRepository.getBy(req.query); //Paginado
    },
  });

  fastify.post('/', {
    schema: {
      tags: ['Productores', 'Productos'],
      summary: 'ADD producto',
      description: `Permite al PRODUCTOR agregar un producto a su catálogo.`,
      params: Type.Object({ productor: Productor.properties.username }),
      body: POSTProducto,
      response: {
        201: Producto,
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seAccedeASiMIsmo y el coincide id_productor en body y params
    handler: async function (req, reply) {
      reply.code(201);
      return productoRepository.add(req.body);
    },
  });
};

export default productosRoutes;
