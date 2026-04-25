import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { etiquetasRepository } from '@repositories/etiquetas.repository.js';
import { Etiqueta } from '@schemas/categoria.schema.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';

const rutasEtiquetas: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Admin: Etiquetas'],
      summary: 'READ etiquetas.',
      description: `
        Devuelve el listado completo de etiquetas globales existentes en el sistema. 
        Estas etiquetas pueden ser usadas en los productos (si la subcategoría lo permite). 
        Cada subcategoría de productos soporta un conjunto determinado de etiquetas.
      `,
      response: {
        200: Type.Array(Etiqueta, {
          examples: [
            [
              { id_etiqueta: 1, nombre: 'etiqueta 1' },
              { id_etiqueta: 2, nombre: 'etiqueta 2' },
            ],
          ],
        }),
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      return etiquetasRepository.getAll();
    },
  });

  fastify.get('/:id_etiqueta', {
    schema: {
      tags: ['Admin: Etiquetas'],
      summary: 'READ etiqueta',
      description: 'Permite actualizar una etiqueta global.',
      params: Type.Object({
        id_etiqueta: Etiqueta.properties.id_etiqueta,
      }),
      response: {
        200: Etiqueta,
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      return etiquetasRepository.getOneBy({ id_etiqueta: req.params.id_etiqueta });
    },
  });

  fastify.post('/', {
    schema: {
      tags: ['Admin: Etiquetas'],
      summary: 'CREATE etiqueta.',
      description: 'Permite crear una nueva etiqueta global.',
      body: Type.Omit(Etiqueta, ['id_etiqueta'], {
        description: 'Datos necesarios para crear una nueva etiqueta.',
        examples: [{ nombre: 'nueva Etiqueta 1' }, { nombre: 'nueva Etiqueta 2' }],
      }),
      response: {
        201: Etiqueta,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      reply.code(201);
      return await etiquetasRepository.add(req.body);
    },
  });

  fastify.put('/:id_etiqueta', {
    schema: {
      tags: ['Admin: Etiquetas'],
      summary: 'UPDATE etiqueta',
      description: 'Permite actualizar una etiqueta global.',
      params: Type.Object({
        id_etiqueta: Etiqueta.properties.id_etiqueta,
      }),
      body: Etiqueta,
      response: {
        204: Type.Null(),
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      reply.code(204);
      await etiquetasRepository.update(req.params.id_etiqueta, req.body);
    },
  });

  fastify.delete('/:id_etiqueta', {
    schema: {
      tags: ['Admin: Etiquetas'],
      summary: 'DELETE etiqueta',
      description: 'Permite actualizar una etiqueta global.',
      params: Type.Object({
        id_etiqueta: Etiqueta.properties.id_etiqueta,
      }),
      response: {
        204: Type.Null(),
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      reply.code(204);
      await etiquetasRepository.remove(req.params.id_etiqueta);
    },
  });
};

export default rutasEtiquetas;
