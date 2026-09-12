import { myPool } from '@database/pool.js';
import { InternalError } from '@errors/response.errors.js';
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import {
  datosPersonalesRepository,
  DatosPersonalessRepositoryClass,
} from '@repositories/datos-personales.respository.js';
import { productorRepository, ProductorRepositoryClass } from '@repositories/productor.repository.js';

import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { Productor } from '@schemas/productores.schema.js';

const productorUsernameRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Productores'],
      summary: 'READ productor.',
      description: `
        Busca y devuelve un productor por su productor (slug). Todos los usuarios pueden obtener la info de un productor (incluido el mismo) con este endpoint
      `,
      params: Type.Object({ productor: Productor.properties.username }),
      response: {
        200: Productor,
        500: DeAcaErrorResponse,
      },
    },
    // preHandler: //FIXME No se que verificar aca:
    handler: async function (req, reply) {
      return productorRepository.getOneBy({ username: req.params.productor });
    },
  });

  fastify.put('/', {
    schema: {
      tags: ['Productores'],
      summary: 'UPDATE productor',
      description: `
        Permite que el productor autenticado actualice sus propios datos. 
      `,
      params: Type.Object({ productor: Productor.properties.username }),
      body: Productor,
      response: {
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo
    handler: async function (req, reply) {
      reply.code(204);
      const { presentacion, nombres, apellidos, email, celular, id_ubicacion } = req.body;
      const client = await myPool.connect();
      try {
        const prodRepoWT: ProductorRepositoryClass = productorRepository.withTransaction(client);
        const dpRepoWT: DatosPersonalessRepositoryClass = datosPersonalesRepository.withTransaction(client);
        const productor = await prodRepoWT.getOneBy({ username: req.params.productor });
        const id_productor = productor.id_productor;
        await client.query('BEGIN;');
        await prodRepoWT.update(id_productor, { presentacion, id_ubicacion }); //Actualizo datos específicos del productor
        await dpRepoWT.update(id_productor, {
          nombres,
          apellidos,
          email,
          celular,
        }); //Actualizo datos personales del usuario
        await client.query('COMMIT;');
      } catch (error: any) {
        await client.query('ROLLBACK');
        throw new InternalError(error.message);
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
      params: Type.Object({ productor: Productor.properties.username }),
      response: {
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo
    handler: async function (req, reply) {
      reply.code(204);
      const productor = await productorRepository.getOneBy({ username: req.params.productor });
      await productorRepository.deactivate(productor.id_productor);
    },
  });
};

export default productorUsernameRoutes;
