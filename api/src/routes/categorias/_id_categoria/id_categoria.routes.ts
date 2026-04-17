import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { categoriasRepository } from '@repositories/categorias.repository.js';
import { Categoria } from '@schemas/categoria.schema.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';

const rutasEtiquetas: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.put('/', {
    schema: {
      tags: ['categorias'],
      summary: 'Actualizar categoria',
      description: 'Permite actualizar una categoria global.',
      params: Type.Object({
        id_categoria: Categoria.properties.id_categoria,
      }),
      body: Type.Omit(Categoria, ['slug_categoria'], {
        description: 'Datos necesarios para editar una categoria.',
        examples: [
          {
            id_categoria: 6,
            nombre: 'categoria 6',
            descripcion: 'descripcion de la categoria 6',
          },
          {
            id_categoria: 7,
            nombre: 'categoria 7',
            descripcion: 'descripcion de la categoria 7',
          },
        ],
      }),
      response: {
        200: Categoria,
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      return categoriasRepository.update(req.params.id_categoria, req.body);
    },
  });

  fastify.delete('/', {
    schema: {
      tags: ['categorias'],
      summary: 'Borrar categoria',
      description: 'Permite actualizar una categoria global.',
      params: Type.Object({
        id_categoria: Categoria.properties.id_categoria,
      }),
      response: {
        204: Type.Null(),
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      reply.code(204);
      await categoriasRepository.remove(req.params.id_categoria);
    },
  });
};

export default rutasEtiquetas;
