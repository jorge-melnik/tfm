import { myPool } from '@database/pool.js';
import { DeAcaInternal } from '@errors/response.errors.js';
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productoRepository } from '@repositories/producto.repository.js';

import { DeAcaErrorResponse, DeAcaListResponse, DeAcaQueryString } from '@schemas/core.schemas.js';
import { POSTProducto, Producto } from '@schemas/producto.schema.js';

const productosRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Productos'],
      summary: 'READ productos',
      description: `
        Devuelve el listado completo de productos registrados. 
      `,
      querystring: Type.Intersect([
        DeAcaQueryString,
        Type.Object({
          username: Type.Optional(Type.String()),
          id_productor: Type.Optional(Type.String()),
          etiquetas: Type.Optional(Type.Array(Type.String())),
          categoria: Type.Optional(Type.String()),
          subcategoria: Type.Optional(Type.String()),
          busqueda: Type.Optional(Type.String()),
        }),
      ]),
      response: {
        200: DeAcaListResponse(Producto),
        500: DeAcaErrorResponse,
      },
    },
    // onRequest: [fastify.authenticate], //FIXME descomentar.
    handler: async (req, reply) => {
      return productoRepository.getBy(req.query); //Paginado
    },
  });

  fastify.post('/', {
    schema: {
      tags: ['Productos'],
      summary: 'ADD producto',
      description: `Permite al PRODUCTOR agregar un producto a su catálogo.`,
      body: POSTProducto,
      response: {
        201: Producto,
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seAccedeASiMIsmo y el coincide id_productor en body y params
    handler: async function (req, reply) {
      reply.code(201);
      const client = await myPool.connect();
      const prodRepoWT = productoRepository.withTransaction(client);
      const {
        id_productor,
        id_subcategoria,
        nombre,
        descripcion,
        precio,
        cantidad_disponible,
        id_etiquetas,
      } = req.body;
      try {
        await client.query('BEGIN;');
        const { id_producto } = await prodRepoWT.add({
          id_productor,
          id_subcategoria,
          nombre,
          producto: '',
          descripcion,
          precio,
          cantidad_disponible,
        });
        await prodRepoWT.addEtiquetas(id_producto, id_etiquetas);
        await client.query('COMMIT;'); //Confirmar transacción
        return productoRepository.getOneBy({ id_productor, id_producto });
      } catch (error: any) {
        await client.query('ROLLBACK;');
        throw new DeAcaInternal(error.message);
      } finally {
        client.release();
      }
    },
  });
};

export default productosRoutes;
