import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productoRepository } from '@repositories/producto.repository.js';

import { DeAcaErrorResponse, DeAcaListResponse, DeAcaQueryString } from '@schemas/core.schemas.js';
import { Producto } from '@schemas/producto.schema.js';

const productosRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Productos'],
      summary: 'READ productos',
      description: `
        Devuelve el listado completo de productos registrados. 
      `,
      querystring: Type.Intersect([
        DeAcaQueryString,
        Type.Object({
          username: Type.Optional(Type.String()),
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
};

export default productosRoutes;
