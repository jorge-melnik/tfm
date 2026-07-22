import { myPool } from '@database/pool.js';
import { DeAcaInternal } from '@errors/response.errors.js';
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { consumidorRepository, ConsumidorRepositoryClass } from '@repositories/consumidor.repository.js';
import {
  datosPersonalesRepository,
  DatosPersonalessRepositoryClass,
} from '@repositories/datos-personales.respository.js';
import { Consumidor } from '@schemas/consumidores.schema.js';

import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { DatosPersonales } from '@schemas/usuarios.schema.js';

const rutasConsumidorPorUsername: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Consumidores'],
      summary: 'READ consumidor',
      description: `Devuelve el consumidor a partir del slug en params.`,
      params: Type.Object({
        username: DatosPersonales.properties.username,
      }),
      response: {
        200: Consumidor,
        500: DeAcaErrorResponse,
      },
    },
    // onRequest : //FIXME: Solo para admin.
    handler: async function (req, reply) {
      //FIXME: Eventualmente esto no conviene que devuelva TODO. paginar.
      return consumidorRepository.getOneBy({ username: req.params.username });
    },
  });

  fastify.put('/', {
    schema: {
      tags: ['Consumidores'],
      summary: 'UPDATE consumidor',
      description: `
        Permite que el consumidor autenticado actualice sus propios datos. 
      `,
      params: Type.Object({ username: Consumidor.properties.username }),
      body: Consumidor,
      response: {
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo
    handler: async function (req, reply) {
      reply.code(204);
      const { username } = req.params;
      const usuario = await datosPersonalesRepository.getOneBy({ username });
      const id_consumidor = usuario.id_usuario;
      const { nombres, apellidos, email, celular } = req.body;
      const client = await myPool.connect();
      try {
        const prodRepoWT: ConsumidorRepositoryClass = consumidorRepository.withTransaction(client);
        const dpRepoWT: DatosPersonalessRepositoryClass = datosPersonalesRepository.withTransaction(client);
        // TODO: Está feo ese datosPersonalesRepository, lo que sea que haga se podría repetir en el consumidor y productor repository?
        await client.query('BEGIN;');
        await prodRepoWT.update(id_consumidor, {}); //Actualizo datos específicos del consumidor
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
      tags: ['Consumidores'],
      summary: 'DELETE consumidor',
      description: `
        Permite que el usuario se de de baja como consumidor, desactivando (no borrando) sus rol de consumidor. 
      `,
      params: Type.Object({ username: Consumidor.properties.username }),
      response: {
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo
    handler: async function (req, reply) {
      reply.code(204);
      const usuario = await datosPersonalesRepository.getOneBy({ username: req.params.username });
      await consumidorRepository.deactivate(usuario.id_usuario);
    },
  });
};

export default rutasConsumidorPorUsername;
//TODO: Necesario esta ruta?
//Mejor hacer un /admin/usuarios y ya.
