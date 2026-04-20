import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productorRepository } from '@repositories/productor.repository.js';

import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { Productor } from '@schemas/productores.schema.js';

const rutasEtiquetas: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.put('/', {
    schema: {
      tags: ['Productores'],
      summary: 'UPDATE productor',
      description: `
        Permite que el productor autenticado actualice sus propios datos. 
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
