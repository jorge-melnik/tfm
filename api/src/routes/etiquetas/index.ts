import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
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
    handler: async function (req, reply) {
      const data = await etiquetasRepository.getAll();
      return {
        data,
      };
    },
  });

  fastify.post('/', {
    schema: {
      body: Etiqueta,
      response: {
        201: Etiqueta,
      },
    },
    handler: async function (req, reply) {
      const data = await etiquetasRepository.add(req.body);
      reply.code(201);
      return data;
    },
  });

  fastify.put('/:id_etiqueta', {
    schema: {
      params: Type.Pick(Etiqueta, ['id_etiqueta']),
      body: Etiqueta,
      response: {
        204: Etiqueta,
      },
    },
    handler: async function (req, reply) {
      const { id_etiqueta } = req.params;
      const data = await etiquetasRepository.update(id_etiqueta, req.body);
    },
  });
};

export default rutasEtiquetas;
