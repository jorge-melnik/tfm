import { myPool } from '@database/pool.js';
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import {
  datosPersonalesRepository,
  DatosPersonalessRepositoryClass,
} from '@repositories/datos-personales.respository.js';
import { productorRepository, ProductorRepositoryClass } from '@repositories/productor.repository.js';

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
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo
    handler: async function (req, reply) {
      const { id_productor } = req.params;
      const { presentacion, nombres, apellidos, email, celular } = req.body;
      const client = await myPool.connect();
      try {
        const prodRepoWT: ProductorRepositoryClass = productorRepository.withTransaction(client);
        const dpRepoWT: DatosPersonalessRepositoryClass = datosPersonalesRepository.withTransaction(client);

        await client.query('BEGIN;');
        await prodRepoWT.update(req.params.id_productor, { presentacion }); //Actualizo datos específicos del productor
        await dpRepoWT.update(id_productor, {
          nombres,
          apellidos,
          email,
          celular,
        }); //Actualizo datos personales del usuario
        await client.query('COMMIT;');
      } catch (error: any) {
        throw error;
      } finally {
        client.release(); //Necesitamos el try catch para siempre liberar el client
      }
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
