import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { etiquetasRepository } from '@repositories/etiquetas.repository.js';
import { Etiqueta } from '@schemas/categoria.schema.js';
import { DeAcaList } from '@schemas/core.schemas.js';

const rutasEtiquetas: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      response: {
        200: DeAcaList(Etiqueta),
      },
    },
    handler: async function (request, reply) {
      const data = await etiquetasRepository.getAll();
      return {
        data,
      };
    },
  });
};

export default rutasEtiquetas;
