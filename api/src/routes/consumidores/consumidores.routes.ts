// import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
// import { consumidorRepository } from '@repositories/consumidor.repository.js';
// import { Consumidor } from '@schemas/consumidores.schema.js';

// import { ErrorResponse } from '@schemas/core.schemas.js';

// const rutasConsumidores: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
//   fastify.get('/', {
//     schema: {
//       tags: ['Consumidores'],
//       summary: 'READ consumidores',
//       description: `
//         Devuelve el listado completo de consumidores registrados.
//       `,
//       response: {
//         200: Type.Array(Consumidor, { description: 'Listado de consumidores.' }),
//         500: ErrorResponse,
//       },
//     },
//     // onRequest : //FIXME: Solo para admin.
//     handler: async function (req, reply) {

//     },
//   });
// };

// export default rutasConsumidores;
