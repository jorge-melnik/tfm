import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';
import { Categoria, Etiqueta, Subcategoria } from '@schemas/categoria.schema.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';

const etiquetasSubcategoriaRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Admin: Subcategorias'],
      summary: 'READ etiquetas. ',
      description:
        'Permite obtener las etiquetas asociadas a una subcategoría. Si se usa con un id_categoría que no coincide con el de la etiqueta, devuelve una lista vacía.',
      params: Type.Object({
        id_categoria: Categoria.properties.id_categoria,
        id_subcategoria: Subcategoria.properties.id_subcategoria,
      }),
      response: {
        200: Type.Array(Etiqueta),
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      return subcategoriasRepository.getEtiquetas(req.params.id_categoria, req.params.id_subcategoria);
    },
  });

  fastify.post('/', {
    schema: {
      tags: ['Admin: Subcategorias'],
      summary: 'ADD etiqueta',
      description: 'Permite asociar una subcategoría con una etiqueta ya existente.',
      params: Type.Object({
        id_categoria: Categoria.properties.id_categoria,
        id_subcategoria: Subcategoria.properties.id_subcategoria,
      }),
      body: Type.Object({
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
      return subcategoriasRepository.addEtiqueta(
        req.params.id_categoria,
        req.params.id_subcategoria,
        req.body.id_etiqueta,
      );
    },
  });

  fastify.delete('/:id_etiqueta', {
    schema: {
      tags: ['Admin: Subcategorias'],
      summary: 'REMOVE etiqueta',
      description: 'Permite desasociar una subcategoría con una etiqueta.',
      params: Type.Object({
        id_categoria: Categoria.properties.id_categoria,
        id_subcategoria: Subcategoria.properties.id_subcategoria,
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
      return subcategoriasRepository.removeEtiqueta(
        req.params.id_categoria,
        req.params.id_subcategoria,
        req.params.id_etiqueta,
      );
    },
  });
};

export default etiquetasSubcategoriaRoutes;
