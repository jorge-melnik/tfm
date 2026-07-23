import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';
import { Subcategoria } from '@schemas/categoria.schema.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';

const rutasEtiquetas: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Subcategorias'],
      summary: 'READ subcategoria',
      description:
        'Permite obtener una subcategoría a partir del slug de la categoría y el slug de la subcategoría.',
      params: Type.Object({
        slug_subcategoria: Subcategoria.properties.slug_subcategoria,
      }),
      response: {
        200: Subcategoria,
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      return subcategoriasRepository.getOneBy({
        slug_subcategoria: req.params.slug_subcategoria,
      });
    },
  });

  fastify.put('/', {
    schema: {
      tags: ['Subcategorias'],
      summary: 'UPDATE subcategoria',
      description: 'Permite actualizar una subcategoria global.',
      params: Type.Object({
        slug_subcategoria: Subcategoria.properties.slug_subcategoria,
      }),
      body: Type.Object(
        {
          slug_categoria: Subcategoria.properties.slug_categoria,
          nombre: Subcategoria.properties.nombre,
        },
        {
          additionalProperties: false,
        },
      ),
      response: {
        204: Type.Null(),
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      reply.code(204);
      const subcategoria = await subcategoriasRepository.getOneBy({
        slug_subcategoria: req.params.slug_subcategoria,
      });
      await subcategoriasRepository.update(subcategoria.id_subcategoria, req.body);
    },
  });

  fastify.delete('/', {
    schema: {
      tags: ['Subcategorias'],
      summary: 'DELETE subcategoria',
      description: 'Permite actualizar una subcategoria global.',
      params: Type.Object({
        slug_subcategoria: Subcategoria.properties.slug_subcategoria,
      }),
      response: {
        204: Type.Null(),
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      reply.code(204);
      const subcategoria = await subcategoriasRepository.getOneBy({
        slug_subcategoria: req.params.slug_subcategoria,
      });
      await subcategoriasRepository.remove(subcategoria.id_subcategoria);
    },
  });

  fastify.patch('/', {
    schema: {
      tags: ['Subcategorias'],
      summary: 'ACTIVAR/DESACTIVAR Subcategoria',
      description: `Permite al ADMIN activar o desactivar Subcategoría`,
      params: Type.Object({
        slug_subcategoria: Subcategoria.properties.slug_subcategoria,
      }),
      body: Type.Object({ activo: Type.Boolean() }),
      response: {
        // 200: Categoria,
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: Solo admin
    handler: async function (req, reply) {
      reply.code(204);
      const subcategoria = await subcategoriasRepository.getOneBy({
        slug_subcategoria: req.params.slug_subcategoria,
      });
      if (req.body.activo) return subcategoriasRepository.activate(subcategoria.id_subcategoria);
      return subcategoriasRepository.deactivate(subcategoria.id_subcategoria);
    },
  });
};

export default rutasEtiquetas;
