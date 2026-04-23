import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productorRepository } from '@repositories/productor.repository.js';

import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { Productor } from '@schemas/productores.schema.js';

const productorUsernameRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Productores'],
      summary: 'READ productor.',
      description: `
        Busca y devuelve un productor por su username (slug). Todos los usuarios pueden obtener la info de un productor (incluido el mismo) con este endpoint
      `,
      params: Type.Object({ username: Productor.properties.username }),
      response: {
        200: Productor,
        500: DeAcaErrorResponse,
      },
    },
    // preHandler: //FIXME No se que verificar aca:
    handler: async function (req, reply) {
      return productorRepository.getOneBy({ username: req.params.username });
    },
  });
};

export default productorUsernameRoutes;
