import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { categoriasRepository } from '@repositories/categorias.repository.js';
import { Categoria } from '@schemas/categoria.schema.js';
import { ErrorResponse } from '@schemas/core.schemas.js';

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
                activo: true,
              },
              {
                id_categoria: 2,
                nombre: 'categoria 2',
                descripcion: 'descripcion de la categoria 1',
                activo: true,
              },
            ],
          ],
        }),
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (req, reply) {
      return categoriasRepository.getAll();
    },
  });

  fastify.post('/', {
    schema: {
      tags: ['Categorias'],
      summary: 'CREATE categoria',
      description: 'Permite crear una nueva categoria.',
      body: Type.Omit(Categoria, ['id_categoria', 'categoria'], {
        description: 'Datos necesarios para crear una nueva categoria.',
        examples: [
          {
            nombre: 'categoria 6',
            descripcion: 'descripcion de la categoria 6',
          },
          {
            nombre: 'categoria 7',
            descripcion: 'descripcion de la categoria 7',
          },
        ],
      }),
      response: {
        201: Categoria,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.hasAllRoles(['ADMIN'])],
    handler: async function (req, reply) {
      reply.code(201);
      return await categoriasRepository.add({
        ...req.body,
        categoria: '', //Para que sepa que hay que calcularlo.
      });
    },
  });
};

export default rutasEtiquetas;
