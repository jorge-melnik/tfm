import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';
import { Categoria, Etiqueta, Subcategoria } from '@schemas/categoria.schema.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';

const etiquetasSubcategoriaRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/etiquetas', {
    schema: {
      tags: ['Subcategorias'],
      summary: 'READ etiquetas.',
      description: `
        Devuelve el listado completo de etiquetas globales existentes en el sistema. 
      `,
      params: Type.Object({
        slug_categoria: Categoria.properties.slug_categoria,
        slug_subcategoria: Subcategoria.properties.slug_subcategoria,
      }),
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
      return subcategoriasRepository.getEtiquetas(req.params.slug_categoria, req.params.slug_subcategoria);
    },
  });

  fastify.post('/', {
    schema: {
      tags: ['Subcategorias'],
      summary: 'ADD etiqueta',
      description: 'Permite asociar una subcategoría con una etiqueta ya existente.',
      params: Type.Object({
        slug_categoria: Categoria.properties.slug_categoria,
        slug_subcategoria: Subcategoria.properties.slug_subcategoria,
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
      const subcategoria = await subcategoriasRepository.getOneBy({
        slug_categoria: req.params.slug_categoria,
        slug_subcategoria: req.params.slug_subcategoria,
      });
      return subcategoriasRepository.addEtiqueta(
        subcategoria.id_categoria,
        subcategoria.id_subcategoria,
        req.body.id_etiqueta,
      );
    },
  });

  fastify.patch('/', {
    schema: {
      tags: ['Subcategorias'],
      summary: 'SET etiquetas',
      description:
        'Permite determinar en una única solicitud las etiquetas que deben quedar asociadas a la subcategoria.',
      params: Type.Object({
        slug_categoria: Categoria.properties.slug_categoria,
        slug_subcategoria: Subcategoria.properties.slug_subcategoria,
      }),
      body: Type.Object({
        slug_categoria: Categoria.properties.slug_categoria,
        slug_subcategoria: Subcategoria.properties.slug_subcategoria,
        id_etiquetas: Type.Array(Etiqueta.properties.id_etiqueta),
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
        slug_categoria: req.params.slug_categoria,
        slug_subcategoria: req.params.slug_subcategoria,
      });
      return subcategoriasRepository.setEtiquetas(
        subcategoria.id_categoria,
        subcategoria.id_subcategoria,
        req.body.id_etiquetas,
      );
    },
  });

  fastify.delete('/:id_etiqueta', {
    schema: {
      tags: ['Subcategorias'],
      summary: 'REMOVE etiqueta',
      description: 'Permite desasociar una subcategoría con una etiqueta.',
      params: Type.Object({
        slug_categoria: Categoria.properties.slug_categoria,
        slug_subcategoria: Subcategoria.properties.slug_subcategoria,
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
      const subcategoria = await subcategoriasRepository.getOneBy({
        slug_categoria: req.params.slug_categoria,
        slug_subcategoria: req.params.slug_subcategoria,
      });
      return subcategoriasRepository.removeEtiqueta(
        subcategoria.id_categoria,
        subcategoria.id_subcategoria,
        req.params.id_etiqueta,
      );
    },
  });
};

export default etiquetasSubcategoriaRoutes;
