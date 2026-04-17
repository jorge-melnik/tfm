import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';
import { Categoria, Subcategoria } from '@schemas/categoria.schema.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';

const idSubcategoriasRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.put('/', {
    schema: {
      tags: ['categorias'],
      summary: 'Actualizar subcategoria',
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
      return subcategoriasRepository.update(req.params.id_subcategoria, req.body);
    },
  });

  fastify.delete('/', {
    schema: {
      tags: ['categorias'],
      summary: 'Borrar subcategoria',
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
};

export default idSubcategoriasRoutes;
