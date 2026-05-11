import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';
import { Categoria, Subcategoria } from '@schemas/categoria.schema.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';

const rutasEtiquetas: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Admin: Subcategorias'],
      summary: 'READ subcategorias',
      description: `
Devuelve el listado completo de subcategorías sin importar su categoría. 
          `,
      response: {
        200: Type.Array(Subcategoria, {
          examples: [
            [
              {
                id_categoria: 1,
                nombre: 'subcategoria 1',
                slug: 'subcategoria-1',
                descripcion: 'descripcion de la subcategoria 1',
                activo: true,
              },
              {
                id_categoria: 2,
                nombre: 'subcategoria 2',
                slug: 'subcategoria-1',
                descripcion: 'descripcion de la subcategoria 1',
                activo: true,
              },
            ],
          ],
        }),
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      return subcategoriasRepository.getAll();
    },
  });
};

export default rutasEtiquetas;
