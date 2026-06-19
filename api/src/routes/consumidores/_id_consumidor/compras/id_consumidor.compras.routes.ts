import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { consumidorRepository } from '@repositories/consumidor.repository.js';
import { Consumidor } from '@schemas/consumidores.schema.js';

import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { DatosPersonales } from '@schemas/usuarios.schema.js';

const rutasComprasUsername: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  // fastify.get('/', {
  //   schema: {
  //     tags: ['Consumidores'],
  //     summary: 'READ compras consumidor',
  //     description: `
  //       Devuelve el listado completo de compras de un consumidor.
  //     `,
  //     params: Type.Object({
  //       username: DatosPersonales.properties.username,
  //     }),
  //     response: {
  //       200: Type.Array(Consumidor, { description: 'Listado de consumidores.' }),
  //       500: DeAcaErrorResponse,
  //     },
  //   },
  //   // onRequest : //FIXME: Solo para admin.
  //   handler: async function (req, reply) {
  //     //FIXME: Eventualmente esto no conviene que devuelva TODO. paginar.
  //     return consumidorRepository.getBy({ username: req.params.username });
  //   },
  // });
};

export default rutasComprasUsername;
