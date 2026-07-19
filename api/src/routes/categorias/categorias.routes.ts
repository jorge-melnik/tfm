import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { categoriasRepository } from '@repositories/categorias.repository.js';
import { Categoria } from '@schemas/categoria.schema.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';

const rutasEtiquetas: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Categorias'],
      summary: 'READ categorias',
      description: `
        Devuelve el listado completo de categorias existentes en el sistema. 
        Estas categorias pueden ser usadas en los productos por medio de una subcategoria. 
      `,
      response: {
        200: Type.Array(Categoria, {
          examples: [
            [
              {
                id_categoria: 1,
                nombre: 'categoria 1',
                descripcion: 'descripcion de la categoria 1',
              },
              {
                id_categoria: 2,
                nombre: 'categoria 2',
                descripcion: 'descripcion de la categoria 1',
              },
            ],
          ],
        }),
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      return categoriasRepository.getAll();
    },
  });
};

export default rutasEtiquetas;
