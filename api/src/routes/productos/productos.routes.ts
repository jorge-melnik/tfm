import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productoRepository } from '@repositories/producto.repository.js';

import { DeAcaQueryString } from '@schemas/core.schemas.js';
import { Ubicacion } from '@schemas/usuarios.schema.js';

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
          latitud: Ubicacion.properties.latitud,
          longitud: Ubicacion.properties.longitud,
          distancia: Type.Number(),
        }),
      ]),
    },
    // onRequest: [fastify.authenticate], //FIXME descomentar.
    handler: async (req, reply) => {
      return productoRepository.getBy(req.query); //Paginado
    },
  });
};

export default productosRoutes;
