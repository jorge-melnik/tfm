import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productorRepository } from '@repositories/productor.repository.js';

import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { Productor } from '@schemas/productores.schema.js';

const rutasEtiquetas: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Productores'],
      summary: 'READ productor.',
      description: `
        Busca y devuelve un productor por su username (slug). 
      `,
      params: Type.Pick(Productor, ['username']),
      response: {
        200: Productor,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      //FIXME: Eventualmente esto no conviene que devuelva TODO. paginar.
      return productorRepository.getOneBy({ username: req.params.username });
    },
  });
};

export default rutasEtiquetas;
