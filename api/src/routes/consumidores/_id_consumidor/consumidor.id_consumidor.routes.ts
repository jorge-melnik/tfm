import { myPool } from '@database/pool.js';
import { DeAcaInternal } from '@errors/response.errors.js';
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import {
  datosPersonalesRepository,
  DatosPersonalessRepositoryClass,
} from '@repositories/datos-personales.respository.js';
import { consumidorRepository, ConsumidorRepositoryClass } from '@repositories/consumidor.repository.js';

import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { Consumidor } from '@schemas/consumidores.schema.js';

const productoIdUsuarioRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.put('/', {
    schema: {
      tags: ['Productores'],
      summary: 'UPDATE consumidor',
      description: `
        Permite que el consumidor autenticado actualice sus propios datos. 
      `,
      params: Type.Object({ id_consumidor: Consumidor.properties.id_consumidor }),
      body: Consumidor,
      response: {
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo
    handler: async function (req, reply) {
      reply.code(204);
      const { id_consumidor } = req.params;
      const { nombres, apellidos, email, celular } = req.body;
      const client = await myPool.connect();
      try {
        const prodRepoWT: ConsumidorRepositoryClass = consumidorRepository.withTransaction(client);
        const dpRepoWT: DatosPersonalessRepositoryClass = datosPersonalesRepository.withTransaction(client);
        await client.query('BEGIN;');
        await prodRepoWT.update(req.params.id_consumidor, {}); //Actualizo datos específicos del consumidor
        await dpRepoWT.update(id_consumidor, {
          nombres,
          apellidos,
          email,
          celular,
        }); //Actualizo datos personales del usuario
        await client.query('COMMIT;');
      } catch (error: any) {
        await client.query('ROLLBACK');
        throw new DeAcaInternal(error.message);
      } finally {
        client.release(); //Necesitamos el try catch para siempre liberar el client
      }
    },
  });

  fastify.delete('/', {
    schema: {
      tags: ['Productores'],
      summary: 'DELETE consumidor',
      description: `
        Permite que el usuario se de de baja como consumidor, desactivando (no borrando) sus rol de consumidor. 
      `,
      params: Type.Object({ id_consumidor: Consumidor.properties.id_consumidor }),
      response: {
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo
    handler: async function (req, reply) {
      reply.code(204);
      await consumidorRepository.deactivate(req.params.id_consumidor);
    },
  });
};

export default productoIdUsuarioRoutes;
