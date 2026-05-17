import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productoRepository } from '@repositories/producto.repository.js';

import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { Producto } from '@schemas/producto.schema.js';

const productosRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Productos'],
      summary: 'READ productores',
      description: `
        Devuelve el listado completo de productores registrados. 
      `,
      response: {
        200: Type.Array(Producto, { description: 'Listado de productos con filtrado y paginación.' }),
        500: DeAcaErrorResponse,
      },
    },
    // onRequest : //FIXME: Solo para admin.
    handler: async function (req, reply) {
      //FIXME: Eventualmente esto no conviene que devuelva TODO. paginar.
      return productoRepository.getAll();
    },
  });
};

export default productosRoutes;
//TODO: Necesario esta ruta?
//Mejor hacer un /admin/usuarios y ya.
