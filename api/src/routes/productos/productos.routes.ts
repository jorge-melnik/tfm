import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { productoRepository } from '@repositories/producto.repository.js';

import { DeAcaErrorResponse, DeAcaListResponse, DeAcaQueryString } from '@schemas/core.schemas.js';
import { Producto } from '@schemas/producto.schema.js';

const productosRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Productos'],
      summary: 'READ productores',
      description: `
        Devuelve el listado completo de productores registrados. 
      `,
      querystring: DeAcaQueryString,
      response: {
        200: DeAcaListResponse(Producto),
        500: DeAcaErrorResponse,
      },
    },
    // onRequest : //FIXME: Solo para admin.
    handler: async (req, reply) => {
      console.log(req.query);
      return productoRepository.getBy(req.query); //Paginado
    },
  });
};

export default productosRoutes;
//TODO: Necesario esta ruta?
//Mejor hacer un /admin/usuarios y ya.
