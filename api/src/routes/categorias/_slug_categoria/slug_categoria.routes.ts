import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { categoriasRepository } from '@repositories/categorias.repository.js';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';
import { Categoria, Subcategoria } from '@schemas/categoria.schema.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';

const rutasEtiquetas: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['categorias'],
      summary: 'Obtener categoria',
      description: 'Permite obtener una categoría por su slug.',
      params: Type.Object({
        slug_categoria: Categoria.properties.slug_categoria,
      }),
      response: {
        200: Categoria,
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      return categoriasRepository.getOneBy({ slug_categoria: req.params.slug_categoria });
    },
  });

  fastify.get('/subcategorias', {
    schema: {
      tags: ['categorias'],
      summary: 'Listado de subcategorias.',
      description: `
        Devuelve el listado de subcategorias en la categoría con el slug_categoria estpecificado. 
        Estas subcategorias pueden ser usadas en los productos. 
      `,
      params: Type.Object({
        slug_categoria: Categoria.properties.slug_categoria,
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
      return subcategoriasRepository.getBy({ slug_categoria: req.params.slug_categoria });
    },
  });

  fastify.get('/subcategorias/:slug_subcategoria', {
    schema: {
      tags: ['categorias'],
      summary: 'Obtener subcategoria por slug',
      description:
        'Permite obtener una subcategoría a partir del slug de la categoría y el slug de la subcategoría.',
      params: Type.Object({
        slug_categoria: Categoria.properties.slug_categoria,
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
        slug_categoria: req.params.slug_categoria,
        slug_subcategoria: req.params.slug_subcategoria,
      });
    },
  });
};

export default rutasEtiquetas;
