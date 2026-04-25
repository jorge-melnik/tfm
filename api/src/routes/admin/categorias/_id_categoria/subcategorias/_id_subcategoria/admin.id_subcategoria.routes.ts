import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';
import { Categoria, Subcategoria } from '@schemas/categoria.schema.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';

const idSubcategoriasRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Admin: Subcategorias'],
      summary: 'READ subcategoria',
      description:
        'Permite obtener una subcategoría a partir del id de la categoría y el id de la subcategoría.',
      params: Type.Object({
        id_categoria: Categoria.properties.id_categoria,
        id_subcategoria: Subcategoria.properties.id_subcategoria,
      }),
      response: {
        200: Subcategoria,
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      return subcategoriasRepository.getOneBy({
        id_categoria: req.params.id_categoria,
        id_subcategoria: req.params.id_subcategoria,
      });
    },
  });

  fastify.put('/', {
    schema: {
      tags: ['Admin: Subcategorias'],
      summary: 'UPDATE subcategoria',
      description: 'Permite actualizar una subcategoria global.',
      params: Type.Object({
        id_categoria: Categoria.properties.id_categoria,
        id_subcategoria: Subcategoria.properties.id_subcategoria,
      }),
      body: Type.Omit(Subcategoria, ['id_categoria', 'slug_categoria', 'slug_subcategoria', 'activo'], {
        examples: [{ id_subcategoria: 20, nombre: 'nombre cambiado' }],
      }),
      response: {
        200: Subcategoria,
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      await subcategoriasRepository.update(req.params.id_subcategoria, req.body);
      return subcategoriasRepository.getOneBy({ id_subcategoria: req.params.id_subcategoria });
    },
  });

  fastify.delete('/', {
    schema: {
      tags: ['Admin: Subcategorias'],
      summary: 'DELETE subcategoria',
      description: 'Permite actualizar una subcategoria global.',
      params: Type.Object({
        id_categoria: Categoria.properties.id_categoria,
        id_subcategoria: Subcategoria.properties.id_subcategoria,
      }),
      response: {
        204: Type.Null(),
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      reply.code(204);
      await subcategoriasRepository.remove(req.params.id_subcategoria);
    },
  });

  fastify.patch('/', {
    schema: {
      tags: ['Admin: Subcategorias'],
      summary: 'ACTIVAR/DESACTIVAR Categoria',
      description: `Permite al ADMIN activar o desactivar Subcategoría`,
      params: Type.Object({
        id_categoria: Categoria.properties.id_categoria,
        id_subcategoria: Subcategoria.properties.id_subcategoria,
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
      if (req.body.activo) return subcategoriasRepository.activate(req.params.id_subcategoria);
      return subcategoriasRepository.deactivate(req.params.id_subcategoria);
    },
  });
};

export default idSubcategoriasRoutes;
