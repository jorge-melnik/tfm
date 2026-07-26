import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { categoriasRepository } from '@repositories/categorias.repository.js';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';
import { Categoria, Etiqueta, Subcategoria } from '@schemas/categoria.schema.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';

const rutasSlugCategorias: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Categorias'],
      summary: 'READ categoria',
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

  fastify.put('/', {
    schema: {
      tags: ['Categorias'],
      summary: 'UPDATE categoria',
      description: 'Permite actualizar una categoria global.',
      params: Type.Object({
        slug_categoria: Categoria.properties.slug_categoria,
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
        204: Type.Null(),
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      reply.code(204);
      const categoria = await categoriasRepository.getOneBy({ slug_categoria: req.params.slug_categoria });
      await categoriasRepository.update(categoria.id_categoria, req.body);
    },
  });

  fastify.delete('/', {
    schema: {
      tags: ['Categorias'],
      summary: 'DELETE categoria',
      description: 'Permite borrar una categoria global.',
      params: Type.Object({
        slug_categoria: Categoria.properties.slug_categoria,
      }),
      response: {
        204: Type.Null(),
        404: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      reply.code(204);
      const categoria = await categoriasRepository.getOneBy({ slug_categoria: req.params.slug_categoria });
      await categoriasRepository.remove(categoria.id_categoria);
    },
  });

  fastify.patch('/', {
    schema: {
      tags: ['Categorias'],
      summary: 'ACTIVAR/DESACTIVAR Categoria',
      description: `Permite al ADMIN activar o desactivar Categoría`,
      params: Type.Object({
        slug_categoria: Categoria.properties.slug_categoria,
      }),
      body: Type.Object({ activo: Type.Boolean() }), //FIXME: Con fotos y video?
      response: {
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: Solo admin
    handler: async function (req, reply) {
      reply.code(204);
      const categoria = await categoriasRepository.getOneBy({ slug_categoria: req.params.slug_categoria });
      if (req.body.activo) return categoriasRepository.activate(categoria.id_categoria);
      return categoriasRepository.deactivate(categoria.id_categoria);
    },
  });

  fastify.get('/subcategorias', {
    schema: {
      tags: ['Subcategorias'],
      summary: 'READ subcategorias',
      description: `
        Devuelve el listado de subcategorias de la categoría con el slug_categoria especificado. 
      `,

      params: Type.Object({
        slug_categoria: Categoria.properties.slug_categoria,
      }),
      response: {
        200: Type.Array(Subcategoria),
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, reply) {
      return (await subcategoriasRepository.getBy({ slug_categoria: req.params.slug_categoria })).data;
    },
  });

  fastify.get('/etiquetas', {
    schema: {
      tags: ['Categorias'],
      summary: 'READ etiquetas.',
      description: `
        Devuelve el listado completo de etiquetas globales existentes en el sistema. 
      `,
      params: Type.Object({
        slug_categoria: Categoria.properties.slug_categoria,
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
      return categoriasRepository.getEtiquetas(req.params.slug_categoria);
    },
  });
};

export default rutasSlugCategorias;
