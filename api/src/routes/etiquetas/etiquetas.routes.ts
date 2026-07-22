import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { etiquetasRepository } from '@repositories/etiquetas.repository.js';
import { Etiqueta } from '@schemas/categoria.schema.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';

const rutasAdminEtiquetas: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Etiquetas'],
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

  fastify.get('/:slug_etiqueta', {
    schema: {
      tags: ['Etiquetas'],
      summary: 'READ etiqueta',
      description: 'Permite actualizar una etiqueta global.',
      params: Type.Object({
        slug_etiqueta: Etiqueta.properties.slug_etiqueta,
      }),
      response: {
        200: Etiqueta,
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      return etiquetasRepository.getOneBy({ slug_etiqueta: req.params.slug_etiqueta });
    },
  });

  fastify.post('/', {
    schema: {
      tags: ['Etiquetas'],
      summary: 'CREATE etiqueta.',
      description: 'Permite crear una nueva etiqueta global.',
      body: Type.Omit(Etiqueta, ['id_etiqueta', 'slug_categoria'], {
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
      return await etiquetasRepository.add({
        ...req.body,
        slug_etiqueta: '', //Para que sepa que tiene que calcularlo.
      });
    },
  });

  fastify.put('/:slug_etiqueta', {
    schema: {
      tags: ['Etiquetas'],
      summary: 'UPDATE etiqueta',
      description: 'Permite actualizar una etiqueta global.',
      params: Type.Object({
        slug_etiqueta: Etiqueta.properties.slug_etiqueta,
      }),
      body: Type.Omit(Etiqueta, ['slug_categoria']),
      response: {
        204: Type.Null(),
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      reply.code(204);
      const etiqueta = await etiquetasRepository.getOneBy({ slug_etiqueta: req.params.slug_etiqueta });
      await etiquetasRepository.update(etiqueta.id_etiqueta, req.body);
    },
  });

  fastify.delete('/:slug_etiqueta', {
    schema: {
      tags: ['Etiquetas'],
      summary: 'DELETE etiqueta',
      description: 'Permite actualizar una etiqueta global.',
      params: Type.Object({
        slug_etiqueta: Etiqueta.properties.slug_etiqueta,
      }),
      response: {
        204: Type.Null(),
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      reply.code(204);
      const etiqueta = await etiquetasRepository.getOneBy({ slug_etiqueta: req.params.slug_etiqueta });
      await etiquetasRepository.remove(etiqueta.id_etiqueta);
    },
  });
};

export default rutasAdminEtiquetas;
