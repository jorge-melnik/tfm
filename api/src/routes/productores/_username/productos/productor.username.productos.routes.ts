import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productoRepository } from '@repositories/producto.repository.js';

import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { Producto } from '@schemas/producto.schema.js';
import { Productor } from '@schemas/productores.schema.js';

const productoIdUsuarioRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Productores'],
      summary: 'READ productos',
      description: `Permite Obtener el listado completo de productos (activos o no) de un productor. `,
      params: Type.Object({ id_usuario: Productor.properties.id_usuario }),
      response: {
        200: Type.Array(Producto),
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo
    handler: async function (req, reply) {
      return productoRepository.getBy({ id_productor: req.params.id_usuario });
    },
  });
};

export default productoIdUsuarioRoutes;
