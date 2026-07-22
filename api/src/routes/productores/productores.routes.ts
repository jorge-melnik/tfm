import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productorRepository } from '@repositories/productor.repository.js';

import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { Productor } from '@schemas/productores.schema.js';

const productoresRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Productores'],
      summary: 'READ productores',
      description: `
        Devuelve el listado completo de productores registrados. 
      `,
      response: {
        200: Type.Array(Productor, { description: 'Listado de productores.' }),
        500: DeAcaErrorResponse,
      },
    },
    // onRequest : //FIXME: Solo para admin.
    handler: async function (req, reply) {
      //FIXME: Eventualmente esto no conviene que devuelva TODO. paginar.
      return productorRepository.getAll();
    },
  });
};

export default productoresRoutes;
//TODO: Necesario esta ruta?
//Mejor hacer un /admin/usuarios y ya.
