import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';
import { Categoria, Etiqueta, Subcategoria } from '@schemas/categoria.schema.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';

const rutasEtiquetas: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Etiquetas'],
      summary: 'READ etiquetas.',
      description: `
        Devuelve el listado completo de etiquetas globales existentes en el sistema. 
      `,
      params: Type.Object({
        slug_categoria: Categoria.properties.slug_categoria,
        slug_subcategoria: Subcategoria.properties.slug_categoria,
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
};

export default rutasEtiquetas;
