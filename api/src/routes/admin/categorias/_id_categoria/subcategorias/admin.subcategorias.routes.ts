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
Devuelve el listado de subcategorias en la categoría con el id especificado. 
Estas subcategorias pueden ser usadas en los productos. 
          `,
      params: Type.Object({
        id_categoria: Categoria.properties.id_categoria,
      }),
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
      return subcategoriasRepository.getBy({ id_categoria: req.params.id_categoria });
    },
  });

  fastify.post('/', {
    schema: {
      tags: ['Admin: Subcategorias'],
      summary: 'CREATE subcategoria',
      description: 'Permite crear una nueva subcategoria dentro de la categoría especificada.',
      params: Type.Object({
        id_categoria: Categoria.properties.id_categoria,
      }),
      body: Type.Omit(Subcategoria, ['id_subcategoria', 'activo', 'slug_categoria'], {
        description: 'Datos necesarios para crear una nueva subcategoria.',
        examples: [
          { id_categoria: 1, nombre: 'subcategoria 1', slug_subcategoria: 'subcategoria-1' },
          { id_categoria: 2, nombre: 'subcategoria 2', slug_subcategoria: 'subcategoria-2' },
        ],
      }),
      response: {
        201: Subcategoria,
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : TODO: Verificar que el slug del body coincide con el de params
    handler: async function (req, reply) {
      reply.code(201);
      return await subcategoriasRepository.add(req.body);
    },
  });
};

export default rutasEtiquetas;
