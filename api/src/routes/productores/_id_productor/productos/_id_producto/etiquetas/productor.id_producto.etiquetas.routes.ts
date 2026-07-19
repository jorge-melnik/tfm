import { myPool } from '@database/pool.js';
import { DeAcaInternal } from '@errors/response.errors.js';
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productoRepository } from '@repositories/producto.repository.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { Producto } from '@schemas/producto.schema.js';

const productorIdUsuarioProductosRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.patch('/', {
    schema: {
      tags: ['Productores'],
      summary: 'ADD REMOVE etiquetas',
      description: `Permite al PRODUCTOR agregar o quitar etiquetas a un producto.`,
      params: Type.Object({
        id_productor: Type.String(),
        id_producto: Type.Integer(),
      }),
      body: Type.Object({
        id_productor: Producto.properties.id_productor,
        id_producto: Producto.properties.id_producto,
        ids_borrar: Type.Array(Type.Integer(), { description: 'ids etiquetas a desasociar del producto.' }),
        ids_agregar: Type.Array(Type.Integer(), { description: 'ids etiquetas a asociar al producto.' }),
      }),
      response: {
        204: Type.Null(),
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : //FIXME: fastify.seModificaASiMismo y el coincide id_productor en body y params. Params coincide con body o bad Request
    handler: async function (req, reply) {
      const { id_productor, id_producto, ids_borrar, ids_agregar } = req.body;

      const client = await myPool.connect();
      try {
        const productoRepoWT = productoRepository.withTransaction(client);
        await client.query('BEGIN;');
        await productoRepoWT.removeEtiquetas(id_productor, id_producto, ids_borrar);
        await productoRepoWT.addEtiquetas(id_productor, id_producto, ids_agregar);
        await client.query('COMMIT;');
      } catch (error: any) {
        client.query('ROLLBACK');
        throw new DeAcaInternal(error.message);
      } finally {
        client.release();
      }
      reply.code(204);
    },
  });
};

export default productorIdUsuarioProductosRoutes;
