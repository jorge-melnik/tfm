import { myPool } from '@database/pool.js';
import { DeAcaInternal } from '@errors/response.errors.js';
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productoRepository } from '@repositories/producto.repository.js';

import { DeAcaErrorResponse, DeAcaListResponse, DeAcaQueryString } from '@schemas/core.schemas.js';
import { POSTProducto, Producto } from '@schemas/producto.schema.js';
import { Productor } from '@schemas/productores.schema.js';

const usernameProductosRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
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
          // Mantenemos la lógica de la unión de strings/arrays para etiquetas
          etiquetas: Type.Optional(Type.Array(Type.String())),
          slug_categoria: Type.Optional(Type.String()),
          slug_subcategoria: Type.Optional(Type.String()),
          busqueda: Type.Optional(Type.String()),
        }),
      ]),
      response: {
        200: DeAcaListResponse(Producto),
        500: DeAcaErrorResponse,
      },
    },
    // onRequest : //FIXME: Solo para admin.
    handler: async (req, reply) => {
      console.log(req.query);
      return productoRepository.getBy(req.query); //Paginado
    },
  });

  fastify.post('/', {
    schema: {
      tags: ['Productos'],
      summary: 'ADD producto',
      description: `Permite al PRODUCTOR agregar un producto a su catálogo.`,
      params: Type.Object({ username: Productor.properties.username }),
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
        fotos,
      } = req.body;
      try {
        await client.query('BEGIN;');
        const { id_producto } = await prodRepoWT.add({
          id_productor,
          id_subcategoria,
          nombre,
          slug_producto: '',
          descripcion,
          precio,
          cantidad_disponible,
          fotos,
        });
        await prodRepoWT.addEtiquetas(id_productor, id_producto, id_etiquetas);
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

export default usernameProductosRoutes;
