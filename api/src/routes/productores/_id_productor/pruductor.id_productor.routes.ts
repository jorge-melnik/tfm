import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productorRepository } from '@repositories/productor.repository.js';

import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { Productor } from '@schemas/productores.schema.js';

const productoIdUsuarioRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.put('/', {
    schema: {
      tags: ['Productores'],
      summary: 'UPDATE productor',
      description: `
        Permite que el productor autenticado actualice sus propios datos. 
      `,
      params: Type.Object({ id_productor: Productor.properties.id_productor }),
      body: Productor,
      response: {
        200: Productor,
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo
    handler: async function (req, reply) {
      //TODO: Hacer override update en productorRepository, para que actualice las distintas tablas. Idem para consumidor.
      return productorRepository.update(req.params.id_productor, { presentacion: req.body.presentacion });
    },
  });

  fastify.delete('/', {
    schema: {
      tags: ['Productores'],
      summary: 'DELETE productor',
      description: `
        Permite que el usuario se de de baja como productor, desactivando (no borrando) sus rol de productor. 
      `,
      params: Type.Object({ id_productor: Productor.properties.id_productor }),
      body: Productor,
      response: {
        204: Productor,
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo
    handler: async function (req, reply) {
      reply.code(204);
      await productorRepository.deactivate(req.params.id_productor);
    },
  });
};

export default productoIdUsuarioRoutes;
