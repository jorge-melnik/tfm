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
};

export default productorIdUsuarioProductosRoutes;
