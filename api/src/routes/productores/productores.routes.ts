// import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
// import { productorRepository } from '@repositories/productor.repository.js';

// import { ErrorResponse } from '@schemas/core.schemas.js';
// import { Productor } from '@schemas/productores.schema.js';

// const productoresRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
//   fastify.get('/', {
//     schema: {
//       tags: ['Productores'],
//       summary: 'READ productores',
//       description: `
//         Devuelve el listado completo de productores registrados.
//       `,
//       response: {
//         200: Type.Array(Productor, { description: 'Listado de productores.' }),
//         500: ErrorResponse,
//       },
//     },
//     onRequest: [fastify.authenticate, fastify.selfWithRole('PRODUCTOR')],
//     handler: async function (req, reply) {
//       return productorRepository.getAll(); // PAGINAR?
//     },
//   });
// };

// export default productoresRoutes;
